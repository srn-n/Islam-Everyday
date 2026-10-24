#!/usr/bin/env node
// Builds the offline Qur'an data used by Islam Everyday from raw source files.
// Run once when a source edition changes:
//   npm run import:quran -- --en <eng-mohammedmarmadu.json> --bn <bn-zakaria-quranenc-v1.1.1.json> --bnt <bn-mukhtasar-quranenc-v1.0.0.json> [--ar <quran-ar.json>]
// Outputs (all aligned to the same 114 surahs / 6,236 ayat):
//   data/quran/ar/NNN.json  ["ayah 1", ...]             Arabic (Uthmani)
//   data/quran/en/NNN.json  ["ayah 1", ...]             English, Pickthall
//   data/quran/bn/NNN.json  {"t":[...], "f":[...]}     Bangla, Abu Bakr Zakaria, with the translator's footnotes
//   data/quran/bnt/NNN.json ["ayah 1", ...]             Bangla short tafsir: Al-Mukhtasar (Tafsir Center for Quranic Studies), as published
// English corrections: data/quran/en-corrections.json lists verses where the Tanzil text is corrected to the
// translator's 1930 wording. Each entry carries the exact source text; the import stops if it no longer matches.
//   data/quran/editions.json  source, licence and attribution metadata (shipped with the data)
//   data/quran/coverage.json  machine-checkable coverage report
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));
const OUT = join(ROOT, "data", "quran");
const args = Object.fromEntries(process.argv.slice(2).reduce((a, v, i, arr) => (v.startsWith("--") ? [...a, [v.slice(2), arr[i + 1]]] : a), []));
if (!args.en || !args.bn || !args.bnt) { console.error("Usage: npm run import:quran -- --en <file> --bn <file> --bnt <file> [--ar <file>]"); process.exit(2); }
const sha = p => createHash("sha256").update(readFileSync(p)).digest("hex");
const meta = (() => { const src = readFileSync(join(ROOT, "assets", "quran-meta.js"), "utf8"); return JSON.parse(src.slice(src.indexOf("=") + 1).trim().replace(/;\s*$/, "")).meta; })();
const counts = meta.map(m => m[3]);
const pad = n => String(n).padStart(3, "0");

// Arabic: existing project text (quran-json, Uthmani script from quranenc.com)
const arPath = args.ar || join(ROOT, "data", "quran-ar.json");
const ar = existsSync(arPath) ? JSON.parse(readFileSync(arPath, "utf8"))
  : counts.map((_, i) => JSON.parse(readFileSync(join(OUT, "ar", pad(i + 1) + ".json"), "utf8"))); // after first import the per-surah files are the Arabic source
const arHash = existsSync(arPath) ? sha(arPath) : createHash("sha256").update(JSON.stringify(ar)).digest("hex");
// English: Tanzil "en.pickthall" text as mirrored by fawazahmed0/quran-api (branch 1)
const enRaw = JSON.parse(readFileSync(args.en, "utf8")).quran;
// Bangla: QuranEnc API "bengali_zakaria" v1.1.1, all 114 surahs, translation + footnotes as published
const bnRaw = JSON.parse(readFileSync(args.bn, "utf8"));

const group = (rows, s, a, f) => { const g = Array.from({ length: 114 }, (_, i) => new Array(counts[i]).fill(null)); for (const r of rows) { const si = +r[s] - 1, ai = +r[a] - 1; if (g[si] && ai >= 0 && ai < g[si].length) g[si][ai] = f(r); } return g; };
const en = group(enRaw, "chapter", "verse", r => r.text);
const bn = group(bnRaw.ayahs, "s", "a", r => ({ t: r.t, f: r.f || "" }));
// Bangla short tafsir: QuranEnc API "bengali_mokhtasar" v1.0.0, as published (verse groups repeat the shared explanation)
const bntRaw = JSON.parse(readFileSync(args.bnt, "utf8"));
const bnt = group(bntRaw.ayahs, "s", "a", r => r.t);
// English corrections to the translator's 1930 wording (see data/quran/en-corrections.json)
const corrPath = join(OUT, "en-corrections.json");
const enCorr = existsSync(corrPath) ? JSON.parse(readFileSync(corrPath, "utf8")).corrections : [];
for (const c of enCorr) {
  const [s, a] = c.ref.split(":").map(Number);
  if (en[s - 1][a - 1] !== c.source) throw new Error(`English correction ${c.ref}: source text no longer matches; review en-corrections.json`);
  en[s - 1][a - 1] = c.corrected;
}

