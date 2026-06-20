import React from "react";
import type { Patient } from "../types";
interface Props {
    patients: Patient[];
    onChat: (pid: number) => Promise<void>;
}
export default function PatientsView({ patients, onChat }: Props): React.ReactElement;
export {};
