// @vitest-environment node
import { readFileSync } from "node:fs";
import { allRows } from "../guide";
import { isKey } from "./ledger";

const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");

describe("the ledger", () => {
  it("is the very file the API runs, so both sides always agree on who wins", () => {
    expect(read("./ledger.ts")).toBe(read("../../../../services/sync/src/ledger.ts"));
  });

  it("accepts every row id of the guide as a key, or the API would refuse the whole push", () => {
    for (const row of allRows) expect(isKey(`c:${row.id}`), row.id).toBe(true);
  });
});
