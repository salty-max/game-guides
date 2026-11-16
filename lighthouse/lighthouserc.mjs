// What every pull request's Lighthouse runs are held to (lighthouse/run.mjs runs them; docs/testing.md#lighthouse says how to read a
// failure). Lighthouse CI checks each URL against every assertMatrix entry whose pattern matches it, so the first entry holds every
// page and the others add each page's own speed floor. The desktop runs are the URLs ending in #desktop.
//
// Accessibility, best practices and SEO take the worst of the three runs; speed takes the median run, so one slow run on a shared
// runner doesn't fail a pull request. The speed floors are main's baseline less a margin for noise. PROVISIONAL: measured on an
// M-series Mac so far, not yet on GitHub's runner.

const worst = { aggregationMethod: "pessimistic" };
const median = { aggregationMethod: "median-run" };

const everyPage = {
  matchingUrlPattern: ".*",
  assertions: {
    "categories:accessibility": ["error", { minScore: 1, ...worst }],
    "categories:best-practices": ["error", { minScore: 1, ...worst }],
    // 92 until the guides serve a robots.txt (the SEO wave): every page fails robots-txt today, here and in production.
    "categories:seo": ["error", { minScore: 0.92, ...worst }],
    "total-blocking-time": ["error", { maxNumericValue: 300, ...median }],
    // Koholint's first chapter shifts by 0.113 on main; 0.1 is Google's "good".
    "cumulative-layout-shift": ["error", { maxNumericValue: 0.15, ...median }],
  },
};

const speed = (matchingUrlPattern, minScore, lcp) => ({
  matchingUrlPattern,
  assertions: {
    "categories:performance": ["error", { minScore, ...median }],
    "largest-contentful-paint": ["error", { maxNumericValue: lcp, ...median }],
  },
});

export default {
  ci: {
    collect: {
      numberOfRuns: 3,
      settings: {
        // axe's target-size counts a row that sits under the phone's tab bar at the fold as a target too small to press. Held out
        // until that and Echoes' 22px links on Progress are settled; every other accessibility audit counts.
        skipAudits: ["target-size"],
      },
    },
    assert: {
      assertMatrix: [
        everyPage,
        speed("/guide/1$", 0.7, 5500),
        speed("/checklist$", 0.85, 3000),
        speed("/dashboard$", 0.75, 4500),
        speed("#desktop$", 0.9, 1000),
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
