/* Islam Everyday — label layout for the prayer-day chart (Phase 5.3).
 *
 * Places labels on one row in chronological order. Each label wants to sit centred on its event's x position
 * (computed from the event time and the chart's time scale). Overlapping labels are merged into clusters that are
 * centred on the mean of their wanted positions, then the whole row is kept inside [min, max]. The result never
 * reorders labels, never overlaps them (given the row is wide enough) and moves each label as little as possible.
 * If the row is too narrow for all labels, they are spread evenly over the row, still in order.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.IE_DAYVIZ = api;
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  /* items: [{ x: wanted centre, w: width }] in chronological order. Returns centres (same order). */
  function layoutLabels(items, min, max, gap) {
    gap = gap == null ? 4 : gap;
    const n = items.length; if (!n) return [];
    const total = items.reduce((a, it) => a + it.w, 0) + gap * (n - 1);
    if (total > max - min) { // not enough room: even spread, in order
      const out = []; let x = min + Math.max(0, (max - min - total) / 2);
      for (const it of items) { out.push(x + it.w / 2); x += it.w + gap; }
      return out;
    }
    // clusters of consecutive labels; each cluster has a left edge and total width
    let cl = items.map((it, i) => ({ s: i, e: i, w: it.w, want: it.x * it.w, ww: it.w }));
    const place = c => { const centre = c.want / c.ww; return Math.max(min, Math.min(max - c.w, centre - c.w / 2)); };
    let merged = true;
    while (merged) {
      merged = false;
      for (let i = 0; i + 1 < cl.length; i++) {
        const a = cl[i], b = cl[i + 1];
        if (place(a) + a.w + gap > place(b)) {
          cl.splice(i, 2, { s: a.s, e: b.e, w: a.w + gap + b.w, want: a.want + b.want, ww: a.ww + b.ww });
          merged = true; break;
        }
      }
    }
    const out = new Array(n);
    for (const c of cl) { let x = place(c); for (let i = c.s; i <= c.e; i++) { out[i] = x + items[i].w / 2; x += items[i].w + gap; } }
    return out;
  }
  /* Rough text width for the chart's font (Latin and Bangla) in SVG units. */
  const textW = (s, size) => String(s).length * size * 0.58 + 6;
  return { layoutLabels, textW };
});
