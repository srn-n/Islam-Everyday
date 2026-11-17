// 16 Nov 2026 (Notion): smoother section changes and a smoother landing.
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const app = readFileSync(new URL("../assets/app.js", import.meta.url), "utf8");
const css = readFileSync(new URL("../assets/app.css", import.meta.url), "utf8");

test("page slides: the header and tab bar names are always set; the direction lives on the snapshots only", () => {
  assert.match(css, /\n#top\{view-transition-name:ie-top\}\nnav\.tabs\{view-transition-name:ie-tabs\}/);
  assert.match(css, /html\[data-vt="right"\]::view-transition-old\(root\),html\[data-vt="right"\]::view-transition-new\(root\)\{--vtx:-1\}/);
  assert.doesNotMatch(css, /html\[data-vt[^\]]*\]\{--vtx/, "a custom property on the root restyled the whole page on every change");
  assert.match(css, /@keyframes vt-in\{from\{opacity:0;transform:translateX\(calc\(var\(--vtx,1\)/);
});

test("phones read the Qur'an and Hadith page data when idle after the opening, never during it or on a data saver", () => {
  assert.match(app, /else if \(!\(navigator\.connection && navigator\.connection\.saveData\)\) \{/);
  assert.match(app, /const pre = \["study", "hadith"\]/);
  assert.match(app, /setTimeout\(afterSplash\(\(\) => setTimeout\(nextPre, 2500\)\), 600\)/);
});

test("landing: the faded splash stays hidden in the page until the rise and the arc are done", () => {
  assert.match(app, /const splashUp = \(\) => \{ const s = \$\("splash"\); return !!s && !s\.classList\.contains\("gone"\); \};/);
  assert.match(app, /!document\.hidden && !splashUp\(\);/, "page slides work again as soon as the splash has faded");
  assert.match(app, /if \(splashUp\(\)\) \{ shut\(\); return; \}/, "Back right after the landing still goes back");
});


test("17 Nov (owner, Notion): the tracker's date picker is the app's own month grid, Monday to Sunday, in the theme", () => {
  assert.doesNotMatch(app, /type="date"/, "no browser or Android date dialog");
  assert.match(app, /lead = \(first\.getUTCDay\(\) \+ 6\) % 7; \/\/ Monday first\n  const loc = calLoc\(\), wdf/);
  assert.match(app, /case "tcal": tCalM = null; openSheet\(tCalHtml\(\), b, "pop"\); break;/);
  for (const v of ["--accent", "--on-accent", "--ink", "--muted"]) assert.match(css.slice(css.indexOf(".dp-grid")), new RegExp(`var\\(${v}\\)`));
  assert.doesNotMatch(css, /#[0-9a-f]{6}/i.source && /\.dp-c[^{]*\{[^}]*#[0-9a-fA-F]{3,6}/, "theme colours only");
});
