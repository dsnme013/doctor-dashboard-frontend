import React from "react";

import type { Patient, ScheduleResponse } from "../types";

const todayLong = new Intl.DateTimeFormat("en-IN", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
}).format(new Date());

interface Props {
  schedule: ScheduleResponse;
  byId: (pid: number | null) => Patient | undefined;
  onAddSlot: () => Promise<void>;
  onStartConsult: (p: Patient) => void;
  onChat: (pid: number) => Promise<void>;
  toast: (msg: string) => void;
}

export default function ScheduleView({
  schedule,
  byId,
  onAddSlot,
  onStartConsult,
  onChat,
  toast,
}: Props): React.ReactElement {
  const prepItems = [
    { label: "Review Ramesh's vitals & history", def: true },
    { label: "Check yesterday's pending prescriptions", def: false },
    { label: "Confirm home-visit route for 4:30 PM", def: false },
  ];

  return (
    <section className="view-anim">
      <div className="crumb">Console / Schedule</div>
      <div className="head">
        <div>
          <h1>Today's schedule</h1>
          <div className="date">{todayLong}</div>
        </div>
        <button className="btn ghost" onClick={() => void onAddSlot()}>
          + Add open slot
        </button>
      </div>
      <div className="panel">
        {schedule.slots.map((s, i) => {
          const p = s.pid != null ? byId(s.pid) : undefined;
          return (
            <div key={i} className={`slot ${s.open ? "open" : ""} ${s.now ? "now" : ""}`}>
              <div className="t">{s.t}</div>
              <div className="node" />
              <div className="box">
                {s.open || !p ? (
                  <>
                    <span>Open slot — accepting bookings</span>
                    <button
                      className="btn ghost"
                      onClick={() => toast(`Slot at ${s.t} blocked for break`)}
                    >
                      Block
                    </button>
                  </>
                ) : (
                  <>
                    <div>
                      <div className="who">{p.name}</div>
                      <div className="what">
                        {p.symptom} · triage {p.score}
                      </div>
                      <span className="tag">{p.mode}</span>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="btn" onClick={() => onStartConsult(p)}>
                        Start
                      </button>
                      <button className="btn ghost" onClick={() => void onChat(p.id)}>
                        Chat
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="panel prepbox" style={{ marginTop: 14 }}>
        <h2 style={{ marginBottom: 8 }}>Before your next consult</h2>
        {prepItems.map((c) => (
          <label key={c.label}>
            <input
              type="checkbox"
              defaultChecked={c.def}
              onChange={(e) => toast((e.target.checked ? "Done: " : "Reopened: ") + c.label)}
            />{" "}
            {c.label}
          </label>
        ))}
      </div>
    </section>
  );
}
