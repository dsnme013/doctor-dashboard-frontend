import React from "react";

import type { Profile } from "../types";

interface Props {
  profile: Profile;
  onChange: (p: Profile) => void;
  onSave: () => Promise<void>;
  onToggleFlag: (key: keyof Profile, label: string) => Promise<void>;
  onCancel: () => void;
}

const toggles: [keyof Profile, string][] = [
  ["accept_video", "Accept video consults"],
  ["accept_home_visits", "Accept home visits"],
  ["auto_accept_low", "Auto-accept low-triage bookings"],
  ["whatsapp_notifications", "WhatsApp notifications"],
];

const specialities = ["General Physician", "Pediatrics", "Internal Medicine", "Dermatology"];

export default function SettingsView({
  profile,
  onChange,
  onSave,
  onToggleFlag,
  onCancel,
}: Props): React.ReactElement {
  return (
    <section className="view-anim">
      <div className="crumb">Console / Settings</div>
      <div className="head">
        <div>
          <h1>Settings</h1>
          <div className="date">Profile &amp; availability</div>
        </div>
      </div>
      <div className="panel" style={{ maxWidth: 720 }}>
        <h2 style={{ marginBottom: 14 }}>Profile</h2>
        <div className="form">
          <div className="field">
            <label>Full name</label>
            <input value={profile.name} onChange={(e) => onChange({ ...profile, name: e.target.value })} />
          </div>
          <div className="field">
            <label>Speciality</label>
            <select
              value={profile.speciality}
              onChange={(e) => onChange({ ...profile, speciality: e.target.value })}
            >
              {specialities.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Video consult fee (₹)</label>
            <input
              type="number"
              value={profile.fee}
              onChange={(e) => onChange({ ...profile, fee: Number(e.target.value) || 0 })}
            />
          </div>
          <div className="field">
            <label>Home visit fee (₹)</label>
            <input
              type="number"
              value={profile.home_fee ?? 0}
              onChange={(e) => onChange({ ...profile, home_fee: Number(e.target.value) || 0 })}
            />
          </div>
          <div className="field">
            <label>Languages</label>
            <input
              value={profile.languages}
              onChange={(e) => onChange({ ...profile, languages: e.target.value })}
            />
          </div>
          <div className="field full">
            <label>Bio shown to patients</label>
            <textarea
              rows={3}
              value={profile.bio}
              onChange={(e) => onChange({ ...profile, bio: e.target.value })}
            />
          </div>
        </div>
        <h2 style={{ margin: "22px 0 4px" }}>Availability</h2>
        {toggles.map(([key, label], i) => (
          <div
            key={key}
            className="switchrow"
            style={i === toggles.length - 1 ? { border: "none" } : undefined}
          >
            <span>{label}</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={Boolean(profile[key])}
                onChange={() => void onToggleFlag(key, label)}
              />
              <i />
            </label>
          </div>
        ))}
        <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
          <button className="btn" onClick={() => void onSave()}>
            Save changes
          </button>
          <button className="btn ghost" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </section>
  );
}
