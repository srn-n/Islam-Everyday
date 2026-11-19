// 19 Nov 2026: privacy.html is the Privacy Policy as a plain page for Google Play (not a screen inside the app).
// It is built from assets/legal.js by tools/build-privacy.mjs and must match it word for word.
import test from "node:test";
import assert from "node:assert/strict";
import { read, loadBrowser } from "./helpers.mjs";
import { render } from "../tools/build-privacy.mjs";

const LG = loadBrowser("assets/legal.js").IE_LEGAL, page = read("privacy.html");

test("privacy.html is up to date with assets/legal.js (run node tools/build-privacy.mjs)", () => {
  assert.equal(page, render(LG));
});

test("privacy.html is a plain page in both languages: no scripts, every section present", () => {
  assert.doesNotMatch(page, /<script/i);
  assert.equal((page.match(/<h2>/g) || []).length, LG.PRIVACY.en.length + LG.PRIVACY.bn.length);
  assert.match(page, /<section id="en" lang="en">/); assert.match(page, /<section id="bn" lang="bn">/);
  assert.ok(page.includes("children from about 7 years old"));
});

test("the children section says the app is for children from about 7 and collects nothing, in both languages", () => {
  const en = Object.fromEntries(LG.PRIVACY.en)["Children"].join(" "), bn = Object.fromEntries(LG.PRIVACY.bn)["শিশু"].join(" ");
  assert.match(en, /from about 7 years old/); assert.match(en, /collects no personal information/);
  assert.match(bn, /৭ বছর/); assert.match(bn, /ব্যক্তিগত তথ্য অ্যাপ সংগ্রহ করে না/);
});

test("the Android app does not carry privacy.html", () => {
  assert.match(read("android-app/scripts/copy-web.mjs"), /"privacy\.html"\]\);/);
});

test("Developer message: the owner's note in both languages, loaded with legal.js, with a Feedback button", () => {
  const app = read("assets/app.js");
  for (const l of ["en", "bn"]) { assert.equal(LG.DEV[l].p.length, 8); assert.ok(LG.DEV[l].sign); }
  assert.match(LG.DEV.en.p.join(" "), /none of it has been checked by a scholar/);
  assert.match(LG.DEV.bn.p.join(" "), /কোনো আলেম এর কিছুই যাচাই করেননি/);
  assert.match(LG.DEV.en.p.join(" "), /free forever, with no ads, no accounts and no subscriptions/);
  assert.match(app, /privacy: "legal", dev: "legal"/);
  assert.match(app, /LG\.DEV\[st\.lang === "bn" \? "bn" : "en"\]/);
  assert.match(app, /data-act="go" data-tab="more" data-sub="feedback">\$\{t\("feedback"\)\}/);
});

test("Android versionCode is above 1: Play already holds the AAB with versionCode 1 (build #25)", () => {
  const v = +read("android-app/android/app/build.gradle").match(/versionCode (\d+)/)[1];
  assert.ok(v >= 2, "raise versionCode by 1 for every AAB uploaded to Play");
});
