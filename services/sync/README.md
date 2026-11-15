# Hundo sync API

The server behind sync codes: it lets a reader's devices share one guide's progress without an account. A device shows a six-digit code, another types it, and from then on the two exchange progress through this API. Each guide keeps its progress in the browser first, and the API only lets devices catch up with each other. It runs as its own Vercel project, `hundo-api`, at `api.hundo.quest` ([deploying.md](../../docs/deploying.md#the-sync-api)). The guides reach it through a rewrite of their own `/api` (their `vercel.json`), so a call is same-origin and the cookies are set by the guide's own host.

## Calls

Every endpoint is a POST with a JSON body that carries `"p": 1`, the protocol, which only ever grows. Replies are JSON, never cached.

| Path | Body | Answer |
| --- | --- | --- |
| `/api/pair/start` | `label` | a six-digit `code`, good for ten minutes and one use. A device with no link waits as pending for fifteen minutes. |
| `/api/pair/claim` | `code`, `label` | `linked: true`, with `already` or `moved` when they apply. A wrong, expired or used code is `400 code`, and a group that already has twelve devices is `409 devices`. |
| `/api/status` | | `linked` and the devices in the group (label, last seen, which is this one). A device that was showing a code finds out here that it was used. |
| `/api/sync` | `guide`, `entries`, `touch`, and `rev` (optional) | the winning entries for the guide, the device count, the server's clock and `rev`, the revision of the guide's data. A call with `rev`, no entries and no `touch` that finds the revision unchanged is answered `{"unchanged": true, "rev", "now"}` and nothing else. |
| `/api/remove` | `id` | `ok`. Takes another device of the group out (the id is in `/api/status`'s list); it can't name itself (that is unlinking) or a device of another group (`400`). Its next call is `401 unlinked`. |
| `/api/unlink` | | takes this device out and clears its cookies. The last device out deletes the group's data. |
| `/api/forget` | | deletes the group's data and every device in it. |

Errors: `400` (bad body, code, guide, entries, or a stamp more than a day ahead, which also returns `now`), `401 unlinked` (and the cookies are cleared), `403 origin`, `409 devices`, `413`, `429 limit`, `503` (the store is down or not set up).

### Who may call

Who is calling comes from the `Origin` alone: a guide on `https://*.hundo.quest` (not `api.`) writes to the `prod` namespace, and a host named like one of the team's previews (`hundo-<project>-<hash or git-branch>-jellycat.vercel.app`; the name is all that is checked) or `localhost` writes to `test`, whose data is kept for a week. Anything else gets a 403, and so does a call with no `Origin`. The host isn't checked against it: behind a guide's rewrite this API gets its own host in `Host`, and no `x-forwarded-host` that names the guide's (seen on the first guide preview). A browser sets `Origin` and no page script can change it. A script on another site is refused for its `Origin`, and couldn't read an answer anyway: the API never sends `Access-Control-Allow-Origin`, and `OPTIONS` is a 405. A form or `text/plain` post, which needs no preflight, is refused for its content type: the body must be `application/json`, checked before anything touches the store.

### Cookies

- `hundo_sync=<deviceId>.<secret>`: `HttpOnly; Secure; SameSite=Lax; Path=/api`, 400 days. The server keeps only a SHA-256 of the secret. On hundo.quest it has `Domain=hundo.quest`, so one link covers every guide in a browser. On a preview or localhost it is host-only, and `Secure` is dropped only for plain-http localhost.
- `hundo_link=<fingerprint>`: the same but `Path=/` and readable by script. The fingerprint is ten characters of a hash of the group id and opens nothing. A guide reads it to know it is linked, with no request.

A device that is only showing a code gets the first cookie for fifteen minutes and not the second, so a guide's other tabs don't try to sync before there is a group.

## What it keeps

All keys sit under `hs:<namespace>:`.

| Key | Holds | Kept |
| --- | --- | --- |
| `dv:<deviceId>` | hash of the secret, the group, a label such as "Safari · iPhone · Koholint app" (the guide's short name, for an installed app) | 400 days from the last touch (15 minutes while pending) |
| `gd:<group>` | each device's label and when it last synced | 400 days from the last touch |
| `p:<group>:<guide>` | the guide's progress, as a sorted set with one member per entry, `key<TAB>stamp<TAB>value`, scored by the stamp | 400 days from the last touch |
| `pc:<code>` | the device that showed the code | 10 minutes |
| `rv:<group>:<guide>` | the revision of that guide's data in the group: a counter that goes up, last of all, whenever a sync writes it, and that a poll can read in one command to learn that nothing changed | 400 days from the last touch |
| `rl:…` | counters for the limits: for pairing, keyed by a salted hash of the visitor's IP address, and for sync, by the device | the length of their window, an hour at most |

No email, no name. The server sees IP addresses, as any web server does, and uses them only through those counters. A "touch" is the once-a-day request that pushes the expiry out.

### Revisions

Each guide's data in a group has a revision, a counter that goes up with every write, last of all (nobody who sees the new number can find the data not yet written). A device sends the revision it last saw, and when it is still current the answer is the one line above. The revision in an answer is the one read before the data, so a change another device makes in the middle of a call is found by the next poll, and is the new number only when this call's own write is the only one that landed. A client that sends no `rev` (an older build) is answered in full as before, and one that gets no `rev` back (an older server) never asks the short question. The protocol stays 1: the field is new and optional both ways.

### Merging

`src/ledger.ts` is the model: progress is flattened to keys (`c:<rowId>` ticked or not, `ceiling`, `chapter`, `spoilers`, `x:<path>` for a guide's own extra state), each with a stamp, and the later stamp wins per key. On a tie a fixed order of values decides: a tick over an untick, a higher number over a lower, spoiler protection on. A key's winner is read back from its members. A member never changes, so two devices pushing at once only ever add members and never overwrite each other, and a sync removes the members that have lost, which can't take a later change with it, since a later change is a different member. A guide's data therefore stays about as big as its keys however often they change. Stamps come from a hybrid clock on the device (never behind a change it has seen), and the server refuses any more than a day ahead of its own clock. A sync answers with the state as the server held it plus that device's own push, so a change another device pushes in the same instant arrives with the next sync. `ledger.ts` has no imports, and the guides carry a byte-identical copy at `packages/core/src/sync/ledger.ts` that a test holds equal: change both together.

### Limits

- Pairing: ten codes an hour and ten tries per fifteen minutes from one address (an IPv6 address counts by its /64), and 300 failed tries across everyone per ten minutes.
- Sync: 120 a minute from one device. That holds a runaway client or a stolen cookie to a trickle. It doesn't guard the store (below).
- A request is at most 256 KB and 1,500 entries. A guide's data holds at most 2,000 keys, of which at most 60 are extra-state leaves of at most 256 bytes. A group has at most twelve devices. One not seen for 60 days is removed by itself the next time its group is read, a sync or a look at the list or a join, and has to be linked again: a lost phone that wakes up is unlinked, not let back in. One that calls before anyone has looked is heard first and stays.
- A sync costs six store commands to pull (the device's record, the sync counter and its expiry, the revision, the data and the device list), ten to push a new key and eleven to change one, and two more on any that comes more than a minute after the device was last marked seen. A poll that asks whether anything changed (`rev` given, nothing to send, no touch) costs two: the device's record and the revision. It isn't counted against the per-device limit: that counter is checked only after the data is read, so it never saved the store a command (a call it refused cost six), and the firewall's rate limit is what holds a flood (at its 120 calls a minute for one address, valid quiet calls cost 240 commands a minute, against 600 for the pulls they replace). The client turns a poll into a full sync every ten minutes, which refreshes the device's last-seen and the device count, and when its daily touch is due. A guide left open polls every 20 seconds to 2 minutes ([core.md](../../docs/core.md#syncing-devices)): about 100 commands an hour untouched, so Upstash's free 500,000 commands a month goes to something like a pair of devices in steady use, or many times that many left open and idle.

### Known limits, and what isn't checked yet

- The API takes the visitor's address from `x-real-ip` (or `x-forwarded-for`). The pairing limits rest on it, so if every request arrived with one address, or none, all readers would share them. Behind a guide's rewrite, `x-real-ip`, `x-forwarded-for` and `x-vercel-forwarded-for` held the same address, not a Vercel one (read from the runtime logs on 2026-11-15, on a call from a browser on a guide preview), so the limits count readers apart. The sync limit is per device and doesn't depend on it.
- Anyone can use up the wrong-try cap and so pause pairing for everyone for ten minutes. Devices already linked go on syncing. The cap is also what bounds guessing a six-digit code: with N codes showing, an attacker who keeps the cap used up hits one with a chance of at most 300 × N in a million every ten minutes.
- Nothing in this service can stop a flood of requests from using up the store's commands: each request, even a refused one, costs it at least one, so the limits protect groups and not the quota. The guard for that is a pair of rate-limit rules in the Vercel project's firewall ([deploying.md](../../docs/deploying.md#the-sync-api) has them): a request they turn away never reaches the function, so it costs no store command. When the quota runs out, syncing answers 503 and every guide keeps working on its own.
- A guide's extra state keeps every path it has ever used, since a path can't be removed, so over its whole life it may use at most 60 distinct ones.
- Any device of a group can remove any other (`/api/remove`), as it could unlink itself or delete the whole group: the removed one is unlinked the next time it connects, and its own progress stays on it. So a stolen cookie can unlink every legitimate device and stay in, with the group's data: whoever presses Remove first wins, and the owners can evict a thief the same way. The call has no limit of its own beyond twelve devices a group and the firewall's.
- Removing a device is checked against the device's own record, but between that check and the delete there is one store round trip, in which a device that moves to another group at that instant would be unlinked there. A device removed in the middle of its own sync writes itself back into the list, with no record: its next call is unlinked, and a Remove on that row tidies it.
- A group's data can be deleted (the last device leaves) and made again, and a guide's revision then starts over at 0. A device that held an old revision for that group and happens to hold exactly the new one would be told "unchanged" until its next full sync, at most ten minutes. Each device's revision is only used within one group's ledger, and linking again starts a ledger afresh, so it takes a stale device to hit it.
- A device's last-seen is refreshed by full syncs only, so the list can show a device that is polling as last seen up to about twelve minutes ago.
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
