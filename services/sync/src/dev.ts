import { createServer, type Server } from "node:http";
import { handle } from "./app";
import { MemoryStore } from "./store";

/** The API on a local port with an in-memory store, for the guides' dev servers to proxy /api to. Data is lost on restart. */
export function startDev(port = 8787): Server {
  const deps = { store: new MemoryStore(), now: Date.now, salt: "dev", spent: new Set<string>() };
  const server = createServer(async (req, res) => {
    const chunks: Buffer[] = [];
    for await (const chunk of req) chunks.push(chunk as Buffer);
    const headers = new Headers();
    for (const [name, value] of Object.entries(req.headers)) if (value !== undefined) headers.set(name, Array.isArray(value) ? value.join(", ") : value);
    const bodyless = req.method === "GET" || req.method === "HEAD";
    const request = new Request(`http://${req.headers.host ?? "localhost"}${req.url}`, { method: req.method, headers, body: bodyless ? undefined : Buffer.concat(chunks) });
    const response = await handle(request, deps);
    res.statusCode = response.status;
    response.headers.forEach((value, name) => name !== "set-cookie" && res.setHeader(name, value));
    const cookies = response.headers.getSetCookie();
    if (cookies.length) res.setHeader("set-cookie", cookies);
    res.end(await response.text());
  });
  server.listen(port, "127.0.0.1", () => console.log(`hundo sync API on http://127.0.0.1:${port} (in-memory store)`));
  return server;
}
