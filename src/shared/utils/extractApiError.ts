/**
 * Extracts a human-readable error message from API error responses.
 *
 * Handles two shapes:
 *  1) Standard Axios error — `err.response.data.message` / `err.response.data.error`
 *  2) Our custom reject (from request.ts) — the rejected value IS the Axios
 *     response itself, so `err.data.message` / `err.data.error`
 */
export function extractApiError(err: unknown, fallback: string): string {
  if (!err || typeof err !== "object") return fallback;

  const e = err as Record<string, unknown>;

  // Shape 1 — standard Axios error: err.response.data
  const axiosData = (e.response as Record<string, unknown> | undefined)?.data as
    | Record<string, unknown>
    | undefined;
  if (axiosData) {
    const msg =
      (axiosData.message as string) || (axiosData.error as string) || "";
    if (msg) return msg;
  }

  // Shape 2 — our custom reject: err IS the response, so err.data
  const directData = e.data as Record<string, unknown> | undefined;
  if (directData) {
    const msg =
      (directData.message as string) || (directData.error as string) || "";
    if (msg) return msg;
  }

  // Shape 3 — plain Error
  if (e.message && typeof e.message === "string") return e.message;

  return fallback;
}
