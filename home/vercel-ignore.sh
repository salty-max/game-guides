#!/bin/sh
# Vercel's ignore step for the landing page, run from home/. Exit 0 skips the build, 1 builds it; Vercel fails the deployment on any other
# exit code, so every doubt ends in a build: no earlier deployment, or an earlier commit that the shallow clone lacks or that history no
# longer has. The page is made from the guides' files and core's, so a change to any guide rebuilds it. Not in scripts/, which every
# guide's own ignore step watches: a change here would redeploy all of them.
base=${VERCEL_GIT_PREVIOUS_SHA:-HEAD^}
git cat-file -e "$base^{commit}" 2>/dev/null || exit 1
git diff --quiet "$base" HEAD -- . ../apps ../packages/core ../package.json ../pnpm-lock.yaml ../pnpm-workspace.yaml ../tsconfig.base.json && exit 0
exit 1
