import React from "react";

import type { Profile, Stats, View } from "../types";
import { initials } from "./Avatar";

interface NavItem {
  v: View;
  ic: string;
  label: string;
  cnt?: number;
}

interface Props {
  view: View;
  stats: Stats | null;
  profile: Profile | null;
  onNavigate: (v: View) => void;
}

export default function Sidebar({ view, stats, profile, onNavigate }: Props): React.ReactElement {
  const items: NavItem[] = [
    { v: "queue", ic: "▦", label: "Today's queue", cnt: stats?.pending },
    { v: "schedule", ic: "🗓", label: "Schedule" },
    { v: "patients", ic: "👤", label: "Patients" },
    { v: "messages", ic: "💬", label: "Messages", cnt: stats?.unread_messages },
    { v: "reports", ic: "📈", label: "Reports" },
    { v: "settings", ic: "⚙", label: "Settings" },
  ];

  return (
    <aside className="side">
      <div className="logo">
        <div className="logo-mark">C+</div>
        <div>
          <b>CareConnect</b>
          <span>Doctor Console</span>
        </div>
      </div>
      <nav className="nav">
        {items.map((n) => (
          <button key={n.v} className={view === n.v ? "on" : ""} onClick={() => onNavigate(n.v)}>
            <span className="ic">{n.ic}</span> {n.label}
            {typeof n.cnt === "number" && n.cnt > 0 && <span className="cnt">{n.cnt}</span>}
          </button>
        ))}
      </nav>
      <button className="me" onClick={() => onNavigate("settings")}>
        <div className="ava">
          {profile ? initials(profile.name.replace(/^Dr\.?\s*/i, "")) : "AM"}
        </div>
        <div>
          <div className="nm">{profile?.name ?? "Dr. Arjun Mehta"}</div>
          <div className="rl">{profile?.speciality ?? "General Physician"}</div>
        </div>
        <div
          className="dot"
          style={{ background: stats?.available ? "#34d399" : "#fbbf24" }}
          title={stats?.available ? "Available" : "Offline"}
        />
      </button>
    </aside>
  );
}
