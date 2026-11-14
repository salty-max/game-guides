export const two = (value: number) => String(value).padStart(2, "0");
export const pct = (done: number, total: number) => (total ? Math.floor((done / total) * 100) : 0);

/** Chapter id → URL, from an `import.meta.glob` of `chapter-<n>.<ext>` files. */
export const byChapter = (files: Record<string, string>) =>
  Object.fromEntries(Object.entries(files).map(([path, url]) => [Number(/chapter-(\d+)\./.exec(path)?.[1]), url]));
