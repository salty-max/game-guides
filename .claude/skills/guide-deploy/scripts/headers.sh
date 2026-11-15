#!/bin/bash
# headers.sh <deployment-url>: the status and the headers that matter for each route vercel.json shapes, each held to
# what it should be. A row that isn't says WRONG and the script exits 1; every row also needs the CSP.
# Run it from a folder linked to the deployment's project (vercel link --project <name> --scope jellycat):
# vercel curl gets through deployment protection only there. It refuses to run anywhere else rather than link a folder.
d=${1:?usage: headers.sh <deployment-url>}
[ -f .vercel/project.json ] || { echo "headers.sh: $(pwd) isn't linked to a Vercel project (vercel link --project <name> --scope jellycat)" >&2; exit 2; }
fail=0
html=$(vercel curl / --deployment "$d" --scope jellycat -- -s)
echo "$html" | grep -oE 'data-corners="[a-z]+"|theme-color" content="[^"]+"|src="/theme-init.js"' | tr '\n' ' '
echo
asset=$(echo "$html" | grep -oE '/assets/index-[A-Za-z0-9_-]+\.js' | head -1)
font=$(echo "$html" | grep -oE '/fonts/[A-Za-z0-9_.-]+\.woff2' | head -1)
workbox=$(vercel curl /sw.js --deployment "$d" --scope jellycat -- -s | grep -oE 'workbox-[a-f0-9]{8,}' | head -1)
[ -n "$workbox" ] && workbox="/$workbox.js"
[ -n "$asset" ] || { echo "  WRONG: no hashed /assets/index-*.js in the page"; fail=1; }
[ -n "$font" ] || { echo "  WRONG: no /fonts/*.woff2 in the page"; fail=1; }
[ -n "$workbox" ] || { echo "  WRONG: no workbox-<hash> chunk named in sw.js"; fail=1; }

# check <route> <status> <cache-control must match> <cache-control must not match> <content-type must match> <content-type must not match> [swa]
# A file that exists gets its cache rule, and one that doesn't is a plain 404 with no long cache: vercel.json's cache
# rules sit in the `hit` phase, after the file was found. Before that they hit a 404 too (a year of cache on a missing asset).
check() {
  local out rc
  out=$(vercel curl "$1" --deployment "$d" --scope jellycat -- -sI 2>/dev/null | tr -d '\r' | awk -v r="$1" -v want="$2" -v pos="$3" -v neg="$4" -v ctpos="$5" -v ctneg="$6" -v needswa="$7" '
    /^HTTP\// {s=$2}
    tolower($1)=="content-type:" {ct=$2}
    tolower($1)=="cache-control:" {sub(/^[^:]*: */,""); cc=$0}
    tolower($1)=="service-worker-allowed:" {swa=$2}
    tolower($1)=="content-security-policy:" {csp="csp"}
    END {
      bad=""
      if (s != want) bad=bad " status"
      if (pos != "" && cc !~ pos) bad=bad " cache-control"
      if (neg != "" && cc ~ neg) bad=bad " cache-control"
      if (ctpos != "" && ct !~ ctpos) bad=bad " content-type"
      if (ctneg != "" && ct ~ ctneg) bad=bad " content-type"
      if (needswa != "" && swa != "/") bad=bad " service-worker-allowed"
      if (csp == "") bad=bad " csp"
      printf "  %-34s %s %-26s %s%s %s%s\n", r, s, ct, cc, (swa == "" ? "" : " swa=" swa), csp, (bad == "" ? "" : "   <-- WRONG:" bad)
      exit (bad == "" ? 0 : 1)
    }')
  rc=$?
  echo "$out"
  [ $rc -eq 0 ] || fail=1
}

nolong='immutable|max-age=[1-9]|stale-while-revalidate'
html='text/html'
check / 200 'max-age=0' '' "$html"
check /guide/3 200 'max-age=0' '' "$html"
check /theme-init.js 200 'max-age=0' '' javascript "$html"
check /sw.js 200 'max-age=0' '' javascript "$html" swa
check /manifest.webmanifest 200 'max-age=0' '' manifest "$html"
[ -n "$asset" ] && check "$asset" 200 'max-age=31536000, immutable' '' javascript "$html"
check /assets/nope.js 404 '' "$nolong" '' "$html"
[ -n "$workbox" ] && check "$workbox" 200 'max-age=31536000, immutable' '' javascript "$html"
check /workbox-nope.js 404 '' "$nolong" '' "$html"
[ -n "$font" ] && check "$font" 200 'max-age=604800' '' font
check /fonts/nope.woff2 404 '' "$nolong" '' "$html"
check /icons/favicon.svg 200 'max-age=604800' '' image
check /icons/nope.svg 404 '' "$nolong" '' "$html"
# the sync API behind /api: its own answers (JSON, or a 404), a CSP on them, and never the app's page
check /api/sync 405 '' "$nolong" json "$html"
check /api/nope 404 '' "$nolong" '' "$html"
[ $fail -eq 0 ] && echo "headers.sh: every row is as it should be" || echo "headers.sh: WRONG rows above" >&2
exit $fail
