import { createHash, randomBytes, randomInt, timingSafeEqual } from "node:crypto";
import { LIMITS, parseEntries, settle, winners, type Entries } from "./ledger";
import { StoreError, toPairs, type Command, type Store } from "./store";

/*
 * The sync API: pairing codes, devices, and one sync call. Every endpoint is a POST with a JSON body, reached through
 * a guide's own /api (a rewrite to this project), so calls are same-origin and the cookies are set by the page's host.
 * Handlers take a Web Request and give a Response, and everything outside them (store, clock, salt) is passed in.
 */

export interface Deps {
  store: Store;
  now: () => number;
  /** Secret salt for the IP hashes behind the rate limits. */
  salt: string;
}

/** The brand.id of every guide. A test holds this list to the apps' own brands. */
export const GUIDES = ["echoes-of-wisdom", "links-awakening", "red-dead-redemption"];

const PROTOCOL = 1;
const DAY = 86_400;
const CODE_SECONDS = 600;
const PENDING_SECONDS = 900;
/** Nothing is kept past 400 days without a sync (Chrome's own cap on a cookie's life). */
const KEEP_SECONDS = 400 * DAY;
const KEEP_TEST_SECONDS = 7 * DAY;
const MAX_BODY = 256 * 1024;
/** Devices in one group. A device not seen for three months drops off the list by itself (and comes back on its next sync). */
const MAX_DEVICES = 12;
const STALE_MS = 90 * 86_400_000;
/** Syncs a minute from one device: a runaway client or a stolen cookie gets a trickle. It does not guard the store's quota. */
const SYNCS_PER_MINUTE = 120;
const SEEN_EVERY = 60_000;

const DEVICE_COOKIE = "hundo_sync";
const LINK_COOKIE = "hundo_link";

type Ns = "prod" | "test";

interface Where {
  ns: Ns;
  /** Set on hundo.quest guides so one link covers every guide; previews and localhost keep host-only cookies. */
  domain?: string;
  secure: boolean;
}

interface Me {
  id: string;
  secret: string;
  /** "" while the device waits as the one showing a code. */
  group: string;
  label: string;
}

interface Ctx {
  deps: Deps;
  where: Where;
  request: Request;
  body: Record<string, unknown>;
  cookies: Map<string, string>;
  now: number;
}

const ttl = (ns: Ns) => (ns === "test" ? KEEP_TEST_SECONDS : KEEP_SECONDS);
const key = (ns: Ns, ...parts: string[]) => ["hs", ns, ...parts].join(":");

/**
 * The team's preview hosts by their name: a deployment (`hundo-koholint-2b16reepd-jellycat.vercel.app`) or a branch
 * (`hundo-koholint-git-<branch>-jellycat.vercel.app`). It's a shape, not proof of ownership: another account could name a project to fit
 * (whether Vercel reserves it isn't known), and what that page could do is use its own cookies in the test namespace.
 */
const PREVIEW_HOST = /^hundo-[a-z0-9-]+-jellycat\.vercel\.app$/;

/**
 * Which page is calling, and so which part of the store it may touch, from the `Origin` alone: only a guide's own hosts, the team's
 * previews and localhost are served. The page's host can't be checked against Origin: behind a guide's /api rewrite Vercel hands this
 * API its own host in Host, and no x-forwarded-host that names the guide's (seen on the first preview, against what Vercel's docs say).
 * Origin is set by the browser and no page script can change it. A script on another site is refused for its Origin, and couldn't
 * read an answer anyway: this API never sends Access-Control-Allow-Origin, nor answers a preflight. A form or text/plain post, which
 * needs no preflight, is refused for its content type wherever it comes from.
 */
