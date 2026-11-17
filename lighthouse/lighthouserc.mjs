// What every pull request's Lighthouse runs are held to (lighthouse/run.mjs runs them; docs/testing.md#lighthouse says how to read a
// failure). Lighthouse CI checks each URL against every assertMatrix entry whose pattern matches it, so the first entry holds every
// page and the others add each page's own speed limits. The desktop runs are the URLs ending in #desktop.
//
// Accessibility, best practices and SEO take the worst of the three runs. Speed takes each metric's median over the three ("median"),
// so one slow run on a shared runner doesn't fail a pull request. Not "median-run": that asserts every metric from the one run nearest
// the median FCP and TTI, which can be the slow one. A page's first run in a CI job is often far slower than the other two (TBT up to
// about 700 ms on /dashboard and over 900 on /guide/1), and main went red on 17 Nov 2026 asserting Red Dead's 329 ms on /dashboard
// where the median was 80.
//
// The speed limits come from main on GitHub's runner (16 Nov 2026, Lighthouse's CPU benchmark 2,200 to 2,500, about three quarters of
// an M-series Mac), one set per page from the guide that does worst on it, so a lighter guide has more room before it trips:
// - performance: that guide's median less about 10 points;
// - TBT, the number a slower machine moves most: about 1.5 times its median;
// - LCP: the limits first set on a Mac, which leave the runner's medians 450 to 1,000 ms of room (desktop, 445 ms);
// - CLS: 0.1 on a chapter, Google's "good", since the fonts are preloaded (they used to swap in late and push the page down by 0.11 to
//   0.14 on the runner); 0.15 elsewhere, where Progress shifted by 0.052 to 0.098 on the runner (Google's "poor" is 0.25).

const worst = { aggregationMethod: "pessimistic" };
const median = { aggregationMethod: "median" };

const everyPage = {
  matchingUrlPattern: ".*",
  assertions: {
    "categories:accessibility": ["error", { minScore: 1, ...worst }],
    "categories:best-practices": ["error", { minScore: 1, ...worst }],
    "categories:seo": ["error", { minScore: 1, ...worst }],
  },
};

const speed = (matchingUrlPattern, { performance, lcp, tbt, cls }) => ({
  matchingUrlPattern,
  assertions: {
    "categories:performance": ["error", { minScore: performance, ...median }],
    "largest-contentful-paint": ["error", { maxNumericValue: lcp, ...median }],
    "total-blocking-time": ["error", { maxNumericValue: tbt, ...median }],
    "cumulative-layout-shift": ["error", { maxNumericValue: cls, ...median }],
  },
});

export default {
  ci: {
    collect: { numberOfRuns: 3 },
    assert: {
      assertMatrix: [
        everyPage,
        speed("/guide/1$", { performance: 0.65, lcp: 5500, tbt: 500, cls: 0.1 }),
        speed("/checklist$", { performance: 0.8, lcp: 3000, tbt: 400, cls: 0.15 }),
        speed("/dashboard$", { performance: 0.75, lcp: 4500, tbt: 260, cls: 0.15 }),
        speed("#desktop$", { performance: 0.9, lcp: 1000, tbt: 60, cls: 0.15 }),
      ],
    },
    upload: {
      target: "filesystem",
      outputDir: "report",
      // The hash keeps /checklist#desktop's reports apart from the phone's: checklist-desktop-…, where a phone run has -unknown-.
      reportFilenamePattern: "%%PATHNAME%%-%%HASH%%-%%DATETIME%%.report.%%EXTENSION%%",
    },
  },
};
