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
      return { ua: r.ua, fa: r.fa, ha: s.ha != null ? s.ha : r.fa, hand: s.hand || "open" };
    };
    return Object.assign({}, p, { arms: { n: arm("n", p.arms.n), f: arm("f", p.arms.f) }, _dx: dx, _dy: dy });
  }
  const lerpA = (a, b, t) => a + (((b - a + 540) % 360) - 180) * t;
  /* Blend two resolved poses. Hand shapes switch half way. */
  function mix(a, b, t) {
    const o = { T: lerpA(a.T, b.T, t), N: lerpA(a.N, b.N, t), turn: (a.turn || 0) + ((b.turn || 0) - (a.turn || 0)) * t, legs: {}, arms: {} };
    for (const s of ["n", "f"]) {
      o.legs[s] = {}; for (const k of ["th", "sh", "ft", "to"]) o.legs[s][k] = lerpA(a.legs[s][k], b.legs[s][k], t);
      o.arms[s] = { hand: t < 0.5 ? a.arms[s].hand : b.arms[s].hand }; for (const k of ["ua", "fa", "ha"]) o.arms[s][k] = lerpA(a.arms[s][k], b.arms[s][k], t);
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
  function draw(p, o) {
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
    ear:      { T: 0, N: 4, legs: STAND_LEGS, arms: { n: { at: "C", dx: 14, dy: 14, bend: 1, ha: 2, hand: "open" }, f: { at: "C", dx: 12, dy: 15, bend: 1, ha: 2, hand: "open" } } },
    shoulder: { T: 0, N: 4, legs: STAND_LEGS, arms: { n: { at: "S", dx: 12, dy: 12, bend: 1, ha: 4, hand: "open" }, f: { at: "S", dx: 10, dy: 13, bend: 1, ha: 4, hand: "open" } } },
    low:      { T: 0, N: 14, legs: STAND_LEGS, arms: { n: { at: "H", dx: 11, dy: -12, bend: 1, ha: 70, hand: "grip" }, f: { at: "H", dx: 9, dy: -14, bend: 1, ha: 76, hand: "open" } } },
    mid:      { T: 0, N: 14, legs: STAND_LEGS, arms: { n: { at: "H", dx: 12, dy: -29, bend: 1, ha: 70, hand: "grip" }, f: { at: "H", dx: 10, dy: -31, bend: 1, ha: 76, hand: "open" } } },
    sides:    { T: 0, N: 14, legs: STAND_LEGS, arms: { n: hang, f: Object.assign({}, hang, { ua: 184 }) } },
    qunut:    { T: 0, N: 8, legs: STAND_LEGS, arms: { n: { at: "S", dx: 19, dy: 9, bend: 1, ha: 78, hand: "open" }, f: { at: "S", dx: 17, dy: 8, bend: 1, ha: 78, hand: "open" } } },
    ruku:     { T: 90, N: 92, legs: { n: { th: 176, sh: 182, ft: 90, to: 90 }, f: { th: 178, sh: 183, ft: 90, to: 90 } }, arms: { n: { at: "n.K", dx: 3, dy: -3, bend: 1, ha: 172, hand: "grip" }, f: { at: "f.K", dx: 1, dy: -4, bend: 1, ha: 172, hand: "grip" } } },
    kneel:    { T: 2, N: 14, legs: KNEEL_LEGS, arms: { n: { at: "n.K", dx: 8, dy: -16, bend: 1, ha: 100, hand: "open" }, f: { at: "f.K", dx: 6, dy: -17, bend: 1, ha: 100, hand: "open" } } },
    reach:    { T: 120, N: 132, legs: { n: { th: 150, sh: 200, ft: 120, to: 95 }, f: { th: 152, sh: 202, ft: 120, to: 95 } }, arms: { n: { at: "ground", dx: -4, dy: 3, bend: -1, ha: 90, hand: "open" }, f: { at: "ground", dx: -6, dy: 3, bend: -1, ha: 90, hand: "open" } } },
    sujud:    { T: 115, N: 150, legs: { n: { th: 170, sh: 284, ft: 176, to: 90 }, f: { th: 168, sh: 284, ft: 176, to: 90 } }, arms: { n: { at: "ground", dx: -19, dy: 3.5, bend: -1, ha: 92, hand: "open" }, f: { at: "ground", dx: -21, dy: 3.5, bend: -1, ha: 92, hand: "open" } } },
    sit:      { T: 0, N: 22, legs: SIT_LEGS, sit: 1, arms: { n: { at: "n.K", dx: -4, dy: -9, bend: 1, ha: 96, hand: "open" }, f: { at: "f.K", dx: -6, dy: -10, bend: 1, ha: 96, hand: "open" } } },
    tashahhud:{ T: 0, N: 22, legs: SIT_LEGS, sit: 1, arms: { n: { at: "n.K", dx: -6, dy: -9, bend: 1, ha: 96, hand: "point" }, f: { at: "f.K", dx: -6, dy: -10, bend: 1, ha: 96, hand: "open" } } },
    tawarruk: { T: 4, N: 22, legs: TAW_LEGS, sit: 2, arms: { n: { at: "n.K", dx: -6, dy: -9, bend: 1, ha: 98, hand: "point" }, f: { at: "f.K", dx: -6, dy: -10, bend: 1, ha: 98, hand: "open" } } },
    jsit:     { T: 2, N: 22, legs: JAF_LEGS, sit: 2, arms: { n: { at: "n.K", dx: -4, dy: -9, bend: 1, ha: 98, hand: "open" }, f: { at: "f.K", dx: -6, dy: -10, bend: 1, ha: 98, hand: "open" } } },
    tawsit:   { T: 4, N: 22, legs: TAW_LEGS, sit: 2, arms: { n: { at: "n.K", dx: -4, dy: -9, bend: 1, ha: 98, hand: "open" }, f: { at: "f.K", dx: -6, dy: -10, bend: 1, ha: 98, hand: "open" } } }
  };
  const RES = {}; for (const k in POSE) RES[k] = resolve(POSE[k]);
  const pose = (k, extra) => extra ? Object.assign({}, RES[k], extra) : RES[k];

  /* ---------- close-ups (front view): where the hands go ---------- */
  // 110 x 120 panel. Front view: the person faces the viewer, so his right hand is on the viewer's left.
  function inset(kind, t) {
    const o = [];
    const torso = `<path class="si-shirt" d="M26 46Q55 38 84 46L88 112H22Z"/><circle class="si-skin" cx="55" cy="26" r="13"/><path class="si-cap" d="M42 24A13 13 0 0 1 68 24Q55 19 42 24Z"/><path class="si-skin" d="M50 37h10v6H50z"/>`;
    const navel = `<circle class="si-mark" cx="55" cy="86" r="1.8"/>`, line = (y, lab) => `<path class="si-guide" d="M14 ${y}H96"/><text class="si-lab" x="98" y="${y + 3}">${lab}</text>`;
    const palm = (x, y, a, front) => `<g transform="translate(${x} ${y}) rotate(${a})"><rect class="si-skin${front ? " front" : ""}" x="-5.5" y="-15" width="11" height="17" rx="5"/><path class="si-fing" d="M-3 -13v-4M0 -14v-4.5M3 -13v-4"/></g>`;
    if (kind === "low" || kind === "mid") {
      const y = kind === "low" ? 96 : 76;
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
    return o.join("");
  }
  /* Where the figure is (for the camera): the box around its joints and head, set on the ground as in draw(). */
  function bbox(p) {
    const b = body(p), dy = G - bottoms(b, p), dx = X0 - b.n.Bl[0]; place(b, dx, dy);
    const pts = [b.H, b.S, b.C, b.n.K, b.n.Tp, b.n.Hl, b.f.K, b.f.Tp, b.f.Hl];
    for (const s of ["n", "f"]) { const a = p.arms[s], E = at(b.Sj, a.ua, LEN.ua), W = at(E, a.fa, LEN.fa); pts.push(E, at(W, a.ha, LEN.hd)); }
    const xs = pts.map(q => q[0]), ys = pts.map(q => q[1]);
    return [Math.min(...xs) - 14, Math.min(...ys) - 16, Math.max(...xs) + 14, G];
  }
  return { G, X0, LEN, POSE, RES, pose, resolve, mix, draw, body, bbox, inset, ik, cap };
});
