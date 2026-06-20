/** Typed fetch wrapper for the Doctor Console API. */

const API_BASE: string = import.meta.env.VITE_API_BASE ?? "http://127.0.0.1:8787";

export class ApiError extends Error {
  constructor(public status: number, detail: string) {
    super(detail);
    this.name = "ApiError";
  }
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const hasBody = init?.body != null && init.body !== "";
  const res = await fetch(`${API_BASE}/api/v1${path}`, {
    ...init,
    headers: {
      ...(hasBody ? { "Content-Type": "application/json" } : {}),
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as {
      detail?: string;
      message?: string;
      error?: string;
    };
    const msg =
      body.detail ??
      body.message ??
      (typeof body.error === "string" ? body.error : undefined) ??
      `Request failed (${res.status})`;
    throw new ApiError(res.status, msg);
  }
  return res.json() as Promise<T>;
}

export { API_BASE };
