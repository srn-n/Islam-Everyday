// 13 Nov 2026 (second batch): the earlier Today page and the first frame at startup.
// (The 3D prayer figure was removed on 14 Nov 2026 with How to pray; its tests went with it.)
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { read, p, exists, loadBrowser } from "./helpers.mjs";

const app = read("assets/app.js"), css = read("assets/app.css");
const J = "android-app/android/app/src/main/java/com/simplymadestudio/islameveryday/";

test("Today is the earlier page again: no row of five prayers or shortcuts above the times", () => {
  assert.doesNotMatch(app, /todayStrip|"qtrk"|today-short/);
  assert.doesNotMatch(css, /today-strip|today-short/);
});

test("startup: the first frame follows the appearance chosen in the app", () => {
  const pl = read(J + "AppearancePlugin.java"), main = read(J + "MainActivity.java");
  assert.match(pl, /setApplicationNightMode/); assert.match(pl, /setDefaultNightMode/);
  assert.match(pl, /@CapacitorPlugin\(name = "Appearance"\)/);
  assert.ok(main.indexOf("AppearancePlugin.apply(base") < main.indexOf("super.attachBaseContext"), "applied before anything is drawn");
  assert.match(main, /setBackgroundDrawable\(new ColorDrawable\(ground\(\)\)\)/);
  // Android 11 and older: no system launch picture (it can only follow the phone); Android 12+ keeps it
  const R = "android-app/android/app/src/main/res/";
  assert.match(read(R + "values/styles.xml"), /android:windowDisablePreview">true/);
  assert.ok(exists(R + "values-v31/styles.xml")); assert.doesNotMatch(read(R + "values-v31/styles.xml"), /windowDisablePreview"/);
  assert.match(read(R + "values-v31/styles.xml"), /windowSplashScreenAnimatedIcon/);
  assert.match(main, /registerPlugin\(AppearancePlugin\.class\)/);
  assert.match(app, /natQ\("Appearance", "set", \{ mode: st\.mode \}\)/);
  assert.match(css, /html\[data-theme="light"\]\{--sys-ground:#EEF3F1\}html\[data-theme="dark"\]\{--sys-ground:#08120F\}/);
  assert.match(read("assets/theme-boot.js"), /meta\[name="color-scheme"\]/);
  // the opening animation itself is unchanged
  assert.match(css, /html\.native \.splash\{animation:sp-sysbg/);
});

test("Android 14+: reminders held back by the phone are explained, with the switch to allow exact times", () => {
  assert.match(app, /checkExactNotificationSetting/); assert.match(app, /changeExactNotificationSetting/);
  assert.match(app, /nfExact === "denied" && nfAny\(\)/);          // shown only when Android says it is holding them back
  const d = read("assets/data.js");
  assert.equal((d.match(/nf_exact:/g) || []).length, 2); assert.equal((d.match(/nf_exact_b:/g) || []).length, 2);
});
