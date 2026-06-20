import React from "react";
import type { Patient, ScheduleResponse } from "../types";
interface Props {
    schedule: ScheduleResponse;
    byId: (pid: number | null) => Patient | undefined;
    onAddSlot: () => Promise<void>;
    onStartConsult: (p: Patient) => void;
    onChat: (pid: number) => Promise<void>;
    toast: (msg: string) => void;
}
export default function ScheduleView({ schedule, byId, onAddSlot, onStartConsult, onChat, toast, }: Props): React.ReactElement;
export {};
