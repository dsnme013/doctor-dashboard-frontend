import React from "react";
import type { Tier } from "../types";
interface Props {
    score: number;
    tier: Tier;
}
export default function TriageMeter({ score, tier }: Props): React.ReactElement;
export {};
