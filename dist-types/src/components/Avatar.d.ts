import React from "react";
export declare const initials: (n: string) => string;
interface Props {
    name: string;
    color: string;
    size?: number;
}
export default function Avatar({ name, color, size }: Props): React.ReactElement;
export {};
