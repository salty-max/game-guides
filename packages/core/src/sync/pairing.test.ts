import { brand } from "../guide";
import { startCode, claimCode } from "./pairing";

const IPHONE = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.7 Mobile/15E148 Safari/604.1";

const standalone = (on: boolean) =>
  vi.spyOn(window, "matchMedia").mockImplementation(((query: string) => ({ matches: on && query.includes("standalone"), media: query, addEventListener() {}, removeEventListener() {} })) as unknown as typeof window.matchMedia);

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("the label a device links with", () => {
  const send = async (call: () => Promise<unknown>) => {
    const fetched = vi.fn(async () => new Response(JSON.stringify({ code: "123456", linked: false }), { status: 200 }));
    vi.stubGlobal("fetch", fetched);
    await call();
    return JSON.parse(String((fetched.mock.calls[0] as unknown as [string, RequestInit])[1].body)).label as string;
  };

  it("names the guide's app when the guide is installed, both when showing a code and when typing one", async () => {
    vi.spyOn(navigator, "userAgent", "get").mockReturnValue(IPHONE);
    standalone(true);
    expect(await send(() => startCode())).toBe(`Safari · iPhone · ${brand.shortName} app`);
    expect(await send(() => claimCode("123456"))).toBe(`Safari · iPhone · ${brand.shortName} app`);
  });

  it("doesn't name the guide for an installed app where it shares its browser's cookies, which is one device with the tab", async () => {
    vi.spyOn(navigator, "userAgent", "get").mockReturnValue("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0");
    standalone(true);
    expect(await send(() => startCode())).toBe("Edge · Windows · installed app");
  });

  it("is just the browser and the system in a tab", async () => {
    vi.spyOn(navigator, "userAgent", "get").mockReturnValue(IPHONE);
    standalone(false);
    expect(await send(() => startCode())).toBe("Safari · iPhone");
  });
});
