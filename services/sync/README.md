# Hundo sync API

The server behind sync codes: it lets a reader's devices share one guide's progress without an account. A device shows a six-digit code, another types it, and from then on the two exchange progress through this API. Each guide keeps its progress in the browser first, and the API only lets devices catch up with each other. It runs as its own Vercel project, `hundo-api`, at `api.hundo.quest` ([deploying.md](../../docs/deploying.md#the-sync-api)). The guides reach it through a rewrite of their own `/api` (their `vercel.json`), so a call is same-origin and the cookies are set by the guide's own host.

## Calls

Every endpoint is a POST with a JSON body that carries `"p": 1`, the protocol, which only ever grows. Replies are JSON, never cached.

| Path | Body | Answer |
| --- | --- | --- |
| `/api/pair/start` | `label` | a six-digit `code`, good for ten minutes and one use. A device with no link waits as pending for fifteen minutes. |
| `/api/pair/claim` | `code`, `label` | `linked: true`, with `already` or `moved` when they apply. A wrong, expired or used code is `400 code`, and a group that already has twelve devices is `409 devices`. |
| `/api/status` | | `linked` and the devices in the group (label, last seen, which is this one). A device that was showing a code finds out here that it was used. |
| `/api/sync` | `guide`, `entries`, `touch` | the winning entries for the guide, the device count and the server's clock. |
| `/api/unlink` | | takes this device out and clears its cookies. The last device out deletes the group's data. |
| `/api/forget` | | deletes the group's data and every device in it. |

Errors: `400` (bad body, code, guide, entries, or a stamp more than a day ahead, which also returns `now`), `401 unlinked` (and the cookies are cleared), `403 origin`, `409 devices`, `413`, `429 limit`, `503` (the store is down or not set up).

### Who may call

The caller's `Origin` must be the page's own host: `x-forwarded-host` behind the rewrite, `Host` when called direct. Hosts on `https://*.hundo.quest` (not `api.`) write to the `prod` namespace. Previews on `*.vercel.app` and `localhost` write to `test`, whose data is kept for a week. Anything else gets a 403. The body must be `application/json`, so a plain form post from another site is refused as well.

### Cookies

- `hundo_sync=<deviceId>.<secret>`: `HttpOnly; Secure; SameSite=Lax; Path=/api`, 400 days. The server keeps only a SHA-256 of the secret. On hundo.quest it has `Domain=hundo.quest`, so one link covers every guide in a browser. On a preview or localhost it is host-only, and `Secure` is dropped only for plain-http localhost.
- `hundo_link=<fingerprint>`: the same but `Path=/` and readable by script. The fingerprint is ten characters of a hash of the group id and opens nothing. A guide reads it to know it is linked, with no request.

A device that is only showing a code gets the first cookie for fifteen minutes and not the second, so a guide's other tabs don't try to sync before there is a group.

## What it keeps

All keys sit under `hs:<namespace>:`.

| Key | Holds | Kept |
| --- | --- | --- |
| `dv:<deviceId>` | hash of the secret, the group, a label such as "Safari · iPhone" | 400 days from the last touch (15 minutes while pending) |
| `gd:<group>` | each device's label and when it last synced | 400 days from the last touch |
| `p:<group>:<guide>` | the guide's progress, as a sorted set with one member per entry, `key<TAB>stamp<TAB>value`, scored by the stamp | 400 days from the last touch |
| `pc:<code>` | the device that showed the code | 10 minutes |
| `rl:…` | counters for the limits: for pairing, keyed by a salted hash of the visitor's IP address, and for sync, by the device | the length of their window, an hour at most |

No email, no name. The server sees IP addresses, as any web server does, and uses them only through those counters. A "touch" is the once-a-day request that pushes the expiry out.

### Merging

`src/ledger.ts` is the model: progress is flattened to keys (`c:<rowId>` ticked or not, `ceiling`, `chapter`, `spoilers`, `x:<path>` for a guide's own extra state), each with a stamp, and the later stamp wins per key. On a tie a fixed order of values decides: a tick over an untick, a higher number over a lower, spoiler protection on. A key's winner is read back from its members. A member never changes, so two devices pushing at once only ever add members and never overwrite each other, and a sync removes the members that have lost, which can't take a later change with it, since a later change is a different member. A guide's data therefore stays about as big as its keys however often they change. Stamps come from a hybrid clock on the device (never behind a change it has seen), and the server refuses any more than a day ahead of its own clock. A sync answers with the state as the server held it plus that device's own push, so a change another device pushes in the same instant arrives with the next sync. `ledger.ts` has no imports, and the guides carry a byte-identical copy at `packages/core/src/sync/ledger.ts` that a test holds equal: change both together.

### Limits

- Pairing: ten codes an hour and ten tries per fifteen minutes from one address (an IPv6 address counts by its /64), and 300 failed tries across everyone per ten minutes.
- Sync: 120 a minute from one device. That holds a runaway client or a stolen cookie to a trickle. It doesn't guard the store (below).
- A request is at most 256 KB and 1,500 entries. A guide's data holds at most 2,000 keys, of which at most 60 are extra-state leaves of at most 256 bytes. A group has at most twelve devices. One not seen for three months drops off the list by itself, and comes back on its next sync.
- A sync costs five store commands to pull, seven to push a new key and eight to change one, so Upstash's free 500,000 commands a month covers somewhere between 60,000 and 100,000 syncs of ordinary use.

### Known limits, and what isn't checked yet

- The API takes the visitor's address from `x-real-ip` and the page's host from `x-forwarded-host`. A forged `x-forwarded-host` that matched the `Origin` was still refused on the first preview, so on a direct call Vercel replaces it with the real host. Through a guide's rewrite to another origin, Vercel's docs say both are forwarded, and nothing here has seen that yet. It gets checked on the first guide preview, and if the headers differ the pairing limits and the origin check need changing. The pairing limits rest on that address, so if every request arrived with one address, or none, all readers would share them. The sync limit is per device and doesn't depend on it.
- Anyone can use up the wrong-try cap and so pause pairing for everyone for ten minutes. Devices already linked go on syncing. The cap is also what bounds guessing a six-digit code: with N codes showing, an attacker who keeps the cap used up hits one with a chance of at most 300 × N in a million every ten minutes.
- Nothing in this service can stop a flood of requests from using up the store's commands: each request, even a refused one, costs it at least one, so the limits protect groups and not the quota. A rate-limit rule in the Vercel project's firewall on `api.hundo.quest` is the guard for that. It isn't set up, and what the team's plan allows hasn't been checked. When the quota runs out, syncing answers 503 and every guide keeps working on its own.
- A guide's extra state keeps every path it has ever used, since a path can't be removed, so over its whole life it may use at most 60 distinct ones.
- A device can remove only itself. One that went quiet drops off by itself after three months, but nothing can remove another that is still being seen.
- Two devices joining a full group in the same instant can take it past twelve.
- If the last device of a group leaves in the same instant that another joins, the group's data on the server can be lost. The devices keep theirs.
- A push that lands just after "delete synced progress" can leave a few keys behind. They expire like the rest.
- Two devices changing one counter, such as Koholint's death count, at the same moment keep the later value and not the sum.

## Run it

```bash
pnpm -C services/sync dev
```

serves it on `http://127.0.0.1:8787` with an in-memory store that is lost on restart (`PORT` changes the port). In the browser pane that is `preview_start` with `sync-api`.

```bash
pnpm -C services/sync test
```

runs the model's tests, the API tests on an in-memory store with a fake clock, and `project.test.ts`, which holds the folder to what Vercel needs: one thin function per route in `api/`, imports only from this folder and Node, and the `vercel.json` and ignore script. With `SYNC_TEST_REDIS_URL` and `SYNC_TEST_REDIS_TOKEN` set to a **test** database, the store contract in `src/store.test.ts` also runs against real Upstash, to prove it answers the commands the same way as the in-memory store.

## Adding a guide

Add its `brand.id` to `GUIDES` in `src/app.ts`. `project.test.ts` fails until every app's id is in the list.
