import React from "react";
import type { Profile, Stats, View } from "../types";
interface Props {
    view: View;
    stats: Stats | null;
    profile: Profile | null;
    onNavigate: (v: View) => void;
}
export default function Sidebar({ view, stats, profile, onNavigate }: Props): React.ReactElement;
export {};
