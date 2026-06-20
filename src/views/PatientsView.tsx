import React, { useMemo, useState } from "react";

import Avatar from "../components/Avatar";
import PatientRecordModal from "../components/PatientRecordModal";
import type { Patient } from "../types";

interface Props {
  patients: Patient[];
  onChat: (pid: number) => Promise<void>;
}

export default function PatientsView({ patients, onChat }: Props): React.ReactElement {
  const [search, setSearch] = useState("");
  const [recordPatient, setRecordPatient] = useState<Patient | null>(null);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return patients;
    return patients.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.symptom.toLowerCase().includes(q) ||
        p.comorb.join(" ").toLowerCase().includes(q)
    );
  }, [patients, search]);

  return (
    <section className="view-anim">
      <div className="crumb">Console / Patients</div>
      <div className="head">
        <div>
          <h1>Patients</h1>
          <div className="date">All patients who reached you via CareConnect</div>
        </div>
      </div>
      <div className="search">
        <input
          placeholder="Search by name, symptom or condition…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Last symptom</th>
              <th>Triage</th>
              <th>Conditions</th>
              <th>Fee</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", color: "var(--ink-soft)", padding: 30 }}>
                  No patients match "{search}"
                </td>
              </tr>
            ) : (
              rows.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <Avatar name={p.name} color={p.color} size={34} />
                      <div>
                        <b>{p.name}</b>
                        <div style={{ fontSize: 11.5, color: "var(--ink-soft)" }}>
                          {p.age}
                          {p.gender}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    {p.symptom}
                    <div style={{ fontSize: 11.5, color: "var(--ink-soft)" }}>
                      onset {p.onset.toLowerCase()}
                    </div>
                  </td>
                  <td>
                    <span className={`tier ${p.tier}`}>
                      {p.tier} {p.score}
                    </span>
                  </td>
                  <td>{p.comorb.length ? p.comorb.join(", ") : "—"}</td>
                  <td>₹{p.fee}</td>
                  <td>
                    <span className={`chip ${p.status === "accepted" ? "ok" : ""}`}>
                      {p.status[0].toUpperCase() + p.status.slice(1)}
                    </span>
                  </td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    <button className="btn ghost" onClick={() => setRecordPatient(p)}>
                      Record
                    </button>{" "}
                    <button className="btn ghost" onClick={() => void onChat(p.id)}>
                      Chat
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {recordPatient && (
        <PatientRecordModal patient={recordPatient} onClose={() => setRecordPatient(null)} />
      )}
    </section>
  );
}
