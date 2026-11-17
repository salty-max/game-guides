---
name: guide-deploy
description: Ship a hundo change through Vercel. Get preview deployments of the affected guides, wait for them, check their headers, deep links, 404s and service worker, then go to production only on the user's go and check the live hundo.quest sites and the update prompt. Use whenever a branch or a merge to main would deploy, when a preview didn't build, or when a guide needs its first Vercel project.
---

# Deploying a guide

[docs/deploying.md](../../../docs/deploying.md) explains the projects, the addresses, `vercel.json`, the ignore command and the pitfalls. This is the procedure. Every push, merge to `main`, production deploy and new project needs the user's go, with exactly what will happen: asked of the user in the session that opened this work (a child sends the question there and asks nothing itself), or in this session when it has no opener. A child never pushes, merges or deploys: its opener does, on the user's go, so for a child the steps below that push, merge or deploy are what it reports it is ready for.

## 1. Which guides deploy

Work out which projects will build before asking for the push. The ignore step, `scripts/vercel-ignore.sh`, builds a project when its app, `packages/core`, `scripts/` or a root workspace file changed. On a branch's first push, only the last commit counts. It also builds whenever it can't compare, such as after history was rewritten. Never make it exit with anything but 0 or 1: Vercel fails the deployment on any other code, and `deploy.test.ts` checks this.

## 2. Previews

