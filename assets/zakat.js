/* Islam Everyday — Zakat estimate (Phase 5.3). A general educational estimate, not a ruling.
 *
 * Same calculation as before Phase 5.3 (reviewed, unchanged):
 *   assets = cash + gold + silver + investments + business stock + money owed to you
 *   net    = assets − debts due now
 *   nisab  = grams × price per gram of the chosen metal (silver or gold)
 *   due    = 2.5% × net, only when net ≥ nisab (and the wealth has been held for a lunar year, which the user judges)
 * Additions in Phase 5.3: a choice of nisab weights (87.48 g gold / 612.36 g silver — 7.5 and 52.5 tola, the app's
 * previous and default values — or 85 g / 595 g, the weights Islamic Relief Australia uses), input validation, a
 * line-by-line breakdown, and a net figure that never goes below zero. No price is built in: the user enters it.
 * Each value is counted once; nothing is added twice, and only the one debts field is subtracted.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.IE_ZAKAT = api;
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  const ASSETS = ["cash", "gold", "silver", "inv", "biz", "recv"], DEBTS = ["debt"];
  const WEIGHTS = { tola: { gold: 87.48, silver: 612.36 }, g85: { gold: 85, silver: 595 } };
  const RATE = 0.025, MAX = 1e15;
  /* A field value: blank → 0; not a number, negative or absurdly large → 0, and reported. */
  function read(x) {
    if (x == null || String(x).trim() === "") return { v: 0, bad: false };
    const n = Number(String(x).trim());
    if (!Number.isFinite(n) || n < 0 || n > MAX) return { v: 0, bad: true };
    return { v: n, bad: false };
  }
  function calc(input) {
    const v = input.v || {}, invalid = [];
    const get = k => { const r = read(v[k]); if (r.bad) invalid.push(k); return r.v; };
    const lines = ASSETS.map(k => [k, get(k)]), debts = DEBTS.map(k => [k, get(k)]);
    const assets = lines.reduce((a, [, x]) => a + x, 0), owed = debts.reduce((a, [, x]) => a + x, 0);
    const net = assets - owed, netClamped = Math.max(0, net);
    const basis = input.basis === "gold" ? "gold" : "silver", wk = WEIGHTS[input.weights] ? input.weights : "tola";
    const grams = WEIGHTS[wk][basis], pr = read(input.price); if (pr.bad) invalid.push("price");
    const price = pr.v, nisab = grams * price;
    const state = !price ? "noprice" : netClamped >= nisab && netClamped > 0 ? "above" : "below";
    const due = state === "above" ? netClamped * RATE : 0;
    return { lines, debts, assets, owed, net, netClamped, basis, weights: wk, grams, price, nisab, state, due, invalid, rate: RATE };
  }
  return { ASSETS, DEBTS, WEIGHTS, RATE, read, calc };
});
