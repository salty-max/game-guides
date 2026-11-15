# Deploying

Every push, deploy and release needs the user's go, asked of the user in the session that opened the work (a child sends the question there and asks nothing itself), or in the session itself when it has no opener. That includes creating a Vercel project.

## The projects

Each guide is its own Vercel project on the team jellycat, built from this repository. The project is named after the app's package (`hundo-koholint` for `apps/koholint`). The guide lives at `https://<sub>.hundo.quest`, attached to its project as a domain. The subdomain is chosen per guide (`koholint`, `rdr`, `echoes`) and set as `brand.home`. `hundo.quest` is registered through Vercel on the same team, so Vercel's DNS does the rest. The first three guides moved here from `*.vercel.app` addresses with the hand-off below; once their readers had moved, the old addresses were detached and `movedFrom` removed from their brands. Red Dead then moved from `reddead.hundo.quest` to `rdr.hundo.quest`: `reddead.hundo.quest` stays attached to `hundo-rdr` and listed in its `movedFrom` until it's detached on a later go. The root README's apps table lists the projects and their sites.

Settings that live in the Vercel dashboard rather than in the repository:

- **Root Directory:** `apps/<name>`. It covers every branch, so renaming an app's folder means changing it just before that branch is pushed and merging without delay: until the merge, `main` has no such folder and the project's builds of it fail.
- **"Include files outside the Root Directory":** on, the default. The build needs `packages/core` and the root workspace files.
- **Production branch:** `main`.
- **Node.js version:** 26.x. CI runs the same major.

## What `vercel.json` sets

Every app's `vercel.json` is the same, and `deploy.test.ts` fails if one drifts:

