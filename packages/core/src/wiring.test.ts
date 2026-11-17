// @vitest-environment node
import { existsSync, readdirSync, readFileSync } from "node:fs";

// Where a guide has to be listed outside its own folder, held to the folders in apps/: a guide forgotten in one of these ships ungated or
// can't be started. A guide is a folder with a vercel.json (as lighthouse/run.mjs and deploy.test.ts count them). Held elsewhere:
// the sync API's GUIDES (services/sync/src/project.test.ts) and Storybook's (packages/stories/src/guides.test.ts). docs/adding-a-guide.md#4-wire-it-into-the-repository
const root = `${process.env.GUIDE_ROOT}/../..`;
const apps = `${root}/apps`;
const guides = readdirSync(apps).filter((name) => existsSync(`${apps}/${name}/vercel.json`));
const packageOf = (guide: string): string => JSON.parse(readFileSync(`${apps}/${guide}/package.json`, "utf8")).name;

describe("every guide is wired in", () => {
  it("finds the guides to hold", () => {
    expect(guides.length).toBeGreaterThan(0);
  });

  it("is audited by CI's lighthouse job, whose matrix is one literal line", () => {
    // (a guide left out of it ships with no performance or accessibility gate)
    const matrix = /^\s*guide:\s*\[([^\]]*)\]/m.exec(readFileSync(`${root}/.github/workflows/ci.yml`, "utf8"));
    expect(matrix, "a `guide: [a, b]` line in the lighthouse job's matrix in .github/workflows/ci.yml").toBeTruthy();
    const listed = matrix![1].split(",").map((name) => name.trim()).filter(Boolean);
    expect(listed.sort(), "the lighthouse matrix in .github/workflows/ci.yml").toEqual([...guides].sort());
  });

  describe(".claude/launch.json", () => {
    const configurations: { name: string; runtimeArgs: string[]; port: number }[] = JSON.parse(readFileSync(`${root}/.claude/launch.json`, "utf8")).configurations;
    const entry = (name: string) => {
      const found = configurations.find((configuration) => configuration.name === name);
      expect(found, `a "${name}" entry in .claude/launch.json`).toBeDefined();
      return found!;
    };

    it("has a dev server and a production preview for each guide, on its package", () => {
      for (const guide of guides) {
        const dev = entry(guide);
        expect(dev.runtimeArgs.slice(0, 2), `${guide}: filter`).toEqual(["--filter", packageOf(guide)]);
        expect(dev.runtimeArgs.slice(-3), `${guide}: port`).toEqual(["--port", String(dev.port), "--strictPort"]);
        const preview = entry(`${guide}-preview`);
        const [, script] = preview.runtimeArgs;
        expect(script, `${guide}-preview: build`).toContain(`pnpm --filter ${packageOf(guide)} build`);
        expect(script, `${guide}-preview: preview`).toContain(`pnpm --filter ${packageOf(guide)} preview --port \${PORT:-${preview.port}} --strictPort`);
      }
    });

    it("gives no two servers the same port", () => {
      const ports = configurations.map((configuration) => configuration.port);
      expect(new Set(ports).size, `ports ${ports.join(", ")}`).toBe(ports.length);
    });
  });

  it("is a row of the root README's table of apps, with its Vercel project", () => {
    const readme = readFileSync(`${root}/README.md`, "utf8");
    for (const guide of guides) {
      expect(readme, guide).toMatch(new RegExp(`^\\| \\[\`apps/${guide}\`\\]\\(apps/${guide}\\) .* \\| ${packageOf(guide)} \\|$`, "m"));
    }
  });
});
