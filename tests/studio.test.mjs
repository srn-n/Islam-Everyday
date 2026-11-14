// Simply Made Studio credit and the themed splash (October 2026).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { read, loadBrowser, exists, local } from "./helpers.mjs";

const app = read("assets/app.js"), css = read("assets/app.css"), html = read("index.html");

test("no credit under a personal name; Simply Made Studio is credited", () => {
  const files = ["index.html", ...local(["README.md"]), "manifest.webmanifest", ...readdirSync(new URL("../assets", import.meta.url)).filter(f => f.endsWith(".js")).map(f => "assets/" + f)];
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
  const op = css.slice(css.indexOf("/* ---------- Opening (Nov 2026, 14th)"));
  for (const tok of ["--r-night", "--r-twi", "--r-late", "--accent", "--ground"]) assert.ok(op.includes("var(" + tok), tok);
  assert.match(css, /\.splash\{[^}]*animation:sp-failsafe \.4s ease 12s forwards/, "never stuck if a script fails");
});

test("the splash respects reduced motion and the app's Motion off setting", () => {
  assert.match(css, /@media \(prefers-reduced-motion:reduce\)\{\n  \.splash \*\{animation:none!important;transition:none!important\}/);
  assert.match(css, /:root\[data-motion="off"\] \.splash \*\{animation:none!important;transition:none!important\}/);
  assert.match(app, /const MIN = !first \? 0 : reduce \|\| st\.motion === "off" \? 1200 : 4000;/, "a short still moment instead of the animation");
});

test("opening (14 Nov 2026): four seconds on the first open, smooth, tap to skip; later opens do not wait", () => {
  const i = app.indexOf('const sp = $("splash")'); assert.ok(i > app.indexOf("render(true);"), "after the first render");
  assert.match(app, /const MIN = !first \? 0 : reduce \|\| st\.motion === "off" \? 1200 : 4000;/, "four seconds on a cold start");
  assert.doesNotMatch(app + read("assets/theme-boot.js"), /sp-long/, "one opening, no long/short versions");
  assert.match(app, /const arm = t0 => \{ settled\.then\(\(\) => setTimeout\(go, Math\.max\(0, MIN - \(performance\.now\(\) - t0\)\)\)\); setTimeout\(go, MIN \+ 1200\); \};/, "the door waits for fonts and the verse, with a failsafe");
  assert.match(app, /if \(!NATIVE\) \{ if \(sp\) arm\(0\); return; \}/);
  assert.match(app, /sp\.classList\.add\("out"\); if \(rise\) \{ v\.classList\.remove\("hold"\); v\.classList\.add\("enter"\); \}/, "the page rises in the same frame as the door opens");
  assert.match(app, /sp\.addEventListener\("pointerdown", go\); addEventListener\("keydown", go, \{ once: true \}\)/, "tap or key skips it");
  assert.match(css, /\.sp-bar i\{[^}]*animation:sp-bar 4s linear forwards\}/, "the bar fills over the four seconds");
  // smooth: only opacity and transform are animated (no letter-spacing, background movement or SVG internals)
  const op = css.slice(css.indexOf("/* ---------- Opening (Nov 2026, 14th)"));
  const frames = [...op.matchAll(/@keyframes sp-[a-z0-9]+\{([^@]*?)\}\n/g)].map(m => m[1]).join(" ");
  const props = [...frames.matchAll(/([a-z-]+):/g)].map(m => m[1]).filter(p => !["opacity", "transform", "visibility", "pointer-events", "background-color"].includes(p));
  assert.deepEqual([...new Set(props)], []);
  assert.doesNotMatch(html.slice(html.indexOf('id="splash"'), html.indexOf("<aside")), /<(circle|g|clipPath|linearGradient|radialGradient)\b/, "the doorway SVG is a still drawing");
  // the app's background work waits until the opening has finished
  assert.match(app, /const nfSync = \(\) => \{ clearTimeout\(nfT\); nfT = setTimeout\(afterSplash\(nfRun\), 500\); \};/);
  assert.match(app, /wgT = setTimeout\(afterSplash\(widgetRun\), 1200\)/);
});

test("How to pray is gone: no page, no menu entry, no link, no files", () => {
  assert.doesNotMatch(app, /vPray|IE_SALAH|data-sub="pray"|"prayfig"|salah-3d|pray-seek/);
  assert.doesNotMatch(app, /const SUBS = \[[^\]]*"pray"/);
  for (const f of ["assets/salah.js", "assets/salah-fig.js", "assets/salah-3d.js", "assets/figure/man.bin", "tools/prayer-figure/build.py"]) assert.ok(!exists(f), f);
  assert.doesNotMatch(read("sw.js"), /salah|figure\//);
  assert.doesNotMatch(read("assets/data.js"), /[{,]pr_[a-z_]+:|[{,]pray:"/);
  assert.doesNotMatch(css, /\.pr-video|\.pv-|\.sl-ol|v-pray/);
});

test("Prayer guide has a prayer-mat icon (the old arch read like a headstone)", () => {
  assert.match(app, /guide: '<rect x="5" y="3" width="14" height="15\.5" rx="1\.6"\/><path d="M9 12\.5V10\.2c0-1\.9 1\.5-3\.2 3-4\.4/);
  assert.doesNotMatch(app, /guide: '<path d="M5 20V10a7 7 0 0 1 14 0v10M3 20h18M12 13v7M9\.5 16h5"\/>'/);
});

test("on-demand pages show the small doorway, not a spinner", () => {
  assert.match(app, /<div class="lazy-wait" role="status"><svg class="mini-door"/);
  assert.doesNotMatch(css, /@keyframes spin\b/);
});
