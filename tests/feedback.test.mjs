// Feedback by email (October 2026).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { read, loadBrowser } from "./helpers.mjs";

const app = read("assets/app.js");

test("the current contact address is used everywhere; the old one is gone", () => {
  const files = ["README.md", "index.html", ...readdirSync(new URL("../assets", import.meta.url)).filter(f => f.endsWith(".js")).map(f => "assets/" + f)];
  for (const f of files) assert.doesNotMatch(read(f), /proton\.me/, f);
  assert.match(app, /FB_EMAIL = "samiiiur@yahoo\.com"/);
  const LG = loadBrowser("assets/legal.js").IE_LEGAL;
  for (const l of ["en", "bn"]) {
    assert.ok(JSON.stringify(LG.PRIVACY[l]).includes("samiiiur@yahoo.com"), "privacy " + l);
    assert.ok(JSON.stringify(LG.TERMS[l]).includes("samiiiur@yahoo.com"), "terms " + l);
  }
  assert.equal(LG.UPDATED.en, "30 October 2026");
});

test("Feedback page is a route, in the More menu and the desktop side menu", () => {
  assert.match(app, /const SUBS = \[[^\]]*"feedback"\]/);
  assert.match(app, /feedback: vFeedback \}\[R\.sub\]/);
  assert.match(app, /\["feedback", "mail", t\("feedback_s"\)\]/);
  assert.match(app, /\["feedback", "mail", "more\/feedback"\]/);
});

test("every feedback string exists in English and Bangla", () => {
  const { I18N } = loadBrowser("assets/data.js").DINSATHI;
  const keys = ["feedback", "feedback_s", "fb_intro", "fb_tip", "fb_privacy", "fb_noapp", "fb_copy", "fb_copied", "fb_github"];
  for (const k of ["mistake", "problem", "idea", "other"]) keys.push("fb_" + k, "fb_" + k + "_s", "fb_ask_" + k);
  for (const k of keys) assert.ok(I18N.en[k] && I18N.bn[k], k);
  assert.ok(I18N.en.fb_noapp.includes("{e}") && I18N.bn.fb_noapp.includes("{e}"));
});

test("the email never carries location, tracker records or settings", () => {
  const fn = app.slice(app.indexOf("function fbMail("), app.indexOf("function vFeedback("));
  assert.doesNotMatch(fn, /st\.(gps|city|log|xlog|fplan|nwread|bm|fav|read|last)\b|city\(\)|cname\(/);
  assert.match(fn, /encodeURIComponent\(subj/);
  assert.match(fn, /encodeURIComponent\(lines\.join/);
});

test("every share sheet offers 'Report a mistake' as an email link", () => {
  assert.match(app, /<a class="opt" href="\$\{esc\(fbMail\("mistake", fbItem\(kind, o\)\)\)\}" data-fb="item">/);
});
