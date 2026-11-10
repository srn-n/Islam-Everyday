// Feedback by email (October 2026); no email address shown anywhere (November 2026).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { read, loadBrowser } from "./helpers.mjs";

const app = read("assets/app.js");
const shipped = () => ["README.md", "index.html", "manifest.webmanifest", ...readdirSync(new URL("../assets", import.meta.url)).filter(f => f.endsWith(".js")).map(f => "assets/" + f)];

test("no email address is written out anywhere in the app or README", () => {
  for (const f of shipped()) {
    assert.doesNotMatch(read(f), /proton\.me|samiiiur@|yahoo\.com"?\s*$/m, f);
    assert.doesNotMatch(read(f), /[A-Za-z0-9._%+-]+@(yahoo|gmail|outlook|hotmail|proton)\.[a-z.]+/i, f);
  }
});

test("the address is used only inside the feedback mailto link", () => {
  assert.match(app, /FB_TO = \(\) => \["samiiiur", "yahoo\.com"\]\.join\("@"\)/);
  assert.equal((app.match(/FB_TO\(\)/g) || []).length, 1, "used in exactly one place");
  assert.match(app, /return `mailto:\$\{FB_TO\(\)\}\?subject=/);
  assert.doesNotMatch(app, /data-act="fbcopy"|case "fbcopy"/, "no copy-address button");
});

test("legal pages point to More → Feedback, in English and Bangla", () => {
  const LG = loadBrowser("assets/legal.js").IE_LEGAL;
  assert.ok(JSON.stringify(LG.PRIVACY.en).includes("More → Feedback") && JSON.stringify(LG.TERMS.en).includes("More → Feedback"));
  assert.ok(JSON.stringify(LG.PRIVACY.bn).includes("আরও → মতামত") && JSON.stringify(LG.TERMS.bn).includes("আরও → মতামত"));
  assert.equal(LG.UPDATED.en, "11 November 2026");
});

test("Feedback page is a route, in the More menu and the desktop side menu", () => {
  assert.match(app, /const SUBS = \[[^\]]*"feedback"\]/);
  assert.match(app, /feedback: vFeedback \}\[R\.sub\]/);
  assert.match(app, /\["feedback", "mail", t\("feedback_s"\)\]/);
  assert.match(app, /\["feedback", "mail", "more\/feedback"\]/);
});

test("every feedback string exists in English and Bangla", () => {
  const { I18N } = loadBrowser("assets/data.js").DINSATHI;
  const keys = ["feedback", "feedback_s", "fb_intro", "fb_tip", "fb_privacy", "fb_github"];
  for (const k of ["mistake", "problem", "idea", "other"]) keys.push("fb_" + k, "fb_" + k + "_s", "fb_ask_" + k);
  for (const k of keys) assert.ok(I18N.en[k] && I18N.bn[k], k);
  for (const k of ["fb_noapp", "fb_copy", "fb_copied"]) assert.equal(I18N.en[k], undefined, k + " removed");
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
