import { dropRecord, readHint, readRecord, SYNC_KEY, writeRecord, type SyncRecord } from "./local";

const record: SyncRecord = { v: 1, group: "abc", entries: { ceiling: [5, 2], "c:heart-well": [6, 1] }, dirty: ["ceiling"], clock: { last: 6, offset: -3000 }, touched: 9 };

beforeEach(() => {
  localStorage.clear();
  document.cookie = "hundo_link=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
});

describe("the saved ledger", () => {
  it("reads back what was written, under the guide's own key", () => {
    expect(SYNC_KEY).toMatch(/\.sync$/);
    expect(writeRecord(record)).toBe(true);
    expect(readRecord()).toEqual(record);
    dropRecord();
    expect(readRecord()).toBeNull();
  });

  it("starts over rather than trust what it can't read, and keeps what it can", () => {
    for (const bad of ["{nope", "null", "[]", JSON.stringify({ ...record, v: 2 }), JSON.stringify({ ...record, group: 3 })]) {
      localStorage.setItem(SYNC_KEY, bad);
      expect(readRecord(), bad).toBeNull();
    }
    localStorage.setItem(SYNC_KEY, JSON.stringify({ ...record, entries: { ...record.entries, "c:Bad Key": [1, 1], ceiling: [-1, 2], chapter: [1, "x"] }, dirty: ["ceiling", "gone"], clock: { last: "x" } }));
    expect(readRecord()).toMatchObject({ entries: { "c:heart-well": [6, 1] }, dirty: [], clock: { last: 0, offset: 0 } });
  });

  it("says no when storage refuses", () => {
    const setItem = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("quota");
    });
    expect(writeRecord(record)).toBe(false);
    setItem.mockRestore();
  });
});

describe("the link cookie", () => {
  it("is the fingerprint when it is set, and empty when it isn't or isn't one", () => {
    expect(readHint()).toBe("");
    document.cookie = "hundo_link=aB3-_xyz09; path=/";
    expect(readHint()).toBe("aB3-_xyz09");
    document.cookie = "hundo_link=has spaces!; path=/";
    expect(readHint()).toBe("");
  });
});
