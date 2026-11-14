---
name: guide-deploy
description: Ship a hundo change through Vercel. Get preview deployments of the affected guides, wait for them, check their headers, deep links, 404s and service worker, then go to production only on the user's go and check the live hundo.quest sites and the update prompt. Use whenever a branch or a merge to main would deploy, when a preview didn't build, or when a guide needs its first Vercel project.
---

# Deploying a guide

[docs/deploying.md](../../../docs/deploying.md) explains the projects, the addresses, `vercel.json`, the ignore command and the pitfalls. This is the procedure. Every push, merge to `main`, production deploy and new project needs the user's go, asked in this session, with exactly what will happen.

## 1. Which guides deploy

Work out which projects will build before asking for the push. The ignore step, `scripts/vercel-ignore.sh`, builds a project when its app, `packages/core`, `scripts/` or a root workspace file changed. On a branch's first push, only the last commit counts. It also builds whenever it can't compare, such as after history was rewritten. Never make it exit with anything but 0 or 1: Vercel fails the deployment on any other code, and `deploy.test.ts` checks this.

## 2. Previews

- **Push the branch**, with the user's go. A new branch with real commits builds a preview on every project whose ignore command sees a change. PR [salty-max/hundo#1](https://github.com/salty-max/hundo/pull/1) built all three this way on 2026-11-14. The pull request's checks link to each deployment.
- **No preview built?** That happens when the branch's last commit touches none of the watched paths. The monorepo session also saw no build for a branch pushed at a commit that already existed (2026-11-14). Create the deployment through the API instead. The body goes in a file:

  ```json
  { "name": "<project>", "project": "<project>", "gitSource": { "type": "github", "repoId": 1458075216, "ref": "<branch>", "sha": "<full sha>" } }
  ```

  ```bash
  vercel api /v13/deployments --scope jellycat -X POST --input <body.json> --raw | jq -r '.url, .id, .readyState'
  ```

  `1458075216` is `salty-max/hundo`'s GitHub id (`gh api repos/salty-max/hundo --jq .id`), unchanged by the rename from game-guides. Leave out `target` so the deployment is a preview. **Never print the whole response**, or a project's: it holds a protection-bypass secret. Always pick fields with `jq`. Right after the POST, the state is queued or initializing. `vercel inspect --wait` shows how it ends. If it ends canceled, the likely reason is that the ignore step skipped it too. That's an inference, not seen yet, so check the build log.
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

   Hold its output against the app's `vercel.json`, which is the source of truth for every value:
   - `/` and the deep link `/guide/3` return 200 HTML: the app, not a 404;
   - `/assets/nope.js` returns a 404, not HTML;
   - every route has the CSP;
   - `index.html`, `sw.js`, `theme-init.js` and the manifest carry the revalidate rule, and `sw.js` has `Service-Worker-Allowed: /` (`swa=/`);
   - hashed `/assets` carry the one-year immutable rule, and `/fonts` and `/icons` the week-long one;
   - the first line shows the page's `data-corners`, its `theme-color` (filled in, not `%GUIDE_THEME_COLOR%`) and the external `theme-init.js`.
2. **The page itself.** Open the preview URL in the browser pane, signed in to Vercel if it asks. Look at the change on desktop and phone, in light and dark, as in the `guide-check` skill.
3. **The service worker,** in a regular browser. It registers, the guide loads offline after one visit, and nothing in the console complains about the CSP.

## 4. Production

Only on the user's go, with exactly what will deploy.

- The normal path is merging the pull request into `main`. Each project whose ignore command sees a change builds production from `main`.
- Wait with `vercel ls <project> --scope jellycat` and `vercel inspect <url> --scope jellycat --wait`. Run `headers.sh` against the production deployment URL too.
- **The update prompt, first.** Returning readers keep the old shell until they accept the new version, because the service worker serves it. On a browser that had the old version open, reload and expect "A new version of the guide is ready. Your progress is already saved." with a Reload button. Press it, then check the change is there and the progress survived. Until a reader does this, nothing new runs for them, the handover included.
- **Only when a guide moves address** ([docs/deploying.md](../../../docs/deploying.md#pitfalls)). Red Dead has `brand.movedFrom` since its move from `reddead.hundo.quest` to `rdr.hundo.quest`. The other guides' old `.vercel.app` addresses were dropped on 2026-11-14. For a move, test it before and after the merge. Once the new build is live, it redirects every visit to the old address before rendering, so nobody can tick anything there.
  1. Before merging, tick a row on the old address while the old build still serves it, in a browser with nothing saved on the new address.
  2. After production is up, reopen the old address and accept the update prompt.
  3. You should land on the same page on `brand.home`, with the tick there.

  A new address that already has checks keeps its own and ignores the handover, by design.
- **The live address**, `brand.home` (`https://<sub>.hundo.quest`): check it as you checked the preview.

## 5. A new project

Follow [docs/deploying.md](../../../docs/deploying.md#a-new-project), with the user's go for creating it, then do steps 2 and 3 for its first preview. Its first production deploy is a separate go.

## Gotchas

- In zsh, never name a loop variable `path`: it's tied to `PATH`, and every command after it breaks.
- In this shell, `du` is aliased to dust and `ls` to eza. Use `/usr/bin/du -sk` and `/bin/ls` in scripts.
- `vercel curl` needs `--scope jellycat` and a linked folder. Anywhere else, protection turns it into a 302.
