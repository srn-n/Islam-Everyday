/* Islam Everyday — the praying figure for "How to pray" (Nov 2026, second version).
 *
 * A side view of a man in a long shirt (kurta) and trousers, facing the qibla (to the right). His right side is towards
 * the viewer, so his right arm and leg are the near ones: right hand over left, the upright right foot and the right
 * index finger are all visible. Faceless: a head with a cap, an ear and the line of the nose only.
 *
 * Pose = joint angles in degrees (0 = up, 90 = towards the qibla, 180 = down, 270 = away from it).
 *   T torso (hip -> shoulders), N neck/head, turn (head turned: + towards the viewer = right, - = left),
 *   legs n/f: th thigh, sh shin, ft foot (ankle -> ball), to toes; arms n/f: either angles (ua, fa, ha) or a target for
 *   the wrist (at: joint name or "ground", dx, dy), solved with two-bone inverse kinematics.
 * The figure is always set on the ground (its lowest point touches it) and the ball of the near foot stays in place,
 * as it does in the prayer. Poses are first resolved to angles, so any two can be blended for movement.
 */
(function (root, factory) { const api = factory(); if (typeof module === "object" && module.exports) module.exports = api; else root.IE_SALAH_FIG = api; })(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  const G = 192, X0 = 214;                                   // ground line, and where the near foot's ball rests
  const LEN = { to: 54, nk: 8, hr: 12, ua: 30, fa: 26, hd: 12, th: 44, sh: 42 };
  const D2R = Math.PI / 180;
  const dir = a => [Math.sin(a * D2R), -Math.cos(a * D2R)];
  const at = (p, a, k) => { const d = dir(a); return [p[0] + d[0] * k, p[1] + d[1] * k]; };
  const ang = v => Math.atan2(v[0], -v[1]) / D2R;
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
  const len = v => Math.hypot(v[0], v[1]);
  const f1 = n => (Math.round(n * 10) / 10).toString();
  const P = p => f1(p[0]) + " " + f1(p[1]);

  /* ---------- shapes ---------- */
  // A limb: two circles joined by straight sides (all arcs sweep the same way, see notes in the changelog).
  function cap(A, B, ra, rb) {
    const a = ang(sub(B, A)), n = (a + 90);
    const A1 = at(A, n, ra), A2 = at(A, n + 180, ra), B1 = at(B, n, rb), B2 = at(B, n + 180, rb), Bt = at(B, a, rb), At = at(A, a + 180, ra);
    return `M${P(A1)}L${P(B1)}A${f1(rb)} ${f1(rb)} 0 0 0 ${P(Bt)}A${f1(rb)} ${f1(rb)} 0 0 0 ${P(B2)}L${P(A2)}A${f1(ra)} ${f1(ra)} 0 0 0 ${P(At)}A${f1(ra)} ${f1(ra)} 0 0 0 ${P(A1)}Z`;
  }
  const circ = (C, r) => `M${f1(C[0] - r)} ${f1(C[1])}a${f1(r)} ${f1(r)} 0 1 0 ${f1(2 * r)} 0a${f1(r)} ${f1(r)} 0 1 0 ${f1(-2 * r)} 0Z`;
  // A closed outline through points, smoothed (quadratic curves through the midpoints).
  function smooth(pts) {
    const m = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], n = pts.length;
    let d = `M${P(m(pts[n - 1], pts[0]))}`;
    for (let i = 0; i < n; i++) d += `Q${P(pts[i])} ${P(m(pts[i], pts[(i + 1) % n]))}`;
    return d + "Z";
  }

  /* ---------- skeleton ---------- */
  function body(p) {
    const H = [0, 0], S = at(H, p.T, LEN.to), Ne = at(S, p.N, LEN.nk), C = at(Ne, p.N, LEN.hr - 1);
    const Hj = at(H, p.T + 90, 1.5), Sj = at(at(S, p.T + 180, 6), p.T + 270, 1);
    const leg = l => { const K = at(Hj, l.th, LEN.th), A = at(K, l.sh, LEN.sh), Bl = at(at(A, l.ft, 13), l.ft + 90, 6), Tp = at(Bl, l.to, 8), Hl = at(at(A, l.ft + 180, 5), l.ft + 90, 5);
      return { K, A, Bl, Tp, Hl }; };
    return { H, S, Ne, C, Hj, Sj, n: leg(p.legs.n), f: leg(p.legs.f) };
  }
  // The lowest points (with their radius) decide where the ground is.
  function bottoms(b, p) {
    const out = [];
    for (const k of ["n", "f"]) { const l = b[k]; out.push(l.K[1] + 7, l.A[1] + 4.5, l.Bl[1] + 3, l.Tp[1] + 2.5, l.Hl[1] + 4); }
    out.push(at(b.H, p.T + 270, 0.5)[1] + 11.6, b.C[1] + LEN.hr);
    return Math.max(...out);
  }
  function place(b, dx, dy) {
    const mv = q => [q[0] + dx, q[1] + dy];
    for (const k of ["H", "S", "Ne", "C", "Hj", "Sj"]) b[k] = mv(b[k]);
    for (const s of ["n", "f"]) for (const k in b[s]) b[s][k] = mv(b[s][k]);
  }
  // Two-bone inverse kinematics: the elbow bends to side +1 or -1.
  function ik(S, T, a, c, bend) {
    const v = sub(T, S), d = Math.max(Math.abs(a - c) + 0.5, Math.min(a + c - 0.05, len(v))), base = ang(v);
    const al = Math.acos(Math.max(-1, Math.min(1, (a * a + d * d - c * c) / (2 * a * d)))) / D2R;
    const ua = base + bend * al, E = at(S, ua, a), fa = ang(sub(at(S, base, d), E));
    return { ua, fa };
  }
  const joint = (b, name) => {
    const m = /^(n|f)\.(\w+)$/.exec(name); if (m) return b[m[1]][m[2]];
    return b[name];
  };
  /* Resolve a pose: every arm becomes angles, and the figure's ground offset is fixed. */
  function resolve(p) {
    const b = body(p), dy = G - bottoms(b, p), dx = X0 - b.n.Bl[0]; place(b, dx, dy);
    const arm = (k, s) => {
      if (s.ua != null) return Object.assign({}, s);
      let tg = s.at === "ground" ? [b.C[0], G] : joint(b, s.at); tg = [tg[0] + (s.dx || 0), tg[1] + (s.dy || 0)];
      if (s.at === "ground") tg[1] = G - (s.dy || 0);
      const r = ik(b.Sj, tg, LEN.ua, LEN.fa, s.bend || 1);
      return { ua: r.ua, fa: r.fa, ha: s.ha != null ? s.ha : r.fa, hand: s.hand || "open", ze: s.ze, zw: s.zw };
    };
    return Object.assign({}, p, { arms: { n: arm("n", p.arms.n), f: arm("f", p.arms.f) }, _dx: dx, _dy: dy });
  }
  /* Sideways (3D) hints: legs zk/za = knee and ankle distance to the person's right (absolute, units as above);
     arms ze/zw = elbow and wrist distance from the middle as a share of the shoulder's (1 = straight down from it,
     0 = on the middle line, below 0 = past it). Defaults: legs straight under the hips, arms hanging. */
  const HIPZ = 7.5, SHZ = 12;
  const lz = (l, s, k) => l[k] != null ? l[k] : (s === "n" ? HIPZ : -HIPZ) * (k === "zk" ? 1 : 1);
  const az = (a, k) => a[k] != null ? a[k] : 1.08;
  const lerpA = (a, b, t) => a + (((b - a + 540) % 360) - 180) * t;
  /* Blend two resolved poses. Hand shapes switch half way. */
  function mix(a, b, t) {
    const o = { T: lerpA(a.T, b.T, t), N: lerpA(a.N, b.N, t), turn: (a.turn || 0) + ((b.turn || 0) - (a.turn || 0)) * t, legs: {}, arms: {} };
    for (const s of ["n", "f"]) {
      o.legs[s] = {}; for (const k of ["th", "sh", "ft", "to"]) o.legs[s][k] = lerpA(a.legs[s][k], b.legs[s][k], t);
      for (const k of ["zk", "za"]) o.legs[s][k] = lz(a.legs[s], s, k) + (lz(b.legs[s], s, k) - lz(a.legs[s], s, k)) * t;
      o.arms[s] = { hand: t < 0.5 ? a.arms[s].hand : b.arms[s].hand }; for (const k of ["ua", "fa", "ha"]) o.arms[s][k] = lerpA(a.arms[s][k], b.arms[s][k], t);
      for (const k of ["ze", "zw"]) o.arms[s][k] = az(a.arms[s], k) + (az(b.arms[s], k) - az(a.arms[s], k)) * t;
    }
    o.sit = t < 0.5 ? a.sit : b.sit;
    return o;
  }

  /* ---------- drawing ---------- */
  function hand(W, h) {
    const a = h.ha;
    if (h.hand === "grip") return [cap(W, at(W, a, 8), 4, 4.2), cap(at(W, a, 6), at(at(W, a, 8), a + 70, 4), 2.6, 2.4)];
    if (h.hand === "point") return [cap(W, at(W, a, 7), 4, 4.3), cap(at(W, a, 6), at(at(W, a, 7), a - 20, 9), 1.9, 1.6), cap(at(W, a, 3), at(at(W, a, 5), a + 60, 3), 2.2, 2)];
    return [cap(W, at(W, a, LEN.hd - 2), 3.9, 2.6), cap(at(W, a, 2), at(at(W, a, 3), a - 45, 5), 2, 1.8)];
  }
  function foot(l) { return [cap(l.A, l.Hl, 4.6, 4.2), cap(l.Hl, l.Bl, 4, 3.2), cap(l.A, at(l.Bl, ang(sub(l.A, l.Bl)) + 0, 3), 4.2, 3.2), cap(l.Bl, l.Tp, 3, 2.4)]; }
  /* The figure as SVG. o: { finger: index finger raised (near hand), points: highlight the seven parts of sujud,
     turbah: the clay tablet under the forehead } */
  function drawSide(p, o) {
    o = o || {};
    const b = body(p);
    const dy = G - bottoms(b, p), dx = X0 - b.n.Bl[0]; place(b, dx, dy);
    const f = p.T + 90, out = [];
    const layer = (cls, parts) => { const d = parts.join(""); out.push(`<path class="sl-ol" d="${d}"/><path class="${cls}" d="${d}"/>`); };
    const armParts = s => { const a = p.arms[s], E = at(b.Sj, a.ua, LEN.ua), W = at(E, a.fa, LEN.fa);
      return { sleeve: [cap(b.Sj, E, 6.6, 5.2), cap(E, at(W, a.fa + 180, 1), 5.2, 4.4)], hand: hand(W, a.hand === "point" && !o.finger ? Object.assign({}, a, { hand: "grip" }) : a), W, E }; };
    const legParts = s => { const l = b[s]; return { pants: [cap(b.Hj, l.K, 9.6, 7.2), cap(l.K, l.A, 7.2, 4.6)], foot: foot(l) }; };
    const fa = armParts("f"), na = armParts("n"), fl = legParts("f"), nl = legParts("n");
    // far side first, then the near leg; the shirt (torso and its skirt, one shape) covers the tops of both thighs
    layer("sl-shirt far", fa.sleeve); layer("sl-skin far", fa.hand);
    layer("sl-pants far", fl.pants); layer("sl-skin far", fl.foot);
    layer("sl-pants", nl.pants); layer("sl-skin", nl.foot);
    const u = p.T, H = b.H, pt = (t, off) => at(at(H, u, t), f, off);
    const torso = smooth([pt(-4, 9.5), pt(12, 11), pt(27, 10.5), pt(42, 12), pt(52, 8.5), pt(57, 0), pt(54, -8.5), pt(42, -11.5), pt(26, -9.5), pt(10, -11.5), pt(-4, -10.5)]);
    const skirt = p.sit ? 0.55 : 0.7, kn = at(b.Hj, p.legs.n.th, LEN.th * skirt), kf = at(b.Hj, p.legs.f.th, LEN.th * skirt);
    layer("sl-skin", [cap(at(b.S, u + 180, 2), b.Ne, 5, 5)]);
    layer("sl-shirt", [torso, cap(at(b.H, u + 180, 1), kf, 11, 10.2), cap(at(b.H, u + 180, 1), kn, 11, 10.2), circ(at(H, f + 180, 0.5), 11.6)]);
    // head: skin, then cap, ear and nose (a turned head shows the nose nearer the middle)
    const N = p.N, tu = Math.max(-1, Math.min(1, p.turn || 0)), nf = Math.cos(tu * Math.PI / 2);
    const headParts = [circ(b.C, LEN.hr)], head = [];
    head.push(`<path class="sl-ol" d="${headParts[0]}"/><path class="sl-skin" d="${headParts[0]}"/>`);
    const capD = `M${P(at(b.C, N - 92, LEN.hr + 0.6))}A${LEN.hr + 0.6} ${LEN.hr + 0.6} 0 0 1 ${P(at(b.C, N + 92, LEN.hr + 0.6))}Q${P(at(b.C, N, 3))} ${P(at(b.C, N - 92, LEN.hr + 0.6))}Z`;
    head.push(`<path class="sl-cap" d="${capD}"/>`);
    if (nf > 0.15 || tu > 0) { const nb = at(b.C, N + 90, LEN.hr * nf - 0.5); head.push(`<path class="sl-face" d="M${P(at(nb, N, 2.5))}L${P(at(at(nb, N + 90, 2.6), N + 180, 2))}L${P(at(nb, N + 180, 2.5))}"/>`); }
    const earAt = at(b.C, N + 90, -2 - 9 * Math.sin(tu * Math.PI / 2));
    head.push(`<ellipse class="sl-ear" cx="${f1(earAt[0])}" cy="${f1(earAt[1])}" rx="2.2" ry="3.2" transform="rotate(${f1(N)} ${f1(earAt[0])} ${f1(earAt[1])})"/>`);
    // With the head down (sujud, going down) it is drawn over the near arm, so the forehead on the ground stays visible.
    const headLow = ((N % 360) + 360) % 360 > 115 && ((N % 360) + 360) % 360 < 245;
    if (!headLow) out.push(head.join(""));
    layer("sl-shirt", na.sleeve); layer("sl-skin", na.hand);
    if (headLow) out.push(head.join(""));
    if (o.turbah) out.unshift(`<rect class="sl-turbah" x="${f1(b.C[0] + 2)}" y="${G - 4}" width="18" height="5" rx="2"/>`);
    if (o.points) { const pts = [at(b.C, N + 135, LEN.hr), na.W, fa.W, b.n.K, b.f.K, b.n.Tp, b.f.Tp];
      out.push(pts.map((q, i) => `<circle class="sl-pt" style="--k:${i}" cx="${f1(q[0])}" cy="${f1(Math.min(G - 1, q[1] + 2))}" r="5.5"/>`).join("")); }
    if (o.turnArrow) { const c = b.C, s = o.turnArrow; out.push(`<path class="sl-turn" d="M${f1(c[0] - 14)} ${f1(c[1] - 22)}Q${f1(c[0])} ${f1(c[1] - 32)} ${f1(c[0] + 14)} ${f1(c[1] - 22)}"/><path class="sl-turn" d="${s > 0 ? `M${f1(c[0] + 14)} ${f1(c[1] - 22)}l-7 -2M${f1(c[0] + 14)} ${f1(c[1] - 22)}l-2 -7` : `M${f1(c[0] - 14)} ${f1(c[1] - 22)}l7 -2M${f1(c[0] - 14)} ${f1(c[1] - 22)}l2 -7`}"/>`); }
    return `<rect class="sl-mat" x="92" y="${G}" width="320" height="7" rx="3.5"/>` + out.join("");
  }


  /* ---------- three-quarter front view (Nov 2026) ----------
     The side-view skeleton above is lifted into 3D: x towards the qibla, y down, z to the person's right. Hips and
     shoulders get their width, arms and legs their sideways hints (ze/zw, zk/za), and everything is seen from the
     front-right (PHI from the qibla line) and a little from above (BETA). Parts are drawn far to near. Faceless.
     who: "man" (cap, kurta to the knees, trousers) or "woman" (headscarf over the shoulders, a long loose dress). */
  const PHI = 66 * D2R, BETA = 11 * D2R, cP = Math.cos(PHI), sP = Math.sin(PHI), cB = Math.cos(BETA), sB = Math.sin(BETA);
  const proj = q => { const x = q[0] - X0, y = q[1] - G, z = q[2], d = x * cP + z * sP; return [X0 + x * sP - z * cP, G + y * cB + d * sB, d]; };
  const add3 = (a, v, k) => [a[0] + v[0] * k, a[1] + v[1] * k, a[2] + v[2] * k];
  function hull(pts) { // monotone chain, 2D
    const P2 = pts.map(q => [q[0], q[1]]).sort((a, b) => a[0] - b[0] || a[1] - b[1]), cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const lo = [], up = []; for (const q of P2) { while (lo.length > 1 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
    for (let i = P2.length - 1; i >= 0; i--) { const q = P2[i]; while (up.length > 1 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
    return lo.slice(0, -1).concat(up.slice(0, -1));
  }
  // a rounded section (an ellipse across the body) at c, depth along fd (2D unit vector), width w across
  const section = (c, fd, dep, w, out, n) => { n = n || 10; for (let i = 0; i < n; i++) { const th = i / n * 2 * Math.PI; out.push(proj([c[0] + fd[0] * Math.cos(th) * dep, c[1] + fd[1] * Math.cos(th) * dep, (c[2] || 0) + Math.sin(th) * w])); } };
  const blob = (c3, r, out, n) => { const c = proj(c3); n = n || 10; for (let i = 0; i < n; i++) { const th = i / n * 2 * Math.PI; out.push([c[0] + Math.cos(th) * r, c[1] + Math.sin(th) * r]); } };
  function skel3(p) {
    const b = body(p), dy = G - bottoms(b, p), dx = X0 - b.n.Bl[0]; place(b, dx, dy);
    const sg = { n: 1, f: -1 }, L = {}, A = {};
    for (const s of ["n", "f"]) {
      const l = b[s], spec = p.legs[s], zk = lz(spec, s, "zk"), za = lz(spec, s, "za"), zh = sg[s] * HIPZ;
      L[s] = { Hp: [b.Hj[0], b.Hj[1], zh], K: [l.K[0], l.K[1], zk], A: [l.A[0], l.A[1], za], Bl: [l.Bl[0], l.Bl[1], za], Tp: [l.Tp[0], l.Tp[1], za], Hl: [l.Hl[0], l.Hl[1], za] };
      const a = p.arms[s], E = at(b.Sj, a.ua, LEN.ua), W = at(E, a.fa, LEN.fa), zs = sg[s] * SHZ;
      A[s] = { S: [b.Sj[0], b.Sj[1], zs], E: [E[0], E[1], zs * az(a, "ze")], W: [W[0], W[1], zs * az(a, "zw")], ha: a.ha, hand: a.hand };
    }
    return { b, L, A, H: [b.H[0], b.H[1], 0], C: [b.C[0], b.C[1], 0], Ne: [b.Ne[0], b.Ne[1], 0], S: [b.S[0], b.S[1], 0] };
  }
  const dep = (...q) => q.reduce((t, x) => t + proj(x)[2], 0) / q.length;
  function draw(p, o) {
    o = o || {};
    if (o.view === "side") return drawSide(p, o);
    const who = o.who === "woman" ? "woman" : "man", W = who === "woman";
    const k = skel3(p), u = p.T, fd = dir(u + 90), parts = [];
    const put = (cls, d, depth, ol) => parts.push({ cls, d, depth, ol: ol !== false });
    const cap3 = (a, b2, ra, rb) => { const A2 = proj(a), B2 = proj(b2); return cap(A2, B2, ra, rb); };
    // hands: the 2D shapes, turned to the projected direction of the hand
    const hand3 = s => { const a = k.A[s], tip = proj([a.W[0] + dir(a.ha)[0] * 10, a.W[1] + dir(a.ha)[1] * 10, a.W[2]]), w = proj(a.W);
      const h = { ha: ang(sub(tip, w)), hand: a.hand === "point" && !o.finger ? "grip" : a.hand }; return hand(w, h).join(""); };
    for (const s of ["n", "f"]) {
      const a = k.A[s], l = k.L[s], far = s === "f" ? " far" : "";
      put("sl-shirt" + far, cap3(a.S, a.E, 6.6, 5.4), dep(a.S, a.E) - 0.2, true);
      put("sl-shirt" + far, cap3(a.E, a.W, 5.4, 4.4), dep(a.E, a.W));
      put("sl-skin" + far, hand3(s), dep(a.W) + 0.4);
      const legC = W ? "sl-shirt" : "sl-pants";
      put(legC + far, cap3(l.Hp, l.K, 9.4, 7.2), dep(l.Hp, l.K));
      put(legC + far, cap3(l.K, l.A, 7.2, 4.8), dep(l.K, l.A));
      put("sl-skin" + far, foot({ A: proj(l.A), Hl: proj(l.Hl), Bl: proj(l.Bl), Tp: proj(l.Tp) }).join(""), dep(l.A, l.Tp) + 0.1);
    }
    // torso: sections from the hips to the shoulders, wrapped
    const tp = []; const tc = t => { const c = at(k.b.H, u, t); return [c[0], c[1], 0]; };
    for (const [t, dp, w] of [[-4, 10.5, 12.5], [10, 10, 11.5], [26, 11, 12.5], [42, 11, 14.5], [52, 8.5, 13.5], [57, 5, 8]]) section(tc(t), fd, dp, w, tp);
    const torsoD = dep(k.H, k.S) - 2;
    // the skirt of the kurta (to the knees) or the dress (to the ankles), over the tops of the legs
    const sk = []; section(tc(-2), fd, 11, 13, sk);
    const skirt = W ? 0.94 : (p.sit ? 0.6 : 0.72);
    for (const s of ["n", "f"]) { const l = k.L[s], kn = [l.Hp[0] + (l.K[0] - l.Hp[0]) * skirt, l.Hp[1] + (l.K[1] - l.Hp[1]) * skirt, l.Hp[2] + (l.K[2] - l.Hp[2]) * skirt];
      blob(kn, W ? 12.5 : 10.5, sk);
      // the dress falls loose and a little wider towards the hem (an A-line), as a long abaya does
      if (W) { const an = [l.K[0] + (l.A[0] - l.K[0]) * 0.86, l.K[1] + (l.A[1] - l.K[1]) * 0.86, l.K[2] + (l.A[2] - l.K[2]) * 0.86]; blob(an, 14, sk); blob(l.K, 12.5, sk); } }
    const legTop = Math.max(...["n", "f"].map(s => dep(k.L[s].Hp, k.L[s].K)));
    const skD = Math.max(torsoD, legTop) + 0.5;
    put("sl-shirt", smooth(hull(tp)), torsoD);
    put("sl-shirt", smooth(hull(sk)), skD);
    if (Math.abs(((u % 360) + 360) % 360) < 40 || p.sit) put("sl-shirt", smooth(hull(tp)), skD + 0.01, false); // one garment: no seam at the waist
    put("sl-skin", cap3([k.S[0], k.S[1], 0], k.Ne, 5, 5), torsoD + 0.1);
    // head: facing direction (turned for the salam), then cap or headscarf
    const N = p.N, tu = Math.max(-1, Math.min(1, p.turn || 0)) * 80 * D2R, fN = dir(N + 90), up = dir(N);
    const fwd = [fN[0] * Math.cos(tu), fN[1] * Math.cos(tu), Math.sin(tu)], C2 = proj(k.C), hd = dep(k.C);
    const upP = proj(add3(k.C, [up[0], up[1], 0], 10)), Np = ang(sub(upP, C2));
    const head = [];
    if (W) {
      // the scarf: round the head and down over the shoulders and chest
      const sc = []; blob(k.C, LEN.hr + 3.2, sc, 14);
      const sh = at(k.b.H, u, 50), ch = at(at(k.b.H, u, 38), u + 90, 7);
      for (const z of [-15, 15]) sc.push(proj([sh[0], sh[1], z]));
      for (const z of [-10, 10]) sc.push(proj([sh[0] + dir(u + 90)[0] * 13, sh[1] + dir(u + 90)[1] * 13, z]), proj([sh[0] - dir(u + 90)[0] * 13, sh[1] - dir(u + 90)[1] * 13, z]));
      sc.push(proj([ch[0], ch[1], -9]), proj([ch[0], ch[1], 9]), proj([at(sh, u + 270, 6)[0], at(sh, u + 270, 6)[1], 0]));
      // Nov 2026 (13th): the scarf falls over the upper back and the chest too, so it reads as a scarf from the side
      const nk = at(k.b.H, u, 34), fdv = dir(u + 90);
      for (const z of [-14, 0, 14]) sc.push(proj([nk[0] + fdv[0] * 17, nk[1] + fdv[1] * 17, z]), proj([nk[0] - fdv[0] * 16, nk[1] - fdv[1] * 16, z])); // wider than the body: a cape-like fall
      head.push(`<path class="sl-ol" d="${smooth(hull(sc))}"/><path class="sl-scarf" d="${smooth(hull(sc))}"/>`);
      const vis = fwd[0] * cP + fwd[2] * sP; // how much of the face turns to the viewer
      if (vis > 0.05) { const fc = proj(add3(k.C, fwd, LEN.hr * 0.5)), rx = 7 * Math.min(1, 0.5 + vis * 0.7), ry = 9;
        head.push(`<ellipse class="sl-skin" cx="${f1(fc[0])}" cy="${f1(fc[1])}" rx="${f1(rx)}" ry="${f1(ry)}" transform="rotate(${f1(Np)} ${f1(fc[0])} ${f1(fc[1])})"/>`); }
    } else {
      head.push(`<path class="sl-ol" d="${circ(C2, LEN.hr)}"/><path class="sl-skin" d="${circ(C2, LEN.hr)}"/>`);
      const r = LEN.hr + 0.6;
      head.push(`<path class="sl-cap" d="M${P(at(C2, Np - 92, r))}A${r} ${r} 0 0 1 ${P(at(C2, Np + 92, r))}Q${P(at(C2, Np, 3))} ${P(at(C2, Np - 92, r))}Z"/>`);
      const ear = [Math.sin(tu) * -1 * 0, 0, 0], rv = [-(fwd[2]) , 0, fwd[0]]; // the right ear: 90° from the face
      const earDir = [fN[0] * -Math.sin(tu), fN[1] * -Math.sin(tu), Math.cos(tu)];
      if (earDir[0] * cP + earDir[2] * sP > 0.1) { const e = proj(add3(k.C, earDir, LEN.hr - 1)); head.push(`<ellipse class="sl-ear" cx="${f1(e[0])}" cy="${f1(e[1])}" rx="2.2" ry="3.2" transform="rotate(${f1(Np)} ${f1(e[0])} ${f1(e[1])})"/>`); }
      void ear; void rv;
      if (fwd[0] * cP + fwd[2] * sP > 0) { const n0 = proj(add3(k.C, fwd, LEN.hr - 0.5)), n1 = proj(add3(add3(k.C, fwd, LEN.hr + 2), [up[0], up[1], 0], -2.5));
        head.push(`<path class="sl-face" d="M${P(proj(add3(add3(k.C, fwd, LEN.hr - 0.5), [up[0], up[1], 0], 2.5)))}L${P(n1)}L${P(n0)}"/>`); }
    }
    // the scarf lies over the shoulders: drawn after the upper arms, before forearms in front of the chest
    // the scarf drapes over the shoulders and upper arms: above both sleeves' upper parts (a hand raised in front of the
    // chest is still drawn over it, as its forearm is nearer)
    const upperN = Math.max(dep(k.A.n.S, k.A.n.E), dep(k.A.n.S) + 0.5);
    // In prostration the head lies between the hands: draw it over the near arm so the forehead on the ground stays in
    // view (as in the side view).
    const headLow = p.N > 115 && p.N < 245;
    put("", head.join(""), headLow ? 1e6 : W ? Math.max(hd, upperN, skD + 0.02) + 0.1 : hd + 0.3, false); // the scarf lies over the dress
    parts.sort((a, b) => a.depth - b.depth);
    const out = parts.map(x => x.cls ? (x.ol ? `<path class="sl-ol" d="${x.d}"/>` : "") + `<path class="${x.cls}" d="${x.d}"/>` : x.d);
    const fh = proj(add3(k.C, fwd, LEN.hr)), gp = (x, z) => proj([x, G, z]);
    if (o.turbah) { const c = k.C[0] + 4, q = [gp(c, -6), gp(c + 16, -6), gp(c + 16, 6), gp(c, 6)]; out.unshift(`<path class="sl-turbah" d="M${q.map(P).join("L")}Z"/>`); }
    if (o.points) { const pts = [[fh[0], Math.max(fh[1], proj([k.C[0], G, 0])[1] - 2)], proj(k.A.n.W), proj(k.A.f.W), proj(k.L.n.K), proj(k.L.f.K), proj(k.L.n.Tp), proj(k.L.f.Tp)];
      out.push(pts.map((q, i) => `<circle class="sl-pt" style="--k:${i}" cx="${f1(q[0])}" cy="${f1(q[1])}" r="5.5"/>`).join("")); }
    if (o.turnArrow) { const c = C2, s2 = o.turnArrow; out.push(`<path class="sl-turn" d="M${f1(c[0] - 14)} ${f1(c[1] - 22)}Q${f1(c[0])} ${f1(c[1] - 32)} ${f1(c[0] + 14)} ${f1(c[1] - 22)}"/><path class="sl-turn" d="${s2 < 0 ? `M${f1(c[0] + 14)} ${f1(c[1] - 22)}l-7 -2M${f1(c[0] + 14)} ${f1(c[1] - 22)}l-2 -7` : `M${f1(c[0] - 14)} ${f1(c[1] - 22)}l7 -2M${f1(c[0] - 14)} ${f1(c[1] - 22)}l2 -7`}"/>`); }
    const m = [gp(X0 - 150, -30), gp(X0 + 70, -30), gp(X0 + 70, 30), gp(X0 - 150, 30)];
    return `<path class="sl-mat" d="M${m.map(P).join("L")}Z"/>` + out.join("");
  }
  /* The box around the figure as drawn in the three-quarter view (for the camera). */
  function bbox3(p) {
    const k = skel3(p), pts = [k.H, k.S, k.C];
    for (const s of ["n", "f"]) { const l = k.L[s], a = k.A[s]; pts.push(l.K, l.A, l.Tp, l.Hl, a.E, a.W); }
    const q = pts.map(proj), xs = q.map(v => v[0]), ys = q.map(v => v[1]);
    return [Math.min(...xs) - 16, Math.min(...ys) - 18, Math.max(...xs) + 16, Math.max(...ys) + 8];
  }

  /* ---------- poses ---------- */
  const STAND_LEGS = { n: { th: 180, sh: 180, ft: 90, to: 90 }, f: { th: 182, sh: 181, ft: 90, to: 90 } };
  // Kneeling with the toes tucked: the shin rises a little towards the heel, the foot stands on its bent toes.
  const KNEEL_LEGS = { n: { th: 178, sh: 282, ft: 176, to: 90 }, f: { th: 176, sh: 282, ft: 176, to: 90 } };
  // Iftirash: sitting on the left foot laid flat (sole up), the right foot upright on its bent toes.
  const SIT_LEGS = { n: { th: 103, sh: 283, ft: 176, to: 90 }, f: { th: 103, sh: 267, ft: 268, to: 268 } };
  // Tawarruk: sitting on the left hip on the ground, the left foot out from under the right shin.
  const TAW_LEGS = { n: { th: 96, sh: 283, ft: 176, to: 90 }, f: { th: 96, sh: 268, ft: 262, to: 262 } };
  // Ja'fari tawarruk (as taught in that school): sitting on the left thigh, the top of the right foot over the left sole.
  const JAF_LEGS = { n: { th: 96, sh: 267, ft: 266, to: 266 }, f: { th: 96, sh: 267, ft: 268, to: 268 } };
  const hang = { ua: 182, fa: 180, ha: 180, hand: "open" };
  const POSE = {
    stand:    { T: 0, N: 10, legs: STAND_LEGS, arms: { n: hang, f: Object.assign({}, hang, { ua: 184 }) } },
    ear:      { T: 0, N: 4, legs: STAND_LEGS, arms: { n: { at: "C", dx: 6, dy: 14, bend: 1, ha: 2, hand: "open", ze: 1.6, zw: 1.5 }, f: { at: "C", dx: 4, dy: 15, bend: 1, ha: 2, hand: "open", ze: 1.6, zw: 1.5 } } },
    shoulder: { T: 0, N: 4, legs: STAND_LEGS, arms: { n: { at: "S", dx: 9, dy: 12, bend: 1, ha: 4, hand: "open", ze: 1.5, zw: 1.3 }, f: { at: "S", dx: 7, dy: 13, bend: 1, ha: 4, hand: "open", ze: 1.5, zw: 1.3 } } },
    low:      { T: 0, N: 14, legs: STAND_LEGS, arms: { n: { at: "H", dx: 11, dy: -12, bend: 1, ha: 70, hand: "grip", ze: 1.12, zw: -0.12 }, f: { at: "H", dx: 9, dy: -14, bend: 1, ha: 76, hand: "open", ze: 1.12, zw: 0.28 } } },
    mid:      { T: 0, N: 14, legs: STAND_LEGS, arms: { n: { at: "H", dx: 12, dy: -29, bend: 1, ha: 70, hand: "grip", ze: 1.15, zw: -0.12 }, f: { at: "H", dx: 10, dy: -31, bend: 1, ha: 76, hand: "open", ze: 1.15, zw: 0.28 } } },
    sides:    { T: 0, N: 14, legs: STAND_LEGS, arms: { n: hang, f: Object.assign({}, hang, { ua: 184 }) } },
    qunut:    { T: 0, N: 8, legs: STAND_LEGS, arms: { n: { at: "S", dx: 19, dy: 9, bend: 1, ha: 78, hand: "open", ze: 1.2, zw: 0.42 }, f: { at: "S", dx: 17, dy: 8, bend: 1, ha: 78, hand: "open", ze: 1.2, zw: 0.42 } } },
    ruku:     { T: 90, N: 92, legs: { n: { th: 176, sh: 182, ft: 90, to: 90 }, f: { th: 178, sh: 183, ft: 90, to: 90 } }, arms: { n: { at: "n.K", dx: 3, dy: -3, bend: 1, ha: 172, hand: "grip", ze: 1.3, zw: 0.64 }, f: { at: "f.K", dx: 1, dy: -4, bend: 1, ha: 172, hand: "grip", ze: 1.3, zw: 0.64 } } },
    kneel:    { T: 2, N: 14, legs: KNEEL_LEGS, arms: { n: { at: "n.K", dx: 8, dy: -16, bend: 1, ha: 100, hand: "open", zw: 0.62 }, f: { at: "f.K", dx: 6, dy: -17, bend: 1, ha: 100, hand: "open", zw: 0.62 } } },
    reach:    { T: 120, N: 132, legs: { n: { th: 150, sh: 200, ft: 120, to: 95 }, f: { th: 152, sh: 202, ft: 120, to: 95 } }, arms: { n: { at: "ground", dx: -4, dy: 3, bend: -1, ha: 90, hand: "open", ze: 1.15, zw: 1.0 }, f: { at: "ground", dx: -6, dy: 3, bend: -1, ha: 90, hand: "open", ze: 1.15, zw: 1.0 } } },
    // Nov 2026 (13th): palms flat beside the head, level with the ears; elbows lifted and away from the sides; thighs
    // upright under the hips; the back long and level rather than hunched.
    sujud:    { T: 115, N: 150, legs: { n: { th: 170, sh: 284, ft: 176, to: 90 }, f: { th: 168, sh: 284, ft: 176, to: 90 } }, arms: { n: { at: "ground", dx: -9, dy: 3.5, bend: -1, ha: 92, hand: "open", ze: 1.75, zw: 1.3 }, f: { at: "ground", dx: -11, dy: 3.5, bend: -1, ha: 92, hand: "open", ze: 1.75, zw: 1.3 } } },
    sit:      { T: 0, N: 22, legs: SIT_LEGS, sit: 1, arms: { n: { at: "n.K", dx: -4, dy: -9, bend: 1, ha: 96, hand: "open", zw: 0.62 }, f: { at: "f.K", dx: -6, dy: -10, bend: 1, ha: 96, hand: "open", zw: 0.62 } } },
    tashahhud:{ T: 0, N: 22, legs: SIT_LEGS, sit: 1, arms: { n: { at: "n.K", dx: -6, dy: -9, bend: 1, ha: 96, hand: "point", zw: 0.62 }, f: { at: "f.K", dx: -6, dy: -10, bend: 1, ha: 96, hand: "open", zw: 0.62 } } },
    tawarruk: { T: 4, N: 22, legs: TAW_LEGS, sit: 2, arms: { n: { at: "n.K", dx: -6, dy: -9, bend: 1, ha: 98, hand: "point", zw: 0.62 }, f: { at: "f.K", dx: -6, dy: -10, bend: 1, ha: 98, hand: "open", zw: 0.62 } } },
    jsit:     { T: 2, N: 22, legs: JAF_LEGS, sit: 2, arms: { n: { at: "n.K", dx: -4, dy: -9, bend: 1, ha: 98, hand: "open", zw: 0.62 }, f: { at: "f.K", dx: -6, dy: -10, bend: 1, ha: 98, hand: "open", zw: 0.62 } } },
    tawsit:   { T: 4, N: 22, legs: TAW_LEGS, sit: 2, arms: { n: { at: "n.K", dx: -4, dy: -9, bend: 1, ha: 98, hand: "open", zw: 0.62 }, f: { at: "f.K", dx: -6, dy: -10, bend: 1, ha: 98, hand: "open", zw: 0.62 } } },
    /* Nov 2026: positions commonly taught for women. chest: right hand over the left on the chest (Hanafi);
       rukuW: a lighter bow, hands resting on the knees with the fingers together, arms close (Hanafi);
       sujudW: gathered, belly near the thighs, forearms down and close to the sides (Hanafi); sujudC: gathered, elbows
       close (taught for women in the other schools); sitW: sitting on the ground with both feet out to the right (Hanafi). */
    chest:    { T: 0, N: 12, legs: STAND_LEGS, arms: { n: { at: "S", dx: 11, dy: 17, bend: 1, ha: 74, hand: "open", ze: 1.02, zw: -0.06 }, f: { at: "S", dx: 9, dy: 19, bend: 1, ha: 78, hand: "open", ze: 1.02, zw: 0.34 } } },
    rukuW:    { T: 62, N: 68, legs: { n: { th: 172, sh: 190, ft: 90, to: 90 }, f: { th: 174, sh: 191, ft: 90, to: 90 } }, arms: { n: { at: "n.K", dx: 2, dy: -4, bend: 1, ha: 176, hand: "open", ze: 1.0, zw: 0.62 }, f: { at: "f.K", dx: 0, dy: -5, bend: 1, ha: 176, hand: "open", ze: 1.0, zw: 0.62 } } },
    sujudW:   { T: 106, N: 148, legs: { n: { th: 150, sh: 284, ft: 176, to: 90, zk: 5, za: 14 }, f: { th: 148, sh: 284, ft: 176, to: 90, zk: -5, za: 4 } }, arms: { n: { at: "ground", dx: -15, dy: 3.5, bend: -1, ha: 92, hand: "open", ze: 0.95, zw: 1.0 }, f: { at: "ground", dx: -17, dy: 3.5, bend: -1, ha: 92, hand: "open", ze: 0.95, zw: 1.0 } } },
    sujudC:   { T: 110, N: 150, legs: { n: { th: 158, sh: 284, ft: 176, to: 90, zk: 6 }, f: { th: 156, sh: 284, ft: 176, to: 90, zk: -6 } }, arms: { n: { at: "ground", dx: -17, dy: 3.5, bend: -1, ha: 92, hand: "open", ze: 1.05, zw: 1.0 }, f: { at: "ground", dx: -19, dy: 3.5, bend: -1, ha: 92, hand: "open", ze: 1.05, zw: 1.0 } } },
    sitW:     { T: 3, N: 22, legs: { n: { th: 100, sh: 270, ft: 268, to: 268, zk: 9, za: 24 }, f: { th: 104, sh: 268, ft: 266, to: 266, zk: -3, za: 16 } }, sit: 2, arms: { n: { at: "n.K", dx: -4, dy: -9, bend: 1, ha: 98, hand: "open", zw: 0.7 }, f: { at: "f.K", dx: -6, dy: -10, bend: 1, ha: 98, hand: "open", zw: 0.3 } } },
    sitWf:    { T: 3, N: 22, legs: { n: { th: 100, sh: 270, ft: 268, to: 268, zk: 9, za: 24 }, f: { th: 104, sh: 268, ft: 266, to: 266, zk: -3, za: 16 } }, sit: 2, arms: { n: { at: "n.K", dx: -6, dy: -9, bend: 1, ha: 98, hand: "point", zw: 0.7 }, f: { at: "f.K", dx: -6, dy: -10, bend: 1, ha: 98, hand: "open", zw: 0.3 } } }
  };
  const RES = {}; for (const k in POSE) RES[k] = resolve(POSE[k]);
  const pose = (k, extra) => extra ? Object.assign({}, RES[k], extra) : RES[k];

  /* ---------- close-ups (front view): where the hands go ---------- */
  // 110 x 120 panel. Front view: the person faces the viewer, so his right hand is on the viewer's left.
  function inset(kind, t, who) {
    const o = [];
    const torso = who === "woman"
      ? `<path class="si-shirt" d="M26 46Q55 38 84 46L88 112H22Z"/><path class="si-scarf" d="M55 9C40 9 36 22 37 34C30 40 24 50 28 60Q55 68 82 60C86 50 80 40 73 34C74 22 70 9 55 9Z"/><ellipse class="si-skin" cx="55" cy="27" rx="9.5" ry="12"/>`
      : `<path class="si-shirt" d="M26 46Q55 38 84 46L88 112H22Z"/><circle class="si-skin" cx="55" cy="26" r="13"/><path class="si-cap" d="M42 24A13 13 0 0 1 68 24Q55 19 42 24Z"/><path class="si-skin" d="M50 37h10v6H50z"/>`;
    const navel = `<circle class="si-mark" cx="55" cy="86" r="1.8"/>`, line = (y, lab) => `<path class="si-guide" d="M14 ${y}H96"/><text class="si-lab" x="98" y="${y + 3}">${lab}</text>`;
    const palm = (x, y, a, front) => `<g transform="translate(${x} ${y}) rotate(${a})"><rect class="si-skin${front ? " front" : ""}" x="-5.5" y="-15" width="11" height="17" rx="5"/><path class="si-fing" d="M-3 -13v-4M0 -14v-4.5M3 -13v-4"/></g>`;
    if (kind === "low" || kind === "mid" || kind === "chest") {
      const y = kind === "low" ? 96 : kind === "mid" ? 76 : 62;
      o.push(torso, navel, `<path class="si-sleeve" d="M28 50Q22 ${y - 10} 40 ${y}"/><path class="si-sleeve" d="M82 50Q90 ${y - 12} 66 ${y}"/>`,
        `<rect class="si-skin" x="44" y="${y - 6}" width="28" height="10" rx="5"/>`, `<rect class="si-skin front" x="36" y="${y - 7}" width="26" height="12" rx="6"/><path class="si-fing" d="M56 ${y - 6}v10M59 ${y - 6}v9"/>`,
        line(86, "•"));
    } else if (kind === "sides") {
      o.push(torso, `<path class="si-sleeve" d="M28 50L22 100"/><path class="si-sleeve" d="M82 50L88 100"/>`, `<rect class="si-skin" x="16" y="98" width="11" height="17" rx="5"/><rect class="si-skin" x="83" y="98" width="11" height="17" rx="5"/>`);
    } else if (kind === "ear" || kind === "shoulder") {
      const y = kind === "ear" ? 30 : 46;
      o.push(torso, `<path class="si-sleeve" d="M28 50Q18 70 27 ${y + 12}"/><path class="si-sleeve" d="M82 50Q92 70 83 ${y + 12}"/>`, palm(27, y + 8, -4, true), palm(83, y + 8, 4, true));
      if (kind === "ear") o.push(`<path class="si-guide" d="M30 30H40M80 30H70"/>`);
    } else if (kind === "qunut") {
      o.push(torso, `<path class="si-sleeve" d="M28 50Q30 74 42 64"/><path class="si-sleeve" d="M82 50Q80 74 68 64"/>`, `<path class="si-skin front" d="M36 58q8 10 18 2v-6q-10 6-18-2z"/><path class="si-skin front" d="M74 58q-8 10-18 2v-6q10 6 18-2z"/>`);
    } else if (/^finger/.test(kind)) {
      // seen from the side: the right hand resting on the right thigh, the index finger pointing towards the qibla.
      // finger: raised at "la ilaha", lowered at "illa Allah" (Hanafi); finger-keep: raised at "illa Allah" and held
      // (Shafi'i); finger-pulse: pointed at each mention of Allah (Hanbali); finger-move: moved gently side to side (Maliki).
      const up = x => Math.max(0, Math.min(1, x));
      const lift = kind === "finger" ? (t < 0.15 ? 0 : t < 0.55 ? up((t - 0.15) * 6) : up(1 - (t - 0.55) * 6)) * 24
        : kind === "finger-keep" ? up((t - 0.5) * 6) * 24 : kind === "finger-pulse" ? Math.max(0, Math.sin(t * Math.PI * 6)) * 18 : 12 + Math.sin(t * Math.PI * 8) * 9;
      o.push(`<path class="si-pants" d="M0 86Q55 78 110 84V118H0Z"/>`,
        `<g transform="rotate(${f1(-lift)} 72 70)"><path class="si-skin" d="M70 66H98Q103 66 103 70Q103 74 98 74H70Z"/></g>`,
        `<path class="si-skin" d="M30 66Q30 58 40 58H68Q76 58 76 66V78Q76 84 68 84H36Q30 84 30 78Z"/><path class="si-fing" d="M58 84q4 3 9 0M48 84q4 3 9 0"/><path class="si-skin" d="M62 58Q66 50 72 54L74 62Z"/>`,
        kind === "finger-move" ? `<path class="si-guide" d="M96 52Q104 68 96 84"/>` : "");
    } else if (kind === "feet") {
      // seen from behind: the left foot laid flat (sat on), the right foot upright with its toes bent towards the qibla
      o.push(`<path class="si-ground" d="M4 110H106"/>`,
        `<path class="si-pants" d="M14 70Q20 52 52 50Q84 52 90 70L92 92H12Z"/>`,                                   // seated, seen from behind
        `<path class="si-skin" d="M10 104Q12 92 30 92H58Q66 92 66 99Q66 106 56 107H16Q10 107 10 104Z"/><path class="si-fing" d="M14 96v8M18 95v9M22 95v9"/>`, // left foot laid flat, sole up, under the body
        `<path class="si-skin" d="M70 60Q70 50 78 50Q86 50 86 60L88 100Q88 106 80 106Q71 106 71 100Z"/><path class="si-fing" d="M73 106l-2 4M77 107v4M81 107l1 4M85 105l2 4"/>`, // right foot upright on bent toes
        `<text class="si-lab" x="20" y="88">L</text><text class="si-lab" x="75" y="46">R</text>`);
    } else if (kind === "seven") {
      o.push(`<text class="si-big" x="55" y="64">7</text>`);
    }
    return who === "woman" ? o.join("").replace(/class="si-pants"/g, 'class="si-shirt"') : o.join(""); // the dress, not trousers
  }
  /* Where the figure is (for the camera): the box around its joints and head, set on the ground as in draw(). */
  function bbox(p) {
    const b = body(p), dy = G - bottoms(b, p), dx = X0 - b.n.Bl[0]; place(b, dx, dy);
    const pts = [b.H, b.S, b.C, b.n.K, b.n.Tp, b.n.Hl, b.f.K, b.f.Tp, b.f.Hl];
    for (const s of ["n", "f"]) { const a = p.arms[s], E = at(b.Sj, a.ua, LEN.ua), W = at(E, a.fa, LEN.fa); pts.push(E, at(W, a.ha, LEN.hd)); }
    const xs = pts.map(q => q[0]), ys = pts.map(q => q[1]);
    return [Math.min(...xs) - 14, Math.min(...ys) - 16, Math.max(...xs) + 14, G];
  }
  return { G, X0, LEN, POSE, RES, pose, resolve, mix, draw, drawSide, body, bbox, bbox3, inset, ik, cap, proj };
});
