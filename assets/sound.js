/* Islam Everyday — sounds (Nov 2026).
 * Everything is generated on the device with the Web Audio API from filtered noise: no audio files, no music and no
 * instrument sounds. Two kinds:
 *   - touch sounds: a soft tick when a control is pressed, a slightly fuller one when something is completed;
 *   - background sound: wind, rain, water drops, river or ocean waves, looping until switched off.
 * Nothing plays until the person has touched the page (browsers require that) and nothing plays while muted
 * (in the Android app the phone's sound profile mutes it: silent or vibrate means no sound).
 */
(function (root, factory) { const api = factory(root); if (typeof module === "object" && module.exports) module.exports = api; else root.IE_SOUND = api; })(typeof self !== "undefined" ? self : this, function (root) {
  "use strict";
  const KINDS = ["wind", "rain", "drops", "river", "ocean"];
  let ctx = null, master = null, amb = null, ambKind = null, wantKind = null, vol = 0.6, muted = false, touch = true, unlocked = false, noise = null, timers = [], loopEnd = 0;
  const AC = root.AudioContext || root.webkitAudioContext;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  /* Loudness: the slider is 0–100; the curve keeps the low end usable. */
  const gainOf = v => Math.pow(clamp(v, 0, 1), 1.6);
  function ensure() {
    if (ctx || !AC) return ctx;
    try { ctx = new AC(); master = ctx.createGain(); master.gain.value = muted ? 0 : gainOf(vol); master.connect(ctx.destination); } catch (e) { ctx = null; }
    return ctx;
  }
  /* Four seconds of noise, made once. Brown noise is white noise run through a leaky integrator. */
  function buffers() {
    if (noise) return noise;
    const n = ctx.sampleRate * 4, mk = () => ctx.createBuffer(1, n, ctx.sampleRate), w = mk(), b = mk(), wd = w.getChannelData(0), bd = b.getChannelData(0);
    let last = 0;
    for (let i = 0; i < n; i++) { const x = Math.random() * 2 - 1; wd[i] = x; last = (last + 0.02 * x) / 1.02; bd[i] = last * 3.5; }
    // cross-fade the end into the start, and loop just short of the end, so the repeat cannot be heard
    const F = 4000; for (const d of [wd, bd]) for (let i = 0; i < F; i++) { const f = i / F; d[i] = d[i] * f + d[n - F + i] * (1 - f); }
    loopEnd = (n - F) / ctx.sampleRate;
    return (noise = { white: w, brown: b });
  }
  const src = (buf, rate) => { const s = ctx.createBufferSource(); s.buffer = buf; s.loop = true; s.loopEnd = loopEnd; if (rate) s.playbackRate.value = rate; return s; };
  const filt = (type, f, q) => { const x = ctx.createBiquadFilter(); x.type = type; x.frequency.value = f; if (q != null) x.Q.value = q; return x; };
  const gain = v => { const g = ctx.createGain(); g.gain.value = v; return g; };
  /* A slow, irregular drift for a parameter, so nothing sounds like a machine: a new random target every few seconds. */
  function drift(param, lo, hi, every) {
    const step = () => { if (!ctx) return; try { param.cancelScheduledValues(ctx.currentTime); param.setTargetAtTime(lo + Math.random() * (hi - lo), ctx.currentTime, every / 3); } catch (e) {} };
    step(); timers.push(setInterval(step, every * 1000));
  }
  /* One water drop: a very short filtered noise tick followed by the hollow "plip" a drop makes in still water. */
  function drop(out, level) {
    const t = ctx.currentTime, f0 = 500 + Math.random() * 900, o = ctx.createOscillator(), g = gain(0);
    o.type = "sine"; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f0 * (1.5 + Math.random() * 0.5), t + 0.07);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(level, t + 0.004); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09 + Math.random() * 0.08);
    o.connect(g); g.connect(out); o.start(t); o.stop(t + 0.25);
  }
  function build(kind) {
    const B = buffers(), out = gain(0), nodes = [];
    const add = (...chain) => { for (let i = 0; i < chain.length - 1; i++) chain[i].connect(chain[i + 1]); chain[0].start && (chain[0].start(), nodes.push(chain[0])); };
    if (kind === "wind") {
      const bp = filt("bandpass", 420, 0.7), g = gain(0.9), hi = filt("bandpass", 1500, 1.4), g2 = gain(0.12);
      add(src(B.brown), bp, g, out); add(src(B.white, 0.7), hi, g2, out);
      drift(bp.frequency, 240, 760, 5); drift(g.gain, 0.35, 1.1, 4); drift(hi.frequency, 900, 2400, 6); drift(g2.gain, 0.02, 0.2, 5);
    } else if (kind === "rain") {
      const hp = filt("highpass", 1400), lp = filt("lowpass", 7800), g = gain(0.22), low = filt("lowpass", 420), g2 = gain(0.5);
      add(src(B.white), hp, lp, g, out); add(src(B.brown, 1.3), low, g2, out);
      drift(g.gain, 0.16, 0.27, 6);
      timers.push(setInterval(() => { if (ctx && ctx.state === "running" && Math.random() < 0.55) drop(out, 0.02 + Math.random() * 0.03); }, 170));
    } else if (kind === "drops") {
      const lp = filt("lowpass", 300), g = gain(0.12);
      add(src(B.brown), lp, g, out); // the quiet of a still room behind the drops
      const next = () => { if (!ctx || ambKind !== "drops") return; if (ctx.state === "running") { drop(out, 0.16 + Math.random() * 0.14); if (Math.random() < 0.3) setTimeout(() => ctx && ambKind === "drops" && drop(out, 0.07), 110 + Math.random() * 120); }
        timers.push(setTimeout(next, 500 + Math.random() * 1900)); };
      timers.push(setTimeout(next, 400));
    } else if (kind === "river") {
      const a = filt("bandpass", 700, 0.6), ga = gain(0.5), b = filt("bandpass", 2100, 0.9), gb = gain(0.16), c = filt("lowpass", 260), gc = gain(0.55);
      add(src(B.white, 0.9), a, ga, out); add(src(B.white, 1.2), b, gb, out); add(src(B.brown), c, gc, out);
      drift(a.frequency, 520, 980, 3); drift(ga.gain, 0.38, 0.6, 2.5); drift(b.frequency, 1600, 2900, 2); drift(gb.gain, 0.08, 0.22, 2);
      timers.push(setInterval(() => { if (ctx && ctx.state === "running" && Math.random() < 0.7) drop(out, 0.012 + Math.random() * 0.02); }, 120));
    } else { // ocean: a slow swell that rises, breaks into hiss and draws back
      const lp = filt("lowpass", 500), g = gain(0.3), hp = filt("highpass", 1800), gh = gain(0.0);
      add(src(B.brown), lp, g, out); add(src(B.white, 0.8), hp, filt("lowpass", 6000), gh, out);
      const wave = () => { if (!ctx || ambKind !== "ocean") return; const t = ctx.currentTime, len = 7 + Math.random() * 5;
        try { g.gain.cancelScheduledValues(t); gh.gain.cancelScheduledValues(t); lp.frequency.cancelScheduledValues(t);
          g.gain.setTargetAtTime(1.0, t, len * 0.16); lp.frequency.setTargetAtTime(900, t, len * 0.16); gh.gain.setTargetAtTime(0.16, t + len * 0.3, len * 0.08);
          g.gain.setTargetAtTime(0.25, t + len * 0.5, len * 0.2); lp.frequency.setTargetAtTime(380, t + len * 0.5, len * 0.2); gh.gain.setTargetAtTime(0.01, t + len * 0.52, len * 0.22); } catch (e) {}
        timers.push(setTimeout(wave, len * 1000)); };
      wave();
    }
    out.connect(master);
    return { out, nodes };
  }
  function stopAmb(fast) {
    timers.forEach(x => { clearInterval(x); clearTimeout(x); }); timers = [];
    const a = amb; amb = null; ambKind = null; if (!a || !ctx) return;
    try { a.out.gain.cancelScheduledValues(ctx.currentTime); a.out.gain.setTargetAtTime(0, ctx.currentTime, fast ? 0.05 : 0.35); } catch (e) {}
    setTimeout(() => { a.nodes.forEach(n => { try { n.stop(); } catch (e) {} }); try { a.out.disconnect(); } catch (e) {} }, fast ? 300 : 1800);
  }
  function startAmb() {
    if (!wantKind || muted || !unlocked || !ensure()) return;
    if (ctx.state === "suspended") { try { ctx.resume(); } catch (e) {} }
    if (ambKind === wantKind) return;
    stopAmb(true); ambKind = wantKind; amb = build(wantKind);
    try { amb.out.gain.setTargetAtTime(0.8, ctx.currentTime, 0.8); } catch (e) {}
  }
  /* Touch sounds: a few milliseconds of filtered noise. kind: "tap" | "done". */
  function tick(kind) {
    if (!touch || muted || !unlocked || vol <= 0 || !ensure() || ctx.state !== "running") return;
    try {
      const B = buffers(), t = ctx.currentTime, s = ctx.createBufferSource(), f = filt("bandpass", kind === "done" ? 1500 : 2300, 1.8), g = gain(0);
      s.buffer = B.white; const len = kind === "done" ? 0.09 : 0.035;
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(kind === "done" ? 0.5 : 0.32, t + 0.003); g.gain.exponentialRampToValueAtTime(0.0001, t + len);
      s.connect(f); f.connect(g); g.connect(master); s.start(t, Math.random() * 3); s.stop(t + len + 0.02);
      if (kind === "done") { const s2 = ctx.createBufferSource(), g2 = gain(0), f2 = filt("bandpass", 2100, 2); s2.buffer = B.white; g2.gain.setValueAtTime(0, t + 0.1); g2.gain.linearRampToValueAtTime(0.4, t + 0.103); g2.gain.exponentialRampToValueAtTime(0.0001, t + 0.2); s2.connect(f2); f2.connect(g2); g2.connect(master); s2.start(t + 0.1, Math.random() * 3); s2.stop(t + 0.22); }
    } catch (e) {}
  }
  const applyGain = () => { if (ctx && master) { try { master.gain.setTargetAtTime(muted ? 0 : gainOf(vol), ctx.currentTime, 0.05); } catch (e) { master.gain.value = muted ? 0 : gainOf(vol); } } };
  const api = {
    KINDS, gainOf,
    supported: () => !!AC,
    /* Called on the first touch or key press: browsers only allow sound after that. */
    unlock() { if (unlocked) return; unlocked = true; if (wantKind && !muted) startAmb(); },
    setVolume(v) { vol = clamp(+v || 0, 0, 100) / 100; applyGain(); },
    setTouch(on) { touch = !!on; },
    /* muted: the phone is on silent or vibrate (Android app), so the app stays quiet too. */
    setMuted(m) { muted = !!m; applyGain(); if (muted) stopAmb(true); else startAmb(); },
    setAmbient(kind) { wantKind = KINDS.includes(kind) ? kind : null; if (!wantKind) stopAmb(false); else startAmb(); },
    /* The app went to the background or came back. */
    pause() { stopAmb(true); if (ctx && ctx.state === "running") { try { ctx.suspend(); } catch (e) {} } },
    resume() { if (ctx && ctx.state === "suspended" && unlocked) { try { ctx.resume(); } catch (e) {} } startAmb(); },
    tap() { tick("tap"); }, done() { tick("done"); },
    state: () => ({ kind: ambKind, want: wantKind, muted, vol, touch, unlocked })
  };
  return api;
});
