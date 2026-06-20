import React from "react";

import type { Tier } from "../types";

interface Props {
  score: number;
  tier: Tier;
}

export default function TriageMeter({ score, tier }: Props): React.ReactElement {
  const cls = tier === "high" ? "f-high" : tier === "moderate" ? "f-mod" : "f-low";
  const filled = Math.min(10, Math.round(score / 10));
  return (
    <div className="meter">
      {Array.from({ length: 10 }, (_, i) => (
        <div key={i} className={`seg ${i < filled ? cls : ""}`} />
      ))}
    </div>
  );
}
