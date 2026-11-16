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

test("widget pictures (16 Nov): each widget its own seven local WebP files, other scenes than the hero's, nothing to choose", async () => {
  const { readFileSync } = await import("node:fs"), { p } = await import("./helpers.mjs");
  const SETS = {
    prayer: ["orchard", "fjord", "oasis", "heather", "terraces", "birch", "lagoon"],
    verse: ["maple", "cliffs", "savanna", "tulips", "river", "bluebell", "starry"],
    large: ["lavender", "bamboo", "glacier", "olive", "aurora", "valley", "blossom"]
  };
  for (const [k, l] of Object.entries(SETS)) assert.match(app, new RegExp(`  ${k}: ${JSON.stringify(l).replace(/[[\]]/g, "\\$&").replace(/,/g, ", ")}`));
  const all = Object.values(SETS).flat();
  assert.equal(new Set(all).size, 21, "no picture in two sets: two widgets never show the same one");
  const HERO = ["mosque", "dunes", "lake", "paddy", "coast", "pines", "tea", "canyon", "meadow", "mangrove", "village", "falls"];
  assert.deepEqual(all.filter(k => HERO.includes(k)), []);
  for (const k of all) {
    const b = readFileSync(p(`assets/widgets-img/${k}.webp`));
    assert.equal(b.subarray(0, 4).toString("latin1"), "RIFF"); assert.equal(b.subarray(8, 12).toString("latin1"), "WEBP");
    assert.ok(b.length < 160e3, k + " size " + b.length);
  }
  for (const k of ["wg_set", "wg_set_h", "wg_pics", "wg_ai"]) both(k);
  for (const k of ["wg_plain", "wg_auto", "wg_now", "wp_lavender"]) assert.doesNotMatch(app, new RegExp(`t\\("${k}"\\)`));
  assert.match(app, /\$\{NATIVE \? `<li class="set-block" id="set-wg">/, "Settings section only in the Android app");
  assert.doesNotMatch(app, /data-act="wg(kind|auto|pic)"|st\.wgMode =|st\.wgPic =/, "no picture choice in Settings");
  assert.match(app, /bg: \{ mode: "auto", sets: WG_SETS \}/);
  assert.match(app, /Pictures for the widgets/); assert.match(app, /উইজেটের ছবি/);
  assert.match(read(".gitattributes"), /\*\.webp binary/);
});

test("widget pictures: each widget reads its own set, one step on at each prayer time", () => {
  assert.match(app, /days\.push\(\{ from: D\.base, to: N\.base, dn: wgDayNo\(y, m, d\),/);
  const wd = read(J + "WidgetData.java");
  assert.match(wd, /static String picAt\(JSONObject d, long now, String kind\)/);
  assert.match(wd, /JSONArray list = sets != null \? sets\.optJSONArray\(kind\) : bg\.optJSONArray\("list"\);/);
  assert.match(wd, /long i = \(day\.optLong\("dn"\) \* 5 \+ n\) % list\.length\(\);/);
  assert.match(wd, /r\.optLong\(2\) <= now\) n\+\+/);
  assert.match(read(J + "PrayerWidget.java"), /WidgetData\.picAt\(d, now, "prayer"\)/);
  assert.match(read(J + "VerseWidget.java"), /WidgetData\.picAt\(d, now, picSet\(\)\)/);
  assert.match(read(J + "VerseWidget.java"), /protected String picSet\(\) \{ return "verse"; \}/);
  assert.match(read(J + "VerseWidgetLarge.java"), /@Override protected String picSet\(\) \{ return "large"; \}/);
  // the phone reads the picture from the app's own files, never from the network
  assert.match(wd, /c\.getAssets\(\)\.open\("public\/assets\/widgets-img\/" \+ name \+ "\.webp"\)/);
  assert.match(wd, /name\.matches\("\[a-z\]\+"\)/);
  assert.match(read(J + "VerseWidget.java"), /WidgetData\.nextPicChange\(d, now\)/);
});

test("widget list previews (14 Nov): real pictures, not the empty layout; a large 4x4 Verse for today", async () => {
  const { readFileSync } = await import("node:fs"), { p } = await import("./helpers.mjs");
  for (const [f, img] of [["widget_prayer_info", "wg_prev_prayer"], ["widget_verse_info", "wg_prev_verse"], ["widget_verse_large_info", "wg_prev_verse_large"]]) {
    const x = read(A + "res/xml/" + f + ".xml");
    assert.match(x, new RegExp(`android:previewImage="@drawable/${img}"`), f);
    assert.doesNotMatch(x, /previewLayout/, f + ": the layout preview was blank, its text is filled in only by the app");
    const b = readFileSync(p(A + "res/drawable-nodpi/" + img + ".webp"));
    assert.equal(b.subarray(8, 12).toString("latin1"), "WEBP"); assert.ok(b.length < 120e3, img + " " + b.length);
  }
  assert.match(read(A + "res/xml/widget_verse_large_info.xml"), /android:targetCellWidth="4"[^]*android:targetCellHeight="4"/);
  assert.match(read(A + "AndroidManifest.xml"), /android:name="\.VerseWidgetLarge"[^]*?@xml\/widget_verse_large_info/);
  const lg = read(J + "VerseWidgetLarge.java");
  assert.match(lg, /extends VerseWidget/); assert.match(lg, /R\.layout\.widget_verse_large/); assert.match(lg, /alarmCode\(\) \{ return 3; \}/);
  assert.match(read(J + "WidgetData.java"), /refresh\(c, VerseWidgetLarge\.class\);/);
  assert.match(read(A + "res/layout/widget_verse_large.xml"), /android:autoSizeMaxTextSize="24sp"/);
  for (const k of ["wg_verse_lg_name", "wg_verse_lg_d"]) { assert.match(read(A + "res/values/strings.xml"), new RegExp(`name="${k}"`)); assert.match(read(A + "res/values-bn/strings.xml"), new RegExp(`name="${k}"`)); }
  assert.ok(exists("tools/widget-previews.mjs"));
});

test("Prayer times widget (16 Nov, Notion): current prayer left, next prayer right; avoided times as on Today", () => {
  // the app sends the three sun-based windows (same as forbiddenNow) with ready lines in the app's language
  assert.match(app, /\[\[A\("sunrise"\), A\("sunrise"\) \+ 15 \* mi\], \[A\("dhuhr"\) - 10 \* mi, A\("dhuhr"\)\], \[A\("maghrib"\) - 15 \* mi, A\("maghrib"\)\]\]/);
  assert.match(app, /lab: \{ next: t\("next"\), cur: t\("curp"\), nocur: t\("wg_nocur"\),/);
  assert.match(app, /sr: A\("sunrise"\), pi: timesOk\(Y\) \? \[pName\("isha", isFriD\(Y\)\), Y\.abs\("isha"\)\] : null/);
  for (const k of ["wg_nocur", "fw_w_now", "fw_w_soon"]) both(k);
  const wd = read(J + "WidgetData.java"), pw = read(J + "PrayerWidget.java"), lay = read(A + "res/layout/widget_prayer.xml");
  // no place and no countdown any more
  assert.doesNotMatch(lay, /wg_place|wg_next_time/); assert.doesNotMatch(pw, /timeLeft|wg_place/); assert.doesNotMatch(wd, /timeLeft/);
  assert.ok(lay.indexOf("wg_cur_name") < lay.indexOf("wg_next_name"), "current on the left, next on the right");
  assert.match(lay, /android:id="@\+id\/wg_next_name"[\s\S]*?android:gravity="end"/);
  // current prayer as Today: Fajr ends at sunrise, before Fajr it is last night's Isha
  assert.match(pw, /if \(k < 0\) \{ JSONArray pi = o\.optJSONArray\("pi"\); return pi == null \? null : pi\.optString\(0\); \}/);
  assert.match(pw, /if \(k == 0 && o\.optLong\("sr"\) > 0 && now >= o\.optLong\("sr"\)\) return null;/);
  assert.match(pw, /WidgetData\.lab\(d, "nocur"\)/);
  assert.match(pw, /WidgetData\.forbidden\(d, now\)/); assert.match(pw, /setViewVisibility\(R\.id\.wg_next_lbl, View\.GONE\)/);
  assert.match(pw, /long sr = sunriseAfter\(d, now\);/, "wakes at sunrise too");
  assert.match(pw, /WidgetData\.scheduleNext\(c, PrayerWidget\.class, 1, next, true\)/);
  assert.match(wd, /am\.canScheduleExactAlarms\(\)/); assert.match(wd, /am\.setExact\(AlarmManager\.RTC,/, "non-waking");
});
