// Copies the website into www/ for the Android app. Source: ../IslamEverydayWeb (sibling folder), or WEB_DIR=<path>.
// Only what the app loads is copied: no tests, tools, docs, git history or Vercel/service-worker files.
import { cpSync, rmSync, existsSync, readFileSync, mkdirSync, readdirSync } from "node:fs";
import { resolve, join, basename } from "node:path";
const src = resolve(process.env.WEB_DIR || process.argv[2] || "../IslamEverydayWeb"), out = resolve("www");
if (!existsSync(join(src, "index.html")) || !existsSync(join(src, "assets/app.js"))) { console.error(`Website not found at ${src}. Set WEB_DIR.`); process.exit(1); }
const SKIP = new Set([".git", ".github", ".vercel", "node_modules", "android-app", "_to_delete", "tests", "tools", "docs", "scripts", "brand", "sw.js", "vercel.json", ".vercelignore",
  "package.json", "package-lock.json", "README.md", "CHANGELOG.md", "RESEARCH.md"]);
rmSync(out, { recursive: true, force: true }); mkdirSync(out);
// entry by entry: www/ can sit inside the website folder (android-app/ in the repo), and Node refuses to copy a folder into itself
for (const e of readdirSync(src)) if (!SKIP.has(e) && !e.startsWith("stale-") && !e.endsWith(".log"))
  cpSync(join(src, e), join(out, e), { recursive: true, filter: p => !basename(p).endsWith(".log") });
const html = readFileSync(join(out, "index.html"), "utf8");
for (const need of ["assets/theme-boot.js", "assets/app.js"]) if (!html.includes(need)) { console.error("index.html does not load " + need); process.exit(1); }
if (!readFileSync(join(out, "assets/app.js"), "utf8").includes('natQ("App", "minimizeApp")')) { console.error("This website copy predates the Android changes (Nov 2026). Update IslamEverydayWeb first."); process.exit(1); }
console.log(`Copied ${src} -> www/`);
