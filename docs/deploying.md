# Deploying

Every push, deploy and release needs the user's go, asked in the session that wants it. That includes creating a Vercel project.

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

  Vercel leaves `VERCEL_GIT_PREVIOUS_SHA` empty on a branch's first deployment ([its docs](https://vercel.com/docs/environment-variables/system-environment-variables)). So on a new branch only the last commit decides: when that commit touches only docs, no preview gets built, even if earlier commits on the branch changed a guide. Push a commit that touches the app, or redeploy from the dashboard.
- **Rewrites:** one catch-all sends every path except `/assets/`, `/fonts/` and `/icons/` to `/index.html`, so deep links like `/guide/3` load the app.
- **Headers:**
  - a strict Content-Security-Policy, with `script-src 'self'` and no inline scripts;
  - `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security` and `Cross-Origin-Opener-Policy`;
  - `public, max-age=0, must-revalidate` on `index.html`, `sw.js`, `theme-init.js` and the manifest, so a new version is seen at once;
  - one year `immutable` on hashed `/assets/*` and the Workbox runtime;
  - a week, with stale-while-revalidate, on fonts and icons.

## Pitfalls

Each of these broke something or nearly did. `packages/core/src/deploy.test.ts` checks the first three in every app, and each guide's `guide.test.ts` checks the fourth.

- **Never turn on `cleanUrls`.** It made deep links like `/guide/3` return 404, because the catch-all rewrite stopped applying (fixed in `38e8d39`).
- **Keep `/assets`, `/fonts` and `/icons` out of the catch-all.** A request for a hashed asset from an older deploy must be a real 404. Rewritten, it gets `index.html` back in place of JavaScript. That breaks the page, and the one-year cache rule on `/assets` can keep the HTML cached.
- **No inline scripts.** The CSP forbids them, so `theme-init.js`, which sets the theme before first paint, stays an external file. Don't fold it into `index.html`, and don't add `'unsafe-inline'` to make something work.
- **Storage keys never change, and an address changes only with a hand-off.** Progress lives in the reader's browser, in localStorage, under `<storagePrefix>.v1`, and localStorage belongs to one origin, so a new prefix or a bare redirect starts every reader from nothing. Each guide's `guide.test.ts` pins its full keys. To move a guide:
  - set `brand.home` to the new address and list the old hostnames in `brand.movedFrom`;
  - attach the new address to the project and check it serves before the merge, or the redirect lands on nothing;
  - keep the old address attached and serving.

  On every visit there, `packages/core/src/boot.ts` redirects to the same page on `home`, with the saved progress and theme in the URL fragment. The new address imports them only when the visit came from an old address and it has no checks yet. `boot.test.ts` covers it.
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

## A new project

For a new guide, after its folder passes `pnpm check` ([adding-a-guide.md](adding-a-guide.md)), and with the user's go:

1. In Vercel, on the team jellycat: add a project and import `salty-max/hundo`.
2. Name it after the app's package, `hundo-<sub>`.
3. Set the Root Directory to `apps/<name>`. Leave "Include files outside the Root Directory" on. Vercel picks up the framework, install, build and output from the app's `vercel.json`.
4. Set the Node.js version to 26.x and the production branch to `main`.
5. Add the guide's `<sub>.hundo.quest` to the project's domains. Its `brand.home` is already set in `brand.ts`.
6. Deploy a preview first, and check it as above, before the first production deploy.
7. Add the guide to the root README's apps table.