const coverage = { generated: new Date().toISOString().slice(0, 10), expectedSurahs: 114, expectedAyahs: counts.reduce((x, y) => x + y, 0), languages: {} };
const report = (lang, grid, text) => {
  const missing = [], empty = [];
  grid.forEach((s, i) => s.forEach((v, j) => { if (v == null) missing.push(`${i + 1}:${j + 1}`); else if (!String(text(v)).trim()) empty.push(`${i + 1}:${j + 1}`); }));
  coverage.languages[lang] = { ayahs: coverage.expectedAyahs - missing.length - empty.length, missing, empty, complete: !missing.length && !empty.length };
};
report("ar", ar.map((s, i) => { if (s.length !== counts[i]) throw new Error(`Arabic surah ${i + 1} has ${s.length} ayat, expected ${counts[i]}`); return s; }), v => v);
report("en", en, v => v);
report("bn", bn, v => v.t);
report("bnt", bnt, v => v);
coverage.languages.en.corrections = enCorr.length;
// Footnote markers that the source publishes without a matching footnote text (kept as published, listed for review)
const marks = s => new Set([...s.matchAll(/\[([০-৯]+)\]/g)].map(m => m[1]));
coverage.languages.bn.footnotes = { ayahsWithFootnotes: 0, markersWithoutNote: [] };
bn.forEach((s, i) => s.forEach((v, j) => { if (!v) return; if (v.f.trim()) coverage.languages.bn.footnotes.ayahsWithFootnotes++; const m = marks(v.t), f = marks(v.f); if ([...m].some(x => !f.has(x))) coverage.languages.bn.footnotes.markersWithoutNote.push(`${i + 1}:${j + 1}`); }));

for (const l of ["ar", "en", "bn", "bnt"]) mkdirSync(join(OUT, l), { recursive: true });
for (let i = 0; i < 114; i++) {
  writeFileSync(join(OUT, "ar", pad(i + 1) + ".json"), JSON.stringify(ar[i]));
  writeFileSync(join(OUT, "en", pad(i + 1) + ".json"), JSON.stringify(en[i]));
  writeFileSync(join(OUT, "bn", pad(i + 1) + ".json"), JSON.stringify({ t: bn[i].map(v => v && v.t), f: bn[i].map(v => v && v.f) }));
  writeFileSync(join(OUT, "bnt", pad(i + 1) + ".json"), JSON.stringify(bnt[i]));
}

