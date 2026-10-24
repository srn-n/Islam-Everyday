/* Islam Everyday — day-aware Verse for today (Face 7).
 *
 * On a Thursday or Friday the Today page may feature a passage chosen for that day instead of the normal
 * 180-day schedule (assets/votd.js). Rules:
 *   - Only entries with review === "reviewed" are ever shown. "reviewed" must mean a qualified reviewer has
 *     approved the passage, its reference and the label shown with it; the app's developer cannot set it alone.
 *   - If there is no reviewed entry for that weekday, the normal daily verse is used. Nothing is generated.
 *   - The label says only that the passage was chosen for the day by its subject. It must not say or imply that a
 *     verse was revealed for that day, or that reading it then has a particular virtue, unless a reliable source
 *     for that claim is added to the entry and reviewed.
 *   - Texts are read from the app's own Qur'an data (Pickthall 1930 English, Zakaria Bangla), as for every verse.
 *
 * Entries use the same shape as assets/votd.js (s, surah, a, b, theme, why, ctx, review, src), plus `wd`
 * (weekday, 0 = Sunday … 4 = Thursday, 5 = Friday).
 *
 * Current state: one DRAFT for Friday (62:9–10, whose own wording names the call to prayer on the day of
 * congregation). It is NOT shown until reviewed. There is no Thursday entry: no passage was found whose relevance
 * to Thursday rests on a reliable source, so Thursday keeps the normal verse.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.IE_VOTD_DAY = api;
})(typeof self !== "undefined" ? self : this, function () {
  const ENTRIES = [
    {
      id: "fri-62-9", wd: 5, s: 62, surah: "Al-Jumu'ah", a: 9, b: 10, theme: "prayer",
      why: "The verses themselves address the believers about the call to prayer on the day of congregation and what follows it.",
      ctx: null,
      review: "draft",
      src: ["https://quran.com/62/9-10", "https://quranenc.com/en/browse/bengali_mokhtasar/62#9"]
    }
  ];
  // Returns a reviewed entry for this weekday, or null (then the caller uses the normal schedule).
  function pick(weekday) { return ENTRIES.find(e => e.wd === weekday && e.review === "reviewed") || null; }
  return { ENTRIES, pick };
});
