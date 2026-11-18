// 14 Nov 2026 (owner's request): the app opens on its theme's own colour with no shift, and coming back to the app
// does not make Today blink.
import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { read, p, exists, pageHtml } from "./helpers.mjs";

const app = read("assets/app.js"), css = read("assets/app.css"), boot = read("assets/theme-boot.js"), html = read("index.html");
const J = "android-app/android/app/src/main/java/com/simplymadestudio/islameveryday/", R = "android-app/android/app/src/main/res/";
const LIGHT = ["classic", "sky", "sandstone", "sage", "rose"], DARK = ["jade", "indigo", "teal", "ember", "violet"]; // 17 Nov 2026: five each
const cap = s => s[0].toUpperCase() + s.slice(1);

test("launch colours: generated from app.css, one launch theme per light/dark pair, the same table in Java", () => {
  const before = ["values/launch_colors.xml", "values-night/launch_colors.xml", "values-v31/launch_themes.xml"].map(f => read(R + f));
  const COL = JSON.parse(execFileSync("node", [p("tools/launch-themes.mjs")], { encoding: "utf8" }));
  assert.deepEqual(["values/launch_colors.xml", "values-night/launch_colors.xml", "values-v31/launch_themes.xml"].map(f => read(R + f)), before, "resources are up to date (run tools/launch-themes.mjs)");
  const day = read(R + "values/launch_colors.xml"), night = read(R + "values-night/launch_colors.xml"), th = read(R + "values-v31/launch_themes.xml");
  for (const l of LIGHT) for (const d of DARK) {
    const n = l + "_" + d;
    assert.match(day, new RegExp(`name="lg_${n}">${COL[l].g}<`)); assert.match(night, new RegExp(`name="lg_${n}">${COL[d].g}<`));
    // 18 Nov 2026: the ground only, no icon, no animation (the page's opening starts at once)
    assert.match(th, new RegExp(`<style name="Launch\\.${cap(l)}\\.${cap(d)}" parent="AppTheme\\.NoActionBarLaunch">[\\s\\S]*?@drawable/splash_blank<[\\s\\S]*?AnimationDuration">0<`));
    assert.ok(!exists(R + `drawable/splash_door_${n}.xml`), "doorway drawable removed");
  }
  const pl = read(J + "AppearancePlugin.java"), hex = c => "0xFF" + c.slice(1);
  assert.ok(pl.includes(`LIGHT_GROUND = { ${LIGHT.map(k => hex(COL[k].g)).join(", ")} }`), "Java light grounds = app.css");
  assert.ok(pl.includes(`DARK_GROUND = { ${DARK.map(k => hex(COL[k].g)).join(", ")} }`), "Java dark grounds = app.css");
  // the default launch screen (before a theme is saved, and on Android 12) is a new install's: Sandstone / Jade
  assert.match(read(R + "values/colors.xml"), new RegExp(`name="ground">${COL.sandstone.g}<`));
  assert.match(read(R + "values-night/colors.xml"), new RegExp(`name="ground">${COL.jade.g}<`));
  assert.ok(!exists(R + "drawable/splash_door.xml"));
  const cfg = JSON.parse(read("android-app/capacitor.config.json")).plugins.SplashScreen;
  assert.equal(cfg.launchShowDuration, 0, "Android's launch screen ends as soon as the app draws"); assert.equal(cfg.launchFadeOutDuration, 0);
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
  // 18 Nov 2026: the page no longer eases in from Android's colour (on Android 12 that was the wrong theme for a moment)
  assert.doesNotMatch(boot, /--sys-ground/);
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

test("open: the landing is two clean steps on one colour (18 Nov 2026 rework)", () => {
  // 1. the doorway, words and bar drift forward and fade; the ground stays; 2. the ground goes and the page fades in
  assert.match(css, /html\.land-in \.splash\.out\{opacity:1;visibility:hidden;transition:visibility 0s linear \.3s\}/);
  assert.match(css, /html\.land-in \.splash\.out \.sp-in\{opacity:0;transform:scale\(1\.05\);transition:opacity \.28s/);
  assert.match(css, /html\.land-pre #view\{opacity:0;transform:translateY\(16px\)\}/, "the page waits drawn, see-through");
  assert.match(css, /:is\(html\.land-pre,html\.land-in\) :is\(#view,\.top,nav\.tabs\)\{will-change:opacity,transform\}/, "on its own layer before the door opens");
  assert.match(css, /html\.land-in #view\{animation:land-view \.75s cubic-bezier\(\.22,1,\.36,1\) \.26s both\}/);
  assert.match(css, /@keyframes land-view\{from\{opacity:0;transform:translateY\(16px\)\}to\{opacity:1;transform:none\}\}/);
  // prime: the hidden page is drawn during the opening's last 1.5 s, not in the frames the door opens
  assert.match(css, /html\.prime \.splash:not\(\.out\)\{opacity:\.999\}/); assert.match(css, /html\.land-pre\.prime #view,html\.land-pre\.prime :is\(\.top,nav\.tabs\)\{opacity:\.01\}/);
  assert.match(app, /setTimeout\(prime, Math\.max\(0, left - 1500\)\)/);
  assert.match(app, /if \(!primed && h\.classList\.contains\("land-pre"\)\) \{ prime\(\); setTimeout\(go, 180\); return; \}/, "a tap to skip gives the page a moment to be drawn");
  assert.match(app, /if \(held\) document\.documentElement\.classList\.add\("landing", "land-pre"\);/);
  assert.match(app, /rise = h\.classList\.contains\("land-pre"\)/, "not the view's hold, which a quiet redraw clears");
  assert.match(app, /setTimeout\(\(\) => \{ sp\.remove\(\); h\.classList\.remove\("prime"\); if \(rise\) h\.classList\.remove\("land-in", "landing"\); \}, rise \? 1080 : 700\);/);
  assert.match(css, /html\.landing nav\.tabs\{background:var\(--surface\)!important;-webkit-backdrop-filter:none!important;backdrop-filter:none!important\}/, "no blur to redo while the page moves");
  assert.match(app, /const afterSplash = fn => \(\) => \{ if \(\$\("splash"\) \|\| performance\.now\(\) < landEnd\)/, "waiting work waits for the landing to finish");
  assert.match(html, /<span class="sp-bar"[\s\S]*<\/p><\/div><\/div>\n<aside/, "bar, skip and promises are inside .sp-in, so they leave with it");
  // the computer website keeps its own exit
  assert.match(css, /\.splash\.out \.sp-in\{opacity:0;transform:scale\(1\.04\);transition:opacity \.24s cubic-bezier\(\.4,0,\.2,1\)/);
  assert.match(css, /transition:opacity \.38s cubic-bezier\(\.4,0,\.2,1\) \.16s,visibility 0s linear \.56s/);
  assert.match(css, /html:not\(\.native\) \.sp-logo\{animation:sp-settle/, "the website's doorway settles in");
  assert.match(css, /html\.native \.sp-logo\{animation:sp-door-in \.7s cubic-bezier\(\.22,1,\.36,1\) both,sp-breathe 3\.2s ease-in-out 2\.3s infinite alternate\}/);
});
