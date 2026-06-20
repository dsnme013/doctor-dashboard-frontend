import React, { useMemo, useState } from "react";

import Avatar from "../components/Avatar";
import TriageMeter from "../components/TriageMeter";
import type { Patient, Profile, Stats, Tier } from "../types";

const todayLong = new Intl.DateTimeFormat("en-IN", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
}).format(new Date());

interface Props {
  patients: Patient[];
  stats: Stats | null;
  profile: Profile | null;
  openSlots: string[];
  onAccept: (p: Patient) => Promise<void>;
  onReschedule: (p: Patient, slot: string) => Promise<void>;
  onToggleAvailability: () => Promise<void>;
  onStartConsult: (p: Patient) => void;
}

export default function QueueView({
  patients,
  stats,
  profile,
  openSlots,
  onAccept,
  onReschedule,
  onToggleAvailability,
  onStartConsult,
}: Props): React.ReactElement {
  const [filter, setFilter] = useState<Tier | "all">("all");
  const [reschedFor, setReschedFor] = useState<number | null>(null);

  const list = useMemo(
    () => patients.filter((p) => filter === "all" || p.tier === filter),
    [patients, filter]
  );

  return (
    <section className="view-anim">
      <div className="crumb">Console / Today's queue</div>
      <div className="head">
        <div>
          <h1>Good morning, {profile?.name.split(" ").slice(-1)[0] ?? "Doctor"}</h1>
          <div className="date">{todayLong}</div>
        </div>
        <button
          className={`btn ${stats?.available ? "off" : ""}`}
          onClick={() => void onToggleAvailability()}
        >
          {stats?.available ? "Available · go offline" : "Go available"}
        </button>
      </div>

      <div className="stats">
        <div className="stat">
          <div className="k">Booked today</div>
          <div className="v">{stats?.booked_today ?? "—"}</div>
          <div className="sub">
            {stats ? `${stats.video} video · ${stats.home_visits} home visits` : ""}
          </div>
        </div>
        <div className="stat alert">
          <div className="k">High triage</div>
          <div className="v">{stats?.high_triage_pending ?? "—"}</div>
          <div className="sub">needs review first</div>
        </div>
        <div className="stat">
          <div className="k">Avg response</div>
          <div className="v">
            {stats?.avg_response_min ?? "—"}
            <small> min</small>
          </div>
          <div className="sub">target &lt; 15 min</div>
        </div>
        <div className="stat">
          <div className="k">Earnings today</div>
          <div className="v">₹{stats?.earnings_today ?? "—"}</div>
          <div className="sub">
            {stats ? `rating ${stats.rating} · ${stats.reviews} reviews` : ""}
          </div>
        </div>
      </div>

      <div className="qhead">
        <h2>Incoming from triage</h2>
        <div className="tabs">
          {(["all", "high", "moderate", "low"] as const).map((f) => (
            <button
              key={f}
              className={filter === f ? "on" : ""}
              onClick={() => {
                setFilter(f);
                setReschedFor(null);
              }}
            >
              {f === "all" ? "All" : f[0].toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="queue">
        {list.length === 0 && (
          <div className="empty">No {filter} triage patients in the queue right now.</div>
        )}
        {list.map((p) => (
          <div
            key={p.id}
            className={`pcard ${
              p.status === "accepted" ? "accepted" : p.flags.length ? "flagged" : ""
            }`}
          >
            <Avatar name={p.name} color={p.color} />
            <div className="pinfo">
              <div className="nm">
                {p.name}{" "}
                <span style={{ fontWeight: 500, color: "var(--ink-soft)" }}>
                  · {p.age} · {p.gender}
                </span>
              </div>
              <div className="meta">
                {p.symptom} · onset {p.onset.toLowerCase()} ·{" "}
                {p.status === "rescheduled" ? "rescheduled to" : "requested"} {p.time}
              </div>
              <div className="chips">
                <span className="chip">₹{p.fee}</span>
                <span className="chip mode">{p.mode}</span>
                {p.status === "accepted" && <span className="chip ok">✓ Accepted</span>}
                {p.status === "rescheduled" && <span className="chip">↻ Rescheduled</span>}
                {p.flags.map((f) => (
                  <span key={f} className="chip flag">
                    ⚑ {f}
                  </span>
                ))}
                {p.comorb.map((c) => (
                  <span key={c} className="chip">
                    {c}
                  </span>
                ))}
              </div>
            </div>
            <div className="tri">
              <span className={`tier ${p.tier}`}>{p.tier}</span>
              <TriageMeter score={p.score} tier={p.tier} />
              <span className="score">triage {p.score} / 100</span>
              <div className="acts">
                {p.status === "accepted" ? (
                  <>
                    <button className="btn done" disabled>
                      ✓ Accepted
                    </button>
                    <button className="btn ghost" onClick={() => onStartConsult(p)}>
                      Start consult
                    </button>
                  </>
                ) : (
                  <>
                    <button className="btn" onClick={() => void onAccept(p)}>
                      Accept
                    </button>
                    <button
                      className="btn ghost"
                      onClick={() => setReschedFor(reschedFor === p.id ? null : p.id)}
                    >
                      Reschedule
                    </button>
                  </>
                )}
              </div>
            </div>
            {reschedFor === p.id && (
              <div className="resched">
                <b>Move {p.name.split(" ")[0]} to:</b>
                {openSlots.map((s) => (
                  <button
                    key={s}
                    className="btn ghost"
                    onClick={() => {
                      setReschedFor(null);
                      void onReschedule(p, s);
                    }}
                  >
                    {s}
                  </button>
                ))}
                <button className="btn danger" onClick={() => setReschedFor(null)}>
                  Cancel
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
