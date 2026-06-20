import React from "react";
import type { Patient } from "../types";
interface Props {
    patient: Patient;
    onClose: () => void;
}
export default function PatientRecordModal({ patient, onClose }: Props): React.ReactElement;
export {};
