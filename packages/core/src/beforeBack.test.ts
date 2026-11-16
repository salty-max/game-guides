import { act, renderHook } from "@testing-library/react";
import { useBeforeBack } from "./beforeBack";
import main from "./main.tsx?raw";

describe("before Back", () => {
  it("runs ahead of the listeners added after the guide loads, like the router's, and only while asked to", () => {
    const heard: string[] = [];
    const router = () => heard.push("router");
    // The router listens from the start; a sheet asks to hear Back only once it's open, later.
    addEventListener("popstate", router);
    const { rerender } = renderHook(({ on }) => useBeforeBack(() => heard.push("before back"), on), { initialProps: { on: true } });
    act(() => void dispatchEvent(new PopStateEvent("popstate")));
    rerender({ on: false });
    act(() => void dispatchEvent(new PopStateEvent("popstate")));
    removeEventListener("popstate", router);
    expect(heard).toEqual(["before back", "router", "router"]);
  });

  it("is listening before the router is: main.tsx imports it ahead of the app", () => {
    const imports = [...main.matchAll(/^import .*["'](.+)["'];$/gm)].map(([, from]) => from);
    expect(imports.indexOf("./beforeBack")).toBeGreaterThanOrEqual(0);
    expect(imports.indexOf("./beforeBack")).toBeLessThan(imports.indexOf("./App"));
  });
});
