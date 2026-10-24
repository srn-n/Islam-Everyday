/* Islam Everyday — tracker helpers: the "Extra worship" record (Witr, voluntary prayers and voluntary fasts),
 * per-date toggling of the five prayers for the tracker's date navigation, and date-key arithmetic.
 *
 * Extra worship is stored in the same saved state as the prayer tracker, under its own key `xlog`; the extra
 * worship functions never touch the five fard prayer records (`log`). Shape: { "YYYY-MM-DD": { tahajjud: true } }.
 * togglePrayer is the only function that works on the fard log, one date and one prayer at a time.
 * Each item is either present (done) or absent for a date, so a record cannot be duplicated, and an empty
 * day is removed rather than kept as {}.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.IE_XTRACK = api;
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  const ITEMS = ["tahajjud", "duha", "rawatib", "witr", "fast"];
  const DAY = /^\d{4}-\d{2}-\d{2}$/;

  /* A clean copy of saved data: only date keys, only known items, only `true` values. */
  function clean(x) {
    const out = {};
    if (!x || typeof x !== "object" || Array.isArray(x)) return out;
    for (const k of Object.keys(x)) {
      const d = x[k];
      if (!DAY.test(k) || !d || typeof d !== "object") continue;
      const o = {};
      for (const i of ITEMS) if (d[i] === true) o[i] = true;
      if (Object.keys(o).length) out[k] = o;
    }
    return out;
  }

  /* Marks an item done for a date, or undoes it if it was already done. Returns a new log; the input is unchanged. */
  function toggle(x, day, item) {
    if (!DAY.test(day)) throw new Error("bad date key: " + day);
    if (!ITEMS.includes(item)) throw new Error("unknown item: " + item);
    const o = Object.assign({}, x[day]);
    if (o[item]) delete o[item]; else o[item] = true;
    const log = Object.assign({}, x);
    if (Object.keys(o).length) log[day] = o; else delete log[day];
    return { log, done: !!o[item] };
  }

  /* Keeps only the given date keys (a Set). */
  function prune(x, keep) {
    const out = {};
    for (const k of Object.keys(x)) if (keep.has(k)) out[k] = x[k];
    return out;
  }

  /* How many of the given dates have the item done. */
  function count(x, days, item) {
    return days.reduce((n, k) => n + (x[k] && x[k][item] ? 1 : 0), 0);
  }

  /* ---- five daily prayers, any date (Phase 5 date navigation) ---- */
  const PRAYERS = ["fajr", "dhuhr", "asr", "maghrib", "isha"];
  /* Toggles one prayer on one date in the fard log ({ "YYYY-MM-DD": { fajr: true, ... } }). Other dates and
     other prayers are copied unchanged; the input is not mutated. Existing keys on the day are kept as they are. */
  function togglePrayer(log, day, prayer) {
    if (!DAY.test(day)) throw new Error("bad date key: " + day);
    if (!PRAYERS.includes(prayer)) throw new Error("unknown prayer: " + prayer);
    const o = Object.assign({}, log[day]);
    o[prayer] = !o[prayer];
    return { log: Object.assign({}, log, { [day]: o }), done: o[prayer] };
  }

  /* ---- date keys: calendar arithmetic on Y/M/D only, never on local clock time, so DST cannot shift a day ---- */
  const pad = n => String(n).padStart(2, "0");
  function key(y, m, d) { return y + "-" + pad(m) + "-" + pad(d); }
  function parts(k) { if (!DAY.test(k)) throw new Error("bad date key: " + k); const [y, m, d] = k.split("-").map(Number); return [y, m, d]; }
  function valid(k) { if (!DAY.test(k)) return false; const [y, m, d] = parts(k); const u = new Date(Date.UTC(y, m - 1, d)); return u.getUTCFullYear() === y && u.getUTCMonth() === m - 1 && u.getUTCDate() === d; }
  function shift(k, n) { const [y, m, d] = parts(k); const u = new Date(Date.UTC(y, m - 1, d + n)); return key(u.getUTCFullYear(), u.getUTCMonth() + 1, u.getUTCDate()); }
  /* Whole days from a to b (b - a). */
  function diff(a, b) { const [y1, m1, d1] = parts(a), [y2, m2, d2] = parts(b); return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 864e5); }
  /* Keeps a selected date inside [min, max] (both date keys); invalid input falls back to max. */
  function clamp(k, min, max) { if (!valid(k)) return max; return diff(min, k) < 0 ? min : diff(k, max) < 0 ? max : k; }

  return { ITEMS, clean, toggle, prune, count, PRAYERS, togglePrayer, key, parts, valid, shift, diff, clamp };
});