- **Install:** `pnpm install --frozen-lockfile`. Run from the app folder, pnpm finds the workspace root and installs everything from the root lockfile. A lockfile that doesn't match a `package.json` fails the deploy, the same way it fails CI.
- **Build:** `pnpm build`, which is `tsc && vite build`, with output in `dist`.
- **Ignore command:** `sh ../../scripts/vercel-ignore.sh`, one script for every app. Vercel skips the build when it exits 0 and builds when it exits 1. **Any other exit code fails the deployment.** The script diffs from the last deployed commit (`VERCEL_GIT_PREVIOUS_SHA`, or the previous commit when that's empty) over the app's own folder, core, `scripts` and the root files the build reads. It answers 1 whenever it can't compare. What it answers:

  | Case | Exit | Result |
  | --- | --- | --- |
  | a commit touching only Echoes, on the Koholint project | 0 | skipped |
  | the same commit on the Echoes project | 1 | built |
  | `VERCEL_GIT_PREVIOUS_SHA` empty | 1 | compared with `HEAD^`, built |
  | the previous deployed commit no longer in history | 1 | built |

  The last case once failed all three production deploys. A bare `git diff` in the ignore command exited 128 on a commit that had been rewritten away, and Vercel treats that as an error, not a build. `deploy.test.ts` holds the script to literal exits 0 and 1, ending in `exit 1`, and to valid shell syntax. The first three rows were tried on real commit ranges with the earlier bare `git diff`, when the monorepo was set up.

  So a change to one guide deploys only that guide, and a change to core, the lockfile or the root `package.json` deploys all three. The root `docs/`, `README.md` and `CLAUDE.md`, the harness, the ESLint config and `.github/` aren't in the list, and a commit touching only those deploys nothing. An app's own `README.md` and `docs/facts-to-verify.md` sit inside its folder, though, so editing them redeploys that guide. If the build starts to read another root file, add it to the list in every app. `deploy.test.ts` checks that core and the root workspace files stay in it.

  Vercel leaves `VERCEL_GIT_PREVIOUS_SHA` empty on a branch's first deployment ([its docs](https://vercel.com/docs/environment-variables/system-environment-variables)). So on a new branch only the last commit decides: when that commit touches only docs, no preview gets built, even if earlier commits on the branch changed a guide. Push a commit that touches the app, or build it with `vercel deploy` (a redeploy runs the same ignore command and is skipped the same way, see Pitfalls).
- **Rewrites:** two, in this order. `/api/:path*` goes to `https://api.hundo.quest/api/:path*` (the sync API, so a call is same-origin and its cookies are the guide's own, and the CSP keeps `connect-src 'self'`). Then one catch-all sends every other path except `/assets/`, `/fonts/` and `/icons/` to `/index.html`, so deep links like `/guide/3` load the app.
- **Headers:**
  - a strict Content-Security-Policy, with `script-src 'self'` and no inline scripts;
  - `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security` and `Cross-Origin-Opener-Policy`;
  - `public, max-age=0, must-revalidate` on `index.html`, `sw.js`, `theme-init.js` and the manifest, so a new version is seen at once;
  - one year `immutable` on hashed `/assets/*` and the Workbox runtime;
  - a week, with stale-while-revalidate, on fonts and icons.

## Pitfalls

Each of these broke something or nearly did. `packages/core/src/deploy.test.ts` checks the first three in every app, and each guide's `guide.test.ts` checks the fourth.

- **Never turn on `cleanUrls`.** It made deep links like `/guide/3` return 404, because the catch-all rewrite stopped applying (fixed in `38e8d39`).
- **Keep `/api`, `/assets`, `/fonts` and `/icons` out of the catch-all.** A request for a hashed asset from an older deploy must be a real 404. Rewritten, it gets `index.html` back in place of JavaScript. That breaks the page, and the one-year cache rule on `/assets` can keep the HTML cached. A call to `/api` that missed would come back as the app's page, which a client reads as an answer. The `/api` rewrite to the sync API sits before the catch-all, and `deploy.test.ts` checks both and their order.
- **The preview toolbar's script is blocked on previews.** Each preview's console shows one CSP error, for the Vercel toolbar's script from `vercel.live` (`script-src 'self'`). Production has no toolbar. It is left as it is, since allowing it would loosen the CSP every guide ships, production's too (not tried: a header rule that matches preview hosts only).
- **No inline scripts.** The CSP forbids them, so `theme-init.js`, which sets the theme before first paint, stays an external file. Don't fold it into `index.html`, and don't add `'unsafe-inline'` to make something work.
- **Storage keys never change, and an address changes only with a hand-off.** Progress lives in the reader's browser, in localStorage, under `<storagePrefix>.v1`, and localStorage belongs to one origin, so a new prefix or a bare redirect starts every reader from nothing. Each guide's `guide.test.ts` pins its full keys. To move a guide:
  - set `brand.home` to the new address and list the old hostnames in `brand.movedFrom`;
  - attach the new address to the project and check it serves before the merge, or the redirect lands on nothing;
  - keep the old address attached and serving.

  On every visit there, `packages/core/src/boot.ts` redirects to the same page on `home`, with the saved progress and theme in the URL fragment. The new address imports them only when the visit came from an old address and it has no checks yet. `boot.test.ts` covers it.
- **Connect a repository to a project only once its Root Directory exists on `main`.** Until then every branch without that folder fails its deployment at clone with "The specified Root Directory … does not exist", and each of those pull requests shows a failing check. On `hundo-api`, neither an ignore command (none gets to run) nor `gitProviderOptions.createDeployments` (it only concerns GitHub's deployment notifications) stopped it. Disconnecting the repository did (`vercel git disconnect`). So create such a project without the repository link, or disconnect it, and connect it (`vercel git connect`) once the folder is on `main`.
- **The ignore command can cancel a deployment you want.** It answers 0 whenever the watched diff is empty. On `hundo-api` an API deployment, a redeploy, and an API deployment with the ignore command overridden in its `projectSettings` were all canceled with "The Ignored Build Step command returned exit code 0", for a commit the branch had already deployed. The script must have been handed that earlier deployment's commit as `VERCEL_GIT_PREVIOUS_SHA` (an inference: against `HEAD^` it would have found the new folder changed), and the `ignoreCommand` in `vercel.json` won over the override. `vercel deploy` from a linked repository root built it.
- **A project whose git deployments were all skipped never gets `VERCEL_GIT_PREVIOUS_SHA`, so only a push's last commit decides.** `hundo-api`'s production deployment was made by hand (`vercel deploy --prod`, which names no commit). After the sync merge, every git deployment on `main` of that project was canceled by its ignore step with exit 0: three docs-only commits, and the component base's merge, whose `pnpm-lock.yaml` change sat earlier in the push than its docs-only last commit. Run with the variable empty, the script answers 0 for each of those tips (and 1 for #14's whole range, given a previous SHA), so what Vercel passed was probably empty (inferred: a deployment that never built leaves no "last successful" commit). The service's script now builds whenever the variable is empty, and `project.test.ts` runs it against real history. The guides' script still compares with `HEAD^` there. It's right once a git build has succeeded, which sets the variable (inferred, and the first push to a new branch still shows only its last commit, see above).
- **A deploy doesn't reach a reader's open or installed guide until they accept the update prompt.** The service worker registers with `registerType: "prompt"`, so a browser tab or installed app opened before a deploy keeps its precached build, even across reloads, until "Reload" is pressed on "A new version of the guide is ready". On 15 Nov 2026 that hid the new "Sync devices" button from Brave and the iPhone app until they accepted it (the live bundle had it). After a deploy, look at production in a fresh profile, or accept the prompt first.
- **Check headers on a real preview.** `vite preview` doesn't send them.

## Preview first

Nothing reaches production without being looked at on a preview deployment first. The `guide-deploy` skill (`.claude/skills/guide-deploy`) has the commands, including a header check that gets through deployment protection.

1. Push a branch. Each project whose ignore command sees a change builds a preview deployment of it, and the Vercel dashboard and the GitHub pull request link to each one.
2. On each preview that built:
   - the change itself, on desktop and phone, in light and dark ([testing.md](testing.md#in-a-browser));
   - a deep link such as `/guide/3` loads the app;
   - a made-up hashed asset such as `/assets/nope.js` returns 404;
   - the headers: `curl -sI <preview-url>/` shows the Content-Security-Policy and the security headers;
   - `/theme-init.js` loads, and the page doesn't flash the wrong theme on reload;
   - in a regular browser, the service worker registers, the guide works offline after one visit, and a newer deploy shows the update prompt.
3. Once every preview is right, merge to `main` with the user's go. Each project that sees a change builds production from `main`.

Previews sit behind Vercel's deployment protection, so a plain `curl` doesn't get through. `vercel curl`, run from a folder linked to the project, does. Anywhere else it gets a 302. The `guide-deploy` skill's `headers.sh` does this. A signed-in browser's network panel works too.

## The sync API

`services/sync` is its own Vercel project, `hundo-api`, on the same team, at `https://api.hundo.quest`. It is the server for sync codes ([its README](../services/sync/README.md)): one Web-standard function per route in `api/`, with Upstash Redis as the store. It is not a guide, so the rules above about every app's `vercel.json` don't reach it. It has its own `vercel.json` and its own ignore script, `services/sync/scripts/vercel-ignore.sh`, which watches the service and the root files that install its packages, but not core. `project.test.ts` holds both to what the deploy needs.

Settings in the Vercel dashboard:

- **Root Directory:** `services/sync`, with "Include files outside the Root Directory" left on, so the install runs from the workspace's lockfile.
- **Framework:** Other (`vercel.json` says `"framework": null`), **Node.js** 26.x, **production branch** `main`.
- **Domain:** `api.hundo.quest`.
- **Environment variables**, for Production and Preview: `SYNC_IP_SALT`, a long random secret (`openssl rand -hex 32`) that salts the IP hashes behind the rate limits, and the Upstash Redis REST URL and token. The code reads `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`, or Vercel KV's `KV_REST_API_URL` and `KV_REST_API_TOKEN`. With either missing, every real call answers `503 unconfigured`.
- **The store:** an Upstash Redis database on the free plan, in Frankfurt. `vercel integration add upstash/upstash-kv --name hundo-sync -m primaryRegion=fra1` creates it (without `-m` it came up in `iad1`, and the Upstash terms have to be accepted once in a browser first). It sets `KV_REST_API_URL`, `KV_REST_API_TOKEN` and three more, for production and preview. Production and previews share it, apart by key prefix: production keys start `hs:prod:`, everything from a preview or localhost `hs:test:` and goes after a week.
- **The firewall:** two rate-limit rules on the project, set up on 15 Nov 2026 from the CLI (`vercel firewall rules add …`, then `publish`): `sync api: pairing`, for paths starting `/api/pair/`, 30 requests per 600 s per address; and `sync api: calls`, for paths starting `/api/`, 120 per 60 s per address. Both count by IP with a fixed window, which is all the team's Pro plan offers besides JA4 (the docs read that day: 40 rules a project, windows of 10 s to 10 min, the first 1,000,000 allowed requests a month included, then usage-based by region, whose unit price wasn't found). A request the rule turns away never reaches the function, so costs no store command. They were published in log mode and switched to the 429 (`rate_limit`) action the same day, after the walk's traffic stayed far under them (its busiest minute was about 22 calls to `/api/` against 120). `vercel firewall rules edit <name> --rate-limit-action rate_limit` alone answered "No changes detected"; giving the whole setting with it (`--action rate_limit --rate-limit-keys ip --rate-limit-algo fixed_window --rate-limit-window <s> --rate-limit-requests <n> --rate-limit-action rate_limit`) staged the change, and the live configuration (`vercel api /v1/security/firewall/config/active?projectId=…`, the rule's `action.mitigate.rateLimit.action`) is what shows the mode, since `rules list` prints the same "Rate Limit (30/600s)" for either. The firewall counted, for `/api/*` calls that came through a guide's rewrite, the address of the machine that made them (`vercel firewall traffic list` and `traffic inspect ip <address>`; the other addresses in the list asked only for `/` and `/favicon.png`), so the limit counts readers apart, not edge nodes. A client over a limit gets a 429, which the guide shows as sync "paused for now" and retries later, with progress kept on the device.
- **Function Region:** Frankfurt (`fra1`), to sit next to the store, in the project's settings. The default is `iad1`. `regions` in `vercel.json` did not move the functions off `iad1` on the first preview, so the file doesn't carry one.
- **The repository link:** connect it only once `services/sync` is on `main` (see Pitfalls).

Creating the project, attaching the domain and creating the store each need the user's go, like any new project. The service can't stop a flood of requests from using the store's commands (each request costs at least one), so a rate-limit rule in the project's firewall is the guard it lacks ([its README](../services/sync/README.md#known-limits-and-what-isnt-checked-yet)).

The service shipped first and the guides' side after it: a guide's preview syncs through its `/api` rewrite to `api.hundo.quest`, which has to be live. The first guide preview showed that the API gets its own host behind the rewrite and no `x-forwarded-host` that names the guide's (every call was a `403 origin`, whatever `Origin` said), which is why the API takes who is calling from `Origin` alone ([its README](../services/sync/README.md#who-may-call)). What a preview of a guide has to show: link two browsers by code on the preview (its calls land in the `test` namespace), with `Cookie`, `Set-Cookie` and `Origin` passing through. They did on Koholint's first preview: `hundo_sync` came back host-only with `Path=/api; Secure; HttpOnly; SameSite=Lax`, `hundo_link` with `Path=/`, and two jars paired and synced. The visitor's address reached the API in `x-real-ip` and `x-forwarded-for`, as the runtime logs showed (`vercel logs -d <deployment> --json`; a temporary `console.log` of those headers, test namespace only, was added to read it and removed again). A preview of the service sits behind deployment protection, so check it with `vercel curl <path> --deployment <url> --scope jellycat -- <curl options>` from a folder linked to the project, calling it with its own address as the `Origin` (that lands in the `test` namespace and the real store). What it should do: a pairing (`pair/start`, then `pair/claim` from a second cookie jar, then `sync` from both) answers as [the README](../services/sync/README.md) says, `GET /api/sync` is `405`, an unknown path is the platform's `404` and not HTML, a POST without cookies is `401 unlinked` with its cookies cleared, and a foreign `Origin` is `403`. The build log has no TypeScript errors.

## A new project

For a new guide, after its folder passes `pnpm check` ([adding-a-guide.md](adding-a-guide.md)), and with the user's go:

1. In Vercel, on the team jellycat: add a project and import `salty-max/hundo`. If the app's folder isn't on `main` yet, which is the case for a new guide until its pull request merges, disconnect the repository again at once (`vercel git disconnect`, see Pitfalls) and connect it once the folder is on `main`.
2. Name it after the app's package, `hundo-<sub>`.
3. Set the Root Directory to `apps/<name>`. Leave "Include files outside the Root Directory" on. Vercel picks up the framework, install, build and output from the app's `vercel.json`.
4. Set the Node.js version to 26.x and the production branch to `main`.
5. Add the guide's `<sub>.hundo.quest` to the project's domains. Its `brand.home` is already set in `brand.ts`.
6. Deploy a preview first, and check it as above, before the first production deploy. While the repository isn't connected, link the repository root to the project (`vercel link`) and run `vercel deploy`, which is how `hundo-api`'s first preview was built.
7. Add the guide to the root README's apps table.
