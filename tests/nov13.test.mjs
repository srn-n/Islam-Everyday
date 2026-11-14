// Nov 2026, 13th: the third batch of Notion tasks (opening, Today, pictures, sounds, How to pray, fixes).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { read, loadBrowser, p } from "./helpers.mjs";
const app = read("assets/app.js"), css = read("assets/app.css"), html = read("index.html"), X = loadBrowser("assets/data.js").DINSATHI, { I18N } = X;

test("An-Nawawi cards wrap on phones (the month-name no-wrap rule no longer matches .nw)", () => {
  assert.doesNotMatch(css, /\{\.nw\{white-space:nowrap\}\}/);
  assert.match(css, /\.nowrap-m\{white-space:nowrap\}/); assert.match(app, /class="nowrap-m"/);
});

test("theme cards: only the theme on screen has the strong outline", () => {
  assert.match(app, /class="th-card\$\{on && now === k \? " in-use" : ""\}"/);
  assert.match(css, /\.th-card\.in-use,\.sc-card\[aria-pressed="true"\]\{border:2px solid var\(--accent\)/);
  assert.doesNotMatch(css, /\.th-card\[aria-pressed="true"\],\.sc-card/);
});

test("sheets: the title leaves room for the close button", () => {
  assert.match(css, /\.sheet>h3:first-of-type\{min-height:44px;display:flex;align-items:center;padding-right:52px/);
});

test("switches move before the page redraws; a daily scene asks before a scene is picked", () => {
  assert.match(app, /function flipSw\(b, on, then\)/);
  assert.match(app, /case "sceneauto": st\.sceneAuto = !st\.sceneAuto; save\(\); flipSw\(b, st\.sceneAuto,/);
  assert.match(app, /if \(st\.sceneAuto\) \{ openSheet\(`<h3>\$\{t\("sc_auto_on"\)\}/);
  assert.doesNotMatch(css, /sc-off/);
  for (const k of ["sc_auto_on", "sc_auto_q", "sc_auto_off", "sc_auto_keep"]) assert.ok(I18N.en[k] && I18N.bn[k], k);
});

test("sounds: water drop kept; ripple and soft bubble replace soft tap and breeze; old channels removed", () => {
  assert.match(app, /const NF_SND = \["default", "drop", "ripple", "bubble"\]/);
  assert.match(app, /const NF_OLD = \["tap", "breeze"\]/);
  assert.match(app, /st\.nfSnd = \{ tap: "bubble", breeze: "ripple" \}\[st\.nfSnd\] \|\| st\.nfSnd;/);
  for (const k of ["tap", "breeze"]) { assert.ok(!existsSync(p(`assets/sounds/ie_${k}.wav`)), k); assert.ok(!existsSync(p(`android-app/android/app/src/main/res/raw/ie_${k}.wav`)), k); }
  const S = loadBrowser("assets/sound.js").IE_SOUND; assert.deepEqual([...S.TOUCH], ["soft", "drop", "bubble"]);
  assert.match(app, /if \(st\.sndK === "air"\) st\.sndK = "bubble";/);
});

test("pictures behind the prayer: seven, small files, an honest note, the same daily rotation", () => {
  assert.match(app, /const PHOTOS = \["mosque", "dunes", "lake", "paddy", "coast", "pines", "tea"\];/);
  for (const k of ["mosque", "dunes", "lake", "paddy", "coast", "pines", "tea"]) for (const s of ["", "-s"]) {
    const f = readFileSync(p(`assets/heroes-img/${k}${s}.webp`)); assert.equal(f.toString("latin1", 0, 4), "RIFF"); assert.equal(f.toString("latin1", 8, 12), "WEBP");
    assert.equal(f.readUInt32LE(4) + 8, f.length, `${k}${s} whole file`); assert.ok(f.length < 110e3, `${k}${s} small`);
    assert.ok(I18N.en["ph_" + k] && I18N.bn["ph_" + k]); }
  assert.match(I18N.en.ph_note, /AI image tool/); assert.match(app, /Figma's AI image tool/);
  assert.match(app, /const sceneToday = \(\) => \{ const ph = st\.heroKind === "photo", list = ph \? PHOTOS : SCENES;/);
  assert.match(css, /\.sky\[data-p="night"\] \.sky-tint\{/);
});

test("Today is the earlier landing page again: no row of five prayers or shortcuts (removed at the owner's request)", () => {
  assert.doesNotMatch(app, /todayStrip|qtrk|today-short/); assert.doesNotMatch(css, /today-strip|today-short/);
  assert.match(app, /\$\{heroScene\(\)\}/); assert.match(app, /\$\{nfCard\(\)\}\n\n  <section class="card a-times">/);
});

test("tab slides: the old page leaves before the new one arrives, without blending", () => {
  assert.match(css, /html\[data-vt\]::view-transition-old\(root\),html\[data-vt\]::view-transition-new\(root\)\{mix-blend-mode:normal\}/);
});

test("Prayer guide on wide screens: two independent columns, sources across the bottom; phone order kept", () => {
  assert.match(app, /<div class="g-col g-col-a">/); assert.match(app, /<div class="g-col g-col-b">/);
  assert.match(css, /\.g-col\{display:contents\}/);
  assert.match(css, /\.g-col\{display:flex;flex-direction:column;gap:20px;min-width:0\}/);
  assert.match(css, /\.v-guide>\.g-srcc\{grid-column:1\/-1/);
});
