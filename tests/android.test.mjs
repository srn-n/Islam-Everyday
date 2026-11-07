// Android app and phone navigation (Nov 2026): history, section slides, Back button, opening and closing.
import { test } from "node:test";
import assert from "node:assert/strict";
import { read } from "./helpers.mjs";
const app = read("assets/app.js"), css = read("assets/app.css"), boot = read("assets/theme-boot.js");

test("switching sections keeps one history entry above Today, and a repeat tap adds nothing", () => {
  assert.match(app, /if \(push && sameRoute\(prev, next\)\)/);
  assert.match(app, /history\.pushState\(Object\.assign\(\{\}, next, \{ _root: 1 \}\), ""\)/);
  assert.match(app, /else history\.replaceState\(/);
  assert.match(app, /if \(push && backing\) \{ after = r; return; \}/, "a tap during a Back waits for it");
  assert.match(app, /delete R\._root;/);
});

test("section slides: phones and the app only, skipped for reduced motion and Motion off, never stacked", () => {
  assert.match(app, /const canVT = \(\) => !!document\.startViewTransition && !reduce && st\.motion !== "off" && \(NATIVE \|\| phone\(\)\)/);
  assert.match(app, /if \(vt\) \{ try \{ vt\.skipTransition\(\); \} catch \(e\) \{\} \}/);
  assert.match(app, /t\.ready\.catch\(\(\) => \{\}\); t\.updateCallbackDone\.catch\(\(\) => \{\}\);/);
  assert.match(css, /::view-transition\{pointer-events:none\}/, "taps pass through a slide");
  assert.match(css, /html\[data-vt\] #top\{view-transition-name:ie-top\}/);
});

test("Android: Back closes a sheet, steps back, returns to Today, then closes the app once", () => {
  for (const s of ['$("sheet").classList.contains("on")) { closeSheet(); return; }', "if (depth > 0) { try { history.back(); return; }", 'if (R.tab !== "today")', 'natQ("App", "minimizeApp")', 'addListener("App", "resume", reopen)', "if (closing) return;"])
    assert.ok(app.includes(s), s);
});

test("Android: the splash waits for the launch screen and starts from its colour", () => {
  assert.match(boot, /r\.className \+= " native sp-hold"/);
  assert.match(css, /html\.sp-hold \.splash,html\.sp-hold \.splash \*\{animation-play-state:paused!important\}/);
  assert.match(app, /natQ\("SplashScreen", "hide"/);
  assert.match(css, /@keyframes sp-sysbg\{from\{background-color:var\(--sys-ground\)\}\}/);
});

test("Android: share, copy and links go through the app; nothing offered that a web view cannot do", () => {
  assert.match(app, /const SITE = NATIVE \? WEB :/);
  assert.match(app, /nat\("Clipboard", "write"/);
  assert.match(app, /nat\("Filesystem", "writeFile", \{ path: "share\/" \+ name, data, directory: "CACHE"/);
  assert.match(app, /\$\{o\.pdf && !NATIVE \? opt\("shpdf"/);
  assert.match(app, /\(NATIVE \? "" : opt\("shjpg"/);
});

test("safe areas use the app's values when present and the browser's otherwise", () => {
  assert.doesNotMatch(css, /[^(,]env\(safe-area-inset-/);
  assert.match(css, /var\(--safe-area-inset-bottom,env\(safe-area-inset-bottom,0px\)\)/);
});
