// 18 Nov 2026 (Notion, eight "Up next" tasks): shuffled lists with a Read section, short hadith and dua previews,
// the large verse widget with share and save, only the current prayer in colour on the prayer widget, the Qibla
// compass (app only), the opening rework, room under the For women confirm box, and the verse changing at 00:01.
import test from "node:test";
import assert from "node:assert/strict";
import { read, exists, loadBrowser } from "./helpers.mjs";

const app = read("assets/app.js"), css = read("assets/app.css"), D = loadBrowser("assets/data.js").DINSATHI.I18N;
const J = "android-app/android/app/src/main/java/com/simplymadestudio/islameveryday/", R = "android-app/android/app/src/main/res/";
const QB = loadBrowser("assets/qibla.js").IE_QIBLA;

test("lists shuffle on every open, with a Read section that is saved on the phone", () => {
  assert.match(app, /const OPEN_SEED = \(Math\.random\(\) \* 4294967296\) >>> 0;/, "one order per open, steady while the app is open");
  assert.match(app, /function shuffled\(arr, salt\)/);
  for (const k of ["dua", "hadith", "study"]) assert.match(app, new RegExp(`, "${k}"\\)`), k);
  assert.match(app, /hread: \[\], dread: \[\]/);
  assert.match(app, /case "rdmark":/);
  for (const l of ["en", "bn"]) for (const k of ["rd_mark", "rd_undo", "rd_sec", "rd_sec_n", "rd_moved", "rd_back"]) assert.ok(D[l][k], l + " " + k);
  assert.ok(D.en.rd_sec.includes("{n}") && D.bn.rd_sec.includes("{n}"));
});

test("hadith and dua cards: a short Arabic preview, then a short meaning, then Read more", () => {
  assert.match(css, /\.hd-main:not\(\.open\) \.pv,\.dua:not\(\.open\) \.pv\{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3;overflow:hidden;max-height:3lh\}/);
  assert.match(css, /\.hd-main:not\(\.open\) \.pv\.ar,\.dua:not\(\.open\) \.pv\.ar\{-webkit-line-clamp:2;max-height:2lh\}/);
});

