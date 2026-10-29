// Simply Made Studio credit and the themed splash (October 2026).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { read, loadBrowser } from "./helpers.mjs";

const app = read("assets/app.js"), css = read("assets/app.css"), html = read("index.html");

test("no credit under a personal name; Simply Made Studio is credited", () => {
  const files = ["index.html", "README.md", "manifest.webmanifest", ...readdirSync(new URL("../assets", import.meta.url)).filter(f => f.endsWith(".js")).map(f => "assets/" + f)];
  for (const f of files) assert.doesNotMatch(read(f), /Samiur|সামিউর/, f);
  assert.match(app, /© \$\{num\(2026\)\} Simply Made Studio/);
  const LG = loadBrowser("assets/legal.js").IE_LEGAL;
  for (const l of ["en", "bn"]) for (const doc of [LG.PRIVACY[l], LG.TERMS[l]]) assert.ok(JSON.stringify(doc).includes("Simply Made Studio"), l);
  const { I18N } = loadBrowser("assets/data.js").DINSATHI;
  assert.match(I18N.en.lg_by, /Simply Made Studio/); assert.match(I18N.bn.lg_by, /Simply Made Studio/);
});

test("the splash is in the page itself, themed, and needs no script to play", () => {
  assert.match(html, /<div class="splash" id="splash" aria-hidden="true">/);
  assert.ok(html.indexOf('id="splash"') < html.indexOf('<script src="assets/quran-meta.js"'), "splash is painted before the scripts load");
  assert.doesNotMatch(html, /class="boot"|class="spin"/);
  for (const tok of ["--r-night", "--r-twi", "--r-late", "--accent", "--ground"]) assert.ok(css.slice(css.indexOf("/* Splash (Oct 2026)")).includes("var(" + tok), tok);
  assert.match(css, /\.splash\{[^}]*animation:sp-failsafe \.4s ease 12s forwards/, "never stuck if a script fails");
});

test("the splash respects reduced motion and the app's Motion off setting", () => {
  assert.match(css, /@media \(prefers-reduced-motion:reduce\)\{\.splash \*\{animation:none!important\}/);
  assert.match(css, /:root\[data-motion="off"\] \.splash \*\{animation:none!important\}/);
  assert.match(app, /const still = reduce \|\| document\.documentElement\.getAttribute\("data-motion"\) === "off";/);
});

test("the splash leaves after the first screen; only the first open in a session waits for dawn", () => {
  const i = app.indexOf('const sp = $("splash")'); assert.ok(i > app.indexOf("render(true);"), "after the first render");
  assert.match(app, /first && !still \? Math\.max\(0, 1600 - performance\.now\(\)\) : 0/);
  assert.match(app, /sp\.classList\.add\("out"\); setTimeout\(\(\) => sp\.remove\(\), 700\)/);
});

test("on-demand pages show the small doorway, not a spinner", () => {
  assert.match(app, /<div class="lazy-wait" role="status"><svg class="mini-door"/);
  assert.doesNotMatch(css, /@keyframes spin\b/);
});