function whereFrom(request: Request): Where | null {
  const origin = request.headers.get("origin");
  if (!origin) return null;
  let url: URL;
  try {
    url = new URL(origin);
  } catch {
    return null;
  }
  const secure = url.protocol === "https:" && url.port === "";
  if (secure && /^(?!api\.)[a-z0-9-]+\.hundo\.quest$/.test(url.hostname)) return { ns: "prod", domain: "hundo.quest", secure: true };
  if (secure && PREVIEW_HOST.test(url.hostname)) return { ns: "test", secure: true };
  if (["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)) return { ns: "test", secure: url.protocol === "https:" };
  return null;
}

function parseCookies(header: string | null): Map<string, string> {
  const out = new Map<string, string>();
  for (const part of (header ?? "").split(";")) {
    const at = part.indexOf("=");
    if (at > 0) out.set(part.slice(0, at).trim(), part.slice(at + 1).trim());
  }
  return out;
}

function cookie(where: Where, name: string, value: string, o: { maxAge: number; path: string; httpOnly?: boolean }) {
  return [`${name}=${value}`, `Max-Age=${o.maxAge}`, `Path=${o.path}`, where.domain && `Domain=${where.domain}`, where.secure && "Secure", o.httpOnly && "HttpOnly", "SameSite=Lax"]
    .filter(Boolean)
    .join("; ");
}

const fingerprint = (group: string) => createHash("sha256").update(group).digest("base64url").slice(0, 10);

/** The device cookie (secret, HttpOnly, only sent to /api) and the hint a guide reads without a request (no secret). */
const sessionCookies = (ctx: Ctx, token: string, group: string) => [
  cookie(ctx.where, DEVICE_COOKIE, token, { maxAge: ttl(ctx.where.ns), path: "/api", httpOnly: true }),
  cookie(ctx.where, LINK_COOKIE, fingerprint(group), { maxAge: ttl(ctx.where.ns), path: "/" }),
];

const clearCookies = (ctx: Ctx) => [
  cookie(ctx.where, DEVICE_COOKIE, "", { maxAge: 0, path: "/api", httpOnly: true }),
  cookie(ctx.where, LINK_COOKIE, "", { maxAge: 0, path: "/" }),
];

function reply(status: number, body: unknown, cookies: string[] = [], headers: Record<string, string> = {}) {
  const response = new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff", ...headers },
  });
  for (const value of cookies) response.headers.append("Set-Cookie", value);
  return response;
}

const unlinked = (ctx: Ctx) => reply(401, { error: "unlinked" }, clearCookies(ctx));
const sha256 = (text: string) => createHash("sha256").update(text).digest("hex");
/** A device's name as the user agent gave it: no control characters (the store keeps a tab between fields), at most 40. */
const cleanLabel = (value: unknown) => {
  const text = typeof value === "string" ? [...value].filter((char) => char.charCodeAt(0) > 31 && char.charCodeAt(0) !== 127).join("").trim().slice(0, 40) : "";
  return text || "Unknown device";
};
const exec = (ctx: Ctx, commands: Command[]) => ctx.deps.store.exec(commands);

const dvKey = (ctx: Ctx, id: string) => key(ctx.where.ns, "dv", id);
const gdKey = (ctx: Ctx, group: string) => key(ctx.where.ns, "gd", group);
const pKey = (ctx: Ctx, group: string, guide: string) => key(ctx.where.ns, "p", group, guide);

/** The device behind this request's cookie, or null when there is none or it was unlinked. */
async function identify(ctx: Ctx): Promise<Me | null> {
  const token = /^([A-Za-z0-9_-]{16})\.([A-Za-z0-9_-]{22})$/.exec(ctx.cookies.get(DEVICE_COOKIE) ?? "");
  if (!token) return null;
  const [id, secret] = [token[1], token[2]];
  const [row] = await exec(ctx, [["HMGET", dvKey(ctx, id), "g", "h", "label"]]);
  const [group, hash, label] = row as (string | null)[];
  if (hash === null) return null;
  const stored = Buffer.from(hash, "hex");
  const given = Buffer.from(sha256(secret), "hex");
  if (stored.length !== given.length || !timingSafeEqual(stored, given)) return null;
  return { id, secret, group: group ?? "", label: label ?? "" };
}

