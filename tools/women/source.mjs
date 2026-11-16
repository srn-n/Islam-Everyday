// Texts for women (16 Nov 2026, Notion: the "For women" page and the reminders on days marked as period days).
// Only published, sourced texts, copied unchanged by tools/women/build.mjs:
//   Qur'an: Arabic and Bangla (Dr. Abu Bakr Muhammad Zakaria) from data/quran; English from the Rowwad Translation
//           Center (QuranEnc, assets/en-rwwad.js; run tools/import-rwwad-subset.py first).
//   Hadith: "he" = HadeethEnc.com records saved in tools/women/hadeethenc (Arabic, English, Bangla, attribution and
//           grade unchanged; each reference opened on sunnah.com on 16 Nov 2026 and the Arabic compared: "shown" =
//           the wording given, "close" = small word differences); "lib" = a narration already in the app's Hadith library (assets/hadith.js, also from
//           HadeethEnc). Only Sahih al-Bukhari or Sahih Muslim, graded authentic.
// The welcome verse is shown once a woman confirms on the For women page; it is not used in the reminders.
export const WELCOME = { q: [3, 195, 195] };
// Slot 1: the worth of women, daughters and mothers in Islam.
export const WORTH = [
  { q: [16, 97, 97] }, { he: 3360, refs: [["muslim", "2631", "shown"]] }, { q: [33, 35, 35] }, { he: 3133, refs: [["muslim", "2630", "shown"]] },
  { q: [4, 124, 124] }, { he: 4182, refs: [["muslim", "2548a", "close"], ["bukhari", "5971", "close"]] }, { q: [9, 71, 71] }, { q: [46, 15, 15] },
  { q: [42, 49, 50] }, { q: [4, 1, 1] }
];
// Slot 2: remembrance of Allah (dhikr), which stays open to a woman on her period.
export const DHIKR = [{ lib: "h11" }, { lib: "h12" }, { lib: "h02" }, { lib: "h15" }];
// Slot 3: good deeds.
export const DEEDS = [{ lib: "h28" }, { q: [99, 7, 8] }, { lib: "h36" }, { lib: "h04" }, { lib: "h16" }];
