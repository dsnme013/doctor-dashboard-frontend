import React from "react";
import type { Profile } from "../types";
interface Props {
    profile: Profile;
    onChange: (p: Profile) => void;
    onSave: () => Promise<void>;
    onToggleFlag: (key: keyof Profile, label: string) => Promise<void>;
    onCancel: () => void;
}
export default function SettingsView({ profile, onChange, onSave, onToggleFlag, onCancel, }: Props): React.ReactElement;
export {};