const tokenOf = (me: Me) => `${me.id}.${me.secret}`;

/** A fixed window counter: false once `subject` has made more than `max` calls in `seconds`. */
async function allow(ctx: Ctx, name: string, subject: string, max: number, seconds: number): Promise<boolean> {
  const counter = key(ctx.where.ns, "rl", name, subject, String(Math.floor(ctx.now / (seconds * 1000))));
  // One batch, so a counter can't be left without an expiry: it is gone when its window is.
  const [count] = await exec(ctx, [["INCR", counter], ["EXPIRE", counter, seconds, "NX"]]);
  return Number(count) <= max;
}

/** An address as the limits count it: IPv4 as is, an IPv6 visitor by its /64, since it can change the low half at will. */
export function visitorOf(raw: string): string {
  const mapped = /^::ffff:(\d+\.\d+\.\d+\.\d+)$/i.exec(raw);
  if (mapped) return mapped[1];
  if (!raw.includes(":")) return raw;
  const [head, tail] = raw.split("::");
  const front = head ? head.split(":") : [];
  const back = tail ? tail.split(":") : [];
  const groups = raw.includes("::") ? [...front, ...Array(Math.max(0, 8 - front.length - back.length)).fill("0"), ...back] : front;
  return groups.slice(0, 4).map((group) => group.toLowerCase().padStart(4, "0")).join(":");
}

function ipHash(ctx: Ctx): string {
  const headers = ctx.request.headers;
  const raw = (headers.get("x-real-ip") ?? headers.get("x-forwarded-for")?.split(",")[0] ?? "").trim();
  return createHash("sha256").update(`${ctx.deps.salt}|${visitorOf(raw)}`).digest("hex").slice(0, 16);
}

/** A new device, linked to `group` or, with "", waiting to be linked by a code (kept 15 minutes). */
async function createDevice(ctx: Ctx, group: string, label: string): Promise<Me> {
  const id = randomBytes(12).toString("base64url");
  const secret = randomBytes(16).toString("base64url");
  const keep = group ? ttl(ctx.where.ns) : PENDING_SECONDS;
  const commands: Command[] = [
    ["HSET", dvKey(ctx, id), "h", sha256(secret), "g", group, "label", label],
    ["EXPIRE", dvKey(ctx, id), keep],
  ];
  if (group) commands.push(["HSET", gdKey(ctx, group), id, `${label}\t${ctx.now}`], ["EXPIRE", gdKey(ctx, group), ttl(ctx.where.ns)]);
  await exec(ctx, commands);
  return { id, secret, group, label };
}

/** Put an existing device in `group`, taking it out of the one it was in, which is deleted when it ends up empty. */
async function attach(ctx: Ctx, id: string, group: string, label: string, from = "") {
  const keep = ttl(ctx.where.ns);
  const commands: Command[] = [
    ["HSET", dvKey(ctx, id), "g", group],
    ["EXPIRE", dvKey(ctx, id), keep],
    ["HSET", gdKey(ctx, group), id, `${label}\t${ctx.now}`],
    ["EXPIRE", gdKey(ctx, group), keep],
  ];
  if (from && from !== group) commands.push(["HDEL", gdKey(ctx, from), id]);
  await exec(ctx, commands);
  if (from && from !== group) await dropIfEmpty(ctx, from);
}

/** A group's devices as the store holds them, apart into those seen within three months and those not. */
function devicesOf(flat: unknown, now: number) {
  const all = toPairs(flat).map(([id, value]) => {
    const [label, seen] = value.split("\t");
    return { id, label, seen: Number(seen) };
  });
  return { all, live: all.filter((device) => now - device.seen <= STALE_MS), stale: all.filter((device) => now - device.seen > STALE_MS) };
}

