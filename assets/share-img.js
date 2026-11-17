/* Islam Everyday — the shared pictures (17 Nov 2026): a Name of Allah, a dua, a hadith or a story as an image
 * (shImage), and the prayer tracker (trkImage). Loaded with the "share" group (LAZY in app.js) only when a picture is
 * made. app.js hands it the helpers it needs (IE_SHARE_IMG(A)). Hand-written (not generated). */
window.IE_SHARE_IMG = function (A) {
  "use strict";
  const { t, num, XT, DTF, LT, lastDays, streak, isPd, PRAYERS, wTr, wRef, SITE, shUrl, NATIVE, phone, log } = A;
  /* 17 Nov 2026 (owner, Notion): a shared picture is in the theme the user has set (its page, card, text and accent
     colours, light or dark), and as tall as the phone's screen: the card stays as it was, centred on the theme's page
     colour, so it fills a phone screen when saved or opened (the website on a computer makes a 9:16 picture). */
  function imgPal() {
    const cs = getComputedStyle(document.documentElement), v = (k, f) => cs.getPropertyValue(k).trim() || f;
    return { bg: v("--ground", "#F6F1E6"), card: v("--surface", "#FFFFFF"), ink: v("--ink", "#0F2420"), muted: v("--muted", "#5A6E69"), line: v("--line", "#DCE6E2"),
      acc: v("--accent", "#0E6B5C"), on: v("--on-accent", "#FFFFFF"), gold: v("--gold", "#8A5A12"), pd: v("--pd", "#B04A72") };
  }
  function phoneFrame(box, bg) {
    const W = box.width, sw = screen.width || 0, sh = screen.height || 0, ratio = sw && sh ? Math.max(sw, sh) / Math.min(sw, sh) : 0;
    const r = (NATIVE || phone()) && ratio ? Math.min(2.4, Math.max(1.6, ratio)) : 16 / 9, H = Math.max(Math.round(W * r), box.height);
    const c = document.createElement("canvas"), x = c.getContext("2d"); c.width = W; c.height = H;
    x.fillStyle = bg; x.fillRect(0, 0, W, H); x.drawImage(box, 0, Math.round((H - box.height) / 2));
    return c;
  }
  /* The image: drawn on a canvas with the bundled fonts. */
  async function shImage(o) {
    const C = imgPal();
    const SANS = '"DS Sans", system-ui, sans-serif', AR = '"DS Arabic", "Amiri", "Noto Naskh Arabic", serif', DISP = '"DS Display", Georgia, serif';
    const all = [o.title, o.tl, o.mean, o.ref].concat(o.body).filter(Boolean).join(" ");
    try { await Promise.all([document.fonts.load(`400 60px ${AR}`, o.ar || "ا"), document.fonts.load(`400 34px ${SANS}`, all), document.fonts.load(`600 34px ${SANS}`, all), document.fonts.load(`400 34px ${DISP}`, "Islam Everyday")]); } catch (e) {}
    const W = 1080, P = 96, MW = W - P * 2, c = document.createElement("canvas"), x = c.getContext("2d");
    const wrap = (txt, font, rtl) => { x.font = font; x.direction = rtl ? "rtl" : "ltr"; const out = [];
      String(txt).split("\n").forEach(par => { let line = ""; par.split(/\s+/).filter(Boolean).forEach(w => { const tt = line ? line + " " + w : w; if (line && x.measureText(tt).width > MW) { out.push(line); line = w; } else line = tt; }); if (line) out.push(line); });
      return out; };
    const blocks = [], add = (txt, font, lh, color, gap, align, rtl) => { if (txt) blocks.push({ lines: wrap(txt, font, rtl), font, lh, color, gap, align, rtl }); };
    const arPx = o.kind === "name" ? 128 : 60;
    add(o.title, `600 40px ${SANS}`, 56, C.acc, 0, "center");
    add(o.ar, `400 ${arPx}px ${AR}`, Math.round(arPx * (o.kind === "name" ? 1.45 : 2.15)), C.ink, 40, "center", true);
    add(o.tl, `400 32px ${SANS}`, 48, C.muted, 24, "center");
    add(o.mean, `600 40px ${SANS}`, 56, C.ink, 22, "center");
    o.body.forEach((b, k) => add(b, `400 34px ${SANS}`, 52, C.ink, k ? 18 : 34, o.kind === "name" ? "left" : "center"));
    add(o.ref, `400 28px ${SANS}`, 42, C.gold, 36, "center");
    const head = 168, foot = 150, bodyH = blocks.reduce((s, b) => s + b.gap + b.lines.length * b.lh, 0);
    const H = Math.max(W, head + bodyH + foot);
    c.width = W; c.height = H;
    x.fillStyle = C.bg; x.fillRect(0, 0, W, H);
    x.fillStyle = C.card; x.beginPath(); (x.roundRect ? x.roundRect(40, 40, W - 80, H - 80, 36) : x.rect(40, 40, W - 80, H - 80)); x.fill();
    x.fillStyle = C.acc; x.fillRect(40, 40, W - 80, 10);
    x.textBaseline = "middle"; x.direction = "ltr"; x.textAlign = "left"; x.font = `400 34px ${DISP}`; x.fillStyle = C.acc; x.fillText("Islam Everyday", P, 112);
    x.textAlign = "right"; x.font = `600 24px ${SANS}`; x.fillStyle = C.gold; x.fillText(t("sh_" + (o.kind === "nawawi" ? "hadith" : o.kind)).toUpperCase(), W - P, 112);
    let y = head + Math.max(0, (H - head - foot - bodyH) / 2);
    blocks.forEach(b => { y += b.gap; x.font = b.font; x.fillStyle = b.color; x.direction = b.rtl ? "rtl" : "ltr"; x.textAlign = b.align;
      const bx = b.align === "center" ? W / 2 : P;
      b.lines.forEach(l => { x.fillText(l, bx, y + b.lh / 2); y += b.lh; }); });
    x.direction = "ltr"; x.textAlign = "center"; x.fillStyle = C.line; x.fillRect(P, H - foot + 10, MW, 2);
    x.font = `400 26px ${SANS}`; x.fillStyle = C.muted;
    x.fillText(SITE ? shUrl(o.hash).replace(/^https?:\/\//, "") : "Islam Everyday", W / 2, H - foot / 2 - 6, MW);
    const f = phoneFrame(c, C.bg); return new Promise(res => f.toBlob(res, "image/jpeg", 0.92));
  }
  async function trkImage(s) {
    /* 17 Nov 2026 (owner, Notion): in the user's theme and phone-screen tall (imgPal, phoneFrame); a verse on answering
       Allah's call to prayer under the grid (assets/share.js, turning with the day); and the studio's name picked out,
       without the web address. */
    const SANS = '"DS Sans", system-ui, sans-serif', DISP = '"DS Display", Georgia, serif', C = imgPal();
    const days = lastDays(s, 7).reverse(), sk = streak(s);
    let V = null; try { const [yy, mm, dd] = XT.parts(s.key); V = window.IE_SHARE.trackFor(Math.floor(Date.UTC(yy, mm - 1, dd) / 864e5)); } catch (e) {}
    const vt = V ? wTr(V) : "", vr = V ? wRef(V) : "";
    try { await Promise.all([document.fonts.load(`400 34px ${SANS}`, t("tsh_title") + t("fg_on") + vt), document.fonts.load(`600 34px ${SANS}`, "0123456789" + vr), document.fonts.load(`600 40px ${DISP}`, "Simply Made Studio Islam Everyday")]); } catch (e) {}
    const W = 1080, P = 96, MW = W - P * 2, c = document.createElement("canvas"), x = c.getContext("2d");
    // the verse, wrapped to the card's width (measured before the canvas is sized)
    const wrap = (txt, font) => { x.font = font; const out = []; let line = ""; String(txt).split(/\s+/).filter(Boolean).forEach(w => { const tt = line ? line + " " + w : w; if (line && x.measureText(tt).width > MW) { out.push(line); line = w; } else line = tt; }); if (line) out.push(line); return out; };
    const VF = `400 31px ${SANS}`, VL = 46, vlines = vt ? wrap("“" + vt + "”", VF) : [];
    const top = 600, rh = 88, cs = 52, ky = top + rh * 5 + 56, vTop = ky + 70, vH = vlines.length ? 40 + vlines.length * VL + 56 : 0, foot = 200;
    const H = vTop + vH + foot; c.width = W; c.height = H;
    x.fillStyle = C.bg; x.fillRect(0, 0, W, H);
    x.fillStyle = C.card; x.beginPath(); (x.roundRect ? x.roundRect(40, 40, W - 80, H - 80, 36) : x.rect(40, 40, W - 80, H - 80)); x.fill();
    x.fillStyle = C.acc; x.fillRect(40, 40, W - 80, 10);
    x.textBaseline = "middle"; x.textAlign = "left"; x.font = `400 34px ${DISP}`; x.fillStyle = C.acc; x.fillText("Islam Everyday", P, 112);
    x.textAlign = "right"; x.font = `600 24px ${SANS}`; x.fillStyle = C.gold; x.fillText(t("wtracker").toUpperCase(), W - P, 112);
    x.textAlign = "center"; x.fillStyle = C.ink; x.font = `600 46px ${SANS}`; x.fillText(t("tsh_title"), W / 2, 230);
    x.fillStyle = C.acc; x.font = `600 112px ${SANS}`; x.fillText(num(sk), W / 2, 345);
    x.fillStyle = C.muted; x.font = `400 32px ${SANS}`; x.fillText(t("daystreak"), W / 2, 425);
    // the grid: prayers down, days across (oldest on the left, today on the right)
    const gx = P + 150, gw = W - P - gx, cw = gw / 7;
    const fmt = DTF(LT(), { weekday: "short", timeZone: "UTC" });
    const empty = () => { x.setLineDash([7, 6]); x.lineWidth = 2.5; x.globalAlpha = .55; x.strokeStyle = C.muted; x.stroke(); x.globalAlpha = 1; x.setLineDash([]); };
    days.forEach((k, j) => { const [yy, mm, dd] = XT.parts(k), cx = gx + cw * j + cw / 2;
      x.fillStyle = k === s.key ? C.acc : C.muted; x.font = `600 24px ${SANS}`; x.fillText(fmt.format(new Date(Date.UTC(yy, mm - 1, dd, 12))), cx, top - 64);
      x.font = `400 24px ${SANS}`; x.fillText(num(dd), cx, top - 32); });
    let anyPd = false;
    PRAYERS.forEach((p, i) => { const cy = top + rh * i + rh / 2;
      x.textAlign = "left"; x.fillStyle = C.ink; x.font = `400 30px ${SANS}`; x.fillText(t(p), P, cy); x.textAlign = "center";
      days.forEach((k, j) => { const cx = gx + cw * j + cw / 2, on = !!(log()[k] || {})[p], ex = !on && isPd(k), r0 = cx - cs / 2, r1 = cy - cs / 2;
        x.beginPath(); (x.roundRect ? x.roundRect(r0, r1, cs, cs, 12) : x.rect(r0, r1, cs, cs));
        if (on) { x.fillStyle = C.acc; x.fill(); }
        else if (ex) { anyPd = true; x.setLineDash([]); x.lineWidth = 3; x.strokeStyle = C.pd; x.stroke(); x.beginPath(); x.arc(cx, cy, 7, 0, Math.PI * 2); x.fillStyle = C.pd; x.fill(); }
        else empty(); }); });
    // key
    const keys = [[t("fg_on"), "on"], [t("fg_off"), "off"]].concat(anyPd ? [[t("pd_ex_key"), "ex"]] : []);
    x.font = `400 26px ${SANS}`; const kw = keys.map(([l]) => 34 + 14 + x.measureText(l).width + 44), tot = kw.reduce((a, b) => a + b, 0) - 44;
    let kx = W / 2 - tot / 2; x.textAlign = "left";
    keys.forEach(([l, kind], j) => { x.beginPath(); (x.roundRect ? x.roundRect(kx, ky - 17, 34, 34, 8) : x.rect(kx, ky - 17, 34, 34));
      if (kind === "on") { x.fillStyle = C.acc; x.fill(); } else if (kind === "ex") { x.lineWidth = 3; x.strokeStyle = C.pd; x.stroke(); x.beginPath(); x.arc(kx + 17, ky, 5, 0, Math.PI * 2); x.fillStyle = C.pd; x.fill(); }
      else empty();
      x.fillStyle = C.muted; x.font = `400 26px ${SANS}`; x.fillText(l, kx + 48, ky); kx += kw[j]; });
    // the verse
    x.textAlign = "center";
    if (vlines.length) {
      let y = vTop + 40; x.fillStyle = C.line; x.fillRect(W / 2 - 60, vTop, 120, 3);
      x.font = VF; x.fillStyle = C.ink; vlines.forEach(l => { x.fillText(l, W / 2, y + VL / 2); y += VL; });
      x.font = `600 25px ${SANS}`; x.fillStyle = C.gold; x.fillText(vr, W / 2, y + 26);
    }
    // the studio: its name picked out (no web address)
    x.fillStyle = C.line; x.fillRect(P, H - foot, MW, 2);
    x.fillStyle = C.muted; x.font = `400 27px ${SANS}`; x.fillText(t("tsh_by"), W / 2, H - foot + 54);
    x.fillStyle = C.acc; x.font = `400 42px ${DISP}`; x.fillText("Simply Made Studio", W / 2, H - foot + 108);
    const f = phoneFrame(c, C.bg); return new Promise(res => f.toBlob(res, "image/jpeg", 0.92));
  }
  return { shImage, trkImage };
};