test("the Verse for today changes at 00:01, in the app and the widgets", () => {
  assert.match(app, /const VOTD_LAG = 6e4/);
  assert.match(app, /if \(was && k !== was\) \{ widgetSync\(\); if \(R\.tab === "today"\)/, "any page: Today redrawn, widgets updated");
  const wd = read(J + "WidgetData.java"), vw = read(J + "VerseWidget.java");
  assert.match(wd, /static final long VERSE_LAG = 60000;/);
  assert.match(wd, /return day == null \? 0 : day\.optLong\("to"\) \+ VERSE_LAG;/);
  assert.match(vw, /WidgetData\.verseNow\(d, now\)/);
  assert.match(vw, /WidgetData\.scheduleNext\(c, getClass\(\), alarmCode\(\), pcFirst \? pc : next, true\);/, "on time when exact alarms are allowed");
});

test("large verse widget: reference on top in the middle, verse centred, share and save without opening the app", () => {
  const lay = read(R + "layout/widget_verse_large.xml");
  assert.ok(lay.indexOf('@+id/wg_ref') < lay.indexOf('@+id/wg_text'), "reference above the verse");
  assert.match(lay, /android:id="@\+id\/wg_text"[\s\S]*?android:gravity="center"/);
  assert.match(lay, /@\+id\/wg_share/); assert.match(lay, /@\+id\/wg_save/);
  for (const f of ["ic_wg_share", "ic_wg_save"]) assert.ok(exists(R + `drawable/${f}.xml`), f);
  for (const v of ["values", "values-bn"]) { const s = read(R + v + "/strings.xml"); assert.match(s, /name="wg_share"/); assert.match(s, /name="wg_save"/); }
  assert.match(read(J + "VerseWidgetLarge.java"), /protected boolean large\(\) \{ return true; \}/);
  const vs = read(J + "VerseShare.java");
  assert.match(vs, /Intent\.createChooser\(send/); assert.match(vs, /PendingIntent\.getActivity/);
  assert.match(vs, /MediaStore\.Images\.Media\.RELATIVE_PATH, Environment\.DIRECTORY_PICTURES \+ "\/Islam Everyday"/, "saved to Pictures without a permission (Android 10+)");
  assert.match(vs, /"Simply Made Studio"/); assert.doesNotMatch(vs, /@|https?:\/\//, "no email or link on the picture");
  assert.doesNotMatch(read("android-app/android/app/src/main/AndroidManifest.xml"), /WRITE_EXTERNAL_STORAGE/);
  assert.match(app, /shr: t\("wg_shr"\), sav: t\("wg_sav"\), saved: t\("wg_saved"\), savefail: t\("wg_savefail"\), by: t\("wg_by"\), brand: t\("brand"\)/);
  for (const l of ["en", "bn"]) for (const k of ["wg_shr", "wg_sav", "wg_saved", "wg_savefail", "wg_by"]) assert.ok(D[l][k], l + " " + k);
});

test("prayer widget: only the current prayer and its time in colour, no neon, next prayer plain", () => {
  const wd = read(J + "WidgetData.java"), pw = read(J + "PrayerWidget.java");
  assert.match(wd, /static final int PIC_CUR = PIC_ACCENT;/); assert.doesNotMatch(wd, /0xFFAEF0DA/);
  assert.match(pw, /v\.setTextColor\(R\.id\.wg_next_name, ink\);/);
  assert.match(pw, /v\.setTextColor\(NAME\[k\], k == ci \? curC : muted\);/); assert.match(pw, /v\.setTextColor\(TIME\[k\], k == ci \? curC : ink\);/);
  assert.doesNotMatch(pw, /k == nx \? acc/);
});

test("Qibla compass: in the app's More only, bearing from the chosen place, words in both languages", () => {
  assert.match(app, /\.\.\.\(NATIVE \? \[\["qibla", "qibla", t\("qb_s"\)\]\] : \[\]\)/, "not on the website");
  assert.match(app, /qibla: \(\) => NATIVE \? vQibla\(\) : vMore\(\)/);
  assert.match(app, /qibla: \["qibla"\]/, "loaded only when opened");
  const src = read("assets/qibla.js");
  assert.match(src, /addEventListener\("deviceorientationabsolute", qbEvent, true\)/);
  assert.doesNotMatch(src, /localStorage|fetch\(|XMLHttpRequest/, "nothing saved or sent");
  // the bearing: Sydney about 277°, Dhaka about 278°, London about 119°, from north
  const q = QB({ t: k => k, num: String, esc: String, city: () => ({}), cname: () => "", back: () => "", buzz() {}, reduce: true, post() {}, route: () => ({}), $: () => null });
  assert.equal(typeof q.page, "function");
  const m = src.match(/function qiblaOf\(c\) \{[\s\S]*?\n    \}/); const qiblaOf = new Function("KAABA", m[0] + "; return qiblaOf;")([21.4225, 39.8262]);
  for (const [lat, lng, b] of [[-33.87, 151.21, 277], [23.81, 90.41, 278], [51.51, -0.13, 119]]) assert.ok(Math.abs(qiblaOf({ lat, lng }).b - b) < 1.5, `${lat},${lng}`);
  for (const l of ["en", "bn"]) {
    for (const k of ["qb_title", "qb_s"]) assert.ok(D[l][k], l + " " + k);
    for (const k of ["qb_wait", "qb_ok", "qb_left", "qb_right", "qb_deg", "qb_from", "qb_nosensor", "qb_how", "qb_cal", "qb_N", "qb_E", "qb_S", "qb_W"]) assert.ok(QB.I18N[l][k], l + " " + k);
  }
});

test("For the believing women: room under the confirm box", () => {
  assert.match(css, /\.w-intro\{margin-bottom:22px\}\.w-intro \.row\{margin-top:14px\}\.w-intro \.row\+\.note\{margin-top:12px;margin-bottom:6px\}/);
});
