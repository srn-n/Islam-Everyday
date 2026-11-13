// 13 Nov 2026 (second batch): the 3D prayer figure, the earlier Today page, and the first frame at startup.
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { read, p, exists, loadBrowser } from "./helpers.mjs";

const app = read("assets/app.js"), css = read("assets/app.css");
const J = "android-app/android/app/src/main/java/com/simplymadestudio/islameveryday/";

test("3D prayer figure: local files, both figures, and the 2D drawing kept as the fallback", () => {
  for (const w of ["man", "woman"]) {
    const b = readFileSync(p("assets/figure/" + w + ".bin"));
    assert.equal(b.subarray(0, 4).toString("latin1"), "IEF1");
    assert.ok(b.length > 300e3 && b.length < 900e3, w + ".bin size " + b.length);
  }
  assert.match(app, /pray: \["salah-fig", "salah", "salah-3d"\]/);
  assert.match(app, /id="pray-3d"/); assert.match(app, /id="pray-fig"/);
  assert.match(app, /PR\.no3d = true/);                       // any 3D failure falls back to the drawing
  const s3 = read("assets/salah-3d.js");
  assert.doesNotMatch(s3, /https?:\/\//);                     // nothing is fetched from outside the app
  assert.match(read("sw.js"), /assets\/salah-3d\.js", "assets\/figure\/man\.bin", "assets\/figure\/woman\.bin"/);
  assert.match(read(".gitattributes"), /\*\.bin binary/);
  assert.ok(exists("tools/prayer-figure/build.py"));
});

test("3D prayer figure: every position of every school solves, and sujud rests on seven points", () => {
  const ctx = loadBrowser("assets/salah-fig.js", "assets/salah.js");
  ctx.TextDecoder = TextDecoder;
  vm.runInContext(read("assets/salah-3d.js"), ctx);
  const F = ctx.IE_SALAH_FIG, SL = ctx.IE_SALAH, S3 = ctx.IE_SALAH_3D;
  for (const w of ["man", "woman"]) {
    const b = readFileSync(p("assets/figure/" + w + ".bin"));
    const c = S3.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.length));
    for (const name of Object.keys(F.POSE)) {
      const fr = S3.frame(c, F, name, name, 1, 0);
      assert.ok(fr.Q.every(q => q.every(Number.isFinite)) && fr.pos.every(v => v.every(Number.isFinite)), w + " " + name);
      if (/^sujud/.test(name)) {
        const pts = S3.contacts(c, fr);
        assert.equal(pts.length, 7);
        for (const [i, v] of pts.entries()) assert.ok(v[1] > -0.03 && v[1] < 0.16, `${w} ${name} point ${i} is ${v[1].toFixed(3)} m above the mat`);
        assert.ok(pts[0][0] > pts[3][0] + 0.12, `${w} ${name}: the forehead is ${(pts[0][0] - pts[3][0]).toFixed(2)} m ahead of the knees`);
      }
    }
    // what the step text says about the arms in sujud: men's elbows raised; forearms on the ground only in sujudW
    const elbow = n => { const fr = S3.frame(c, F, n, n, 1, 0); return fr.pos[c.bix.lowerarm_r][1] + fr.off[1]; };
    assert.ok(elbow("sujud") > 0.17, w + ": elbows are off the ground in sujud"); assert.ok(elbow("sujudW") < 0.12, w + ": forearms rest on the ground in sujudW");
    // salam to the right turns the face to the person's right (+z)
    { const q = S3.frame(c, F, "tashahhud", "tashahhud", 1, 1).Q[c.bix.head]; assert.ok(2 * (q[0] * q[2] - q[3] * q[1]) > 0.8); }
    // half-way between two positions is still a sound body
    const mid = S3.frame(c, F, "kneel", "sujud", 0.5, 0);
    assert.ok(mid.Q.every(q => Math.abs(Math.hypot(...q) - 1) < 1e-3));
  }
  assert.ok(SL && F);
});

test("3D prayer figure: small markers instead of rings, no sound, reduced motion respected", () => {
  assert.match(css, /\.pv-dot\{/);
  assert.match(app, /class="pv-dot"[^>]*r="3"/);
  assert.match(css, /prefers-reduced-motion[^}]*\{[^}]*\.pv-dot|\.pv-dot[^}]*animation:none/s);
  assert.doesNotMatch(read("assets/salah-3d.js"), /Audio\(|AudioContext/);
});

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
