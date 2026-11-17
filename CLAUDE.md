# hundo

Spoiler-aware PWA completion guides for single-player games: a pnpm workspace with one shared app in `packages/core` and one guide per folder in `apps/` (the README lists them). React 19, TypeScript, Vite, Vitest. GitHub `salty-max/hundo`, deployed as one Vercel project per guide plus `hundo-api` for the sync API, and served at `<sub>.hundo.quest`. The README has the layout. This file is the rules.

## Commands

- `pnpm install` at the root (pnpm 11, pinned in `packageManager`; Node 26 like Vercel and CI).
- `pnpm check`: lint (warnings fail), typecheck, tests and build in every package. Through the harness: `bun harness/q.ts check -- bun run check`, which stamps the tree for the push gate and, with the check queue on, may wait its turn behind another session's check (see Sessions and worktrees).
- `bun harness/hooks.ts install .`, once per clone, from the main checkout's root: it points `core.hooksPath` at `harness/githooks`. `bun harness/hooks.ts status` shows whether they're on. It refuses in a worktree.
- In an app folder: `pnpm dev`, `pnpm test`, `pnpm build`, `pnpm preview`, `pnpm icons`. At the root, `pnpm screenshots [app,…]` retakes the install dialog's pictures from production builds (not part of the check). A `cd` lasts one command in a session here (`.claude/settings.json`), so reach the folder in the same command, `cd apps/<name> && pnpm test`, or use `pnpm -C apps/<name> test`.
- Browser pane: `preview_start` with `koholint`, `rdr` or `echoes` for dev, or `<name>-preview` for a production build (`.claude/launch.json`). These load only in a session started in this repository. They serve the folder the session works in: its worktree when the app opened it in one, the main checkout otherwise, so read the `cwd` in `preview_list` before trusting a page ([docs/testing.md](docs/testing.md#which-folder-the-pane-serves)). A port that's taken moves to the next free one, so read the port from the result (`docs/testing.md`).
- Sync API: `services/sync` serves sync codes. `pnpm -C services/sync test`, or `preview_start` with `sync-api` for it on port 8787 with an in-memory store. Its notes are `services/sync/README.md`. A guide's dev and preview servers send `/api` there (`SYNC_API` names another address), so start it first to try sync ([docs/testing.md](docs/testing.md#sync-in-a-browser)).
- Screenshots: `node .claude/skills/guide-check/scripts/shoot.mjs --out <dir>` (the `guide-check` skill).
- Lighthouse: `pnpm lighthouse [app,…]` at the root audits the production builds as CI's `lighthouse` job does, about two minutes a guide, and stays out of `pnpm check` ([docs/testing.md](docs/testing.md#lighthouse)).
- Component stories: `pnpm --filter hundo-stories storybook`, or `preview_start` with `storybook`. They run as tests, axe in every guide's palette and theme, inside `pnpm check`, and need the system Google Chrome ([docs/testing.md](docs/testing.md#stories)).

## Which skill and doc for which task

The skills, in `.claude/skills/`, hold the procedures. The docs hold the reference they point to.

| Task | Skill | Doc |
| --- | --- | --- |
| Add a guide | `guide-new` | `docs/adding-a-guide.md` |
| Write or fix chapter data, missables, counts, `facts-to-verify.md` | `guide-content` | `docs/chapter-data.md` |
| Chapter banners | `guide-banners` | `docs/house-style.md` |
| Palette, fonts, corners, icon, buttons | | `docs/house-style.md` |
| Anything in `packages/core` | | `docs/core.md` |
| Look at a change in a browser, before and after | `guide-check` | `docs/testing.md` |
| Vercel, previews, production, a new project | `guide-deploy` | `docs/deploying.md` |
| The sync API (`services/sync`) | | `services/sync/README.md`, `docs/deploying.md` |

## Hard rules

Each one is a mistake already made, or one that would cost readers their progress.

- **Storage keys never change, and an address changes only with a hand-off.** Progress lives in each reader's localStorage under `<storagePrefix>.v1` on the guide's origin, the theme under `<storagePrefix>.theme`, a synced device's ledger under `<storagePrefix>.sync`, Keep screen on under `<storagePrefix>.awake`, the last place read under `<storagePrefix>.place`, when the guide last asked to keep its storage under `<storagePrefix>.persist`, and Count my visits turned off under `<storagePrefix>.counts`. A new key, or a bare move to a new address, starts everyone from nothing (and a new `.sync` makes every synced device send all it has again). A move needs `brand.home`, `brand.movedFrom` and the old address left serving ([docs/deploying.md](docs/deploying.md#pitfalls)). The `.v1` stays even when the save format's `version` moves on. Each guide's `guide.test.ts` pins all seven keys.
- **A guide's `brand.id` never changes.** It's the `guide` written into every backup, and the name the sync API (`services/sync`) stores a guide's progress under. The API's `GUIDES` list must hold every guide's id, and `services/sync/src/project.test.ts` fails when it doesn't.
- **Row ids never change once live.** They're the saved checks, and a renamed id comes back unticked for every reader.
- **`theme-init.js` stays an external file.** The CSP has `script-src 'self'` and no inline scripts. `deploy.test.ts` checks both.
- **No `cleanUrls` in `vercel.json`.** It breaks the SPA rewrite, so deep links 404. `deploy.test.ts` checks it.
- **The catch-all skips `/api`, `/assets`, `/fonts`, `/icons` and `/workbox-`, `/api` goes to the sync API ahead of it, and a long cache comes only with a found file.** A missing hashed asset must 404, not come back as HTML, and that 404 must not carry the one-year cache. A missing call must be the API's answer, not the app's page. So `vercel.json` is `routes` alone, with the cache rules after `{ "handle": "hit" }` (never `headers` or `rewrites` beside it: [docs/deploying.md](docs/deploying.md#what-verceljson-sets)). `deploy.test.ts` checks the routes and their order, and `headers.sh` checks a preview's 404s.
- **Every app's `vercel.json` is the same file**, and its ignore command (`scripts/vercel-ignore.sh`) watches the app, core, `scripts` and the root workspace files, and only ever exits 0 or 1: Vercel fails a deployment on any other code. `deploy.test.ts` checks all of it.
- **A guide sets only its palette (`theme.css`), its fonts and `corners` (`brand.ts`), its icon art and its banners.** Every other look is core's. `theme.test.ts` holds the palette to eleven keys and to contrast in both themes.
- **Never pass `className` (or `style`) to `Button`.** Pick a `look`. The type forbids both.
- **Raw CSS imports load empty in Vitest unless they're let through.** Read a stylesheet as text with `?raw`, which `vite.ts`'s `test.css.include` allows. The theme test once passed on nothing because of this.
- **A missable needs two independent sources on different hosts.** Anything weaker goes in the app's `docs/facts-to-verify.md`. So does every count, weight or claim nobody has confirmed, in the same commit as the data.
- **Commit `pnpm-lock.yaml` with any `package.json` change.** CI and Vercel install with `--frozen-lockfile`.

## Working rules

- **Look before calling it done.** Every visible change gets opened in a browser on desktop and phone, in light and dark. For a core change, do that in an article guide and in Red Dead (`docs/testing.md`).
- **Preview first.** Nothing reaches production without a look at its Vercel preview: headers, deep links, the service worker (`docs/deploying.md`).
- **No push, deploy, merge to `main` or new Vercel project without the user's go**, asked of the user in the opener when a child wants it (a child asks nothing, see Harness below), in the session itself when it has no opener. A merge to `main` deploys every guide whose ignore command sees a change.
- **No unverifiable claims** in the guides, the READMEs or these docs. Comments only where they explain a why.

## Sessions and worktrees

hundo sets `[hooks] lock = false`, `[session] worktrees = true` and `[session] decisions = "opener"` in `harness.toml`. Each child session works in its own git worktree on its own branch, cut from `main`, and asks the user nothing (a plan child's approval of its plan aside): its questions and every go go to its opener. Nothing commits to `main` here and the work meets in pull requests, so no session waits for another's. The board is the list of who does what, not a lock. A card can still be `blocked --on` another, as a choice (the last item).

- **`pnpm install` first in a new worktree.** It has no `node_modules`.
- **Open a child from the desktop app.** The harness's CLI path adds `--worktree` to `claude --bg` (`claude --help` lists `-w, --worktree [name]`), but nobody has run the two together here, so a CLI-opened child may start in the main checkout: look at its folder first.
- **Where the harness reads the main checkout.** The git hooks (`core.hooksPath` is absolute) and everything the tools read from `harness.toml` while they run (`lock`, `queue`, `decisions`, `worktrees`, the check) come from the main checkout, so a change to either only takes effect once the main checkout has it merged and pulled: until then `session.ts` run in a worktree still prints the old rules. The board and the check stamps are shared by every worktree. `hooks.ts install` refuses in a worktree.
- **A sync, `init` or `doctor` acts on the worktree it is given.** `bun ~/code/wow-addons/harness/harness-sync.ts <worktree>` writes that worktree's own `harness/` and `init.ts <worktree> --section-only` its own CLAUDE.md section, rendered from its own `harness.toml`: a harness update is a commit on a branch like any other, not an edit in the main checkout. `doctor.ts <worktree>` judges the worktree's files and the hooks as the main checkout has them.
- **`session.ts check` may say "git fetch first".** Unpushed commits are counted by content against the remote as last fetched, so a branch merged since the last fetch still reads unpushed. Fetch and run it again: a rebase-merged branch then reads nothing unpushed, whatever new ids the rebase gave its commits (a patch changed in the rebase still counts).
- **A queued check can wait minutes.** `[checks] queue = true` runs one `check` at a time on the Mac, so `bun harness/q.ts check -- bun run check` may print one waiting line and sit in the line behind another session's check. Run it in the background: a foreground Bash call is capped at 10 minutes with the wait and the check both inside it, and the waiting line warns that a call that times out loses its place.
- **Rewrites of core are sequenced on purpose.** The component rewrite, and anything else that rewrites core under every guide, goes one at a time: a worktree spares the wait, not the rebase. The card that comes second is set `blocked --on` the first (`board.ts set <id> --status blocked --on <card>`), which is a choice and the board then reads as it always did, or it starts once the first has landed.

<!-- harness:start -->

## Harness

This project runs under a small harness (`harness.toml`, tools in `harness/`). The rules
below are checked by git hooks or by tools, so they are not advice.

- **One task, one session, one card.** A session's first write is its card:
  `bun harness/board.ts add <repo> "<title>" --repos <repo> --try "…" --committed "(none yet)" --left "…"`.
  It names the repositories the task writes. Nothing refuses a commit for want of it
  (`[hooks] lock = false`): keeping it is the session's own rule. Move the card at each
  stop
  (`board.ts set <id> --status waiting-test|waiting-review|ready-to-push|done`).
- **Checks go through q**: `bun harness/q.ts check -- <the check>`. One verdict line,
  the log in `.cache/logs/`, the tree stamped. A push is refused for a tree with no
  passing check. Never pipe a check into `tail`; anything long goes to a file.
- **The board is a list, not a lock.** A `note:` that another card is running in a
  repository only says who else is there: keep to your own files and talk to that
  session by its id, don't wait for it. `board.ts held` shows who runs where. A card
  can still be `blocked --on` another, as a choice.
- **Each child works in a worktree of its own**, on a branch of its own
  (`[session] worktrees = true`): commit there, never in the main checkout. The board,
  its cards and the check stamps are shared by every worktree, and `harness/packet.ts`,
  `review.ts` and `session.ts check` act on the worktree they are run from or asked
  about. The git hooks run from the main checkout (`core.hooksPath` is the absolute
  path `hooks.ts install` wrote there, so a worktree's own copy of the tools is never
  the one that runs) and the tools read `harness.toml` from it: install the hooks
  there (`bun harness/hooks.ts install .`), never from a worktree.
- **Review before the commit**: `bun harness/packet.ts <repo>` on the uncommitted files,
  the `reviewer` helper reads the packet, fix what it finds, then
  `bun harness/review.ts <repo> "<verdict>"`, then one commit. A push is refused for a
  change no review stands behind (docs are waived).
- **Commits**: Conventional Commits, lowercase subjects, no AI co-author or "generated
  with" line (the commit-msg hook refuses them).
- Ask before any push, release or deploy.
- Rules this project keeps beyond these: `CLAUDE.md`.

How sessions work together (behaviour: no hook checks these):

- **A new task asked in a session that has its own is opened as a child** (the `child`
  skill): tell the user its name and where to find it, write nothing for it here. A
  small follow-up of the same thread stays.
- **Every decision is taken in the opener, never in a child**
  (`[session] decisions = "opener"`). A child asks the user nothing: it sends each
  question (a push, a merge, any choice) to its opener with the options and its
  recommendation, and stops. The opener asks the user through the question tool
  (`AskUserQuestion`, or `wrap_up`'s ask), the recommended answer first and marked
  "(Recommended)". Never a question buried in prose.
- **A go is the user's, asked in the opener.** A child never pushes and never asks
  for a go: its report says what is committed and what a push would send
  (repository, sha range, push only). The opener asks the user, then pushes on their
  answer or relays it to the child quoted. A push go never covers a deploy or a
  release: each is asked again.
- **Close a finished child yourself**: its work pushed (or dropped) and its card done,
  then `bun harness/session.ts check <local_id>` and archive it (desktop) or
  `session.ts close` (CLI). Never wait to be told. Never one that waits on the user,
  holds an open card or has a follow-up on its way.
- **Pick each child's model from its task**: the project's default for mechanical work
  from a written brief, a stronger model at higher effort for judgment (prose, voice,
  security, design, a plan the user must approve). Set it when the child starts (a plan
  child once its plan is approved) and say the choice in one line.
- **A problem found along the way gets fixed now**, under its own card, or handed to a
  new session at once. Never only mentioned in the report.
- **Review your own work before saying it is done**: read the diff, grep for leftovers,
  check each claim in the report, see CI's verdict. Chain a commit after the check with
  `&&`, never `;`.
- **"Can't" is a research task first**: the docs, the code that does the same thing, the
  web. Say what was checked, and "not verified" with the probe that would settle it,
  never "impossible" on a guess.

<!-- harness:end -->
