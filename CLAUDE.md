# game-guides

Spoiler-aware PWA field guides for single-player games: a pnpm workspace with one shared app in `packages/core` and one guide per folder in `apps/` (Koholint, Red Dead, Echoes). React 19, TypeScript, Vite, Vitest. GitHub `salty-max/game-guides`, deployed as three Vercel projects. The README has the layout. This file is the rules.

## Commands

- `pnpm install` at the root (pnpm 11, pinned in `packageManager`; Node 26 like Vercel and CI).
- `pnpm check`: lint (warnings fail), typecheck, tests and build in every package. Through the harness: `bun harness/q.ts check -- bun run check`, which stamps the tree for the push gate.
- `bun harness/hooks.ts install .`, once per clone, from the main checkout's root: it points `core.hooksPath` at `harness/githooks`. `bun harness/hooks.ts status` shows whether they're on. Never run it from a worktree, which would point the whole repository at that worktree's copy.
- In an app folder: `pnpm dev`, `pnpm test`, `pnpm build`, `pnpm preview`, `pnpm icons`.
- Browser pane: `preview_start` with `koholint`, `red-dead` or `echoes` for dev, or `<name>-preview` for a production build (`.claude/launch.json`).

## Which doc for which task

| Task | Read first |
| --- | --- |
| Add a guide | `docs/adding-a-guide.md` |
| Write or fix chapter data, missables, counts, `facts-to-verify.md` | `docs/chapter-data.md` |
| Palette, fonts, corners, icon, banners, buttons | `docs/house-style.md` |
| Anything in `packages/core` | `docs/core.md` |
| Run the checks, look at a change in a browser | `docs/testing.md` |
| Vercel, previews, production, `vercel.json` | `docs/deploying.md` |

## Hard rules

Each one is a mistake already made, or one that would cost readers their progress.

- **Storage keys never change, and an address changes only with a hand-off.** Progress lives in each reader's localStorage under `<storagePrefix>.v1` on the guide's origin, and the theme under `<storagePrefix>.theme`. A new key, or a bare move to a new address, starts everyone from nothing. A move needs `brand.home`, `brand.movedFrom` and the old address left serving ([docs/deploying.md](docs/deploying.md#pitfalls)). The `.v1` stays even when the save format's `version` moves on. Each guide's `guide.test.ts` pins both keys.
- **Row ids never change once live.** They're the saved checks, and a renamed id comes back unticked for every reader.
- **`theme-init.js` stays an external file.** The CSP has `script-src 'self'` and no inline scripts. `deploy.test.ts` checks both.
- **No `cleanUrls` in `vercel.json`.** It breaks the SPA rewrite, so deep links 404. `deploy.test.ts` checks it.
- **The catch-all rewrite skips `/assets`, `/fonts` and `/icons`.** A missing hashed asset must 404, not come back as HTML. `deploy.test.ts` checks it.
- **Every app's `vercel.json` is the same file**, and its ignore command (`scripts/vercel-ignore.sh`) watches the app, core, `scripts` and the root workspace files, and only ever exits 0 or 1: Vercel fails a deployment on any other code. `deploy.test.ts` checks all of it.
- **A guide sets only its palette (`theme.css`), its fonts and `corners` (`brand.ts`), its icon art and its banners.** Every other look is core's. `theme.test.ts` holds the palette to eleven keys and to contrast in both themes.
- **Never pass `className` (or `style`) to `Button`.** Pick a `look`. The type forbids both.
- **Raw CSS imports load empty in Vitest unless they're let through.** Read a stylesheet as text with `?raw`, which `vite.ts`'s `test.css.include` allows. The theme test once passed on nothing because of this.
- **A missable needs two independent sources on different hosts.** Anything weaker goes in the app's `docs/facts-to-verify.md`. So does every count, weight or claim nobody has confirmed, in the same commit as the data.
- **Commit `pnpm-lock.yaml` with any `package.json` change.** CI and Vercel install with `--frozen-lockfile`.

## Working rules

- **Look before calling it done.** Every visible change gets opened in a browser on desktop and phone, in light and dark. For a core change, do that in an article guide and in Red Dead (`docs/testing.md`).
- **Preview first.** Nothing reaches production without a look at its Vercel preview: headers, deep links, the service worker (`docs/deploying.md`).
- **No push, deploy, merge to `main` or new Vercel project without the user's go**, asked in the session that wants it. A merge to `main` deploys every guide whose ignore command sees a change.
- **No unverifiable claims** in the guides, the READMEs or these docs. Comments only where they explain a why.

<!-- harness:start -->

## Harness

This project runs under a small harness (`harness.toml`, tools in `harness/`). The rules
below are checked by git hooks or by tools, so they are not advice.

- **One task, one session, one card.** A session's first write is its card:
  `bun harness/board.ts add <repo> "<title>" --repos <repo> --try "…" --committed "(none yet)" --left "…"`.
  It holds the repositories it names, and a commit by a Claude session is refused unless
  its running card names the repository (`board.ts held` says who got there first). Move
  the card at each stop
  (`board.ts set <id> --status waiting-test|waiting-review|ready-to-push|done`).
- **Checks go through q**: `bun harness/q.ts check -- <the check>`. One verdict line,
  the log in `.cache/logs/`, the tree stamped. A push is refused for a tree with no
  passing check. Never pipe a check into `tail`; anything long goes to a file.
- **The board is the lock.** A `held:` line means another card got there first: drop
  that repository from yours (`set <id> --repos …` without it) and go on with the rest,
  or commit what you have, `set <id> --on <holder>` and write nothing. A card whose
  session is gone still holds until the user moves it.
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
- **Questions go through the question tool** (`AskUserQuestion`, or `wrap_up`'s ask),
  the recommended answer first and marked "(Recommended)". Never a question buried in
  prose.
- **A go belongs to the session that asks it.** A child asks its own go in its own
  session and never pushes. Its opener pushes only on a go the user gave in the opener,
  or on the child's quote of the user's words with their scope (repository, sha range,
  push only). A push go never covers a deploy or a release: each is asked again.
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
