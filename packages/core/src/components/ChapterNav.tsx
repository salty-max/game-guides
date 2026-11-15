import { cva } from "class-variance-authority";
import { Button, LinkButton } from "./ui";
import { CHAPTER_COUNT } from "../guide";
import { useReveal } from "../useReveal";
import { isOpen, useProgress } from "../store/progress";

// Under a checklist route it follows the last group; at the end of an article it is set off from the last section by a rule.
const chapterNav = cva("flex flex-wrap justify-between gap-2.5", {
  variants: { in: { route: "mt-[19px]", article: "mt-8 border-t border-line pt-5" } },
  defaultVariants: { in: "route" },
});

/** The end of a chapter: back to the one before, and on to the next (revealing it first if it is hidden), or to the progress page after the last. */
export function ChapterNav({ chapter, in: place }: { chapter: number; in?: "route" | "article" }) {
  const nextOpen = useProgress((s) => isOpen(s.data, chapter + 1));
  const reveal = useReveal();
  return (
    <nav className={chapterNav({ in: place })} aria-label="Chapter navigation">
      <span>
        {chapter > 1 && (
          <LinkButton to={`/guide/${chapter - 1}`} icon="left">
            Previous chapter
          </LinkButton>
        )}
      </span>
      {chapter === CHAPTER_COUNT ? (
        <LinkButton to="/dashboard" look="" icon="chart">
          View progress
        </LinkButton>
      ) : nextOpen ? (
        <LinkButton to={`/guide/${chapter + 1}`} look="" icon="arrow">
          Next chapter
        </LinkButton>
      ) : (
        <Button look="" icon="unlock" onClick={() => reveal(chapter + 1)}>
          Reveal next chapter
        </Button>
      )}
    </nav>
  );
}
