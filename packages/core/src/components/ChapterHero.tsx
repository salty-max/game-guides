import type { ReactNode } from "react";
import { CHAPTER_COUNT } from "../guide";
import { two } from "../format";
import type { Chapter } from "../types";

/**
 * The top of a chapter: a tint from the guide's palette with the chapter's banner fading in on the right, its number, region, title and
 * intro, and `children`, the buttons under them. Up to 1050px wide the banner stacks above the words and fades into the card at its
 * foot, as it fades at its left beside them; on a phone the intro goes. The banner is 3:1, as its stacked frame is, so nothing is cut.
 */
export function ChapterHero({ chapter, banner, children }: { chapter: Chapter; banner?: string; children: ReactNode }) {
  return (
    <section className="relative isolate flex min-h-[245px] items-center overflow-hidden rounded-hero border border-line bg-[linear-gradient(120deg,var(--hero-from),var(--hero-to))] px-[clamp(23px,4vw,49px)] py-[22px] stack:block stack:min-h-0 stack:p-0 phone:rounded-card">
      {banner && (
        <img
          className="absolute top-0 right-0 -z-1 h-full w-[68%] mask-[linear-gradient(to_right,transparent_9%,#000_66%)] object-cover object-[76%_center] stack:static stack:block stack:aspect-3/1 stack:h-auto stack:w-full stack:mask-[linear-gradient(to_top,transparent_4%,#000_62%)]"
          src={banner}
          alt=""
          width={1800}
          height={600}
          fetchPriority="high"
        />
      )}
      <div className="w-[59%] max-w-[560px] stack:w-full stack:max-w-none stack:px-[clamp(18px,4vw,38px)] stack:py-5 phone:px-3.5 phone:py-4">
        <div className="mb-2 flex flex-wrap items-center gap-2.5 text-[13px] font-bold">
          <span className="rounded-tag bg-ink px-2.5 py-1 text-[11px] font-extrabold tracking-[0.14em] text-paper uppercase">
            Chapter {two(chapter.id)} / {two(CHAPTER_COUNT)}
          </span>
          <span>{chapter.region}</span>
        </div>
        <h1 className="mb-2.5 font-display text-[clamp(38px,5vw,62px)] leading-[1.02] font-bold tracking-[-0.02em] phone:mb-1.5 phone:text-[34px]">{chapter.title}</h1>
        <p className="max-w-[450px] text-[15px] leading-[1.6] phone:hidden">{chapter.intro}</p>
        {/* On a phone the buttons keep narrower sides: Button reads the variable. */}
        <div className="mt-4 flex flex-wrap gap-2 phone:mt-2.5 phone:[--button-px:10px]">{children}</div>
      </div>
    </section>
  );
}
