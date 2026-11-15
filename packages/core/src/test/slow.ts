import { configure } from "@testing-library/react";

/**
 * For a test file that mounts React in jsdom. A mount costs 0.1 to 0.4 s alone, and ten to thirty times that when the
 * machine is busy (several checks running at once), which is more than Vitest's 5 s and Testing Library's 1 s waits.
 * Those timeouts only catch a hang, so such a file gets room. Call it at the top of the file, before its tests are declared.
 */
export const allowSlowMounts = () => {
  vi.setConfig({ testTimeout: 60_000 });
  configure({ asyncUtilTimeout: 30_000 });
};
