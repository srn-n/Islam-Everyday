/* Verse for today: a deterministic pick from the whole Qur'an (6,236 ayat).
 *
 * Day boundary: local midnight in the selected city's time zone. The app passes the
 * city's calendar date (year, month, day); the same date always gives the same ayah,
 * so refreshing during the day never changes it.
 *
 * Selection: dayNumber = days since 1970-01-01 for that calendar date.
 *   index = (dayNumber * STEP + OFFSET) mod 6236
 * STEP = 1009 is coprime with 6236 (= 4 x 1559), so consecutive days visit every
 * ayah exactly once in a 6,236-day cycle, spread across the Qur'an rather than in order.
 * Long ayat are included like any other and are shown in full.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.DINSATHI_VOTD = api;
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  const STEP = 1009, OFFSET = 0, TOTAL = 6236;
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  function dayNumber(y, m, d) { return Math.floor(Date.UTC(y, m - 1, d) / 864e5); }
  function indexFor(y, m, d) { const n = dayNumber(y, m, d); return (((n * STEP + OFFSET) % TOTAL) + TOTAL) % TOTAL; }
  /* counts: ayah counts for surahs 1..114 (in order). Returns [surah, ayah], both 1-based. */
  function locate(index, counts) {
    let k = index;
    for (let s = 0; s < counts.length; s++) { if (k < counts[s]) return [s + 1, k + 1]; k -= counts[s]; }
    throw new RangeError("index out of range: " + index);
  }
  function verseFor(y, m, d, counts) { return locate(indexFor(y, m, d), counts); }
  return { STEP, OFFSET, TOTAL, coprime: gcd(STEP, TOTAL) === 1, dayNumber, indexFor, locate, verseFor };
});
