/* Islam Everyday — Today on the website at desktop widths (19 Nov 2026). Loaded on computers only (app.js LAZY.desk),
 * never in the Android app. window.IE_DESK_TODAY(A) returns todayGrid(), which app.js calls after each render. */
(function () {
  "use strict";
  window.IE_DESK_TODAY = A => {
    const TG = { ro: null, raf: 0 };
    /* Today on the website, wide screens (19 Nov 2026, Notion: "uneven space and gaps between the boxes"). The fixed grid
       lined the boxes up in rows, so a short box left a gap under it and one column ended far below the others. Now each
       of the three columns stacks its boxes with the same 20 px between them: the Today card and the prayer times share the
       top row, the Verse for today runs under the Today card, the tracker under the prayer times, and the other boxes go,
       tallest first, to whichever column is shortest. The last box of a column that ends short is stretched to line up
       with the longest (up to 400 px), so the bottom edge is even. Measured again whenever a box changes height.
       Website only, never the Android app, and only at desktop widths (app.css .v-today.mas); phones are untouched. */
    function todayGrid() {
      const v = A.$("view");
      const on = !A.NATIVE && A.route().tab === "today" && v && v.classList.contains("v-today") && matchMedia("(min-width:1024px)").matches;
      if (!on) { if (TG.ro) { TG.ro.disconnect(); TG.ro = null; } if (v && v.classList.contains("mas")) { v.classList.remove("mas"); [...v.children].forEach(el => { el.style.gridColumn = el.style.gridRow = el.style.alignSelf = ""; }); } return; }
      const kids = [...v.children], foot = kids.find(el => el.classList.contains("site-foot")), cards = kids.filter(el => el !== foot);
      const U = 4, GAP = 20, sp = px => Math.ceil(px / U), gp = GAP / U;
      const wide = el => el.classList.contains("a-hero") || el.classList.contains("a-verse");
      const right = el => el.classList.contains("a-times") || el.classList.contains("a-track");
      v.classList.add("mas");
      // 1. columns first (a box's height depends on its width), every box at its natural height
      cards.forEach(el => { el.style.gridColumn = wide(el) ? "1 / 3" : right(el) ? "3" : ""; el.style.alignSelf = "start"; el.style.gridRow = ""; });
      const others = cards.filter(el => !wide(el) && !right(el));
      others.forEach(el => { el.style.gridColumn = "1"; });
      const H = new Map(cards.map(el => [el, el.getBoundingClientRect().height]));
      // 2. place: top row (Today card and prayer times share a height), then the verse and the tracker, then the rest
      const top = [0, 0, 0], put = [];
      const hero = cards.find(el => el.classList.contains("a-hero")), times = cards.find(el => el.classList.contains("a-times"));
      const row1 = Math.max(hero ? sp(H.get(hero)) : 0, times ? sp(H.get(times)) : 0);
      if (hero) { put.push([hero, "1 / 3", 0, row1, true]); top[0] = top[1] = row1 + gp; }
      if (times) { put.push([times, "3", 0, row1, true]); top[2] = row1 + gp; }
      cards.forEach(el => { if (el === hero || el === times) return;
        if (wide(el)) { const r = Math.max(top[0], top[1]); put.push([el, "1 / 3", r, sp(H.get(el))]); top[0] = top[1] = r + sp(H.get(el)) + gp; }
        else if (right(el)) { put.push([el, "3", top[2], sp(H.get(el))]); top[2] += sp(H.get(el)) + gp; } });
      // the other boxes: every way of sharing them among the three columns is tried (a handful of boxes, so at most a few
      // hundred ways), keeping the one whose columns end most evenly; the Hijri tile is best not stretched (it is a picture)
      const n = others.length, hs = others.map(el => sp(H.get(el)));
      let best = null, bestScore = Infinity;
      for (let k = 0, all = Math.pow(3, Math.min(n, 7)); k < all; k++) {
        const t = top.slice(), lastOf = [-1, -1, -1]; let x = k;
        for (let i = 0; i < n; i++) { const c = n <= 7 ? x % 3 : t.indexOf(Math.min(...t)); x = Math.floor(x / 3); t[c] += hs[i] + gp; lastOf[c] = i; }
        const mx = Math.max(...t);
        let score = mx - Math.min(...t);
        lastOf.forEach((i, c) => { if (i >= 0 && others[i].classList.contains("a-tiles") && mx - t[c] > 10) score += 200; });
        if (score < bestScore) { bestScore = score; best = k; }
      }
      { let x = best || 0; others.forEach((el, i) => { const c = n <= 7 ? x % 3 : top.indexOf(Math.min(...top)); x = Math.floor(x / 3);
          put.push([el, String(c + 1), top[c], hs[i]]); top[c] += hs[i] + gp; }); }
      // 3. even bottom edge: stretch each column's last box up to 400 px
      const end = Math.max(...top) - gp;
      [0, 1, 2].forEach(c => { const last = put.filter(p => p[1] === String(c + 1)).sort((a, b) => b[2] - a[2])[0];
        if (last && end - (last[2] + last[3]) <= sp(400)) { last[3] = end - last[2]; last[4] = true; } });
      put.forEach(([el, col, r, n, str]) => { el.style.gridColumn = col; el.style.gridRow = `${r + 1} / span ${Math.max(1, n)}`; el.style.alignSelf = str ? "stretch" : "start"; });
      if (foot) { foot.style.gridColumn = "1 / -1"; foot.style.gridRow = `${end + gp + 1} / span ${sp(60)}`; foot.style.alignSelf = "start"; }
      // again whenever a box changes size (a day picked in the tracker, a note opened, the window resized)
      if (!TG.ro && window.ResizeObserver) TG.ro = new ResizeObserver(() => { cancelAnimationFrame(TG.raf); TG.raf = requestAnimationFrame(todayGrid); });
      if (TG.ro) { TG.ro.disconnect(); cards.forEach(el => TG.ro.observe(el)); }
    }
    addEventListener("resize", () => { cancelAnimationFrame(TG.raf); TG.raf = requestAnimationFrame(todayGrid); });
    return todayGrid;
  };
})();
