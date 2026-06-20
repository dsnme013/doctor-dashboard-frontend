import React from "react";
import type { Patient, Thread, ThreadSummary } from "../types";
interface Props {
    threadList: ThreadSummary[];
    thread: Thread | null;
    threadPatient: Patient | undefined;
    onOpenThread: (pid: number) => Promise<void>;
    onSend: (text: string) => Promise<void>;
}
export default function MessagesView({ threadList, thread, threadPatient, onOpenThread, onSend, }: Props): React.ReactElement;
export {};
