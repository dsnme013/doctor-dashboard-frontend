import React from "react";
import type { Patient, Profile, Stats } from "../types";
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
export default function QueueView({ patients, stats, profile, openSlots, onAccept, onReschedule, onToggleAvailability, onStartConsult, }: Props): React.ReactElement;
export {};
