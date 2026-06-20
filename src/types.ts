/** Shared domain types — mirror app/schemas.py on the backend. */

export type Tier = "low" | "moderate" | "high";
export type PatientStatus = "pending" | "accepted" | "rescheduled";
export type Mode = "Video" | "Home visit";
export type View = "queue" | "schedule" | "patients" | "messages" | "reports" | "settings";

export interface Patient {
  id: number;
  name: string;
  age: number;
  gender: "M" | "F" | "O";
  symptom: string;
  onset: string;
  score: number;
  tier: Tier;
  flags: string[];
  comorb: string[];
  mode: Mode;
  time: string;
  color: string;
  status: PatientStatus;
  fee: number;
}

export interface ScheduleSlot {
  t: string;
  pid: number | null;
  open: boolean;
  now: boolean;
}

export interface ScheduleResponse {
  slots: ScheduleSlot[];
  open_slots: string[];
}

export interface Msg {
  who: "me" | "them";
  t: string;
  txt: string;
}

export interface Thread {
  patient_id: number;
  unread: boolean;
  msgs: Msg[];
}

export interface ThreadSummary {
  patient_id: number;
  name: string;
  color: string;
  unread: boolean;
  last: Msg | null;
}

export interface Stats {
  booked_today: number;
  video: number;
  home_visits: number;
  high_triage_pending: number;
  pending: number;
  avg_response_min: number;
  rating: number;
  reviews: number;
  available: boolean;
  unread_messages: number;
  earnings_today?: number;
}

export interface Profile {
  name: string;
  speciality: string;
  fee: number;
  home_fee: number;
  languages: string;
  bio: string;
  accept_video: boolean;
  accept_home_visits: boolean;
  auto_accept_low: boolean;
  whatsapp_notifications: boolean;
}

export interface PatientRecord {
  patient_id: number;
  color: string;
  booking_ref: string | null;
  demographics: {
    name: string;
    age: number;
    gender: "M" | "F" | "O";
    phone?: string;
    address?: string;
    city?: string;
    village?: string;
    pincode?: string;
    house_number?: string;
  };
  visit: {
    mode: Mode;
    time: string;
    slot_at_iso: string | null;
    fee_inr: number;
    status: PatientStatus;
    doctor_name: string;
    booked_at_iso: string | null;
  };
  triage: {
    score: number;
    tier: Tier;
    severity_0_to_10?: number;
    recommended_next_step: string;
    red_flag_triggered: boolean;
    reasons: string[];
    summary: string;
    bullets: string[];
    flags: string[];
  };
  symptoms: {
    main: string;
    detail?: string;
    onset: string;
  };
  history: {
    conditions: string[];
    medications: string[];
    recent_tests: string[];
    insurance?: string;
    consent_collected: boolean;
  };
}

export interface Reports {
  summary: {
    consults: number;
    delta_pct: number;
    completion_pct: number;
    no_shows: number;
    avg_consult_min: number;
    earnings_inr: number;
  };
  consults_by_day: { day: string; n: number }[];
  triage_mix: { tier: Tier; n: number; pct: number }[];
  top_symptoms: { symptom: string; n: number }[];
}
