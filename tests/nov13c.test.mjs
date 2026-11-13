// 13 Nov 2026 (third batch, Notion): today's scene marked in Settings, a clear status during avoided times,
// and Android home-screen widgets for prayer times and the Verse for today.
import test from "node:test";
import assert from "node:assert/strict";
import { read, exists } from "./helpers.mjs";

const app = read("assets/app.js"), css = read("assets/app.css"), data = read("assets/data.js");
const A = "android-app/android/app/src/main/", J = A + "java/com/simplymadestudio/islameveryday/";
const fn = n => { const i = app.indexOf("function " + n + "("); return app.slice(i, app.indexOf("\n}\n", i) + 2); };
const both = k => assert.equal((data.match(new RegExp("[{,]" + k + ":\"", "g")) || []).length, 2, k + " in en and bn");

test("Settings marks the scene on the hero now: with Change every day on, today's, not the last one tapped", () => {
  const f = fn("sceneCards");
  assert.match(f, /cur = sceneToday\(\)/);
  assert.equal((f.match(/aria-pressed="\$\{cur === k\}"/g) || []).length, 2, "drawn scenes and pictures");
  assert.doesNotMatch(f, /st\.scene === k|st\.photo === k/);
  assert.match(f, /st\.sceneAuto \? t\("sc_today"\) : t\("th_chosen"\)/);
  both("sc_today");
});

