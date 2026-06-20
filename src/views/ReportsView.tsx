import React from "react";

import type { Reports } from "../types";

const tierColor: Record<string, string> = {
  high: "#c2410c",
  moderate: "#b45309",
  low: "#15803d",
};

interface Props {
  reports: Reports;
  toast: (msg: string) => void;
}

export default function ReportsView({ reports, toast }: Props): React.ReactElement {
  const maxDay = Math.max(...reports.consults_by_day.map((d) => d.n), 1);
  const maxSym = Math.max(...reports.top_symptoms.map((s) => s.n), 1);

  return (
    <section className="view-anim">
      <div className="crumb">Console / Reports</div>
      <div className="head">
        <div>
          <h1>Reports</h1>
          <div className="date">Last 7 days</div>
        </div>
        <button className="btn ghost" onClick={() => toast("Report exported — check downloads (demo)")}>
          Export CSV
        </button>
      </div>
      <div className="stats">
        <div className="stat">
          <div className="k">Consults</div>
          <div className="v">{reports.summary.consults}</div>
          <div className="sub">▲ {reports.summary.delta_pct}% vs last week</div>
        </div>
        <div className="stat">
          <div className="k">Completion</div>
          <div className="v">
            {reports.summary.completion_pct}
            <small>%</small>
          </div>
          <div className="sub">{reports.summary.no_shows} no-shows</div>
        </div>
        <div className="stat">
          <div className="k">Avg consult</div>
          <div className="v">
            {reports.summary.avg_consult_min}
            <small> min</small>
          </div>
          <div className="sub">video calls</div>
        </div>
        <div className="stat">
          <div className="k">Earnings</div>
          <div className="v">
            ₹{(reports.summary.earnings_inr / 1000).toFixed(1)}
            <small>k</small>
          </div>
          <div className="sub">payouts on Friday</div>
        </div>
      </div>
      <div className="rgrid">
        <div className="panel">
          <h2 style={{ marginBottom: 6 }}>Consults by day</h2>
          {reports.consults_by_day.map((d) => (
            <div key={d.day} className="bar-row">
              <span className="lbl">{d.day}</span>
              <div className="bar">
                <i style={{ width: `${(d.n / maxDay) * 100}%` }} />
              </div>
              <span className="n">{d.n}</span>
            </div>
          ))}
        </div>
        <div className="panel">
          <h2 style={{ marginBottom: 6 }}>Triage mix</h2>
          <div className="donut-wrap">
            <svg width="130" height="130" viewBox="0 0 42 42" role="img" aria-label="Triage mix">
              <circle cx="21" cy="21" r="15.9" fill="none" stroke="#e2e9e7" strokeWidth="6" />
              <circle cx="21" cy="21" r="15.9" fill="none" stroke="#c2410c" strokeWidth="6" strokeDasharray="24 76" strokeDashoffset="25" />
              <circle cx="21" cy="21" r="15.9" fill="none" stroke="#b45309" strokeWidth="6" strokeDasharray="38 62" strokeDashoffset="1" />
              <circle cx="21" cy="21" r="15.9" fill="none" stroke="#15803d" strokeWidth="6" strokeDasharray="38 62" strokeDashoffset="-37" />
              <text x="21" y="22.5" textAnchor="middle" fontSize="7" fontWeight="700" fill="#0e2a2b">
                {reports.summary.consults}
              </text>
            </svg>
            <div className="legend">
              {reports.triage_mix.map((t) => (
                <div key={t.tier}>
                  <span className="sw" style={{ background: tierColor[t.tier] }} /> {t.tier[0].toUpperCase() + t.tier.slice(1)} · {t.n} ({t.pct}%)
                </div>
              ))}
            </div>
          </div>
          <h2 style={{ margin: "18px 0 6px" }}>Top symptoms</h2>
          {reports.top_symptoms.map((s) => (
            <div key={s.symptom} className="bar-row">
              <span className="lbl">{s.symptom}</span>
              <div className="bar">
                <i style={{ width: `${(s.n / maxSym) * 100}%`, background: "#3d5a5b" }} />
              </div>
              <span className="n">{s.n}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
