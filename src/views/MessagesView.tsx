import React, { useState } from "react";

import Avatar from "../components/Avatar";
import type { Patient, Thread, ThreadSummary } from "../types";

interface Props {
  threadList: ThreadSummary[];
  thread: Thread | null;
  threadPatient: Patient | undefined;
  onOpenThread: (pid: number) => Promise<void>;
  onSend: (text: string) => Promise<void>;
}

export default function MessagesView({
  threadList,
  thread,
  threadPatient,
  onOpenThread,
  onSend,
}: Props): React.ReactElement {
  const [draft, setDraft] = useState("");

  const send = async (): Promise<void> => {
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    await onSend(text);
  };

  return (
    <section className="view-anim">
      <div className="crumb">Console / Messages</div>
      <div className="head">
        <div>
          <h1>Messages</h1>
          <div className="date">Secure patient chat</div>
        </div>
      </div>
      <div className="msgwrap">
        <div className="msglist">
          {threadList.map((t) => (
            <button
              key={t.patient_id}
              className={`msgitem ${thread?.patient_id === t.patient_id ? "on" : ""}`}
              onClick={() => void onOpenThread(t.patient_id)}
            >
              <Avatar name={t.name} color={t.color} size={36} />
              <div>
                <div className="nm">{t.name}</div>
                <div className="prev">{t.last?.txt ?? "No messages yet"}</div>
              </div>
              {t.unread && <span className="unread" />}
            </button>
          ))}
        </div>
        <div className="thread">
          <div className="thread-head">
            {threadPatient && <Avatar name={threadPatient.name} color={threadPatient.color} size={34} />}
            <span>{threadPatient?.name ?? "Select a conversation"}</span>
          </div>
          <div className="thread-body">
            {thread?.msgs.map((m, i) => (
              <div key={i} className={`bub ${m.who}`}>
                {m.txt}
                <span className="tm">{m.t}</span>
              </div>
            ))}
          </div>
          <div className="thread-input">
            <input
              placeholder="Type a reply…"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") void send();
              }}
            />
            <button className="btn" onClick={() => void send()}>
              Send
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
