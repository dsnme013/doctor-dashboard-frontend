import React from "react";

export default function Toast({ message }: { message: string }): React.ReactElement {
  return <div className={`toast ${message ? "show" : ""}`}>{message}</div>;
}
