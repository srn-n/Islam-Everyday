// 19 Nov 2026 (Notion, "Up next"): status bar in the theme from the first frame, a quick opening for a reopen soon
// after last use, the website's Today boxes in even columns, "Go to the tracker" gliding instead of redrawing.
import test from "node:test";
import assert from "node:assert/strict";
import { read, exists, loadBrowser } from "./helpers.mjs";

const app = read("assets/app.js"), css = read("assets/app.css"), boot = read("assets/theme-boot.js");
const J = "android-app/android/app/src/main/java/com/simplymadestudio/islameveryday/";

test("phone status and navigation bars follow the theme from the first frame", () => {
  const ap = read(J + "AppearancePlugin.java"), ma = read(J + "MainActivity.java");
  assert.match(ap, /static void bars\(Activity a\)/);
  assert.match(ap, /c\.setAppearanceLightStatusBars\(!dark\);/); assert.match(ap, /c\.setAppearanceLightNavigationBars\(!dark\);/);
  assert.match(ap, /w\.setStatusBarColor\(android\.graphics\.Color\.TRANSPARENT\);/, "the theme's ground shows behind the bar");
  assert.equal((ma.match(/AppearancePlugin\.bars\(this\);/g) || []).length, 2, "before the first frame and after the bridge's own settings");
  assert.match(ap, /getBridge\(\)\.getWebView\(\)\.setBackgroundColor\(g\);\n\s*\} catch \(Exception ignored\) \{\}\n\s*bars\(getActivity\(\)\);/, "and when the appearance changes");
  assert.match(boot, /Capacitor\.nativePromise\("SystemBars", "setStyle", \{ style: dark \? "DARK" : "LIGHT" \}\)/, "the page sets it before app.js too");
});

test("a reopen within 30 minutes of last use gets a quick opening in the theme", () => {
  assert.match(boot, /if \(seen && Date\.now\(\) - seen < 18e5\) r\.className \+= " sp-quick";/);
  assert.match(app, /const quick = h\.classList\.contains\("sp-quick"\);/);
  assert.match(app, /localStorage\.setItem\("ie\.seen", String\(Date\.now\(\)\)\)/);
  assert.match(app, /document\.addEventListener\("visibilitychange", \(\) => \{ if \(document\.hidden\) seen\(\); \}\)/);
  assert.match(css, /html\.sp-quick \.sp-in \*\{animation:none!important\}/);
  assert.match(css, /html\.sp-quick \.sp-in\{animation:sp-quick-in \.4s cubic-bezier\(\.22,1,\.36,1\) backwards\}/, "backwards only, so the door can still fade it out");
  assert.match(css, /html\.sp-quick :is\(\.sp-ring,\.sp-bar,\.sp-skip\)\{display:none\}/);
});

test("Go to the tracker (and a calendar day's 'more') glide to their section instead of redrawing the page", () => {
  assert.doesNotMatch(app, /href="#trk-h"|href="#wd-h"/, "no #hash links the router would read as pages");
  assert.match(app, /data-act="jumpto" data-to="trk-h"/); assert.match(app, /data-act="jumpto" data-to="wd-h"/);
  assert.match(app, /case "jumpto": \{ const hd = \$\(b\.dataset\.to\)/);
  assert.match(app, /scrollTo\(\{ top: Math\.max\(0, sec\.getBoundingClientRect\(\)\.top \+ scrollY - off\), behavior: reduce \? "auto" : "smooth" \}\)/);
});

test("website Today at desktop widths: three columns that each stack their boxes (never the app)", () => {
  assert.ok(exists("assets/desk-today.js"));
  const dt = read("assets/desk-today.js");
  assert.match(dt, /const on = !A\.NATIVE && A\.route\(\)\.tab === "today"/, "never in the Android app");
  assert.match(dt, /matchMedia\("\(min-width:1024px\)"\)\.matches/);
  assert.match(dt, /new ResizeObserver/);
  assert.match(app, /desk: \["desk-today"\]/); assert.match(read("sw.js"), /"assets\/desk-today\.js"/);
  assert.match(css, /\.v-today\.mas\{grid-template-areas:none;grid-template-rows:none;grid-auto-rows:4px;row-gap:0\}/);
  const W = loadBrowser("assets/desk-today.js"); assert.equal(typeof W.IE_DESK_TODAY, "function");
});

test("credit: no personal name in the app; the feedback address is kept as the owner decided (19 Nov 2026)", () => {
  for (const f of ["assets/app.js", "assets/data.js", "assets/legal.js", "index.html", "assets/share-img.js", "android-app/android/app/src/main/java/com/simplymadestudio/islameveryday/VerseShare.java"])
    assert.doesNotMatch(read(f), /Samiur|সামিউর|Rahman, Samiur|Samiur Rahman/, f);
  assert.match(read("index.html"), /Simply Made Studio/);
});