- **Push the branch**, with the user's go. A new branch with real commits builds a preview on every project whose ignore command sees a change. PR [salty-max/hundo#1](https://github.com/salty-max/hundo/pull/1) built all three this way on 2026-11-14. The pull request's checks link to each deployment.
- **No preview built?** That happens when the branch's last commit touches none of the watched paths. The monorepo session also saw no build for a branch pushed at a commit that already existed (2026-11-14). Create the deployment through the API instead, unless the ignore step is what skipped it: an API deployment runs the same script, so with an empty watched diff it is canceled too. In that case use `vercel deploy` from a linked repository root, on a project that has launched (never before, section 5 says why), and read its `target` back before checking it. The body goes in a file:

  ```json
  { "name": "<project>", "project": "<project>", "gitSource": { "type": "github", "repoId": 1458075216, "ref": "<branch>", "sha": "<full sha>" } }
  ```

  ```bash
  vercel api /v13/deployments --scope jellycat -X POST --input <body.json> --raw | jq -r '.url, .id, .readyState'
  ```

  `1458075216` is `salty-max/hundo`'s GitHub id (`gh api repos/salty-max/hundo --jq .id`), unchanged by the rename from game-guides. Leave out `target` so the deployment is a preview. **Never print the whole response**, or a project's: it holds a protection-bypass secret. Always pick fields with `jq`. Right after the POST, the state is queued or initializing. `vercel inspect --wait` shows how it ends. If it ends canceled, check the build log. "The Ignored Build Step command returned exit code 0" means the ignore step skipped it, which it does whenever the watched diff is empty. On `hundo-api` (2026-11-15) an API deployment, a redeploy and an API deployment with the ignore command overridden in `projectSettings` were all canceled this way for a commit the branch had already deployed (the script must have been handed that earlier deployment's commit as `VERCEL_GIT_PREVIOUS_SHA`, an inference), and `vercel.json`'s `ignoreCommand` won over the override. `vercel deploy` from a linked repository root built it.
- **Find and wait.** `vercel ls <project> --scope jellycat` lists the deployments. Match yours by branch and commit, because other sessions deploy too. Then wait on each one:

  ```bash
  vercel inspect <url> --scope jellycat --wait --timeout 5m
  ```

  If one fails, `vercel inspect <url> --scope jellycat --logs` shows why.

## 3. Check each preview

1. **Headers and routes.** Previews sit behind deployment protection. `vercel curl` gets through only from a folder linked to the project, so link a scratch folder once:

   ```bash
   mkdir -p <scratchpad>/link-<project> && cd <scratchpad>/link-<project> && vercel link --project <project> --scope jellycat --yes
   ```

   Then run the helper from that folder, in the same command: a `cd` lasts one command in this repository's sessions (`CLAUDE_BASH_MAINTAIN_PROJECT_WORKING_DIR` in `.claude/settings.json`). It refuses to run anywhere else.

   ```bash
   cd <scratchpad>/link-<project> && bash <repo>/.claude/skills/guide-deploy/scripts/headers.sh <deployment-url>
   ```

   It holds each row to what it should be, says `WRONG` beside any that isn't and exits 1, so read every row, not only the verdict. The app's `vercel.json` is the source of truth for every value:
   - `/` and the deep link `/guide/3` return 200 HTML: the app, not a 404;
   - `/assets/nope.js`, `/workbox-nope.js`, `/fonts/nope.woff2` and `/icons/nope.svg` return a 404 (not the app's HTML) with no long cache: no `immutable`, no `max-age` above 0. The long cache rules apply only to a file that exists;
   - `/api/sync` (405) and `/api/nope` (404) are the sync API's own answers, not the app's page;
   - `/favicon.ico` is the icon file (an image, with no long cache), not the app's page;
   - every route has the CSP;
   - `index.html`, `sw.js`, `theme-init.js` and the manifest carry the revalidate rule, and `sw.js` has `Service-Worker-Allowed: /` (`swa=/`);
   - hashed `/assets` and the Workbox chunk (`/workbox-<hash>.js`) carry the one-year immutable rule, and `/fonts` and `/icons` the week-long one;
   - the first line shows the page's `data-corners`, its `theme-color` (filled in, not `%GUIDE_THEME_COLOR%`) and the external `theme-init.js`.
2. **The page itself.** Open the preview URL in the browser pane, signed in to Vercel if it asks. Look at the change on desktop and phone, in light and dark, as in the `guide-check` skill.
3. **The service worker,** in a regular browser. It registers, the guide loads offline after one visit, and nothing in the console complains about the CSP.

## 4. Production

Only on the user's go, with exactly what will deploy.

- The normal path is merging the pull request into `main`. Each project whose ignore command sees a change builds production from `main`.
- Wait with `vercel ls <project> --scope jellycat` and `vercel inspect <url> --scope jellycat --wait`. Run `headers.sh` against the production deployment URL too.
- **The new build reaching a returning reader, first.** The service worker serves the old shell until a new build takes over ([docs/core.md](../../../docs/core.md#syncing-devices), `sw-updates.ts`). On a browser that had the old version open, with no other tab of that guide open, reload and touch nothing: within a few seconds the page reloads once by itself on the new build, with no toast. Then press something and wait for, or force, a mid-session check by switching away from the tab and back after an hour; a build found then shows "A new version of the guide is ready. Your progress is already saved." with a Reload button. Either way, check the change is there and the progress survived. Until the new build takes over, nothing new runs for that reader, the handover included.
- **Only when a guide moves address** ([docs/deploying.md](../../../docs/deploying.md#pitfalls)). Red Dead has `brand.movedFrom` since its move from `reddead.hundo.quest` to `rdr.hundo.quest`. The other guides' old `.vercel.app` addresses were dropped on 2026-11-14. For a move, test it before and after the merge. Once the new build is live, it redirects every visit to the old address before rendering, so nobody can tick anything there.
  1. Before merging, tick a row on the old address while the old build still serves it, in a browser with nothing saved on the new address.
  2. After production is up, reopen the old address and let the new build take over (touch nothing until it reloads by itself, or accept the update prompt if it shows).
  3. You should land on the same page on `brand.home`, with the tick there.

  A new address that already has checks keeps its own and ignores the handover, by design.
- **The live address**, `brand.home` (`https://<sub>.hundo.quest`): check it as you checked the preview.

## 5. A new project

Follow [docs/deploying.md](../../../docs/deploying.md#a-new-project), with the user's go for creating it, then do steps 2 and 3 for its first deployment. Its launch, the merge and then the domain, is a separate go.

- **No custom domain until launch.** Create the project without `<sub>.hundo.quest`. On `hundo-lordran`, a project with no deployments, the first deployment went to production three times on 17 Nov 2026: from `vercel deploy`, from `vercel deploy --target preview`, and from a Git push of the pull request's branch. Each time it took the guide's domain, so the domain goes on only at launch: after the merge (whose last commit must touch the app, core, `scripts` or the root workspace files, or the first production build of `main` is most likely canceled by the ignore step), once `main`'s production deployment is built and its state is ready (adding it earlier would most likely serve the pull request's build on the real address at once, per Vercel's docs, not tried here).
- **Its first deployment comes from Git:** connect the project (`vercel git connect`) once the guide's pull request is open. The next push builds if its last commit touches the app, core, `scripts` or the root workspace files (section 1). Never `vercel deploy`, `redeploy`, `promote` or `alias` on it before launch.
- **Check it** with headers.sh (section 3) and in the browser. Check sync and a visit count on its branch address, `<project>-git-<branch>-jellycat.vercel.app`, since the sync API refuses the origin `<project>.vercel.app` by design (it serves `*.hundo.quest` and `hundo-…-jellycat.vercel.app` only). That address is protected: sign in to Vercel, or send the project's bypass token as `x-vercel-protection-bypass` from a script, without `x-vercel-set-bypass-cookie` on every request (it loops POSTs in 307s), and never print the token.
- After any deployment, read its target back before anything else (`vercel api /v13/deployments/<id> --scope jellycat --raw | jq .target`), and the project's domains (`vercel api /v9/projects/<project>/domains --scope jellycat --raw | jq -r '.domains[].name'`). A new project's first one has been production: its domains must then be `.vercel.app` names only. Any later one before launch that says `production`, or a `hundo.quest` name on the project before launch: stop and tell the user. Read domains from the project: a deployment's `alias` list kept `lordran.hundo.quest` after it was detached.

## Gotchas

- In zsh, never name a loop variable `path`: it's tied to `PATH`, and every command after it breaks.
- In this shell, `du` is aliased to dust and `ls` to eza. Use `/usr/bin/du -sk` and `/bin/ls` in scripts.
- `vercel curl` needs `--scope jellycat` and a linked folder. Anywhere else, protection turns it into a 302.
