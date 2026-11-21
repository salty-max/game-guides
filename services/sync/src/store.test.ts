import { afterEach, describe, expect, it } from "vitest";
import { MemoryStore, StoreError, UpstashStore, storeFromEnv, toPairs, type Store } from "./store";

/*
 * One contract, two stores: the commands the API runs must answer the same on MemoryStore and on real Upstash.
 * Upstash runs only when SYNC_TEST_REDIS_URL and SYNC_TEST_REDIS_TOKEN are set (a test database, never production):
 *   SYNC_TEST_REDIS_URL=… SYNC_TEST_REDIS_TOKEN=… pnpm test
 */

const url = process.env.SYNC_TEST_REDIS_URL;
const token = process.env.SYNC_TEST_REDIS_TOKEN;
const run = Math.random().toString(36).slice(2, 10);

interface Stand {
  name: string;
  make: () => Store;
}
const stands: Stand[] = [{ name: "MemoryStore", make: () => new MemoryStore() }];
if (url && token) stands.push({ name: "Upstash", make: () => new UpstashStore(url, token) });

describe.each(stands)("store contract: $name", ({ make }) => {
  const store = make();
  const used = new Set<string>();
  const key = (name: string) => {
    const full = `contract:${run}:${name}`;
    used.add(full);
    return full;
  };
  afterEach(async () => {
    if (used.size) await store.exec([["DEL", ...used]]);
    used.clear();
  });

  it("runs a batch in order and returns each answer", async () => {
    const k = key("batch");
    expect(await store.exec([["SET", k, "a"], ["GET", k], ["SET", k, "b"], ["GET", k]])).toEqual(["OK", "a", "OK", "b"]);
    expect(await store.exec([])).toEqual([]);
  });

  it("SET NX EX only sets a key that is not there", async () => {
    const k = key("code");
    expect(await store.exec([["SET", k, "first", "NX", "EX", 600]])).toEqual(["OK"]);
    expect(await store.exec([["SET", k, "second", "NX", "EX", 600], ["GET", k]])).toEqual([null, "first"]);
  });

  it("MGET gives each key's value in order, and null for one that isn't there or isn't a string", async () => {
    const [a, b, h] = [key("many:a"), key("many:b"), key("many:h")];
    await store.exec([["SET", a, "1.57.6", "EX", 600], ["SET", b, "none"], ["HSET", h, "f", "v"]]);
    expect(await store.exec([["MGET", a, key("many:missing"), b, h]])).toEqual([["1.57.6", null, "none", null]]);
  });

  it("SET XX EX only replaces a key that is there", async () => {
    const k = key("summary");
    expect(await store.exec([["SET", k, "none", "XX", "EX", 600], ["GET", k]])).toEqual([null, null]);
    await store.exec([["SET", k, "1.57.6", "EX", 600]]);
    expect(await store.exec([["SET", k, "none", "XX", "EX", 600], ["GET", k]])).toEqual(["OK", "none"]);
  });

  it("GETDEL gives a value once", async () => {
    const k = key("once");
    await store.exec([["SET", k, "v"]]);
    expect(await store.exec([["GETDEL", k], ["GETDEL", k], ["GET", k]])).toEqual(["v", null, null]);
  });

  it("INCR counts from one, and EXPIRE says whether the key was there", async () => {
    const k = key("count");
    expect(await store.exec([["INCR", k], ["INCR", k], ["INCR", k]])).toEqual([1, 2, 3]);
    expect(await store.exec([["EXPIRE", k, 100], ["EXPIRE", key("missing"), 100]])).toEqual([1, 0]);
  });

  it("INCRBY and HINCRBY add any amount from nothing, and give the new total", async () => {
    const k = key("budget");
    const h = key("totals");
    expect(await store.exec([["INCRBY", k, 5], ["INCRBY", k, 3]])).toEqual([5, 8]);
    expect(await store.exec([["HINCRBY", h, "v:app", 2], ["HINCRBY", h, "v:app", 1], ["HINCRBY", h, "p:guide/3", 4]])).toEqual([2, 3, 4]);
    expect(toPairs((await store.exec([["HGETALL", h]]))[0]).sort()).toEqual([["p:guide/3", "4"], ["v:app", "3"]]);
  });

  it("SCAN with MATCH finds the keys that fit, page by page until the cursor is back at 0", async () => {
    const hits = [key("scan:gd:a"), key("scan:gd:b")];
    key("scan:other");
    await store.exec([...hits, `contract:${run}:scan:other`].map((name) => ["SET", name, "1"]));
    const found: string[] = [];
    let cursor = "0";
    do {
      const [page] = (await store.exec([["SCAN", cursor, "MATCH", `contract:${run}:scan:gd:*`, "COUNT", 1000]])) as [[string, string[]]];
      cursor = String(page[0]);
      found.push(...page[1]);
    } while (cursor !== "0");
    expect(found.sort()).toEqual(hits.sort());
  });

  it("DEL counts what it removed", async () => {
    const [a, b] = [key("a"), key("b")];
    await store.exec([["SET", a, "1"], ["SET", b, "2"]]);
    expect(await store.exec([["DEL", a, b, key("never")], ["DEL", a]])).toEqual([2, 0]);
  });

  it("hashes: HSET, HGET, HMGET, HGETALL, HLEN and HDEL", async () => {
    const k = key("hash");
    expect(await store.exec([["HSET", k, "g", "", "h", "x", "label", "Safari · iPhone"]])).toEqual([3]);
    expect(await store.exec([["HSET", k, "h", "y"]])).toEqual([0]);
    expect(await store.exec([["HGET", k, "h"], ["HGET", k, "nope"]])).toEqual(["y", null]);
    expect(await store.exec([["HMGET", k, "g", "h", "nope", "label"]])).toEqual([["", "y", null, "Safari · iPhone"]]);
    const [all] = await store.exec([["HGETALL", k]]);
    expect(Object.fromEntries(toPairs(all))).toEqual({ g: "", h: "y", label: "Safari · iPhone" });
    expect(await store.exec([["HLEN", k], ["HDEL", k, "g", "h", "nope"], ["HLEN", k]])).toEqual([3, 2, 1]);
    expect(await store.exec([["HDEL", k, "label"], ["HLEN", k], ["HGETALL", k]])).toEqual([1, 0, []]);
  });

  it("a missing hash reads as empty", async () => {
    const k = key("none");
    expect(await store.exec([["HGETALL", k], ["HLEN", k], ["HMGET", k, "a", "b"]])).toEqual([[], 0, [null, null]]);
  });

  it("ZADD adds members and counts only the new ones, ZREM removes them, ZCARD counts", async () => {
    const k = key("zset");
    expect(await store.exec([["ZADD", k, 10, "a", 20, "b"]])).toEqual([2]);
    expect(await store.exec([["ZADD", k, 10, "a", 30, "c"]])).toEqual([1]);
    expect(await store.exec([["ZCARD", k], ["ZREM", k, "a", "nope"], ["ZCARD", k]])).toEqual([3, 1, 2]);
    expect(await store.exec([["ZREM", k, "b", "c"], ["ZCARD", k], ["ZRANGE", k, 0, -1]])).toEqual([2, 0, []]);
  });

  it("ZRANGE gives members by score, then by name, with scores as text when asked", async () => {
    const k = key("order");
    await store.exec([["ZADD", k, 5, "b", 5, "a", 1700000000123, "z"]]);
    const [withScores, plain] = await store.exec([["ZRANGE", k, 0, -1, "WITHSCORES"], ["ZRANGE", k, 0, -1]]);
    expect(withScores).toEqual(["a", "5", "b", "5", "z", "1700000000123"]);
    expect(plain).toEqual(["a", "b", "z"]);
  });

  it("EXPIRE NX sets an expiry once, so a counter's window is fixed by its first hit", async () => {
    const k = key("window");
    expect(await store.exec([["INCR", k], ["EXPIRE", k, 100, "NX"], ["INCR", k], ["EXPIRE", k, 5000, "NX"]])).toEqual([1, 1, 2, 0]);
  });

  it("keeps members that hold a tab, JSON and non-ASCII text", async () => {
    const k = key("members");
    const member = 'x:mode\t7\t{"a":["é",1]}';
    await store.exec([["ZADD", k, 7, member]]);
    const [range] = await store.exec([["ZRANGE", k, 0, -1, "WITHSCORES"]]);
    expect(range).toEqual([member, "7"]);
  });

  it("refuses a command on a key of the wrong kind", async () => {
    const k = key("wrongtype");
    await store.exec([["SET", k, "v"]]);
    await expect(store.exec([["HGETALL", k]])).rejects.toBeInstanceOf(StoreError);
  });
});

