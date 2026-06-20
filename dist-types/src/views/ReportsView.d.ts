import React from "react";
import type { Reports } from "../types";
interface Props {
    reports: Reports;
    toast: (msg: string) => void;
}
export default function ReportsView({ reports, toast }: Props): React.ReactElement;
export {};