const editions = {
  schema: 1,
  numbering: "Kufan, 114 surahs, 6,236 ayat; ayah 1 of Al-Fatihah is the basmala",
  ar: {
    id: "ar-uthmani-quranenc", language: "ar", title: "The Noble Qur'an, Uthmani script",
    source: "quran-json npm package v3.1.2 (risan/quran-json), which takes the Uthmani text from the Noble Qur'an Encyclopedia (quranenc.com)",
    sourceUrl: "https://github.com/risan/quran-json", license: "Package licensed CC BY-SA 4.0 (LICENSE.txt); the Qur'an text itself is not subject to copyright",
    attribution: "Arabic text: Noble Qur'an Encyclopedia (quranenc.com) via quran-json", inputSha256: arHash
  },
  en: {
    id: "en-pickthall", language: "en", title: "The Meaning of the Glorious Koran", translator: "Mohammed Marmaduke William Pickthall (1875-1936)",
    edition: "Wording follows the first edition (New York: Alfred A. Knopf; London: George Allen & Unwin, 1930). Digital base text: Tanzil 'en.pickthall' (an edited electronic text of unidentified origin, descended from the USC-MSA text), mirrored in fawazahmed0/quran-api edition 'eng-mohammedmarmadu', corrected to the 1930 wording",
    sourceUrl: "https://raw.githubusercontent.com/fawazahmed0/quran-api/1/editions/eng-mohammedmarmadu.json", sourceCommit: "47ca096b0976443ba2eab2e45cdf0fb4096a2610",
    upstream: "https://tanzil.net/trans/en.pickthall",
    license: "The 1930 translation is in the public domain: the translator died in 1936, so the term has ended in life+70 countries (Australia, the UK, the EU) and in Bangladesh (life+60), and the 1930 US publication entered the US public domain on 1 January 2026. Tanzil offers its translation files for non-commercial use with credit (tanzil.net/trans); this app is free and non-commercial and credits Tanzil. The fawazahmed0/quran-api repository is released under The Unlicense. The wording of later revised printings is not used.",
    attribution: "English translation: Marmaduke Pickthall, The Meaning of the Glorious Koran (1930 first edition). Digital base text from Tanzil (tanzil.net) via fawazahmed0/quran-api, corrected to the 1930 wording.",
    notices: [`Wording follows the 1930 first edition. ${enCorr.length} verses of the Tanzil text are corrected to the 1930 wording (transcription errors, the replaced words "God", "Owner" and "Mecca", and the edited electronic text's rewordings), each checked against three 1930 copies and later printings. Modern spellings (judgment, steadfast and similar) and the digital text's punctuation are kept. Every change, with the replaced text, the reason and the checks made, is listed in data/quran/en-corrections.json and docs/translation-audit.md.`],
    corrections: "data/quran/en-corrections.json", inputSha256: sha(args.en)
  },
  bn: {
    id: "bn-zakaria-quranenc", language: "bn", title: "Translation of the Meanings of the Noble Quran - Bengali Translation - Abu Bakr Zakaria",
    translator: "Dr. Abu Bakr Muhammad Zakaria", version: bnRaw.version, versionDate: bnRaw.version_date, publisher: "Encyclopedia of the Noble Qur'an (QuranEnc.com)",
    sourceUrl: "https://quranenc.com/en/browse/bengali_zakaria", api: bnRaw.source, retrieved: (bnRaw.retrieved || "").slice(0, 10),
    license: "QuranEnc republication terms: (1) no modification, addition or deletion of the content; (2) clearly refer to the publisher and the source (QuranEnc.com); (3) mention the version number; (4) keep the transcript information inside the document; (5) notify QuranEnc.com of any note on the translation; (6) update to the latest version issued by QuranEnc.com; (7) no inappropriate advertisements alongside the translation.",
    attribution: `Bangla translation: Dr. Abu Bakr Muhammad Zakaria, version ${bnRaw.version} (${bnRaw.version_date}), published by QuranEnc.com (https://quranenc.com/en/browse/bengali_zakaria).`,
    notices: ["Translation and footnotes are bundled exactly as returned by the QuranEnc API (footnotes included, nothing removed).", "Maintenance duty: check QuranEnc.com for newer versions and re-run `npm run import:quran`.", "Islam Everyday shows no advertisements."],
    inputSha256: sha(args.bn)
  },
  bnt: {
    id: "bn-mukhtasar-quranenc", language: "bn", kind: "tafsir (short explanation, not a translation)", title: bntRaw.title,
    issuer: bntRaw.issuer, version: bntRaw.version, versionDate: bntRaw.version_date, publisher: "Encyclopedia of the Noble Qur'an (QuranEnc.com)",
    sourceUrl: "https://quranenc.com/en/browse/bengali_mokhtasar", api: bntRaw.source, retrieved: (bntRaw.retrieved || "").slice(0, 10),
    license: "QuranEnc republication terms: (1) no modification, addition or deletion of the content; (2) clearly refer to the publisher and the source (QuranEnc.com); (3) mention the version number; (4) keep the transcript information inside the document; (5) notify QuranEnc.com of any note on the translation; (6) update to the latest version issued by QuranEnc.com; (7) no inappropriate advertisements alongside the translation.",
    attribution: `Bangla short tafsir: Al-Mukhtasar in Interpreting the Noble Quran, ${bntRaw.issuer}, Bengali version ${bntRaw.version} (${bntRaw.version_date}), published by QuranEnc.com (https://quranenc.com/en/browse/bengali_mokhtasar).`,
    notices: ["Text bundled exactly as returned by the QuranEnc API. Where the publisher explains a group of verses together, each verse in the group carries the same explanation.", "About 1,100 entries contain left-over characters from an old Bangla font encoding (for example ত্রæটি for ত্রুটি). The data is kept as published; the app repairs these characters only when displaying them (assets/bnfix.js), and they are listed for reporting to QuranEnc.", "Maintenance duty: check QuranEnc.com for newer versions and re-run `npm run import:quran`.", "Islam Everyday shows no advertisements."],
    inputSha256: sha(args.bnt)
  }
};
writeFileSync(join(OUT, "editions.json"), JSON.stringify(editions, null, 2));
writeFileSync(join(OUT, "coverage.json"), JSON.stringify(coverage, null, 2));
console.log(JSON.stringify({ ar: coverage.languages.ar.ayahs, en: coverage.languages.en.ayahs, enCorrections: enCorr.length, bn: coverage.languages.bn.ayahs, bnt: coverage.languages.bnt.ayahs, bnMarkersWithoutNote: coverage.languages.bn.footnotes.markersWithoutNote.length }, null, 0));
