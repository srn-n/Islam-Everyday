# Run: python3 tools/notification-sounds.py <output folder>  (writes ie_ripple.wav and ie_bubble.wav; copy them to
# assets/sounds/ and android-app/android/app/src/main/res/raw/). Water drop (ie_drop.wav) is from the 12 Nov set.
# Islam Everyday notification sounds, Nov 2026 (second set). Soft and low: slow attacks, gentle low-pass,
# a short soft echo tail. No music, no instruments.
import numpy as np, wave, sys
SR = 22050; rng = np.random.default_rng(11)
def lp(x, f):
    a = np.exp(-2*np.pi*f/SR); y = np.empty_like(x); p = 0.0
    for i, v in enumerate(x): p = (1-a)*v + a*p; y[i] = p
    return y
def room(x, taps=((0.061, .30), (0.097, .22), (0.143, .15), (0.211, .10), (0.283, .06))):
    y = x.copy()
    for d, g in taps:
        n = int(d*SR); y[n:] += g*lp(x[:-n], 1400)
    return y
def blip(n_total, t0, f0, f1, dur, lvl, attack=0.008, curve=0.05):
    out = np.zeros(n_total); n = int(dur*SR); t = np.arange(n)/SR
    f = f0 + (f1-f0)*(1-np.exp(-t/curve)); ph = 2*np.pi*np.cumsum(f)/SR
    env = np.minimum(t/attack, 1)**2 * np.exp(-t/(dur/4))
    s = int(t0*SR); out[s:s+n] = lvl*np.sin(ph)*env*(1+0.12*np.sin(ph*2))  # a little warmth from the 2nd harmonic
    return out
def norm(x, peak):
    x = x - np.mean(x); fade = int(0.04*SR); x[-fade:] *= np.linspace(1, 0, fade)
    return x/np.max(np.abs(x))*peak
def save(name, x):
    with wave.open(name, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(x, -1, 1)*32767).astype('<i2').tobytes())
out = sys.argv[1]
# Ripple: three soft, low drops falling into still water, each lower and quieter, with a calm echo.
N = int(1.6*SR); r = np.zeros(N)
for t0, f0, lvl in [(0.0, 660, 1.0), (0.24, 570, 0.7), (0.5, 490, 0.45)]:
    r += blip(N, t0, f0, f0*1.35, 0.42, lvl, attack=0.01, curve=0.07)
save(out + '/ie_ripple.wav', norm(lp(room(r), 2600), 0.55))
# Bubble: two round, warm bubbles rising gently, the second a little higher.
N = int(1.0*SR); b = np.zeros(N)
b += blip(N, 0.0, 430, 660, 0.30, 1.0, attack=0.012, curve=0.09)
b += blip(N, 0.18, 520, 790, 0.30, 0.75, attack=0.012, curve=0.09)
save(out + '/ie_bubble.wav', norm(lp(room(b), 2400), 0.55))
