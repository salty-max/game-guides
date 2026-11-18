export const two = (value: number) => String(value).padStart(2, "0");
// Multiplied before dividing: (29 / 50) * 100 is 57.99… in floating point, and would round down to 57.
export const pct = (done: number, total: number) => (total ? Math.floor((done * 100) / total) : 0);

/** Chapter id → what an eager `import.meta.glob` of `chapter-<n>.<ext>` files gives for each. */
export const byChapter = <T>(files: Record<string, T>): Record<number, T> =>
  Object.fromEntries(Object.entries(files).map(([path, file]) => [Number(/chapter-(\d+)\./.exec(path)?.[1]), file]));

/** "just now", "5 minutes ago", "3 hours ago", "2 days ago". */
export function ago(at: number, now: number): string {
  const minutes = Math.max(0, Math.round((now - at) / 60_000));
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 48) return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  return `${Math.round(hours / 24)} days ago`;
}
