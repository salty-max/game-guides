// @vitest-environment node
import { describe, expect, it } from "vitest";

// Every spacing in core is on one scale (docs/core.md, Spacing): Tailwind's whole steps (4px apart at the default 16px), the half steps
// 0.5 to 3.5 (2, 6, 10 and 14px) and `px` for a hairline. A step inside a calc(), a clamp() or a variable's fallback is written in rem,
// and is one of those too, and so is a variable that holds a spacing. This reads core's source and stylesheets as text rather than leaving
// it to lint: lint here checks no scale, and it never sees a stylesheet, a spacing variable or a length inside a calc() or a clamp().
const sources = import.meta.glob(["./**/*.{ts,tsx,css}", "!./**/*.test.{ts,tsx}"], { query: "?raw", import: "default", eager: true }) as Record<string, string>;

// A utility that takes a spacing, after any variants (`phone:`, `[&_svg]:`), with its value.
const spacing = /^(?:[^\s:]+:)*-?(?:[mp][trblxyse]?|gap(?:-[xy])?|space-[xy]|inset(?:-[xy])?|top|right|bottom|left|start|end|scroll-[mp][trblxyse]?)-(.+)$/;
// The variables that hold a spacing, set in a class (`drawer:[--pad-end:2rem]`) or in tokens.css. The frame's gutter (a `vw` clamp) and
// the sizes (`--icon-w`) aren't steps.
const spacingVariable = /--(?:pad-end|button-px|sticky-gap):\s*([^\];\s]+)/g;
const onScale = (px: number) => px % 4 === 0 || [2, 6, 10, 14].includes(px);

/** Why the lengths in a calc(), a clamp(), a fallback or a variable's value are off the scale, or nothing. */
function offScaleLengths(value: string): string | undefined {
  // (a variable's name goes first: its digits aren't a length, and what follows a `-` that isn't part of one is a length subtracted)
  const lengths = value.replace(/--[\w-]+/g, "");
  for (const [, n] of lengths.matchAll(/(?<![\w.])(\d*\.?\d+)rem/g)) if (!onScale(Number(n) * 16)) return `${n}rem is no step`;
  for (const [, n] of lengths.matchAll(/(?<![\w.])(\d*\.?\d+)px/g)) if (Number(n) > 1) return `${n}px: write the step in rem`;
}

/** Why a class is off the scale, or nothing. */
function offScale(token: string): string | undefined {
  const value = spacing.exec(token)?.[1];
  if (!value) return;
  if (/^\d*\.(?:25|75)\b/.test(value)) return "a quarter step";
  if (/^(?:[4-9]|\d{2,})\.5\b/.test(value)) return "a half step above 4";
  if (/^\[-?[\d.]+(?:px|rem|em)\]/.test(value)) return "a length of its own: use a step";
  if (/^[[(]/.test(value)) return offScaleLengths(value);
}

/** Each spacing variable a text sets off the scale, with why. Read over the whole text, not its words: `--x: 1.5rem` has a space. */
const variablesOffScale = (text: string) =>
  [...text.matchAll(spacingVariable)].flatMap(([set, value]) => {
    const why = offScaleLengths(value);
    return why ? [`${set} (${why})`] : [];
  });

describe("spacing", () => {
  it("tells a step from a one-off", () => {
    const off = [
      "mt-3.25",
      "gap-[13px]",
      "phone:pl-4.25",
      "mb-6.5",
      "-mx-0.75",
      "px-[clamp(1.4375rem,5cqi,3rem)]",
      "pt-[calc(0.9375rem+var(--safe-top))]",
      "top-[calc(var(--bar)-0.8125rem)]",
      "pl-[calc(var(--safe-left)-13px)]",
      "px-(--button-px,1.125rem)",
    ];
    const on = [
      "mt-3",
      "gap-2.5",
      "py-0.5",
      "-mx-(--gutter)",
      "gap-px",
      "mt-auto",
      "ps-check-indent",
      "px-[calc(1rem+var(--safe-left))]",
      "gap-[clamp(1.5rem,5.4cqi,4rem)]",
      "top-[var(--vv-top,0px)]",
      "inset-shadow-[0_0_0_100vmax_transparent]",
      "items-end",
      "text-left",
    ];
    expect(off.filter((token) => !offScale(token))).toEqual([]);
    expect(on.filter((token) => offScale(token))).toEqual([]);
    const offSet = ["drawer:[--pad-end:1.875rem]", "phone:[--button-px:0.6875rem]", "--sticky-gap:1.4rem;", "--sticky-gap: 1.4rem;"];
    const onSet = ["drawer:[--pad-end:2rem]", "--sticky-gap:1.5rem;", "--sticky-gap: 1.5rem;", "[--gutter:clamp(0.75rem,3.25vw,3.3125rem)]", "[--icon-w:2.75rem]"];
    expect(offSet.filter((text) => !variablesOffScale(text).length)).toEqual([]);
    expect(onSet.filter((text) => variablesOffScale(text).length)).toEqual([]);
  });

  it("holds every spacing in core to the scale", () => {
    // (read, not empty: a glob that matched nothing, or a stylesheet that loaded empty, would pass)
    expect(Object.keys(sources).length).toBeGreaterThan(50);
    expect(sources["./components/ui.tsx"]).toContain("gap-");
    expect(sources["./tokens.css"]).toContain("--sticky-gap:");
    const found = Object.entries(sources).flatMap(([file, text]) => [
      ...text.split(/[\s"'`{}]+/).flatMap((token) => {
        const why = offScale(token);
        return why ? [`${file}: ${token} (${why})`] : [];
      }),
      ...variablesOffScale(text).map((set) => `${file}: ${set}`),
    ]);
    expect(found).toEqual([]);
  });
});
