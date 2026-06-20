/** Typed fetch wrapper for the Doctor Console API. */
declare const API_BASE: string;
export declare class ApiError extends Error {
    status: number;
    constructor(status: number, detail: string);
}
export declare function api<T>(path: string, init?: RequestInit): Promise<T>;
export { API_BASE };
