// Security hardening checks (October 2026 audit).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const read = p => readFileSync(root + p, "utf8");

test("Vercel sends a strict CSP and the standard security headers on every path", () => {
  const cfg = JSON.parse(read("vercel.json"));
  const all = cfg.headers.find(h => h.source === "/(.*)");
  assert.ok(all, "catch-all header rule");
  const H = Object.fromEntries(all.headers.map(h => [h.key.toLowerCase(), h.value]));
  const csp = H["content-security-policy"];
  assert.ok(csp, "CSP present");
  const dir = name => (csp.split(";").map(s => s.trim()).find(s => s.startsWith(name + " ")) || "");
  assert.equal(dir("script-src"), "script-src 'self'", "scripts only from this site, no inline or eval");
  assert.match(dir("frame-ancestors"), /'none'/);
  assert.match(dir("object-src"), /'none'/);
  assert.match(dir("base-uri"), /'none'/);
  assert.doesNotMatch(csp, /unsafe-eval/);
  assert.equal(H["x-content-type-options"], "nosniff");
  assert.equal(H["x-frame-options"], "DENY");
  assert.ok(H["referrer-policy"]);
  assert.match(H["permissions-policy"], /geolocation=\(self\)/);
});

test("the page has no inline scripts or inline event handlers (required by script-src 'self')", () => {
  const html = read("index.html");
  assert.doesNotMatch(html, /<script(?![^>]*\ssrc=)[^>]*>/i, "no inline <script>");
  for (const f of ["index.html", ...readdirSync(root + "assets").filter(f => f.endsWith(".js")).map(f => "assets/" + f)]) {
    assert.doesNotMatch(read(f), /<[a-z][^>]*\son(click|load|error|mouseover|focus|input|change|submit)\s*=/i, f + " has no inline handlers");
    assert.doesNotMatch(read(f), /\beval\(|new Function\(/, f + " uses no eval");
  }
});

test("every link stored in the app's data is an https URL", () => {
  const bad = [];
  for (const f of readdirSync(root + "assets").filter(f => f.endsWith(".js"))) {
    const s = read("assets/" + f);
    for (const m of s.matchAll(/\b(?:url|link|href)\s*:\s*["'`]([^"'`]+)["'`]/g)) if (!m[1].startsWith("<") /* SVG icon markup keyed "link" */ && !/^https:\/\//.test(m[1])) bad.push(f + ": " + m[1]);
  }
  assert.deepEqual(bad, []);
});

test("the HTML escaper also escapes single quotes", () => {
  const src = read("assets/app.js").match(/const esc = s => [^\n]+/)[0];
  const esc = new Function(src.replace("const esc = ", "return "))();
  assert.equal(esc(`<a href='x' title="y">&`), "&lt;a href=&#39;x&#39; title=&quot;y&quot;&gt;&amp;");
});

test("the service worker only stores the real app shell as index.html", () => {
  const sw = read("sw.js");
  assert.match(sw, /isShell/);
  assert.match(sw, /text\/html/);
  assert.doesNotMatch(sw, /const key = r\.mode === "navigate" \? "index\.html" : r;\s*\n\s*e\.respondWith\(fetch\(r\)\.then\(res => \{ if \(res\.ok\)/, "old unconditional shell overwrite is gone");
});

test("development folders are not published", () => {
  const ign = read(".vercelignore").split(/\r?\n/).map(s => s.trim());
  for (const d of ["tests/", "tools/", "scripts/"]) assert.ok(ign.includes(d), d);
});

test("a closed sheet is inert, so keyboard focus cannot reach its off-screen content", () => {
  assert.match(read("index.html"), /id="sheet"[^>]*\sinert[\s>]/);
  const js = read("assets/app.js");
  assert.match(js, /sh\.inert = false; sh\.classList\.add\("on"\)/);
  assert.match(js, /sh\.setAttribute\("aria-hidden", "true"\); sh\.inert = true;/);
});
