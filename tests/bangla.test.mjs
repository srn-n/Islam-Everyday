// Bangla wording (November 2026): one spelling per word across the interface and the app's own writing.
// Quoted Qur'an/hadith translations (inside “ ”) and the Qur'an/hadith data files keep their publishers' spelling.
import { test } from "node:test";
import assert from "node:assert/strict";
import { read, loadBrowser } from "./helpers.mjs";

const { I18N } = loadBrowser("assets/data.js").DINSATHI;
const OLD = ["নামায", "হাদীস", "সহীহ", "বুখারী", "হালনাগাদ", "স্বতন্ত্রভাবে পর্যালোচনা"];

test("interface strings use one spelling (নামাজ, হাদিস, সহিহ, বুখারি) and plain words", () => {
  for (const [k, v] of Object.entries(I18N.bn)) for (const w of OLD) assert.ok(!v.includes(w), `${k}: ${w}`);
});

test("the app's own Bangla writing outside quotations uses the same spelling", () => {
  for (const f of ["assets/app.js", "assets/guide.js", "assets/legal.js", "assets/stories.js", "assets/study-notes.js", "assets/names.js"]) {
    const outside = read(f).replace(/“[^”]*”/g, "");
    for (const w of ["নামায", "হাদীস", "স্বতন্ত্রভাবে পর্যালোচনা"]) assert.ok(!outside.includes(w), `${f}: ${w}`);
  }
});

test("every Bangla string keeps the same placeholders as its English one", () => {
  for (const [k, v] of Object.entries(I18N.en)) {
    const ph = s => [...String(s).matchAll(/\{\w+\}/g)].map(m => m[0]).sort().join();
    assert.equal(ph(I18N.bn[k]), ph(v), k);
  }
});
