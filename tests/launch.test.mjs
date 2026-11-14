// 14 Nov 2026 (owner's request): the app opens on its theme's own colour with no shift, and coming back to the app
// does not make Today blink.
import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { read, p, exists } from "./helpers.mjs";

const app = read("assets/app.js"), css = read("assets/app.css"), boot = read("assets/theme-boot.js");
const J = "android-app/android/app/src/main/java/com/simplymadestudio/islameveryday/", R = "android-app/android/app/src/main/res/";
const LIGHT = ["classic", "sky", "sandstone"], DARK = ["jade", "indigo", "teal"];
const cap = s => s[0].toUpperCase() + s.slice(1);

test("launch colours: generated from app.css, one launch theme per light/dark pair, the same table in Java", () => {
  const before = ["values/launch_colors.xml", "values-night/launch_colors.xml", "values-v31/launch_themes.xml"].map(f => read(R + f));
  const COL = JSON.parse(execFileSync("node", [p("tools/launch-themes.mjs")], { encoding: "utf8" }));
  assert.deepEqual(["values/launch_colors.xml", "values-night/launch_colors.xml", "values-v31/launch_themes.xml"].map(f => read(R + f)), before, "resources are up to date (run tools/launch-themes.mjs)");
  const day = read(R + "values/launch_colors.xml"), night = read(R + "values-night/launch_colors.xml"), th = read(R + "values-v31/launch_themes.xml");
  for (const l of LIGHT) for (const d of DARK) {
    const n = l + "_" + d;
    assert.match(day, new RegExp(`name="lg_${n}">${COL[l].g}<`)); assert.match(night, new RegExp(`name="lg_${n}">${COL[d].g}<`));
    assert.match(day, new RegExp(`name="la_${n}">${COL[l].a}<`)); assert.match(night, new RegExp(`name="la_${n}">${COL[d].a}<`));
    assert.match(th, new RegExp(`<style name="Launch\\.${cap(l)}\\.${cap(d)}" parent="AppTheme\\.NoActionBarLaunch">[\\s\\S]*?@drawable/splash_door_${n}<`));
    assert.match(read(R + `drawable/splash_door_${n}.xml`), new RegExp(`@color/la_${n}"`));
  }
  const pl = read(J + "AppearancePlugin.java"), hex = c => "0xFF" + c.slice(1);
  assert.ok(pl.includes(`LIGHT_GROUND = { ${LIGHT.map(k => hex(COL[k].g)).join(", ")} }`), "Java light grounds = app.css");
  assert.ok(pl.includes(`DARK_GROUND = { ${DARK.map(k => hex(COL[k].g)).join(", ")} }`), "Java dark grounds = app.css");
  // the default launch screen (before a theme is saved, and on Android 12) is a new install's: Sandstone / Jade
  assert.match(read(R + "values/colors.xml"), new RegExp(`name="ground">${COL.sandstone.g}<[\\s\\S]*name="launch_accent">${COL.sandstone.a}<`));
  assert.match(read(R + "values-night/colors.xml"), new RegExp(`name="ground">${COL.jade.g}<[\\s\\S]*name="launch_accent">${COL.jade.a}<`));
  assert.match(read(R + "drawable/splash_door.xml"), /@color\/launch_accent/);
});

test("launch: Android 13+ picks the pair's launch theme; the window and WebView start on the theme's ground", () => {
  const pl = read(J + "AppearancePlugin.java"), main = read(J + "MainActivity.java");
  assert.match(pl, /Build\.VERSION\.SDK_INT < 33\) return;[\s\S]*getSplashScreen\(\)\.setSplashScreenTheme\(id\)/);
  for (const l of LIGHT) for (const d of DARK) assert.match(pl, new RegExp(`R\\.style\\.Launch_${cap(l)}_${cap(d)}\\b`));
  assert.match(pl, /return LAUNCH\[lightTheme\(c\)\]\[darkTheme\(c\)\];/);
  assert.match(pl, /call\.getString\("light", null\)[\s\S]*call\.getString\("dark", null\)/);
  assert.match(main, /AppearancePlugin\.applySplash\(this\)/);
  assert.match(main, /getWebView\(\)\.setBackgroundColor\(g\)/);
  assert.ok(main.indexOf("setBackgroundDrawable(new ColorDrawable(AppearancePlugin.ground(this)))") < main.indexOf("super.onCreate"), "window colour before the first frame");
  // night mode is set again only when it changes (setting it again can redraw the screen)
  assert.match(pl, /getDefaultNightMode\(\) != want/); assert.match(pl, /getInt\("nm", -1\) != m/);
  // the page starts on what Android drew: its own ground, except Android 12 (default Sandstone / Jade)
  assert.match(boot, /var a12 = \/Android 12\[;\) L\]\/\.test\(navigator\.userAgent \|\| ""\);/);
  assert.match(boot, /setProperty\("--sys-ground", a12 \? \(dark \? "#08120F" : "#F3EADB"\) : "var\(--ground\)"\)/);
  assert.match(app, /const nk = st\.mode \+ "\|" \+ st\.lightTheme \+ "\|" \+ st\.darkTheme;/);
});

test("Today redraws in place: coming back to the app or the minute tick changes only what changed", () => {
  assert.match(app, /function patchKids\(live, prev, next\)/);
  assert.match(app, /if \(!anim && R\.tab === "today" && todayTpl && v\.dataset\.pg === "today"\) \{ patchKids\(v, todayTpl\.content, tpl\.content\); todayTpl = tpl; \}/);
  assert.match(app, /if \(p\.isEqualNode\(n\)\) continue;/, "unchanged parts are not touched");
  assert.match(app, /if \(p\.getAttribute\(a\.name\) !== a\.value\) l\.setAttribute/, "only attributes that changed in the markup");
  assert.match(app, /filter\(n => !\(n\.nodeType === 1 && n\.classList\.contains\("seg-th"\)\)\)/, "segment thumbs added by script are kept");
  assert.match(app, /v\.dataset\.pg = ""; todayTpl = null;/, "the loading state resets it");
});

test("open: no blink as the splash leaves; content fades before the ground; the page rises after", () => {
  assert.match(app, /setTimeout\(\(\) => \{ sp\.remove\(\); \}, 700\);/);
  assert.doesNotMatch(app, /sp\.remove\(\); v\.classList\.remove\("door"\)/, "removing door mid-rise restarted it from invisible (the blink)");
  assert.match(css, /\.splash\.out \.sp-in\{opacity:0;transform:scale\(1\.06\);transition:opacity \.2s ease/);
  assert.match(css, /transition:opacity \.38s cubic-bezier\(\.4,0,\.2,1\) \.16s,visibility 0s linear \.56s/);
  assert.match(css, /\.view\.door\.enter>\*\{animation:rise-door \.62s var\(--bounce\) both;animation-delay:calc\(140ms \+ var\(--i,0\)\*30ms\)\}/);
});
