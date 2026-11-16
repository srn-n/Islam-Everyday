// 16 Nov 2026 (Notion): smoother section changes and a smoother landing.
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const app = readFileSync(new URL("../assets/app.js", import.meta.url), "utf8");
const css = readFileSync(new URL("../assets/app.css", import.meta.url), "utf8");

test("page slides: the header and tab bar names are always set; the direction lives on the snapshots only", () => {
  assert.match(css, /\n#top\{view-transition-name:ie-top\}\nnav\.tabs\{view-transition-name:ie-tabs\}/);
  assert.match(css, /html\[data-vt="right"\]::view-transition-old\(root\),html\[data-vt="right"\]::view-transition-new\(root\)\{--vtx:-1\}/);
  assert.doesNotMatch(css, /html\[data-vt[^\]]*\]\{--vtx/, "a custom property on the root restyled the whole page on every change");
  assert.match(css, /@keyframes vt-in\{from\{opacity:0;transform:translateX\(calc\(var\(--vtx,1\)/);
});

test("phones read the Qur'an and Hadith page data when idle after the opening, never during it or on a data saver", () => {
  assert.match(app, /else if \(!\(navigator\.connection && navigator\.connection\.saveData\)\) \{/);
  assert.match(app, /const pre = \["study", "hadith"\]/);
  assert.match(app, /setTimeout\(afterSplash\(\(\) => setTimeout\(nextPre, 2500\)\), 600\)/);
});

test("landing: the faded splash stays hidden in the page until the rise and the arc are done", () => {
  assert.match(app, /const splashUp = \(\) => \{ const s = \$\("splash"\); return !!s && !s\.classList\.contains\("gone"\); \};/);
  assert.match(app, /!document\.hidden && !splashUp\(\);/, "page slides work again as soon as the splash has faded");
  assert.match(app, /if \(splashUp\(\)\) \{ shut\(\); return; \}/, "Back right after the landing still goes back");
});

test("date picker (16 Nov, owner): Android's calendar dialog takes the theme the app shows", () => {
  const R = "android-app/android/app/src/main/", J = R + "java/com/simplymadestudio/islameveryday/";
  const x = readFileSync(new URL("../" + R + "res/values/date_pickers.xml", import.meta.url), "utf8");
  const ap = readFileSync(new URL("../" + J + "AppearancePlugin.java", import.meta.url), "utf8");
  const ma = readFileSync(new URL("../" + J + "MainActivity.java", import.meta.url), "utf8");
  const acc = { Classic: /:root\{[^}]*--accent:(#[0-9A-F]{6})/i, Sandstone: /:root\[data-palette="sandstone"\]\{[^}]*--accent:(#[0-9A-F]{6})/i,
    Jade: /:root\[data-theme="dark"\]\{[^}]*--accent:(#[0-9A-F]{6})/i, Teal: /:root\[data-palette="teal"\]\[data-theme="dark"\]\{[^}]*--accent:(#[0-9A-F]{6})/i };
  for (const [N, re] of Object.entries(acc)) {
    const a = css.match(re)[1].toUpperCase();
    assert.match(x, new RegExp(`<style name="PickDlg\\.${N}"[^]*?<item name="android:colorAccent">${a}</item>`), N + " accent");
    assert.match(x, new RegExp(`<style name="PickStyle\\.${N}"[^]*?<item name="android:headerBackground">${a}</item>`), N + " header");
  }
  for (const N of ["Classic", "Sky", "Sandstone", "Jade", "Indigo", "Teal"]) assert.match(x, new RegExp(`<style name="Pick\\.${N}" parent="">\\s*<item name="android:datePickerDialogTheme">@style/PickDlg\\.${N}</item>`));
  assert.match(x, /PickDlg\.Jade" parent="android:Theme\.Material\.Dialog\.Alert"/); assert.match(x, /PickDlg\.Sky" parent="android:Theme\.Material\.Light\.Dialog\.Alert"/);
  assert.match(ap, /a\.getTheme\(\)\.applyStyle\(isDark\(a\) \? PICK_DARK\[darkTheme\(a\)\] : PICK_LIGHT\[lightTheme\(a\)\], true\)/);
  assert.match(ap, /applySplash\(getActivity\(\)\);\s*applyPicker\(getActivity\(\)\);/, "a theme change in the app");
  assert.match(ma, /AppearancePlugin\.applyPicker\(this\); \/\/ the date picker/); assert.match(ma, /onConfigurationChanged[^]*applyPicker\(this\)/, "the phone switching light/dark");
});