/** Whether a group has room for a device. A device that went quiet for three months, a browser cleared and never unlinked, is dropped first. */
async function hasRoom(ctx: Ctx, group: string): Promise<boolean> {
  const [flat] = await exec(ctx, [["HGETALL", gdKey(ctx, group)]]);
  const { live, stale } = devicesOf(flat, ctx.now);
  if (stale.length > 0) await exec(ctx, [["HDEL", gdKey(ctx, group), ...stale.map((device) => device.id)]]);
  return live.length < MAX_DEVICES;
}

async function dropIfEmpty(ctx: Ctx, group: string) {
  const [count] = await exec(ctx, [["HLEN", gdKey(ctx, group)]]);
  if (count === 0) await exec(ctx, [["DEL", gdKey(ctx, group), ...GUIDES.map((guide) => pKey(ctx, group, guide))]]);
}

async function pairStart(ctx: Ctx) {
  if (!(await allow(ctx, "start", ipHash(ctx), 10, 3600))) return reply(429, { error: "limit" });
  let me = await identify(ctx);
  const cookies: string[] = [];
  if (!me) {
    me = await createDevice(ctx, "", cleanLabel(ctx.body.label));
    // Not the hint cookie yet: other tabs would try to sync before there is a group.
    cookies.push(cookie(ctx.where, DEVICE_COOKIE, tokenOf(me), { maxAge: PENDING_SECONDS, path: "/api", httpOnly: true }));
  } else if (!me.group) {
    await exec(ctx, [["EXPIRE", dvKey(ctx, me.id), PENDING_SECONDS]]);
    // The cookie's own clock runs on too: left alone it dies 15 minutes after the first code, with the device still waiting.
    cookies.push(cookie(ctx.where, DEVICE_COOKIE, tokenOf(me), { maxAge: PENDING_SECONDS, path: "/api", httpOnly: true }));
  }
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
    const [set] = await exec(ctx, [["SET", key(ctx.where.ns, "pc", code), me.id, "NX", "EX", CODE_SECONDS]]);
    if (set === "OK") return reply(200, { code, expiresAt: ctx.now + CODE_SECONDS * 1000, linked: me.group !== "" }, cookies);
  }
  return reply(503, { error: "busy" });
}

async function pairClaim(ctx: Ctx) {
  const ns = ctx.where.ns;
  // Six digits is a small space, so wrong guesses are counted per visitor and across everyone.
  const failures = key(ns, "rl", "claimfail", String(Math.floor(ctx.now / 600_000)));
  const [failed] = await exec(ctx, [["GET", failures]]);
  if (Number(failed ?? 0) >= 300) return reply(429, { error: "limit" });
  if (!(await allow(ctx, "claim", ipHash(ctx), 10, 900))) return reply(429, { error: "limit" });
  const wrong = async () => {
    await exec(ctx, [["INCR", failures], ["EXPIRE", failures, 600, "NX"]]);
    // A wrong code, an expired one and a used one all look the same.
    return reply(400, { error: "code" });
  };

  const code = typeof ctx.body.code === "string" ? ctx.body.code.replace(/\D/g, "") : "";
  if (code.length !== 6) return wrong();
  const [showerId] = await exec(ctx, [["GETDEL", key(ns, "pc", code)]]);
  if (typeof showerId !== "string") return wrong();
  const [row] = await exec(ctx, [["HMGET", dvKey(ctx, showerId), "g", "label"]]);
  const [showerGroup, showerLabel] = row as (string | null)[];
  if (showerGroup === null && showerLabel === null) return wrong();

  const me = await identify(ctx);
  if (me?.id === showerId) return wrong();
  const label = cleanLabel(ctx.body.label);
  const shower = showerLabel || "Unknown device";
  const outcome: { already?: boolean; moved?: boolean } = {};
  const full = () => reply(409, { error: "devices" });
  let group: string;
  let token: string;
  if (showerGroup) {
    // The device showing the code is linked: the one typing joins its group.
    group = showerGroup;
    if (me?.group === group) {
      token = tokenOf(me);
      outcome.already = true;
    } else {
      if (!(await hasRoom(ctx, group))) return full();
      if (!me) token = tokenOf(await createDevice(ctx, group, label));
      else {
        await attach(ctx, me.id, group, label, me.group);
        token = tokenOf(me);
        outcome.moved = me.group !== "";
      }
    }
  } else if (me?.group) {
    // The device showing the code has no group yet and the one typing has: the first joins the second.
    group = me.group;
    if (!(await hasRoom(ctx, group))) return full();
    await attach(ctx, showerId, group, shower);
    token = tokenOf(me);
  } else {
    // Neither is linked: a new group for both.
    group = randomBytes(16).toString("base64url");
    await attach(ctx, showerId, group, shower);
    if (me) {
      await attach(ctx, me.id, group, label);
      token = tokenOf(me);
    } else token = tokenOf(await createDevice(ctx, group, label));
  }
  return reply(200, { linked: true, ...outcome }, sessionCookies(ctx, token, group));
}