test("avoided times: while a window is on, the hero shows a clear status with the time left", () => {
  const f = fn("forbiddenLine");
  assert.match(f, /class="forb-warn on" id="forb-warn" role="status" data-end=/);
  assert.match(f, /id="forb-left">\$\{countdown\(end - s\.now\)\}/);
  assert.match(app, /const fl = \$\("forb-left"\), fw = \$\("forb-warn"\); if \(fl && fw\)/, "the time left ticks every second");
  assert.match(css, /\.sky \.forb-warn\.on\{/); assert.match(css, /prefers-reduced-motion:reduce\)\{\.sky \.fw-dot\{animation:none\}/);
  both("fw_now_h"); both("fw_left");
});

test("widgets: the app sends seven days of times and verses, only when something changed", () => {
  assert.match(app, /const widgetSync = \(\) => \{ if \(!NATIVE\) return;/);
  assert.match(app, /applyTheme\(\); header\(\); nav\(\); side\(\); widgetSync\(\);/);
  assert.match(app, /"resume", \(\) => \{ ask\(\); nfSync\(\); widgetSync\(\); \}/);
  const d = fn("widgetData");
  assert.match(d, /for \(let i = 0; i < 7; i\+\+\)/); assert.match(d, /votdFor\(y, m, d\)/); assert.match(d, /pName\(k, isFriD\(D\)\)/);
  assert.match(fn("widgetRun"), /if \(d === wgSig\) return;/);
  // the widget verse is the card's translation word for word; only footnote marks (Latin or Bangla digits) are left out
  const p = fn("votdPlain");
  assert.match(p, /RW\.get\(i, k\)\[0\]/); assert.match(p, /tr\.t\[k - 1\]/);
  assert.match(p, /\.replace\(\/\\s\*\\\[\[\\d০-৯\]\+\\\]\/g, ""\)/);
  assert.doesNotMatch(p, /slice\(|substr/);
});

test("widgets: Android side (receivers, layouts, plugin, both languages)", () => {
  const man = read(A + "AndroidManifest.xml");
  for (const w of ["PrayerWidget", "VerseWidget"]) {
    assert.match(man, new RegExp(`android:name="\\.${w}"[^]*?APPWIDGET_UPDATE[^]*?android\\.appwidget\\.provider`));
    assert.ok(exists(J + w + ".java"));
  }
  for (const f of ["layout/widget_prayer.xml", "layout/widget_verse.xml", "xml/widget_prayer_info.xml", "xml/widget_verse_info.xml", "drawable/widget_bg.xml"]) assert.ok(exists(A + "res/" + f), f);
  // RemoteViews: only views a home screen can show
  for (const f of ["widget_prayer", "widget_verse"]) {
    const x = read(A + "res/layout/" + f + ".xml"), tags = [...x.matchAll(/<([A-Za-z.]+)[\s>]/g)].map(m => m[1]).filter(n => n !== "?xml");
    assert.deepEqual([...new Set(tags)].filter(n => !["FrameLayout", "LinearLayout", "ImageView", "TextView"].includes(n)), [], f);
  }
  assert.match(read(J + "MainActivity.java"), /registerPlugin\(WidgetsPlugin\.class\)/);
  assert.match(read(J + "WidgetsPlugin.java"), /@CapacitorPlugin\(name = "Widgets"\)/);
  const wd = read(J + "WidgetData.java");
  assert.match(wd, /am\.set\(AlarmManager\.RTC,/, "an ordinary alarm: no exact-alarm permission needed");
  assert.doesNotMatch(wd + read(J + "PrayerWidget.java") + read(J + "VerseWidget.java"), /https?:\/\/|URL\(|HttpURLConnection/, "no network");
  for (const k of ["wg_prayer_name", "wg_prayer_d", "wg_verse_name", "wg_verse_d", "wg_empty"]) {
    assert.match(read(A + "res/values/strings.xml"), new RegExp(`name="${k}"`)); assert.match(read(A + "res/values-bn/strings.xml"), new RegExp(`name="${k}"`));
  }
});

test("widget pictures: seven local WebP files, other scenes than the hero's, chosen in Settings (app only)", async () => {
  const { readFileSync } = await import("node:fs"), { p } = await import("./helpers.mjs");
  const W = ["waterfall", "river", "snow", "wheat", "garden", "stars", "autumn"];
  assert.match(app, new RegExp(`const WPICS = ${JSON.stringify(W).replace(/[[\]]/g, "\\$&").replace(/,/g, ", ")};`));
  const HERO = ["mosque", "dunes", "lake", "paddy", "coast", "pines", "tea"];
  assert.deepEqual(W.filter(k => HERO.includes(k)), []);
  for (const k of W) {
    const b = readFileSync(p(`assets/widgets-img/${k}.webp`));
    assert.equal(b.subarray(0, 4).toString("latin1"), "RIFF"); assert.equal(b.subarray(8, 12).toString("latin1"), "WEBP");
    assert.ok(b.length < 160e3, k + " size " + b.length);
    both("wp_" + k);
  }
  for (const k of ["wg_set", "wg_set_h", "wg_plain", "wg_auto", "wg_auto_d", "wg_now", "wg_ai"]) both(k);
  assert.match(app, /\$\{NATIVE \? `<li class="set-block" id="set-wg">/, "Settings section only in the Android app");
  assert.match(fn("widgetCards"), /cur = wgNowPic\(\)/);
  assert.match(app, /bg: \{ mode: st\.wgMode, pic: st\.wgPic, list: WPICS \}/);
  assert.match(app, /Pictures for the widgets/); assert.match(app, /উইজেটের ছবি/);
  assert.match(read(".gitattributes"), /\*\.webp binary/);
});

test("widget pictures: the app and the phone use the same rule for the picture shown now", () => {
  // app: day number × 5 + prayers begun that day
  assert.match(app, /const wgPicAt = \(dn, started\) => WPICS\[\(\(dn \* 5 \+ started\) % WPICS\.length/);
  assert.match(app, /days\.push\(\{ from: D\.base, to: N\.base, dn: wgDayNo\(y, m, d\),/);
  const wd = read(J + "WidgetData.java");
  assert.match(wd, /long i = \(day\.optLong\("dn"\) \* 5 \+ n\) % list\.length\(\);/);
  assert.match(wd, /r\.optLong\(2\) <= now\) n\+\+/);
  // the phone reads the picture from the app's own files, never from the network
  assert.match(wd, /c\.getAssets\(\)\.open\("public\/assets\/widgets-img\/" \+ name \+ "\.webp"\)/);
  assert.match(wd, /name\.matches\("\[a-z\]\+"\)/);
  // with pictures changing on their own, the verse widget also wakes at prayer times
  assert.match(read(J + "VerseWidget.java"), /WidgetData\.nextPicChange\(d, now\)/);
});
