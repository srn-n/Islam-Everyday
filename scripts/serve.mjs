#!/usr/bin/env node
// Islam Everyday local server: static files only, no dependencies, no caching.
// Usage: npm start            -> http://localhost:8090
//        PORT=9000 npm start   -> http://localhost:9000
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));
export const DEFAULT_PORT = 8090;
const TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".json": "application/json; charset=utf-8", ".webmanifest": "application/manifest+json",
  ".png": "image/png", ".svg": "image/svg+xml", ".ico": "image/x-icon", ".woff2": "font/woff2", ".md": "text/markdown; charset=utf-8", ".txt": "text/plain; charset=utf-8"
};

export function createAppServer(root = ROOT) {
  return createServer(async (req, res) => {
    try {
      const url = new URL(req.url, "http://localhost");
      let path = decodeURIComponent(url.pathname);
      if (path.endsWith("/")) path += "index.html";
      const file = normalize(join(root, path));
      if (file !== root && !file.startsWith(root + sep)) { res.writeHead(403).end("Forbidden"); return; }
      const st = await stat(file);
      if (!st.isFile()) throw new Error("not a file");
      const body = await readFile(file);
      // no-store: a stale tab can never keep serving an old copy of the app
      res.writeHead(200, { "Content-Type": TYPES[extname(file)] || "application/octet-stream", "Cache-Control": "no-store", "Content-Length": body.length });
      res.end(req.method === "HEAD" ? undefined : body);
    } catch {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }).end("Not found");
    }
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT) || DEFAULT_PORT;
  const server = createAppServer();
  server.on("error", err => {
    if (err.code === "EADDRINUSE") {
      console.error(`\nPort ${port} is already in use - probably another copy of Islam Everyday (or another app) is still running.\n` +
        `Stop it with Ctrl+C in its terminal, or start this one on another port:\n` +
        `  macOS/Linux:  PORT=9000 npm start\n  PowerShell:   $env:PORT=9000; npm start\n`);
      process.exit(1);
    }
    throw err;
  });
  server.listen(port, () => {
    console.log(`\nIslam Everyday is running at http://localhost:${port}\nServing: ${ROOT}\nPress Ctrl+C to stop.\n`);
  });
}