async function status(ctx: Ctx) {
  const me = await identify(ctx);
  if (!me) return unlinked(ctx);
  if (!me.group) return reply(200, { linked: false, pending: true });
  const [flat] = await exec(ctx, [["HGETALL", gdKey(ctx, me.group)]]);
  const devices = devicesOf(flat, ctx.now).live.map(({ id, label, seen }) => ({ label, seen, self: id === me.id }));
  // Also how a device that was showing a code learns its code was used: its next poll carries the new cookies.
  return reply(200, { linked: true, devices, now: ctx.now }, sessionCookies(ctx, tokenOf(me), me.group));
}

async function sync(ctx: Ctx) {
  const guide = ctx.body.guide;
  if (typeof guide !== "string" || !GUIDES.includes(guide)) return reply(400, { error: "guide" });
  const entries: Entries | null = ctx.body.entries === undefined ? {} : parseEntries(ctx.body.entries);
  if (!entries) return reply(400, { error: "entries" });
  if (Object.values(entries).some(([at]) => at > ctx.now + LIMITS.future)) return reply(400, { error: "clock", now: ctx.now });

  const me = await identify(ctx);
  if (!me?.group) return unlinked(ctx);
  const set = pKey(ctx, me.group, guide);
  const devicesKey = gdKey(ctx, me.group);
  const visits = key(ctx.where.ns, "rl", "sync", me.id, String(Math.floor(ctx.now / 60_000)));

  const [count, , stored, flat] = await exec(ctx, [["INCR", visits], ["EXPIRE", visits, 60, "NX"], ["ZRANGE", set, 0, -1], ["HGETALL", devicesKey]]);
  if (Number(count) > SYNCS_PER_MINUTE) return reply(429, { error: "limit" });

  // Settle what the device sent against what is stored: the winners go back, only winning changes are added, and the
  // members that lost are removed, so a guide's data stays about as big as its keys however often they change.
  const members = (stored as unknown[]).map(String);
  const { entries: state, add, drop } = settle(members, entries);
  const names = Object.keys(state);
  const over = names.length > LIMITS.keys || names.filter((name) => name.startsWith("x:")).length > LIMITS.leaves;
  if (over) {
    // Two devices that each stayed under a cap can together pass it. Only a push that adds keys is refused then, and what
    // lost is still cleared, so the data can't get stuck: pulls and changes to keys it already has go on working.
    const held = winners(members);
    if (Object.keys(entries).some((name) => !(name in held))) {
      const { drop: tidy } = settle(members, {});
      if (tidy.length > 0) await exec(ctx, [["ZREM", set, ...tidy]]);
      return reply(413, { error: "full" });
    }
  }

  const keep = ttl(ctx.where.ns);
  const touch = ctx.body.touch === true;
  const { all, live } = devicesOf(flat, ctx.now);
  const mine = all.find((device) => device.id === me.id);
  const commands: Command[] = [];
  // Always an expiry with the data, so a push that lands after a "forget" leaves nothing that lasts.
  if (add.length > 0) commands.push(["ZADD", set, ...add.flatMap(([at, member]) => [at, member])], ["EXPIRE", set, keep]);
  if (drop.length > 0) commands.push(["ZREM", set, ...drop]);
  if (!mine || ctx.now - mine.seen > SEEN_EVERY) commands.push(["HSET", devicesKey, me.id, `${me.label}\t${ctx.now}`], ["EXPIRE", devicesKey, keep]);
  if (touch) commands.push(["EXPIRE", dvKey(ctx, me.id), keep], ["EXPIRE", devicesKey, keep], ["EXPIRE", set, keep]);
  if (commands.length > 0) await exec(ctx, commands);

  const total = live.some((device) => device.id === me.id) ? live.length : live.length + 1;
  return reply(200, { p: PROTOCOL, entries: state, devices: total, now: ctx.now }, touch ? sessionCookies(ctx, tokenOf(me), me.group) : []);
}