describe("MemoryStore", () => {
  it("expires keys against its clock, and answers TTL", async () => {
    let now = 1_000_000;
    const store = new MemoryStore({ now: () => now });
    await store.exec([["SET", "k", "v", "EX", 600], ["SET", "plain", "v"], ["HSET", "h", "f", "v"], ["EXPIRE", "h", 60]]);
    expect(store.ttl("k")).toBe(600);
    expect(store.ttl("plain")).toBeNull();
    now += 599_000;
    expect(await store.exec([["GET", "k"], ["HLEN", "h"]])).toEqual(["v", 0]);
    now += 2000;
    expect(await store.exec([["GET", "k"], ["SET", "k", "again", "NX"]])).toEqual([null, "OK"]);
    expect(store.keys().sort()).toEqual(["k", "plain"]);
  });

  it("sets a window once with EXPIRE NX and reports it in TTL", async () => {
    const store = new MemoryStore({ now: () => 0 });
    await store.exec([["INCR", "c"], ["EXPIRE", "c", 100, "NX"], ["EXPIRE", "c", 900, "NX"]]);
    expect(store.ttl("c")).toBe(100);
  });

  it("keeps a counter's expiry when it counts on", async () => {
    let now = 0;
    const store = new MemoryStore({ now: () => now });
    await store.exec([["INCR", "c"], ["EXPIRE", "c", 10]]);
    now += 9000;
    await store.exec([["INCR", "c"]]);
    now += 2000;
    expect(await store.exec([["GET", "c"]])).toEqual([null]);
  });

  it("refuses commands it does not know", async () => {
    await expect(new MemoryStore().exec([["FLUSHALL"]])).rejects.toBeInstanceOf(StoreError);
  });

  it("lets concurrent batches interleave when told to", async () => {
    const order: string[] = [];
    const store = new MemoryStore({ between: () => new Promise((resolve) => setImmediate(resolve)) });
    const a = store.exec([["SET", "a", "1"], ["GET", "a"]]).then(() => order.push("a"));
    const b = store.exec([["SET", "b", "1"]]).then(() => order.push("b"));
    await Promise.all([a, b]);
    expect(order).toEqual(["b", "a"]);
  });
});

