import React from "react";

export const initials = (n: string): string =>
  n.split(" ").map((w) => w[0]).slice(0, 2).join("");

interface Props {
  name: string;
  color: string;
  size?: number;
}

export default function Avatar({ name, color, size = 46 }: Props): React.ReactElement {
  return (
    <div
      className="pava"
      style={{ background: color, width: size, height: size, fontSize: size * 0.3 }}
    >
      {initials(name)}
    </div>
  );
}
