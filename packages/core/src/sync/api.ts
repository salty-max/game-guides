/*
 * The sync API as the guide calls it: always the guide's own /api, which Vercel rewrites to the API's project, so a call is same-origin
 * and its cookies belong to the guide's host. Every call is a POST with `p`, the protocol, which only ever grows.
 */

export const PROTOCOL = 1;

export interface Reply<T = Record<string, unknown>> {
  /** The HTTP status, or 0 when the service couldn't be reached at all. */
  status: number;
  body: T | null;
}

/** A call never throws: a network failure is status 0. */
export async function call<T = Record<string, unknown>>(path: string, body: Record<string, unknown> = {}, keepalive = false): Promise<Reply<T>> {
  try {
    const response = await fetch(`/api${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ p: PROTOCOL, ...body }),
      credentials: "same-origin",
      cache: "no-store",
      keepalive,
    });
    const json: unknown = await response.json().catch(() => null);
    return { status: response.status, body: json !== null && typeof json === "object" ? (json as T) : null };
  } catch {
    return { status: 0, body: null };
  }
}
