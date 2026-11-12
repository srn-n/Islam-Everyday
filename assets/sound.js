/* Islam Everyday — touch sounds (Nov 2026; background sounds removed in the November rework).
 * Everything is generated on the device with the Web Audio API: no audio files, no music and no instrument sounds.
 * Three soft kinds to choose from, each with a slightly fuller variant when something is completed:
 *   - "soft":  a muted, cushioned tap (low filtered noise with a faint body);
 *   - "drop":  a small water drop (a short rising sine "plip");
 *   - "air":   a light breath of air (a few milliseconds of soft, high filtered noise).
 * Nothing plays until the person has touched the page (browsers require that) and nothing plays while muted
 * (in the Android app the phone's sound profile mutes it: silent or vibrate means no sound).
 */
(function (root, factory) { const api = factory(root); if (typeof module === "object" && module.exports) module.exports = api; else root.IE_SOUND = api; })(typeof self !== "undefined" ? self : this, function (root) {
  "use strict";
  const TOUCH = ["soft", "drop", "air"];
  let ctx = null, master = null, vol = 0.6, muted = false, touch = true, kind = "soft", unlocked = false, noise = null;
  const AC = root.AudioContext || root.webkitAudioContext;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  /* Loudness: the slider is 0–100; the curve keeps the low end usable. */
  const gainOf = v => Math.pow(clamp(v, 0, 1), 1.6);
  function ensure() {
    if (ctx || !AC) return ctx;
    try { ctx = new AC(); master = ctx.createGain(); master.gain.value = muted ? 0 : gainOf(vol); master.connect(ctx.destination); } catch (e) { ctx = null; }
    return ctx;
  }
  /* One second of white noise, made once. */
  function buf() {
    if (noise) return noise;
    const n = ctx.sampleRate, b = ctx.createBuffer(1, n, ctx.sampleRate), d = b.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    return (noise = b);
  }
  const filt = (type, f, q) => { const x = ctx.createBiquadFilter(); x.type = type; x.frequency.value = f; if (q != null) x.Q.value = q; return x; };
  const env = (g, t, peak, attack, len) => { g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(peak, t + attack); g.gain.exponentialRampToValueAtTime(0.0001, t + len); };
  function noiseHit(t, type, f, q, peak, len) {
    const s = ctx.createBufferSource(), fl = filt(type, f, q), g = ctx.createGain();
    s.buffer = buf(); env(g, t, peak, 0.003, len); s.connect(fl); fl.connect(g); g.connect(master); s.start(t, Math.random() * 0.8); s.stop(t + len + 0.02);
  }
  function sine(t, f0, f1, peak, len, ramp) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = "sine"; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + (ramp || len * 0.6));
    env(g, t, peak, 0.003, len); o.connect(g); g.connect(master); o.start(t); o.stop(t + len + 0.02);
  }
  function play(k, full) {
    const t = ctx.currentTime;
    if (k === "drop") { sine(t, 640, 1080, full ? 0.34 : 0.24, full ? 0.14 : 0.1, 0.05); if (full) sine(t + 0.12, 900, 1320, 0.14, 0.09, 0.04); }
    else if (k === "air") { noiseHit(t, "bandpass", 3200, 0.8, full ? 0.16 : 0.11, full ? 0.11 : 0.06); if (full) noiseHit(t + 0.09, "bandpass", 2600, 0.8, 0.1, 0.1); }
    else { noiseHit(t, "lowpass", 900, 0.7, full ? 0.55 : 0.4, full ? 0.07 : 0.045); sine(t, 210, 160, full ? 0.2 : 0.14, full ? 0.07 : 0.045); if (full) { noiseHit(t + 0.1, "lowpass", 1100, 0.7, 0.32, 0.05); sine(t + 0.1, 240, 180, 0.1, 0.05); } }
  }
  function tick(full, k) {
    if ((!touch && !k) || muted || !unlocked || vol <= 0 || !ensure() || ctx.state !== "running") return;
    try { play(k || kind, full); } catch (e) {}
  }
  const applyGain = () => { if (ctx && master) { try { master.gain.setTargetAtTime(muted ? 0 : gainOf(vol), ctx.currentTime, 0.05); } catch (e) { master.gain.value = muted ? 0 : gainOf(vol); } } };
  const api = {
    TOUCH, gainOf,
    supported: () => !!AC,
    /* Called on the first touch or key press: browsers only allow sound after that. */
    unlock() { if (unlocked) return; unlocked = true; ensure(); },
    setVolume(v) { vol = clamp(+v || 0, 0, 100) / 100; applyGain(); },
    setTouch(on) { touch = !!on; },
    setKind(k) { kind = TOUCH.includes(k) ? k : "soft"; },
    /* muted: the phone is on silent or vibrate (Android app), so the app stays quiet too. */
    setMuted(m) { muted = !!m; applyGain(); },
    /* The app went to the background or came back. */
    pause() { if (ctx && ctx.state === "running") { try { ctx.suspend(); } catch (e) {} } },
    resume() { if (ctx && ctx.state === "suspended" && unlocked) { try { ctx.resume(); } catch (e) {} } },
    tap() { tick(false); }, done() { tick(true); },
    /* Plays one kind once, for the chooser in Settings (even with touch sounds off). */
    preview(k) { tick(false, TOUCH.includes(k) ? k : kind); },
    state: () => ({ kind, muted, vol, touch, unlocked })
  };
  return api;
});
