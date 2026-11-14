#!/bin/sh
# Vercel's ignore step for one app, run from apps/<name>. Exit 0 skips the build, 1 builds it; Vercel fails the
# deployment on any other exit code, so every doubt ends in a build: no earlier deployment, or an earlier commit that
# the shallow clone lacks or that history no longer has.
base=${VERCEL_GIT_PREVIOUS_SHA:-HEAD^}
git cat-file -e "$base^{commit}" 2>/dev/null || exit 1
git diff --quiet "$base" HEAD -- . ../../packages/core ../../scripts ../../package.json ../../pnpm-lock.yaml ../../pnpm-workspace.yaml ../../tsconfig.base.json && exit 0
exit 1
