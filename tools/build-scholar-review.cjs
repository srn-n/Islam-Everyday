// Builds docs/scholar-review.md from the app data: node tools/build-scholar-review.cjs (run from the project root).
const vm = require("vm"), fs = require("fs");
const c = {}; c.window = c; c.self = c; vm.createContext(c);
for (const f of ["assets/votd.js", "assets/votd-en.js", "assets/hadith.js", "assets/nawawi.js", "assets/quran-meta.js"]) vm.runInContext(fs.readFileSync(f, "utf8"), c);
const VE = c.IE_VOTD_EN, V = c.DINSATHI_VOTD, H = c.IE_HADITH, NW = c.IE_NAWAWI, meta = c.QURAN_META.meta;
const cat = Object.fromEntries(H.CATEGORIES.map(x => [x[0], x[1]]));
const C = JSON.parse(fs.readFileSync("data/quran/en-corrections.json", "utf8")).corrections;
const key = r => { const [s, a] = r.split(":").map(Number); return s * 1000 + a; };
const esc = s => String(s).replace(/\|/g, "/");
const L = [];
L.push("# Scholar review pack: Hadith, an-Nawawi's Forty, Verse for today, English translation and explanations, White Days, prohibited times, zakat", "");
L.push("Prepared for a qualified reviewer. **No qualified scholar has reviewed this content yet.** Nothing in the app claims scholarly approval. Please mark each item, add notes, and return the file.", "");
L.push("What has been done so far (checks against sources, not a scholarly review):", "");
L.push("- Hadith: texts, translations and grades are from HadeethEnc.com, reproduced unchanged. On 17 October 2026 all 216 stored fields (Arabic, English, Bangla, attribution and grade for 24 narrations) were identical to HadeethEnc, and all 24 HadeethEnc pages and all 39 sunnah.com references opened at the stated numbers.");
L.push("- Hadith, Phase 5.3: 16 more narrations (h25–h40) and an-Nawawi's Forty Hadith (all 42) were retrieved from HadeethEnc.com on 17–18 October 2026; all 504 general and 378 an-Nawawi fields (Arabic, English, Bangla, takhrij and grade) are checked by SHA-256 against the retrieved text (tests/fixtures/hadith-hashes.json). Each an-Nawawi number was opened on sunnah.com/nawawi40 and its Arabic compared with HadeethEnc's; the underlying collection numbers are the ones sunnah.com links.");
L.push("- Verse for today: every passage was read with its surrounding verses and the Al-Mukhtasar explanation (QuranEnc). The context notes were written for the app.");
L.push("- English translation: compared word by word with three copies of Pickthall's 1930 first edition; see `docs/translation-audit.md`.");
L.push(`- English explanation under the Verse for today (Phase 5.2): Al-Mukhtasar, English edition, QuranEnc.com, retrieved ${VE.SOURCE.retrieved}; ${VE.SOURCE.count} verse explanations stored unchanged and checked by SHA-256 against the publisher's text (fingerprint ${VE.SOURCE.fingerprint}). Published commentary, not AI-generated.`);
L.push("- White Days (Hijri calendar, Phase 5.2): four hadith references opened and read on sunnah.com on 18 October 2026; English quotations are sunnah.com's translations; the Bangla lines are summaries written for the app.", "");
L.push("## Reviewer checklist", "");
for (const x of [
  "Each hadith is authentic as graded, and its reference numbers are correct.",
  "Each hadith's English and Bangla text fairly conveys the Arabic.",
  "No hadith is placed in a category that misrepresents it, and none needs an explanatory note to avoid misunderstanding.",
  "Each Qur'an passage is suitable to show on its own on the home screen, with its context note where one is given.",
  "Each context note is accurate and adds no unsupported interpretation.",
  "The English verses in section C may stand as Pickthall's 1930 wording, or should be changed (say how).",
  "The editorial notes on the English explanations in section D are accurate and sufficient, and no other explanation needs one.",
  "The White Days summary in section E (English quotations, Bangla summaries, grades, the Tashriq exception) is accurate.",
  "Each grade in section G is correct, and the flagged grades (Hasan, or an-Nawawi's own grade) are described fairly.",
  "The context notes on an-Nawawi nos. 8 and 14, and the translation note on no. 35, are accurate and sufficient.",
  "The prohibited-time windows and their wording in section H are acceptable as approximations, and the scope note is correct.",
  "The zakat explanations, assumptions and sources in section I are acceptable for a general educational estimate.",
  "Anything that should be withheld from publication is marked."
]) L.push("- [ ] " + x);
L.push("", "Reviewer name and qualification: ______________________   Date: __________", "");
L.push(`## A. Hadith, general library (${H.HADITH.length})`, "", "Status in the app: `source-checked`. Categories are an editorial choice for the app.", "");
L.push("| # | Reference (sunnah.com) | HadeethEnc id | Narrator | Grade | Categories | Note shown in the app | Review |", "|---|---|---|---|---|---|---|---|");
for (const h of H.HADITH) {
  const refs = h.refs.map(r => (r.c === "bukhari" ? "Bukhari " : "Muslim ") + (r.label || r.n) + (r.wording !== "shown" ? " (" + r.wording + " wording)" : "")).join("; ");
  L.push(`| ${h.id} | ${refs} | ${h.he} | ${esc(h.narrator.en)} | ${esc(h.grade.collection.en)}; HadeethEnc: ${esc(h.grade.he.en)} | ${h.cats.map(k => cat[k]).join(", ")} | ${h.note ? esc(h.note.en) : ""} | [ ] ok [ ] change [ ] withhold |`);
}
L.push("", "For particular attention:", "");
L.push("- h15 (Bukhari 6307, the Prophet ﷺ asking forgiveness more than seventy times a day): shown under hope and dhikr; is a note on its meaning needed?");
L.push("- h23 (Bukhari 1283, \"patience is at the first stroke of calamity\"): shown under \"When You Feel Sad\"; is the tone suitable for a grieving reader?");
L.push("- h02, h06, h07, h10, h11, h21: the wording shown differs in places from one of the cited collections; the card says so.", "");
L.push("## B. Verse for today (180 passages)", "");
L.push("Rule: day 1 is 1 January 2026 in the selected city; index = ((days since the anchor mod 180) + 180) mod 180. Status in the app: `checked` (not scholar-reviewed). English: Pickthall; Bangla: Abu Bakr Zakaria, with Al-Mukhtasar shown under the Bangla.", "");
for (const t of V.THEMES) {
  L.push(`### Days ${t.from}–${t.to}: ${t.en}`, "", "| Day | Passage | Why chosen | Context note | OK |", "|---|---|---|---|---|");
  for (const e of V.SCHEDULE.filter(e => e.seq >= t.from && e.seq <= t.to))
    L.push(`| ${e.seq} | ${meta[e.s - 1][1]} ${e.s}:${e.a}${e.b > e.a ? "–" + e.b : ""} | ${esc(e.why)} | ${e.ctx ? esc(e.ctx.en) : ""} | [ ] |`);
  L.push("");
}
L.push("For particular attention:", "");
L.push("- Day 132 (35:28) begins with the end of a sentence from 35:27 (\"And of men and beasts and cattle, in like manner, divers hues?\"). Consider showing 35:27–28.");
L.push("- Day 6 (6:54): the 1930 English does not render \"through ignorance\" (bi-jahalatin); see section C.");
L.push("- Passages addressed to a particular person or occasion carry a context note (for example days 7, 12, 17, 18, 128). Are the notes sufficient?", "");
L.push("## C. English translation: verses for review", "", "The app follows Pickthall's 1930 first edition. These 1930 readings are used but need a reviewer's view:", "");
L.push("| Verse | Question |", "|---|---|");
for (const x of C.filter(x => x.review).sort((a, b) => key(a.ref) - key(b.ref))) L.push(`| ${x.ref} | ${esc(x.review)} |`);
L.push("", "Held back (the app keeps the digital wording; decide whether to use the 1930 reading):", "");
L.push("- 2:57: the 1930 printing has \"We wronged them not\"; the Arabic and Pickthall's own 7:160 have \"They wronged Us not\".");
L.push("- 82:9: the 1930 printing has \"Nay, but they deny the Judgement\"; the Arabic verb is second person (ye deny).", "");
L.push("Treated as misprints of the 1930 printing and not reproduced: 2:129, 3:147, 4:94, 5:67, 7:53, 7:161, 17:33, 20:109, 45:8, 71:17 (details in `docs/translation-audit.md`).", "");
L.push("## D. English explanation for the Verse for today (Al-Mukhtasar, English)", "");
L.push("Shown under the verse when the app is in English, headed \"Explanation · Al-Mukhtasar · published tafsir, not the Qur'an text\", with the source line. The publisher's leading verse number is hidden; nothing else is changed. QuranEnc lists no version number for this edition (retrieval date recorded instead).", "");
L.push("Explanations with an editorial note written for the app:", "", "| Verse | Editorial note shown | Review |", "|---|---|---|");
for (const [r, f] of Object.entries(VE.FLAGS)) L.push(`| ${r} | ${esc(f.en)} | [ ] ok [ ] change [ ] withhold |`);
L.push("", "Publisher's own wording kept as published (possible typing slips; report to QuranEnc rather than correct):", "");
L.push("- 39:9 \"ascribes parters with Him\"; 59:18 \"what good deeds it has send forth\"; 99:6 \"will come to of the place of reckoning\".");
L.push("- 54:17 carries the publisher's explanation numbered 40 (the same refrain recurs at 54:17, 22, 32 and 40); 59:22–23 and 79:40–41 are explained together and shown once.", "");
L.push("## E. White Days (Ayyām al-Bīḍ) in the Hijri calendar", "");
L.push("| Shown | Reference | Grade as shown | Review |", "|---|---|---|---|");
L.push("| Command to fast the 13th, 14th and 15th; \"like keeping perpetual fast\" (Qatadah ibn Milhan) | Sunan Abi Dawud 2449 (in-book 14/137) | Sahih (al-Albani), as on sunnah.com | [ ] |");
L.push("| Advice to fast three days a month (Abu Hurayrah); al-Bukhari's chapter title names the 13th–15th | Sahih al-Bukhari 1981 | Sahih al-Bukhari | [ ] |");
L.push("| The Prophet ﷺ fasted three days a month without choosing particular days (A'ishah) | Sahih Muslim 1160 | Sahih Muslim | [ ] |");
L.push("| \"The days of Tashriq are the days of eating and drinking\": 13 Dhul-Hijjah is not fasted | Sahih Muslim 1141 | Sahih Muslim | [ ] |");
L.push("", "Dates are calculated (Umm al-Qura, plus the user's ±2-day adjustment), not sighted; the app says so. The fasting plan is a private reminder, not a record of fasts kept.", "");
L.push("## G. An-Nawawi's Forty Hadith (42)", "", "A separate collection from section A, numbered as an-Nawawi numbered it. Texts, takhrij and grades: HadeethEnc.com, unchanged. Nos. 15 and 36 are the same HadeethEnc entries as h10 and h03 in section A and are stored once. \"Flag\" marks grades held for review: outside al-Bukhari and Muslim with a Hasan grade, or graded only by an-Nawawi; this app has not verified those chains.", "");
L.push("| No. | sunnah.com | Underlying collection numbers (linked by sunnah.com) | Takhrij (HadeethEnc) | Grade (HadeethEnc) | Class | Flag | Note in the app | Review |", "|---|---|---|---|---|---|---|---|---|");
for (const r0 of NW.HADITH) {
  const r = r0.shared ? Object.assign({}, r0, (g => ({ attribution: g.attribution, grade: g.grade.he }))(H.HADITH.find(h => h.id === r0.shared))) : r0;
  const refs = r.refs.map(x => NW.COLLECTIONS[x.c].en + " " + x.n + (x.grade ? " (" + x.grade + ")" : "")).join("; ") || "none linked";
  L.push(`| ${r.n} | nawawi40:${r.n} | ${esc(refs)} | ${esc(r.attribution.en)} | ${esc(r.grade.en)} | ${r.cls} | ${r.flag ? "review grade" : ""} | ${r.note ? esc(r.note.en) : r.shared ? "Shared with " + r.shared : ""} | [ ] ok [ ] change [ ] withhold |`);
}
L.push("", `Flagged for review: ${NW.HADITH.filter(r => r.flag).map(r => r.n).join(", ")}. HadeethEnc ids: ${NW.HADITH.map(r => r.n + ":" + r.he).join(", ")}.`, "");
L.push("General library additions (Phase 5.3), chosen for everyday themes not yet covered (mercy, ease, gentleness, truthfulness, humility, greeting, guiding to good, charity, the five prayers, gratitude), only narrations in Sahih al-Bukhari or Sahih Muslim that HadeethEnc grades Authentic: h25–h40 in section A.", "");
L.push("## H. Times when voluntary prayer is avoided (Today card)", "");
L.push("| Shown | Source | Review |", "|---|---|---|");
L.push("| Three times tied to the sun: rising until it is up, at its height until it passes the meridian, setting until it sets | Sahih Muslim 831 ('Uqbah ibn 'Amir) | [ ] |");
L.push("| No prayer after the Fajr prayer until sunrise, nor after the Asr prayer until sunset | Sahih al-Bukhari 586 (Abu Sa'id al-Khudri) | [ ] |");
L.push("| Five times; exceptions for prayers with a reason (e.g. greeting the mosque, tawaf, eclipse) and making up missed prayers, as discussed | Ibn Baz, fatwa 18495, binbaz.org.sa | [ ] |");
L.push("", "Method: sunrise, solar transit (Dhuhr) and sunset are calculated for the user's location and date. Windows used: sunrise to +15 min, Dhuhr −10 min to Dhuhr, Maghrib −15 min to Maghrib (approximations: the sources give no minutes); an advance notice 10 minutes before each. After-Fajr and after-Asr notes appear only when that prayer is ticked. No warning is shown when the day's times cannot be calculated reliably. The app says this concerns voluntary prayer only and that schools differ on exceptions and durations.", "");
L.push("## I. Zakat (educational estimate)", "");
L.push("- Disclaimer shown verbatim (English) with a Bangla translation. Formula unchanged: 2.5% of (cash + gold + silver + investments + business stock + money owed to you − debts due now) when that is at least the nisab; the lunar-year condition is explained, not calculated.");
L.push("- Nisab weights offered: 87.48 g gold / 612.36 g silver (7.5 / 52.5 tola, default) or 85 g / 595 g (the weights Islamic Relief Australia uses). The user enters today's price; none is built in. Silver is the default basis.");
L.push("- Sources: Sahih al-Bukhari 8 (Islam built on five, including zakat) as hadith; Islamic Relief Australia's zakat guide as charity guidance (nisab weights, hawl, debts due within 12 months, superannuation not counted until paid out). The two are labelled apart.", "");
L.push("## J. Open questions for the owner and the reviewer", "");
L.push("1. Keep the one-edition policy (Pickthall 1930), knowing that in 13 verses the 1930 text leaves an element of the Arabic untranslated, or add marked editorial supplements in square brackets?");
L.push("2. Should the Hadith page also show HadeethEnc's published explanation for each narration?");
L.push("3. HadeethEnc does not expose a version number; is the retrieval date an acceptable record?");
L.push("4. Should the notes on the Bangla sources (29 footnote markers without a note; legacy-font characters repaired on display in Al-Mukhtasar) be reported to QuranEnc before release?");
L.push("5. Should the English explanation also be offered in the full Qur'an reader? (Only the 267 Verse-for-today verses are bundled now.)");
L.push("6. Should the HadeethEnc English typo in an-Nawawi no. 35 (\"our brothers\") be reported to HadeethEnc (their term 5)?");
L.push("7. Are the 15/10/15-minute windows for the prohibited times acceptable, or should they follow a particular school's figures?");
fs.writeFileSync("docs/scholar-review.md", L.join("\n") + "\n");
console.log(L.length, "lines");
