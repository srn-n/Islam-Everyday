/* Islam Everyday — the 3D prayer figure for How to pray (Nov 2026).
 *
 * A real-time 3D character instead of a video: one rigged, clothed figure per presentation (assets/figure/man.bin,
 * woman.bin; built by tools/prayer-figure/build.py from the CC0 MakeHuman base mesh, skeleton and skin weights) is
 * posed from the SAME movement definitions as before (IE_SALAH_FIG.POSE: torso, head, leg angles and where each wrist
 * goes) and drawn with WebGL. Because the pose comes from the player's own clock, play, pause, seeking, speed, the step
 * buttons, the school and the men/women choice always stay in step with the captions, and nothing is downloaded.
 *
 * Coordinates: x = the way the person faces (the qibla), y = up, z = the person's right. Metres. The floor is y = 0.
 * Angles in the definitions: 0 = up, 90 = towards the qibla, 180 = down, 270 = back.
 * Skinning is done here in JavaScript (about 13 000 vertices), so the shader needs no bone uniforms and runs on any
 * phone GPU. If WebGL or the model is not available, the player keeps the earlier drawn figure.
 */
(function (root, factory) { const api = factory(root); if (typeof module === "object" && module.exports) module.exports = api; else root.IE_SALAH_3D = api; })(typeof self !== "undefined" ? self : this, function (root) {
  "use strict";
  const D2R = Math.PI / 180;
  /* ---------- small vector / quaternion kit ---------- */
  const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k], dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const len = a => Math.hypot(a[0], a[1], a[2]), norm = a => { const l = len(a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
  const perp = (v, n) => sub(v, mul(n, dot(v, n)));                      // the part of v at right angles to unit n
  const qaxis = (ax, deg) => { const h = deg * D2R / 2, s = Math.sin(h), n = norm(ax); return [n[0] * s, n[1] * s, n[2] * s, Math.cos(h)]; };
  const qmul = (a, b) => [a[3] * b[0] + a[0] * b[3] + a[1] * b[2] - a[2] * b[1], a[3] * b[1] - a[0] * b[2] + a[1] * b[3] + a[2] * b[0], a[3] * b[2] + a[0] * b[1] - a[1] * b[0] + a[2] * b[3], a[3] * b[3] - a[0] * b[0] - a[1] * b[1] - a[2] * b[2]];
  const qrot = (q, v) => { const u = [q[0], q[1], q[2]], t = mul(cross(u, v), 2); return add(add(v, mul(t, q[3])), cross(u, t)); };
  const qnlerp = (a, b, t) => { const s = a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3] < 0 ? -1 : 1, r = [0, 0, 0, 0]; for (let i = 0; i < 4; i++) r[i] = a[i] + (b[i] * s - a[i]) * t; const l = Math.hypot(r[0], r[1], r[2], r[3]) || 1; return [r[0] / l, r[1] / l, r[2] / l, r[3] / l]; };
  const qfromTo = (a, b) => { a = norm(a); b = norm(b); const d = dot(a, b); if (d > 0.99999) return [0, 0, 0, 1]; if (d < -0.99999) return qaxis(Math.abs(a[0]) < 0.9 ? cross(a, [1, 0, 0]) : cross(a, [0, 1, 0]), 180); const c = cross(a, b), q = [c[0], c[1], c[2], 1 + d], l = Math.hypot(q[0], q[1], q[2], q[3]); return [q[0] / l, q[1] / l, q[2] / l, q[3] / l]; };
  // the rotation that takes the frame (p0 primary, s0 secondary) to (p1, s1)
  const qframe = (p0, s0, p1, s1) => { const q1 = qfromTo(p0, p1), s = norm(perp(qrot(q1, s0), norm(p1))), t = norm(perp(s1, norm(p1)));
    if (len(perp(s1, norm(p1))) < 1e-5) return q1; let a = Math.acos(Math.max(-1, Math.min(1, dot(s, t)))) / D2R; if (dot(cross(s, t), norm(p1)) < 0) a = -a; return qmul(qaxis(p1, a), q1); };
  const pitch = deg => qaxis([0, 0, -1], deg);                         // turns "up" towards the qibla
  const dirA = (deg, z) => { const c = Math.sqrt(Math.max(0, 1 - (z || 0) * (z || 0))); return [Math.sin(deg * D2R) * c, Math.cos(deg * D2R) * c, z || 0]; };

  /* ---------- the model ---------- */
  const CH = {}, LOADING = {};
  function parse(buf) {
    const dv = new DataView(buf), jl = dv.getUint32(4, true), meta = JSON.parse(new TextDecoder().decode(new Uint8Array(buf, 8, jl)));
    let o = 8 + jl; const nv = meta.nv, take = (T, n) => { const a = new T(buf.slice(o, o + n * T.BYTES_PER_ELEMENT)); o += n * T.BYTES_PER_ELEMENT; return a; };
    const q = take(Uint16Array, nv * 4), nq = take(Int8Array, nv * 4), col = take(Uint8Array, nv * 4), bi = take(Uint8Array, nv * 4), bw = take(Uint8Array, nv * 4), idx32 = take(Uint32Array, meta.ni), skin = take(Uint8Array, nv);
    const P = new Float32Array(nv * 3), N = new Float32Array(nv * 3), W = new Float32Array(nv * 4);
    for (let i = 0; i < nv; i++) { for (let k = 0; k < 3; k++) { P[i * 3 + k] = meta.lo[k] + q[i * 4 + k] * meta.sc; N[i * 3 + k] = nq[i * 4 + k] / 127; } for (let k = 0; k < 4; k++) W[i * 4 + k] = bw[i * 4 + k] / 255; }
    const B = meta.bones, bix = {}; B.forEach((b, i) => { bix[b.n] = i; });
    const c = { meta, nv, P, N, W, bi, col, idx: new Uint16Array(idx32), skin, B, bix, out: new Float32Array(nv * 3), outN: new Float32Array(nv * 3), poses: {} };
    const h = n => B[bix[n]].h, t = n => B[bix[n]].t;
    c.h = h; c.tl = t;
    c.k = (len(sub(t("thigh_r"), h("thigh_r"))) + len(sub(t("calf_r"), h("calf_r")))) / 86;      // model metres per drawing unit
    c.shz = Math.abs(h("upperarm_r")[2]);
    c.side = { n: "_r", f: "_l" };
    c.rest = {};
    for (const s of ["_r", "_l"]) { const sg = s === "_r" ? 1 : -1, hd = h("hand" + s), fd = norm(sub(h("middle_01" + s), hd));
      let pn = norm(cross(sub(h("index_01" + s), hd), sub(h("pinky_01" + s), hd))); if (pn[1] > 0) pn = mul(pn, -1);     // the palm faces down in the rest pose
      c.rest["hand" + s] = { f: fd, n: norm(perp(pn, fd)), lat: norm(sub(h("pinky_01" + s), h("index_01" + s))), sg }; }
    return c;
  }
  function load(who) {
    if (CH[who]) return Promise.resolve(CH[who]);
    if (!LOADING[who]) LOADING[who] = fetch("assets/figure/" + who + ".bin").then(r => { if (!r.ok) throw new Error("figure " + r.status); return r.arrayBuffer(); }).then(b => (CH[who] = parse(b)));
    return LOADING[who];
  }

  /* ---------- from a movement definition to bone rotations ---------- */
  const FING = ["index", "middle", "ring", "pinky"];
  // How the hand lies in each kind of position: finger direction and palm direction (right hand; the left is mirrored).
  function handAim(name, spec, T, sg) {
    const m = v => [v[0], v[1], v[2] * sg];
    if (name === "qunut") return [m([0.55, 0.83, -0.1]), m([-0.83, 0.55, 0])];
    if (spec.at === "ground") return [m([1, 0, -0.08]), [0, -1, 0]];
    if (spec.at === "C" || (spec.at === "S" && (spec.ha || 0) < 45)) return [m([0, 1, 0]), m([1, 0, 0])];               // takbir: palms to the qibla
    if (spec.at === "H" || spec.at === "S") return [m([0.12, 0.1, -1]), m([-1, 0, -0.1])];                                // folded: across the body
    if (spec.at && /K$/.test(spec.at)) return T > 45 ? [m([0.3, -0.95, 0]), m([-0.8, -0.6, 0])] : [m([1, -0.12, 0]), [0.1, -1, 0]];   // on the knees (bowing) or on the thighs (sitting)
    return [m([0.08, -1, 0]), m([0, 0, -1])];                                                                               // hanging: palms to the thighs
  }
  function fk(c, Q, pos) {            // bone head positions from rotations (root stays at its rest place)
    const B = c.B; for (let i = 0; i < B.length; i++) { const p = B[i].p; pos[i] = p < 0 ? B[i].h.slice() : add(pos[p], qrot(Q[p], sub(B[i].h, B[p].h))); } return pos;
  }
  function inherit(c, Q, set) { const B = c.B; for (let i = 0; i < B.length; i++) if (!set[i]) Q[i] = B[i].p < 0 ? [0, 0, 0, 1] : Q[B[i].p]; }
  function solve(c, name, F) {
    if (c.poses[name]) return c.poses[name];
    const raw = F.POSE[name], res = F.pose(name), B = c.B, ix = c.bix, Q = new Array(B.length), set = new Array(B.length).fill(false), k = c.k;
    const put = (n, q) => { Q[ix[n]] = q; set[ix[n]] = true; };
    const T = raw.T, N = raw.N;
    // bowing keeps the back level: the bend comes from the hips, not from rounding the spine
    const fl = Math.max(0, Math.min(1, (T - 45) / 30)) * Math.max(0, Math.min(1, (115 - T) / 15));
    put("pelvis", pitch(T * (0.72 + 0.2 * fl))); put("spine_01", pitch(T * (0.86 + 0.11 * fl))); put("spine_02", pitch(T)); put("spine_03", pitch(T * (1.06 - 0.04 * fl)));
    put("neck_01", pitch(T + (N - T) * 0.55)); put("head", pitch(N));
    for (const s of ["n", "f"]) { const L = raw.legs[s], sx = c.side[s], sg = s === "n" ? 1 : -1, hz = 7.5 * sg;
      // tawarruk: the left foot comes out to the right, under the right shin (the side drawing cannot show this)
      const zk = L.zk != null ? L.zk : hz, za = L.za != null ? L.za : /^taw/.test(name) && s === "f" ? -hz * 1.25 : zk, lt = len(sub(c.tl("thigh" + sx), c.h("thigh" + sx))), ls = len(sub(c.tl("calf" + sx), c.h("calf" + sx)));
      const dt = Math.max(-0.9, Math.min(0.9, (zk - hz) * k / lt)), ds = Math.max(-0.9, Math.min(0.9, (za - zk) * k / ls));
      put("thigh" + sx, qmul(qfromTo(dirA(L.th), dirA(L.th, dt)), pitch(L.th - 180)));
      put("calf" + sx, qmul(qfromTo(dirA(L.sh), dirA(L.sh, ds)), pitch(L.sh - 180)));
      put("foot" + sx, pitch(L.ft - 90)); put("ball" + sx, pitch(L.to - 90)); }
    inherit(c, Q, set);
    let pos = fk(c, Q, []);
    // where the ground is for this position (arms still at rest), so "on the ground" targets can be placed
    const gy = groundOf(c, Q, pos, true);
    const hd = ix.head, headC = add(pos[hd], qrot(Q[hd], sub(c.meta.marks.headC, B[hd].h)));
    const J = { C: headC, S: pos[ix.neck_01], H: mul(add(pos[ix.thigh_r], pos[ix.thigh_l]), 0.5), "n.K": pos[ix.calf_r], "f.K": pos[ix.calf_l] };
    for (const s of ["n", "f"]) { const A = raw.arms[s], R = res.arms[s], sx = c.side[s], sg = s === "n" ? 1 : -1;
      const S = pos[ix["upperarm" + sx]], a = len(sub(c.tl("upperarm" + sx), c.h("upperarm" + sx))), b = len(sub(c.tl("lowerarm" + sx), c.h("lowerarm" + sx)));
      const ze = A.ze != null ? A.ze : 1.08, zw = A.zw != null ? A.zw : 1.08;
      let Wt;
      if (A.at) { const j = A.at === "ground" ? [headC[0], gy, 0] : J[A.at]; Wt = [j[0] + (A.dx || 0) * k, A.at === "ground" ? gy + (A.dy || 0) * k : j[1] - (A.dy || 0) * k, sg * c.shz * zw];
        if (/K$/.test(A.at)) { Wt[2] = j[2];
          // bowing: the palm, not the wrist, belongs on the knee
          if (T > 45) { const f = handAim(name, A, T, sg)[0], h = 0.085 * c.meta.height / 1.7; Wt = [j[0] + 0.045 - f[0] * h, j[1] + 0.02 - f[1] * h, j[2] + sg * 0.01]; } }
        // folded hands rest on the clothes, not inside them
        if ((A.at === "H" || A.at === "S") && (A.ha || 0) >= 45 && name !== "qunut") Wt[0] = Math.max(Wt[0], J.H[0] + (A.at === "S" ? 0.185 : 0.17) * c.meta.height / 1.7 + (s === "n" ? 0.022 : 0)); }
      else { const e = add(S, mul(dirA(R.ua), a)); Wt = add(e, mul(dirA(R.fa), b)); Wt[2] = sg * c.shz * zw; }
      let d = sub(Wt, S), L = len(d); const mx = (a + b) * 0.995; if (L > mx) { d = mul(d, mx / L); L = mx; Wt = add(S, d); }
      const ax = norm(d), ca = (a * a + L * L - b * b) / (2 * a * L), along = a * ca, rad = a * Math.sqrt(Math.max(0, 1 - ca * ca)), mid = add(S, mul(ax, along));
      const hint = add(S, mul(dirA(R.ua), a)); hint[2] = sg * c.shz * ze;
      // sujudW only (its text: "the forearms on the ground"): the elbow goes down and back. Everywhere else the elbows stay raised.
      if (name === "sujudW") { hint[0] = S[0] - 0.12; hint[1] = gy - 0.3; }
      let E = mid; { let u = perp(sub(hint, mid), ax); if (len(u) < 1e-4) u = perp([0, -1, 0], ax); E = add(mid, mul(norm(u), rad)); }
      const pit = v => { const t = perp(v, norm(sub(E, S))); return len(t) > 0.02 ? norm(t) : norm(perp([1, 0, 0], norm(sub(E, S)))); };
      const restU = norm(sub(c.tl("upperarm" + sx), c.h("upperarm" + sx))), restF = norm(sub(c.tl("lowerarm" + sx), c.h("lowerarm" + sx)));
      const [fd, pn] = handAim(name, A, T, sg), rh = c.rest["hand" + sx];
      put("upperarm" + sx, qframe(restU, [1, 0, 0], sub(E, S), pit(sub(Wt, E))));
      const qh = qframe(rh.f, rh.n, fd, pn);
      // the forearm turns about half-way with the hand
      const qf0 = qframe(restF, rh.n, sub(Wt, E), pn);
      put("lowerarm" + sx, qf0); put("hand" + sx, qh);
      // fingers: straight, a light grip, or pointing with the index finger
      const kind = A.hand || R.hand || "open", lat = qrot(qh, rh.lat), curlAx = mul(lat, sg);        // curling turns the fingers towards the palm
      // open and resting hands keep the fingers together (the rest shape of the model spreads them)
      const pnrm = qrot(qh, rh.n), tog = (dot(cross(rh.n, rh.f), rh.lat) > 0 ? 1 : -1) * (kind !== "open" || /^(ear|shoulder|qunut)/.test(name) ? 0 : 7), ADD = { index: 1, middle: 0.15, ring: -0.75, pinky: -1.6 };
      const curl = (n, degs) => { const qa = qmul(qaxis(pnrm, tog * (ADD[n] || 0)), qh); let acc = 0; for (let j = 1; j <= 3; j++) { acc += degs[j - 1]; put(n + "_0" + j + sx, qmul(qaxis(curlAx, acc), qa)); } };
      const g = kind === "grip" ? [22, 34, 26] : kind === "point" ? [68, 84, 56] : [4, 6, 4];
      for (const fn of FING) curl(fn, kind === "point" && fn === "index" ? [0, 2, 2] : g);
      if (kind === "point") { let acc = 0; const tx = qrot(qh, rh.f); for (let j = 1; j <= 3; j++) { acc += [10, 18, 24][j - 1]; put("thumb_0" + j + sx, qmul(qaxis(curlAx, acc), qmul(qaxis(tx, -18 * sg), qh))); } }
    }
    inherit(c, Q, set);
    return (c.poses[name] = { Q, T, N });
  }
  /* Skins the mesh for rotations Q; returns the lowest point that rests on the floor (bare skin, knees, seat). */
  const M = new Float32Array(64 * 12);
  function skin(c, Q, pos) {
    const B = c.B;
    for (let i = 0; i < B.length; i++) { const q = Q[i], x = q[0], y = q[1], z = q[2], w = q[3], h = B[i].h, p = pos[i], o = i * 12;
      const r0 = 1 - 2 * (y * y + z * z), r1 = 2 * (x * y - z * w), r2 = 2 * (x * z + y * w), r3 = 2 * (x * y + z * w), r4 = 1 - 2 * (x * x + z * z), r5 = 2 * (y * z - x * w), r6 = 2 * (x * z - y * w), r7 = 2 * (y * z + x * w), r8 = 1 - 2 * (x * x + y * y);
      M[o] = r0; M[o + 1] = r1; M[o + 2] = r2; M[o + 3] = p[0] - (r0 * h[0] + r1 * h[1] + r2 * h[2]);
      M[o + 4] = r3; M[o + 5] = r4; M[o + 6] = r5; M[o + 7] = p[1] - (r3 * h[0] + r4 * h[1] + r5 * h[2]);
      M[o + 8] = r6; M[o + 9] = r7; M[o + 10] = r8; M[o + 11] = p[2] - (r6 * h[0] + r7 * h[1] + r8 * h[2]); }
    const P = c.P, N = c.N, W = c.W, bi = c.bi, out = c.out, outN = c.outN, sk = c.skin; let minY = 1e9;
    for (let i = 0, n = c.nv; i < n; i++) { const px = P[i * 3], py = P[i * 3 + 1], pz = P[i * 3 + 2], nx = N[i * 3], ny = N[i * 3 + 1], nz = N[i * 3 + 2];
      let x = 0, y = 0, z = 0, a = 0, b = 0, d = 0;
      for (let j = 0; j < 4; j++) { const w = W[i * 4 + j]; if (w === 0) continue; const o = bi[i * 4 + j] * 12;
        x += w * (M[o] * px + M[o + 1] * py + M[o + 2] * pz + M[o + 3]); y += w * (M[o + 4] * px + M[o + 5] * py + M[o + 6] * pz + M[o + 7]); z += w * (M[o + 8] * px + M[o + 9] * py + M[o + 10] * pz + M[o + 11]);
        a += w * (M[o] * nx + M[o + 1] * ny + M[o + 2] * nz); b += w * (M[o + 4] * nx + M[o + 5] * ny + M[o + 6] * nz); d += w * (M[o + 8] * nx + M[o + 9] * ny + M[o + 10] * nz); }
      out[i * 3] = x; out[i * 3 + 1] = y; out[i * 3 + 2] = z; outN[i * 3] = a; outN[i * 3 + 1] = b; outN[i * 3 + 2] = d;
      if (sk[i] && y < minY) minY = y; }
    return minY;
  }
  function groundOf(c, Q, pos, noArms) {
    let m = skin(c, Q, pos); const ix = c.bix;
    if (noArms) { m = 1e9; const sk = c.skin, bi = c.bi, out = c.out, lo = Math.min(ix.foot_l, ix.foot_r, ix.ball_l, ix.ball_r); for (let i = 0; i < c.nv; i++) { if (!sk[i]) continue; const n = c.B[bi[i * 4]].n; if (/^(foot|ball|head|neck)/.test(n) && out[i * 3 + 1] < m) m = out[i * 3 + 1]; } void lo; }
    for (const n of ["calf_r", "calf_l"]) m = Math.min(m, pos[ix[n]][1] - 0.05);
    for (const n of ["thigh_r", "thigh_l"]) m = Math.min(m, pos[ix[n]][1] - 0.105);
    return m;
  }
  /* The figure at one moment: between position a and position b (t from 0 to 1), with the head turned for the salam. */
  function frame(c, F, a, b, t, turn) {
    const A = solve(c, a, F), Bp = a === b || t >= 1 ? A && solve(c, b, F) : solve(c, b, F), n = c.B.length, Q = new Array(n);
    if (a === b || t >= 1) for (let i = 0; i < n; i++) Q[i] = Bp.Q[i]; else if (t <= 0) for (let i = 0; i < n; i++) Q[i] = A.Q[i]; else for (let i = 0; i < n; i++) Q[i] = qnlerp(A.Q[i], Bp.Q[i], t);
    if (turn) { const hi = c.bix.head, up = qrot(Q[hi], [0, 1, 0]); Q[hi] = qmul(qaxis(up, -turn * 78), Q[hi]); }      // + = to the person's right
    const pos = fk(c, Q, []), gy = groundOf(c, Q, pos), ax = pos[c.bix.ball_r][0];
    return { Q, pos, off: [-ax, -gy, 0] };
  }
  const markOf = (c, fr, bone, restPt) => { const i = c.bix[bone]; return add(add(fr.pos[i], qrot(fr.Q[i], sub(restPt, c.B[i].h))), fr.off); };
  function contacts(c, fr) {            // forehead, palms, knees, toes: where the body meets the floor in sujud
    const ix = c.bix, B = c.B, P = (bone, pt) => markOf(c, fr, bone, pt);
    return [P("head", c.meta.marks.forehead), P("hand_r", B[ix.middle_01_r].h), P("hand_l", B[ix.middle_01_l].h), P("calf_r", B[ix.calf_r].h), P("calf_l", B[ix.calf_l].h), P("ball_r", B[ix.ball_r].t), P("ball_l", B[ix.ball_l].t)];
  }

  /* ---------- drawing ---------- */
  const VS = "attribute vec3 p;attribute vec3 n;attribute vec4 c;uniform mat4 vp;uniform vec3 off;uniform vec4 sh;varying vec3 vn;varying vec3 vc;varying vec3 vw;void main(){vec3 w=p+off;if(sh.w>0.5){w=w-sh.xyz*(w.y/sh.y);w.y=0.002;}vn=n;vc=c.rgb;vw=w;gl_Position=vp*vec4(w,1.0);}";
  const FS = "precision mediump float;varying vec3 vn;varying vec3 vc;varying vec3 vw;uniform vec3 L;uniform vec3 eye;uniform vec4 flat_;void main(){if(flat_.a>0.0){gl_FragColor=flat_;return;}vec3 n=normalize(vn);if(!gl_FrontFacing)n=-n;float d=max(dot(n,L),0.0);float h=0.5+0.5*n.y;vec3 v=normalize(eye-vw);float rim=pow(1.0-max(dot(n,v),0.0),3.0);vec3 lin=vc*vc;vec3 col=lin*(0.30+0.26*h+0.62*d)+vec3(0.05)*rim;gl_FragColor=vec4(sqrt(col),1.0);}";
  const G = new WeakMap();
  function ctx(canvas) {
    if (G.has(canvas)) return G.get(canvas);
    let gl = null; try { gl = canvas.getContext("webgl", { antialias: true, alpha: true, stencil: true, premultipliedAlpha: false }); } catch (e) {}
    if (!gl) { G.set(canvas, null); return null; }
    const sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o)); return o; };
    let st;
    try { const pr = gl.createProgram(); gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(pr); if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) throw new Error("link"); gl.useProgram(pr);
      st = { gl, pr, loc: {}, bufs: {}, who: "", cam: null };
      for (const u of ["vp", "off", "sh", "L", "eye", "flat_"]) st.loc[u] = gl.getUniformLocation(pr, u);
      for (const a of ["p", "n", "c"]) st.loc[a] = gl.getAttribLocation(pr, a);
      for (const b of ["p", "n", "c", "i", "fp", "fn", "fc"]) st.bufs[b] = gl.createBuffer();
    } catch (e) { G.set(canvas, null); return null; }
    canvas.addEventListener("webglcontextlost", e => { e.preventDefault(); G.delete(canvas); });
    G.set(canvas, st); return st;
  }
  const persp = (fov, asp, n, f) => { const t = 1 / Math.tan(fov * D2R / 2); return [t / asp, 0, 0, 0, 0, t, 0, 0, 0, 0, (f + n) / (n - f), -1, 0, 0, 2 * f * n / (n - f), 0]; };
  const look = (e, c) => { const z = norm(sub(e, c)), x = norm(cross([0, 1, 0], z)), y = cross(z, x); return [x[0], y[0], z[0], 0, x[1], y[1], z[1], 0, x[2], y[2], z[2], 0, -dot(x, e), -dot(y, e), -dot(z, e), 1]; };
  const m4 = (a, b) => { const r = new Array(16); for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) r[j * 4 + i] = a[i] * b[j * 4] + a[4 + i] * b[j * 4 + 1] + a[8 + i] * b[j * 4 + 2] + a[12 + i] * b[j * 4 + 3]; return r; };
  const AZ = 52, EL = 13, FOV = 22;                 // the camera: in front of the person and to their right, a little above
  const CAMD = norm([Math.cos(EL * D2R) * Math.cos(AZ * D2R), Math.sin(EL * D2R), Math.cos(EL * D2R) * Math.sin(AZ * D2R)]);
  const LIGHT = norm([0.45, 0.8, 0.5]);
  /* Draws one moment. o: { who, a, b, t, turn, dark, turbah, points }. Returns { ok, pts } (pts: contact points in
     canvas CSS pixels, when asked) or { ok: false } when 3D is not available (the caller then draws the 2D figure). */
  function draw(canvas, F, o) {
    const c = CH[o.who]; if (!c) return { ok: false };
    const st = ctx(canvas); if (!st) return { ok: false };
    const gl = st.gl, dpr = Math.min(root.devicePixelRatio || 1, 2), cw = canvas.clientWidth || 356, chh = canvas.clientHeight || 200, w = Math.round(cw * dpr), h = Math.round(chh * dpr);
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    const fr = frame(c, F, o.a, o.b, o.t, o.turn || 0);
    const B = st.bufs, L = st.loc;
    if (st.who !== o.who) { st.who = o.who; gl.bindBuffer(gl.ARRAY_BUFFER, B.c); gl.bufferData(gl.ARRAY_BUFFER, c.col, gl.STATIC_DRAW); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, B.i); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, c.idx, gl.STATIC_DRAW); st.cam = null; }
    // the camera glides: wide for standing, closer when the body is low; never a cut
    const head = markOf(c, fr, "head", c.meta.marks.headC), pel = add(fr.pos[c.bix.pelvis], fr.off), low = 1 - Math.max(0, Math.min(1, (head[1] - 0.55) / 0.75));
    const tgt = { x: (head[0] + pel[0]) / 2 * (0.35 + 0.65 * low), y: 0.86 - 0.44 * low, hgt: 2.02 - 0.84 * low };
    const cam = st.cam && !o.snap ? st.cam : tgt; for (const k2 of ["x", "y", "hgt"]) cam[k2] += (tgt[k2] - cam[k2]) * (st.cam && !o.snap ? 0.12 : 1); st.cam = cam;
    const asp = w / h, dist = cam.hgt / 2 / Math.tan(FOV * D2R / 2) * Math.max(1, 1.5 / asp), ctr0 = [cam.x, cam.y, 0];
    // phones: the small picture sits over the left third, so the view is a little tighter and the figure a little to the right
    const narrow = (canvas.clientWidth || 999) < 430, rt = norm(cross(mul(CAMD, -1), [0, 1, 0])), span = cam.hgt * Math.max(1, 1.5 / asp) * asp;
    const ctr = narrow ? sub(ctr0, mul(rt, span * (0.085 - 0.035 * low))) : ctr0, eye = add(ctr, mul(CAMD, dist * (narrow ? 0.96 : 1)));
    const vp = m4(persp(FOV, asp, 0.5, 40), look(eye, ctr));
    gl.viewport(0, 0, w, h); gl.clearColor(0, 0, 0, 0); gl.clearStencil(0); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
    gl.useProgram(st.pr); gl.uniformMatrix4fv(L.vp, false, new Float32Array(vp)); gl.uniform3fv(L.L, LIGHT); gl.uniform3fv(L.eye, eye);
    const attr = (buf, loc, size, type, normd, data, dyn) => { gl.bindBuffer(gl.ARRAY_BUFFER, buf); if (data) gl.bufferData(gl.ARRAY_BUFFER, data, dyn ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, size, type, normd, 0, 0); };
    // the prayer mat (and the clay tablet, where that school uses one)
    const quad = (x0, x1, z0, z1, y) => [x0, y, z0, x1, y, z0, x1, y, z1, x0, y, z0, x1, y, z1, x0, y, z1];
    const flat = (verts, rgba) => { attr(B.fp, L.p, 3, gl.FLOAT, false, new Float32Array(verts), true); gl.disableVertexAttribArray(L.n); gl.disableVertexAttribArray(L.c); gl.vertexAttrib3f(L.n, 0, 1, 0); gl.vertexAttrib4f(L.c, 1, 1, 1, 1);
      gl.uniform3f(L.off, 0, 0, 0); gl.uniform4f(L.sh, 0, 1, 0, 0); gl.uniform4fv(L.flat_, rgba); gl.drawArrays(gl.TRIANGLES, 0, verts.length / 3); };
    gl.disable(gl.DEPTH_TEST); gl.disable(gl.CULL_FACE); gl.disable(gl.STENCIL_TEST); gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    const mat = o.dark ? [0.25, 0.42, 0.37, 1] : [0.62, 0.77, 0.72, 1], edge = o.dark ? [0.33, 0.52, 0.46, 1] : [0.52, 0.69, 0.64, 1];
    flat(quad(-1.02, 1.12, -0.36, 0.36, 0), edge); flat(quad(-0.99, 1.09, -0.33, 0.33, 0.0005), mat);
    flat(quad(0.86, 1.02, -0.2, 0.2, 0.001), edge);                                              // a band at the qibla end of the mat
    if (o.turbah) { const tx = turbahX(c, F); const v = []; for (let i = 0; i < 20; i++) { const a0 = i / 20 * 6.2832, a1 = (i + 1) / 20 * 6.2832; v.push(tx, 0.004, 0, tx + Math.cos(a0) * 0.045, 0.004, Math.sin(a0) * 0.045, tx + Math.cos(a1) * 0.045, 0.004, Math.sin(a1) * 0.045); } flat(v, [0.60, 0.42, 0.20, 1]); }
    // the figure's soft shadow on the floor, then the figure
    attr(B.p, L.p, 3, gl.FLOAT, false, c.out, true); attr(B.n, L.n, 3, gl.FLOAT, false, c.outN, true); attr(B.c, L.c, 4, gl.UNSIGNED_BYTE, true);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, B.i); gl.uniform3fv(L.off, fr.off);
    gl.enable(gl.STENCIL_TEST); gl.stencilFunc(gl.EQUAL, 0, 255); gl.stencilOp(gl.KEEP, gl.KEEP, gl.INCR);
    gl.uniform4f(L.sh, LIGHT[0], LIGHT[1], LIGHT[2], 1); gl.uniform4f(L.flat_, 0.02, 0.08, 0.07, 0.2); gl.drawElements(gl.TRIANGLES, c.idx.length, gl.UNSIGNED_SHORT, 0);
    gl.disable(gl.STENCIL_TEST); gl.disable(gl.BLEND); gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL);
    gl.uniform4f(L.sh, 0, 1, 0, 0); gl.uniform4f(L.flat_, 0, 0, 0, 0); gl.drawElements(gl.TRIANGLES, c.idx.length, gl.UNSIGNED_SHORT, 0);
    const res = { ok: true };
    if (o.points) res.pts = contacts(c, fr).map(q => { const x = vp[0] * q[0] + vp[4] * q[1] + vp[8] * q[2] + vp[12], y = vp[1] * q[0] + vp[5] * q[1] + vp[9] * q[2] + vp[13], ww = vp[3] * q[0] + vp[7] * q[1] + vp[11] * q[2] + vp[15]; return [(x / ww * 0.5 + 0.5) * cw, (1 - (y / ww * 0.5 + 0.5)) * chh]; });
    return res;
  }
  let TX = {};
  function turbahX(c, F) { const k = c.meta.who; if (TX[k] == null) { const fr = frame(c, F, "sujud", "sujud", 1, 0); TX[k] = markOf(c, fr, "head", c.meta.marks.forehead)[0] + 0.02; } return TX[k]; }
  return { load, ready: who => !!CH[who], draw, frame, solve, contacts, parse, _ch: CH, AZ, EL };
});
