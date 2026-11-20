// The landing page's markup, rendered to static HTML at build (render.tsx): no React reaches the browser. Each guide is drawn as its own
// chapter hero, in its own palette, display font and corners (the .g-<folder> classes guides.css sets), with its chapter 1 banner.
import { findTerms } from "./find";
import type { Guide } from "./guides";

/** Where the build put each guide's pictures. */
export type GuideArt = {
  /** The banner's copies, narrowest first. */
  banner: { url: string; width: number }[];
  /** The icon tile at 40, 80 and 120px. */
  tile: { url: string; width: number }[];
};

const srcSet = (copies: GuideArt["banner"]) => copies.map((copy) => `${copy.url} ${copy.width}w`).join(", ");

// The banner is drawn at the band's height, three times as wide as that: about 280px tall beside the words (840px wide), about 150px in a
// phone's short band (450px).
const BANNER_SIZES = "(max-width: 36rem) 460px, 840px";
const TILE_SIZES = "(max-width: 36rem) 32px, 44px";

const Arrow = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 12h14m-5-5 5 5-5 5" />
  </svg>
);

const features = [
  {
    title: "Spoiler-aware",
    text: "Chapters past yours stay hidden until you choose to reveal them.",
    icon: <path d="M5 12a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7Zm3-2V7a4 4 0 1 1 8 0v3m-4 4v3" />,
  },
  {
    title: "Works offline",
    text: "Install a guide as an app on your phone or computer. It runs with no connection.",
    icon: <path d="M8.5 2.5h7A2.5 2.5 0 0 1 18 5v14a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 6 19V5a2.5 2.5 0 0 1 2.5-2.5Zm2 16h3M9 9.5l2 2 4-4" />,
  },
  {
    title: "Sync with a code",
    text: "Link your devices with a six-digit code and your ticks follow you.",
    icon: <path d="M20 12a8 8 0 0 1-14.3 4.9M4 12a8 8 0 0 1 14.3-4.9M18.5 3v4.2h-4.2M5.5 21v-4.2h4.2" />,
  },
  {
    title: "No account",
    text: "No email, no sign-up. Your ticks stay in your browser unless you link a device to sync them.",
    icon: <path d="M8 8a4 4 0 1 0 8 0 4 4 0 0 0-8 0Zm-3.5 12.5c.8-3.6 3.9-5.5 7.5-5.5 1.3 0 2.6.3 3.7.8m.8 1.7 4 4m0-4-4 4" />,
  },
];

export const Logo = ({ href }: { href?: string }) => {
  const word = (
    <>
      hund<span className="o" />
    </>
  );
  return href ? (
    <a className="logo" href={href} aria-label="Hundo">
      {word}
    </a>
  ) : (
    <span className="logo" aria-hidden="true">
      {word}
    </span>
  );
};

const Footer = () => (
  <footer className="wrap">
    <div>
      <Logo />
      <span>© 2026 Hundo · Unofficial fan guides, not affiliated with the games’ publishers.</span>
    </div>
  </footer>
);

const Band = ({ guide, art, eager }: { guide: Guide; art: GuideArt; eager: boolean }) => {
  const largest = art.banner.at(-1)!;
  return (
    <li className={`cell g-${guide.folder}`} data-guide={findTerms(guide)} data-id={guide.id}>
      <div className="world">
        <img
          className="art"
          src={largest.url}
          srcSet={srcSet(art.banner)}
          sizes={BANNER_SIZES}
          width={largest.width}
          height={Math.round(largest.width / 3)}
          alt=""
          loading={eager ? undefined : "lazy"}
          decoding="async"
        />
        <div className="text">
          <div className="kick">
            <img className="tile" src={art.tile.at(-1)!.url} srcSet={srcSet(art.tile)} sizes={TILE_SIZES} width={120} height={120} alt="" loading={eager ? undefined : "lazy"} />
            <span>
              {guide.game}
              <span className="pub"> · {guide.publisher}</span>
            </span>
          </div>
          <h3>
            <a href={guide.home}>{guide.mark}</a>
          </h3>
          {guide.goals.length > 0 && <p className="goals">{guide.goals.join(", ")}</p>}
          <div className="row">
            <span className="btn" aria-hidden="true">
              Open {guide.mark}
              <Arrow />
            </span>
            <span className="meta">
              {guide.chapters} chapters · {guide.rows} checks
            </span>
          </div>
        </div>
      </div>
    </li>
  );
};

/** The page: what hundo is, then every guide. */
export const Home = ({ guides, art }: { guides: Guide[]; art: Record<string, GuideArt> }) => (
  <>
    <header className="top wrap">
      <Logo href="/" />
    </header>
    <main>
      <section className="hero wrap">
        <h1>Every last check, one chapter at a time.</h1>
        <p>Spoiler-aware walkthroughs and completion checklists for single-player games, one guide per game.</p>
      </section>
      <section className="wrap" aria-label="What every guide does">
        <ul className="features">
          {features.map((feature) => (
            <li key={feature.title}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                {feature.icon}
              </svg>
              <strong>{feature.title}</strong>
              <span>{feature.text}</span>
            </li>
          ))}
        </ul>
      </section>
      <section className="wrap guides" aria-labelledby="guides">
        <div className="bar">
          <h2 id="guides">
            {guides.length} {guides.length === 1 ? "guide" : "guides"} <span>· A to Z by game</span>
          </h2>
          {/* Shown by find.ts: without the script there is nothing to type into. */}
          <div className="find" data-find hidden>
            <label htmlFor="find">Find</label>
            <input id="find" type="search" placeholder="Game or guide" autoComplete="off" spellCheck={false} />
          </div>
        </div>
        <p className="status" role="status" data-find-status />
        <ul className="worlds">
          {guides.map((guide, index) => (
            <Band key={guide.folder} guide={guide} art={art[guide.folder]} eager={index < 2} />
          ))}
        </ul>
      </section>
    </main>
    <Footer />
  </>
);

/** The page Vercel answers an unknown path with (vercel.json). */
export const NotFound = () => (
  <>
    <header className="top wrap">
      <Logo href="/" />
    </header>
    <main className="hero wrap lost">
      <h1>Nothing here.</h1>
      <p>Each guide lives at its own address. The list of them is on the front page.</p>
      <p>
        <a className="back" href="/">
          See every guide
        </a>
      </p>
    </main>
    <Footer />
  </>
);