async function unlink(ctx: Ctx) {
  const me = await identify(ctx);
  if (me) {
    const commands: Command[] = [["DEL", dvKey(ctx, me.id)]];
    if (me.group) commands.push(["HDEL", gdKey(ctx, me.group), me.id]);
    await exec(ctx, commands);
    if (me.group) await dropIfEmpty(ctx, me.group);
  }
  // Also when the cookie is stale: the point is that this browser stops syncing.
  return reply(200, { ok: true }, clearCookies(ctx));
}

async function forget(ctx: Ctx) {
  const me = await identify(ctx);
  if (!me?.group) return unlinked(ctx);
  const [flat] = await exec(ctx, [["HGETALL", gdKey(ctx, me.group)]]);
  const ids = new Set([me.id, ...toPairs(flat).map(([id]) => id)]);
  await exec(ctx, [["DEL", ...[...ids].map((id) => dvKey(ctx, id)), gdKey(ctx, me.group), ...GUIDES.map((guide) => pKey(ctx, me.group, guide))]]);
  return reply(200, { ok: true }, clearCookies(ctx));
}

const routes: Record<string, (ctx: Ctx) => Promise<Response>> = {
  "/api/pair/start": pairStart,
  "/api/pair/claim": pairClaim,
  "/api/status": status,
  "/api/sync": sync,
  "/api/unlink": unlink,
  "/api/forget": forget,
};

/** Answer one request. `deps` is null when the store isn't set up, which is a 503 for every real call. */
export async function handle(request: Request, deps: Deps | null): Promise<Response> {
  try {
    const route = routes[new URL(request.url).pathname];
    if (!route) return reply(404, { error: "not_found" });
    if (request.method !== "POST") return reply(405, { error: "method" }, [], { Allow: "POST" });
    const where = whereFrom(request);
    if (!where) return reply(403, { error: "origin" });
    if (!deps) return reply(503, { error: "unconfigured" });
    if (!/^application\/json\b/i.test(request.headers.get("content-type") ?? "")) return reply(400, { error: "body" });
    if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY) return reply(413, { error: "size" });
    const text = await request.text();
    if (text.length > MAX_BODY) return reply(413, { error: "size" });
    let body: unknown;
    try {
      body = JSON.parse(text);
    } catch {
      return reply(400, { error: "body" });
    }
    if (body === null || typeof body !== "object" || Array.isArray(body)) return reply(400, { error: "body" });
    if ((body as { p?: unknown }).p !== PROTOCOL) return reply(400, { error: "protocol" });
    return await route({ deps, where, request, body: body as Record<string, unknown>, cookies: parseCookies(request.headers.get("cookie")), now: deps.now() });
  } catch (error) {
    if (error instanceof StoreError) return reply(503, { error: "store" });
    console.error(error);
    return reply(500, { error: "server" });
  }
}
