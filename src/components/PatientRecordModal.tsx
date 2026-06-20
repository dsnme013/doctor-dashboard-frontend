import React, { useEffect, useState } from "react";

import { api } from "../api/client";
import Avatar from "./Avatar";
import TriageMeter from "./TriageMeter";
import type { Patient, PatientRecord } from "../types";

interface Props {
  patient: Patient;
  onClose: () => void;
}

function genderLabel(g: "M" | "F" | "O"): string {
  if (g === "M") return "Male";
  if (g === "F") return "Female";
  return "Other";
}

function listOrDash(items: string[]): string {
  return items.length ? items.join(", ") : "—";
}

export default function PatientRecordModal({ patient, onClose }: Props): React.ReactElement {
  const [record, setRecord] = useState<PatientRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    void api<PatientRecord>(`/patients/${patient.id}/record`)
      .then((r) => {
        if (!cancelled) setRecord(r);
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message || "Could not load health record");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [patient.id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const r = record;

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="modal record-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="record-title"
      >
        <div className="modal-head">
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Avatar name={patient.name} color={patient.color} size={44} />
            <div>
              <h2 id="record-title">{patient.name}</h2>
              <div className="modal-sub">
                {patient.age}
                {patient.gender} · Health record
                {r?.booking_ref ? ` · ${r.booking_ref}` : ""}
              </div>
            </div>
          </div>
          <button type="button" className="btn ghost" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="modal-body">
          {loading && <div className="empty">Loading health record…</div>}
          {error && <div className="empty" style={{ borderColor: "#f5c6c6", color: "var(--flag)" }}>{error}</div>}
          {!loading && !error && r && (
            <>
              <div className="record-grid">
                <section className="record-section">
                  <h3>Demographics</h3>
                  <dl className="record-dl">
                    <div>
                      <dt>Name</dt>
                      <dd>{r.demographics.name}</dd>
                    </div>
                    <div>
                      <dt>Age / gender</dt>
                      <dd>
                        {r.demographics.age} · {genderLabel(r.demographics.gender)}
                      </dd>
                    </div>
                    <div>
                      <dt>Phone</dt>
                      <dd>{r.demographics.phone || "—"}</dd>
                    </div>
                    <div>
                      <dt>City</dt>
                      <dd>{r.demographics.city || "—"}</dd>
                    </div>
                    <div>
                      <dt>Village</dt>
                      <dd>{r.demographics.village || "—"}</dd>
                    </div>
                    <div>
                      <dt>Pincode</dt>
                      <dd>{r.demographics.pincode || "—"}</dd>
                    </div>
                    <div>
                      <dt>House no.</dt>
                      <dd>{r.demographics.house_number || "—"}</dd>
                    </div>
                    <div className="full">
                      <dt>Full address</dt>
                      <dd>{r.demographics.address || "—"}</dd>
                    </div>
                  </dl>
                </section>

                <section className="record-section">
                  <h3>Visit</h3>
                  <dl className="record-dl">
                    <div>
                      <dt>Doctor</dt>
                      <dd>{r.visit.doctor_name}</dd>
                    </div>
                    <div>
                      <dt>Mode</dt>
                      <dd>{r.visit.mode}</dd>
                    </div>
                    <div>
                      <dt>Scheduled</dt>
                      <dd>{r.visit.time}</dd>
                    </div>
                    <div>
                      <dt>Fee</dt>
                      <dd>₹{r.visit.fee_inr}</dd>
                    </div>
                    <div>
                      <dt>Status</dt>
                      <dd>
                        <span className={`chip ${r.visit.status === "accepted" ? "ok" : ""}`}>
                          {r.visit.status[0].toUpperCase() + r.visit.status.slice(1)}
                        </span>
                      </dd>
                    </div>
                  </dl>
                </section>
              </div>

              <section className="record-section">
                <h3>Triage assessment</h3>
                <div className="record-triage">
                  <div>
                    <span className={`tier ${r.triage.tier}`}>{r.triage.tier}</span>
                    <TriageMeter score={r.triage.score} tier={r.triage.tier} />
                    <span className="score">Score {r.triage.score} / 100</span>
                    {r.triage.severity_0_to_10 != null && (
                      <div style={{ fontSize: 12.5, color: "var(--ink-soft)", marginTop: 6 }}>
                        Patient-reported severity: {r.triage.severity_0_to_10}/10
                      </div>
                    )}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: 6 }}>{r.triage.recommended_next_step}</div>
                    <p style={{ fontSize: 13.5, lineHeight: 1.5 }}>{r.triage.summary}</p>
                    {r.triage.bullets.length > 0 && (
                      <ul className="record-list">
                        {r.triage.bullets.map((b) => (
                          <li key={b}>{b}</li>
                        ))}
                      </ul>
                    )}
                    {r.triage.flags.length > 0 && (
                      <div className="chips" style={{ marginTop: 10 }}>
                        {r.triage.flags.map((f) => (
                          <span key={f} className="chip flag">
                            {f}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </section>

              <div className="record-grid">
                <section className="record-section">
                  <h3>Presenting symptoms</h3>
                  <dl className="record-dl">
                    <div>
                      <dt>Chief complaint</dt>
                      <dd>{r.symptoms.main}</dd>
                    </div>
                    <div>
                      <dt>Onset</dt>
                      <dd>{r.symptoms.onset}</dd>
                    </div>
                    {r.symptoms.detail && (
                      <div className="full">
                        <dt>Patient description</dt>
                        <dd>{r.symptoms.detail}</dd>
                      </div>
                    )}
                  </dl>
                </section>

                <section className="record-section">
                  <h3>Health history</h3>
                  <dl className="record-dl">
                    <div>
                      <dt>Conditions</dt>
                      <dd>{listOrDash(r.history.conditions)}</dd>
                    </div>
                    <div>
                      <dt>Medications</dt>
                      <dd>{listOrDash(r.history.medications)}</dd>
                    </div>
                    <div>
                      <dt>Recent tests</dt>
                      <dd>{listOrDash(r.history.recent_tests)}</dd>
                    </div>
                    <div>
                      <dt>Insurance</dt>
                      <dd>{r.history.insurance || "—"}</dd>
                    </div>
                    <div>
                      <dt>Consent</dt>
                      <dd>{r.history.consent_collected ? "Health info consent given" : "Not recorded"}</dd>
                    </div>
                  </dl>
                </section>
              </div>

              {r.triage.reasons.length > 0 && (
                <section className="record-section">
                  <h3>Triage factors</h3>
                  <ul className="record-list">
                    {r.triage.reasons.map((reason) => (
                      <li key={reason}>{reason}</li>
                    ))}
                  </ul>
                </section>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
