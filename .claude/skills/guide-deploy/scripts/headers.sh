#!/bin/bash
# headers.sh <deployment-url>: the status and the headers that matter for each route vercel.json shapes.
# Run it from a folder linked to the deployment's project (vercel link --project <name> --scope jellycat):
# vercel curl gets through deployment protection only there. It refuses to run anywhere else rather than link a folder.
d=${1:?usage: headers.sh <deployment-url>}
[ -f .vercel/project.json ] || { echo "headers.sh: $(pwd) isn't linked to a Vercel project (vercel link --project <name> --scope jellycat)" >&2; exit 2; }
html=$(vercel curl / --deployment "$d" --scope jellycat -- -s)
echo "$html" | grep -oE 'data-corners="[a-z]+"|theme-color" content="[^"]+"|src="/theme-init.js"' | tr '\n' ' '
echo
asset=$(echo "$html" | grep -oE '/assets/index-[A-Za-z0-9_-]+\.js' | head -1)
font=$(echo "$html" | grep -oE '/fonts/[A-Za-z0-9_.-]+\.woff2' | head -1)
for route in / /guide/3 /theme-init.js /sw.js /manifest.webmanifest "$asset" /assets/nope.js "$font" /icons/favicon.svg; do
  vercel curl "$route" --deployment "$d" --scope jellycat -- -sI 2>/dev/null | awk -v r="$route" '
    /^HTTP\// {s=$2}
    tolower($1)=="content-type:" {ct=$2}
    tolower($1)=="cache-control:" {sub(/^[^:]*: */,""); cc=$0}
    tolower($1)=="service-worker-allowed:" {swa=" swa="$2}
    tolower($1)=="content-security-policy:" {csp=" csp"}
    END {gsub(/\r/,"",cc); gsub(/\r/,"",ct); printf "  %-34s %s %-26s %s%s%s\n", r, s, ct, cc, swa, csp}'
done
