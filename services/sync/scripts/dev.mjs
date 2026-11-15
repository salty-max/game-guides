// Runs src/dev.ts through Vite's module loader, so the TypeScript and its extensionless imports work without a build.
import { createServer } from "vite";

const vite = await createServer({
  configFile: false,
  root: new URL("..", import.meta.url).pathname,
  appType: "custom",
  logLevel: "error",
  server: { middlewareMode: true, hmr: false, watch: null },
});
const { startDev } = await vite.ssrLoadModule("/src/dev.ts");
startDev(Number(process.env.PORT ?? 8787));
