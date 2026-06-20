/**
 * CareConnect — Doctor Console
 * App shell: owns shared state, talks to the API, routes between views.
 */
import React, { useCallback, useEffect, useState } from "react";

import { API_BASE, api } from "./api/client";
import Sidebar from "./components/Sidebar";
import Toast from "./components/Toast";
import type {
  Patient,
  Profile,
  Reports,
  ScheduleResponse,
  Stats,
  Thread,
  ThreadSummary,
  View,
} from "./types";
import MessagesView from "./views/MessagesView";
import PatientsView from "./views/PatientsView";
import QueueView from "./views/QueueView";
import ReportsView from "./views/ReportsView";
import ScheduleView from "./views/ScheduleView";
import SettingsView from "./views/SettingsView";

export default function App(): React.ReactElement {
  const [view, setView] = useState<View>("queue");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [schedule, setSchedule] = useState<ScheduleResponse>({ slots: [], open_slots: [] });
  const [threadList, setThreadList] = useState<ThreadSummary[]>([]);
  const [thread, setThread] = useState<Thread | null>(null);
  const [reports, setReports] = useState<Reports | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [toastMsg, setToastMsg] = useState("");
  const [error, setError] = useState("");

  const toast = useCallback((msg: string) => {
    setToastMsg(msg);
    window.setTimeout(() => setToastMsg(""), 2600);
  }, []);

  /* ------------------------------- loaders ------------------------------ */
  const loadQueue = useCallback(async () => {
    const [q, s] = await Promise.all([api<Patient[]>("/queue"), api<Stats>("/stats")]);
    setPatients(q);
    setStats(s);
    setError("");
  }, []);

  const loadSchedule = useCallback(async () => {
    setSchedule(await api<ScheduleResponse>("/schedule"));
  }, []);

  const loadThreads = useCallback(async () => {
    setThreadList(await api<ThreadSummary[]>("/messages"));
  }, []);

  useEffect(() => {
    Promise.all([
      loadQueue(),
      loadSchedule(),
      loadThreads(),
      api<Reports>("/reports").then(setReports),
      api<Profile>("/profile").then((p) =>
        setProfile({ ...p, home_fee: p.home_fee ?? p.fee })
      ),
    ]).catch((e: Error) =>
      setError(
        `Could not reach the backend at ${API_BASE} — is the CareConnect API running? (cd backend && npm run dev) (${e.message})`
      )
    );
  }, [loadQueue, loadSchedule, loadThreads]);

  /* Poll for new patient bookings from the chat (real-time sync). */
  useEffect(() => {
    const refresh = () => {
      void loadQueue();
      void loadSchedule();
      void loadThreads();
    };
    const interval = window.setInterval(refresh, 4000);
    const onFocus = () => refresh();
    window.addEventListener("focus", onFocus);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, [loadQueue, loadSchedule, loadThreads]);

  /* ------------------------------- actions ------------------------------ */
  const accept = useCallback(
    async (p: Patient): Promise<void> => {
      try {
        await api<Patient>(`/booking/${p.id}/accept`, { method: "POST" });
        await Promise.all([loadQueue(), loadSchedule()]);
        toast(`Consult with ${p.name} accepted — patient notified in chat`);
      } catch (e) {
        toast((e as Error).message);
      }
    },
    [loadQueue, loadSchedule, toast]
  );

  const reschedule = useCallback(
    async (p: Patient, slot: string): Promise<void> => {
      try {
        await api<Patient>(`/booking/${p.id}/reschedule`, {
          method: "PATCH",
          body: JSON.stringify({ slot }),
        });
        await Promise.all([loadQueue(), loadSchedule()]);
        toast(`${p.name} moved to ${slot} — patient notified on WhatsApp`);
      } catch (e) {
        toast((e as Error).message);
      }
    },
    [loadQueue, loadSchedule, toast]
  );

  const toggleAvailability = useCallback(async (): Promise<void> => {
    if (!stats) return;
    const next = !stats.available;
    await api("/availability", { method: "POST", body: JSON.stringify({ available: next }) });
    setStats({ ...stats, available: next });
    toast(
      next
        ? "You are now available for instant consults"
        : "You are offline for instant consults — booked slots still active"
    );
  }, [stats, toast]);

  const addOpenSlot = useCallback(async (): Promise<void> => {
    await api("/schedule/slot?t=5:30", { method: "POST" });
    await loadSchedule();
    toast("Slot added at 5:30 PM — accepting bookings");
  }, [loadSchedule, toast]);

  const openThread = useCallback(
    async (pid: number): Promise<void> => {
      const th = await api<Thread>(`/messages/${pid}`);
      setThread(th);
      await loadThreads();
    },
    [loadThreads]
  );

  const sendMessage = useCallback(
    async (text: string): Promise<void> => {
      if (!thread) return;
      const th = await api<Thread>(`/messages/${thread.patient_id}`, {
        method: "POST",
        body: JSON.stringify({ text }),
      });
      setThread(th);
      await loadThreads();
      toast("Message sent on WhatsApp");
    },
    [thread, loadThreads, toast]
  );

  const saveProfile = useCallback(async (): Promise<void> => {
    if (!profile) return;
    setProfile(await api<Profile>("/profile", { method: "PUT", body: JSON.stringify(profile) }));
    toast("Profile saved — patients will see updated details");
  }, [profile, toast]);

  const toggleProfileFlag = useCallback(
    async (key: keyof Profile, label: string): Promise<void> => {
      if (!profile) return;
      const next = { ...profile, [key]: !profile[key] };
      setProfile(next);
      await api<Profile>("/profile", { method: "PUT", body: JSON.stringify(next) });
      toast(`${label} ${next[key] ? "enabled" : "paused"}`);
    },
    [profile, toast]
  );

  const startConsult = useCallback(
    (p: Patient): void =>
      toast(
        p.mode === "Video"
          ? `Starting video call with ${p.name}… (demo)`
          : `Home visit for ${p.name} — route opened in maps (demo)`
      ),
    [toast]
  );

  const goToChat = useCallback(
    async (pid: number): Promise<void> => {
      setView("messages");
      const target = threadList.some((t) => t.patient_id === pid)
        ? pid
        : threadList[0]?.patient_id ?? pid;
      await openThread(target);
    },
    [threadList, openThread]
  );

  const navigate = useCallback(
    (v: View): void => {
      setView(v);
      if (v === "messages" && !thread && threadList[0]) {
        void openThread(threadList[0].patient_id);
      }
    },
    [thread, threadList, openThread]
  );

  /* ------------------------------- derived ------------------------------ */
  const byId = useCallback(
    (pid: number | null): Patient | undefined =>
      pid == null ? undefined : patients.find((p) => p.id === pid),
    [patients]
  );

  const threadPatient = thread ? byId(thread.patient_id) : undefined;

  /* -------------------------------- render ------------------------------ */
  return (
    <div className="app">
      <Sidebar view={view} stats={stats} profile={profile} onNavigate={navigate} />

      <main className="main">
        {error && (
          <div className="empty" style={{ marginBottom: 16, borderColor: "#f5c6c6" }}>
            {error}
          </div>
        )}

        {view === "queue" && (
          <QueueView
            patients={patients}
            stats={stats}
            profile={profile}
            openSlots={schedule.open_slots}
            onAccept={accept}
            onReschedule={reschedule}
            onToggleAvailability={toggleAvailability}
            onStartConsult={startConsult}
          />
        )}

        {view === "schedule" && (
          <ScheduleView
            schedule={schedule}
            byId={byId}
            onAddSlot={addOpenSlot}
            onStartConsult={startConsult}
            onChat={goToChat}
            toast={toast}
          />
        )}

        {view === "patients" && (
          <PatientsView patients={patients} onChat={goToChat} />
        )}

        {view === "messages" && (
          <MessagesView
            threadList={threadList}
            thread={thread}
            threadPatient={threadPatient}
            onOpenThread={openThread}
            onSend={sendMessage}
          />
        )}

        {view === "reports" && reports && <ReportsView reports={reports} toast={toast} />}

        {view === "settings" && profile && (
          <SettingsView
            profile={profile}
            onChange={setProfile}
            onSave={saveProfile}
            onToggleFlag={toggleProfileFlag}
            onCancel={() => {
              void api<Profile>("/profile").then(setProfile);
              toast("Changes discarded");
            }}
          />
        )}
      </main>

      <Toast message={toastMsg} />
    </div>
  );
}
