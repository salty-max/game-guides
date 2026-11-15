import { browserOf, deviceLabel, isApple } from "./label";

const agents = {
  iphoneSafari: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.7 Mobile/15E148 Safari/604.1",
  iphoneChrome: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/140.0.0.0 Mobile/15E148 Safari/604.1",
  macBrave: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
  winChrome: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
  winEdge: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36 Edg/140.0.0.0",
  androidChrome: "Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36",
  androidFirefox: "Mozilla/5.0 (Android 15; Mobile; rv:140.0) Gecko/140.0 Firefox/140.0",
  macSafari: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.7 Safari/605.1.15",
};

describe("deviceLabel", () => {
  it("names the browser and the system", () => {
    expect(deviceLabel(agents.iphoneSafari)).toBe("Safari · iPhone");
    expect(deviceLabel(agents.iphoneChrome)).toBe("Chrome · iPhone");
    expect(deviceLabel(agents.macBrave)).toBe("Chrome · Mac");
    expect(deviceLabel(agents.winChrome)).toBe("Chrome · Windows");
    expect(deviceLabel(agents.winEdge)).toBe("Edge · Windows");
    expect(deviceLabel(agents.androidChrome)).toBe("Chrome · Android");
    expect(deviceLabel(agents.androidFirefox)).toBe("Firefox · Android");
    expect(deviceLabel(agents.macSafari)).toBe("Safari · Mac");
  });

  it("says when it is an installed app, and still gives something for an agent it doesn't know", () => {
    expect(deviceLabel(agents.iphoneSafari, true)).toBe("Safari · iPhone · installed app");
    expect(deviceLabel("")).toBe("Browser");
  });
});

describe("deviceLabel for an installed app", () => {
  it("says which guide's app it is, since each installed guide is a device of its own", () => {
    expect(deviceLabel(agents.iphoneSafari, true, 5, "Koholint")).toBe("Safari · iPhone · Koholint app");
    expect(deviceLabel(agents.winEdge, true, 0, "RDR")).toBe("Edge · Windows · RDR app");
    expect(deviceLabel(agents.macSafari, false, 0, "Koholint")).toBe("Safari · Mac");
  });

  it("keeps to what the server keeps, 40 characters, for every browser and system and every guide's name", () => {
    const longest = [
      "Mozilla/5.0 (Linux; Android 15; SM-S921B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/27.0 Chrome/125.0.0.0 Mobile Safari/537.36",
      "Mozilla/5.0 (X11; CrOS x86_64 14541.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
      "Mozilla/5.0 (Linux; Android 15) AppleWebKit/537.36 (KHTML, like Gecko) OPR/80.0.0.0 Mobile Safari/537.36",
      ...Object.values(agents),
    ];
    for (const ua of longest) for (const app of ["Koholint", "RDR", "Echoes"]) expect(deviceLabel(ua, true, 5, app).length, `${ua} ${app}`).toBeLessThanOrEqual(40);
  });
});

describe("isApple", () => {
  it("knows an iPhone, an iPad, and an iPad that says it is a Mac, but not a Mac", () => {
    expect(isApple(agents.iphoneSafari, 5)).toBe(true);
    expect(isApple("Mozilla/5.0 (iPad; CPU OS 18_7 like Mac OS X) AppleWebKit/605.1.15 Version/18.7 Mobile/15E148 Safari/604.1", 5)).toBe(true);
    expect(isApple(agents.macSafari, 5)).toBe(true);
    expect(isApple(agents.macSafari, 0)).toBe(false);
    expect(isApple(agents.winChrome, 0)).toBe(false);
  });

  it("labels an iPad that says it is a Mac as an iPad", () => {
    expect(deviceLabel(agents.macSafari, false, 5)).toBe("Safari · iPad");
  });

  it("knows the iPhone browsers by what they are, and not as Safari", () => {
    for (const [ua, name] of [
      [agents.iphoneChrome, "Chrome"],
      [agents.iphoneSafari, "Safari"],
      ["Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) EdgiOS/140.0.0.0 Mobile/15E148 Safari/605.1.15", "Edge"],
      ["Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/140.0 Mobile/15E148 Safari/605.1.15", "Firefox"],
      ["Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) OPiOS/16.0.15 Mobile/15E148 Safari/9537.53", "Opera"],
    ] as const) expect(browserOf(ua), ua).toBe(name);
    expect(deviceLabel(agents.macSafari, false, 0)).toBe("Safari · Mac");
  });
});