describe("UpstashStore", () => {
  const reply = (body: unknown, status = 200) => async () => new Response(JSON.stringify(body), { status });

  it("posts the batch to /pipeline with the token and reads each result", async () => {
    const seen: { url: string; init?: RequestInit }[] = [];
    const store = new UpstashStore("https://example.upstash.io/", "secret", (async (input: string | URL | Request, init?: RequestInit) => {
      seen.push({ url: String(input), init });
      return new Response(JSON.stringify([{ result: "OK" }, { result: 3 }, { result: null }]));
    }) as typeof fetch);
    expect(await store.exec([["SET", "k", "v"], ["INCR", "n"], ["GET", "gone"]])).toEqual(["OK", 3, null]);
    expect(seen[0].url).toBe("https://example.upstash.io/pipeline");
    expect(seen[0].init?.method).toBe("POST");
    expect((seen[0].init?.headers as Record<string, string>).Authorization).toBe("Bearer secret");
    expect(JSON.parse(String(seen[0].init?.body))).toEqual([["SET", "k", "v"], ["INCR", "n"], ["GET", "gone"]]);
  });

  it("sends nothing for an empty batch", async () => {
    const store = new UpstashStore("https://x", "t", (async () => {
      throw new Error("should not be called");
    }) as typeof fetch);
    expect(await store.exec([])).toEqual([]);
  });

  it("turns an error row, a bad status and a dead network into a StoreError", async () => {
    await expect(new UpstashStore("https://x", "t", reply([{ error: "ERR max requests limit exceeded" }]) as typeof fetch).exec([["GET", "k"]])).rejects.toThrow("max requests");
    await expect(new UpstashStore("https://x", "t", reply({ error: "no" }, 401) as typeof fetch).exec([["GET", "k"]])).rejects.toBeInstanceOf(StoreError);
    const down = (async () => {
      throw new TypeError("fetch failed");
    }) as typeof fetch;
    await expect(new UpstashStore("https://x", "t", down).exec([["GET", "k"]])).rejects.toBeInstanceOf(StoreError);
  });
});

describe("storeFromEnv", () => {
  it("reads Upstash's variable names and Vercel KV's, and is null without both parts", () => {
    expect(storeFromEnv({ UPSTASH_REDIS_REST_URL: "https://a", UPSTASH_REDIS_REST_TOKEN: "t" })).toBeInstanceOf(UpstashStore);
    expect(storeFromEnv({ KV_REST_API_URL: "https://a", KV_REST_API_TOKEN: "t" })).toBeInstanceOf(UpstashStore);
    expect(storeFromEnv({ UPSTASH_REDIS_REST_URL: "https://a" })).toBeNull();
    expect(storeFromEnv({ KV_REST_API_TOKEN: "t" })).toBeNull();
    expect(storeFromEnv({})).toBeNull();
  });
});

describe("toPairs", () => {
  it("reads a flat list or an object, and nothing else", () => {
    expect(toPairs(["a", "1", "b", 2])).toEqual([["a", "1"], ["b", "2"]]);
    expect(toPairs({ a: 1 })).toEqual([["a", "1"]]);
    expect(toPairs(["odd"])).toEqual([]);
    expect(toPairs(null)).toEqual([]);
    expect(toPairs("x")).toEqual([]);
  });
});
