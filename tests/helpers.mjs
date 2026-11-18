// Shared helpers for `npm test` (node:test, no dependencies).
import { readFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import { createRequire } from "node:module";

export const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));
export const p = (...a) => join(ROOT, ...a);
export const read = f => readFileSync(p(f), "utf8");
export const json = f => JSON.parse(read(f));
export const exists = f => existsSync(p(f));
// Nov 2026 (owner): .md files are kept on the owner's computer only, not in the repository (.gitignore). Checks on them
// run where they exist and are skipped in GitHub's build.
export const local = files => files.filter(f => !f.endsWith(".md") || existsSync(p(f)));
export const pad = n => String(n).padStart(3, "0");
export const { skeleton } = createRequire(import.meta.url)(p("tools", "arabic-skeleton.cjs"));

/* Runs browser scripts (window.* globals) in an isolated context and returns that context. */
export function loadBrowser(...files) {
  const ctx = { console };
  ctx.window = ctx; ctx.self = ctx; ctx.globalThis = ctx;
  vm.createContext(ctx);
  for (const f of files) vm.runInContext(read(f), ctx, { filename: f });
  return ctx;
}
let meta;
export const quranMeta = () => meta || (meta = loadBrowser("assets/quran-meta.js").QURAN_META);

/* 18 Nov 2026: index.html loads the app's scripts through assets/boot-load.js (so the opening is already playing when
   they run). For checks about which scripts the page loads and in what order, this is index.html with that list
   written out as the <script> tags it stands for, right after the loader's own tag. */
export function pageHtml() {
  const html = read("index.html"), L = JSON.parse(read("assets/boot-load.js").match(/var L = (\[[^\]]*\])/)[1]);
  const tag = '<script src="assets/boot-load.js"></script>';
  return html.replace(tag, tag + L.map(s => `<script src="${s}"></script>`).join(""));
}
