/* Islam Everyday — Qibla compass (18 Nov 2026, Notion): Android app only (More), not on the website.
 * Loaded when the page is opened (app.js: LAZY.qibla). The words (I18N) join the app's own when the file arrives.
 * window.IE_QIBLA(A) makes the page from the app's helpers in A. */
(function () {
  "use strict";
  const make = A => {
    const { t, num, esc, city, cname, back, buzz, reduce, $ } = A;
    /* Qibla compass (18 Nov 2026, Notion): in the Android app only (More), not on the website. The direction is the
       great-circle bearing from the chosen place to the Ka'bah (21.4225° N, 39.8262° E). The phone's compass comes from
       the "deviceorientationabsolute" event (magnetometer, read on the phone only; nothing is sent or saved). The dial turns
       so that the Ka'bah mark shows where to face; within 5° the ring lights up and the phone buzzes once. */
    const KAABA = [21.4225, 39.8262];
    function qiblaOf(c) {
      const r = x => x * Math.PI / 180, f1 = r(c.lat), f2 = r(KAABA[0]), dl = r(KAABA[1] - c.lng);
      const b = Math.atan2(Math.sin(dl), Math.cos(f1) * Math.tan(f2) - Math.sin(f1) * Math.cos(dl)) * 180 / Math.PI;
      const km = 6371 * Math.acos(Math.min(1, Math.sin(f1) * Math.sin(f2) + Math.cos(f1) * Math.cos(f2) * Math.cos(dl)));
      return { b: (b + 360) % 360, km };
    }
    let qbOn = false, qbH = null, qbShow = 0, qbRaf = 0, qbHit = false, qbSeen = 0;
    const qbAngle = () => (screen.orientation && typeof screen.orientation.angle === "number" ? screen.orientation.angle : (window.orientation || 0));
    function qbEvent(e) {
      if (A.route().tab !== "more" || A.route().sub !== "qibla") { qbStop(); return; }
      let h = null;
      if (typeof e.webkitCompassHeading === "number") h = e.webkitCompassHeading;
      else if (e.absolute && typeof e.alpha === "number") h = 360 - e.alpha;
      if (h == null || isNaN(h)) return;
      qbH = (h + qbAngle() + 360) % 360; qbSeen = Date.now();
      if (!qbRaf) qbRaf = requestAnimationFrame(qbDraw);
    }
    function qbStart() {
      if (qbOn) return; qbOn = true; qbSeen = 0; qbHit = false;
      addEventListener("deviceorientationabsolute", qbEvent, true);
      // no reading within two seconds: the phone has no compass (or it is off); the direction in degrees still shows
      setTimeout(() => { if (qbOn && !qbSeen) { const n = $("qb-state"); if (n) { n.textContent = t("qb_nosensor"); n.className = "qb-state warn"; } } }, 2000);
    }
    function qbStop() { if (!qbOn) return; qbOn = false; removeEventListener("deviceorientationabsolute", qbEvent, true); cancelAnimationFrame(qbRaf); qbRaf = 0; }
    function qbDraw() {
      qbRaf = 0; const dial = $("qb-dial"); if (!dial || qbH == null) return;
      // the shortest turn, eased, so the dial does not spin round when the reading passes north
      let d = ((qbH - qbShow) % 360 + 540) % 360 - 180; qbShow += d * (reduce ? 1 : 0.25);
      dial.style.transform = `rotate(${(-qbShow).toFixed(1)}deg)`;
      const q = qiblaOf(city()).b, off = ((q - qbH) % 360 + 540) % 360 - 180, ok = Math.abs(off) <= 5, n = $("qb-state");
      $("qb-wrap").classList.toggle("on", ok);
      if (n) { n.className = "qb-state" + (ok ? " ok" : ""); n.textContent = ok ? t("qb_ok") : t(off > 0 ? "qb_right" : "qb_left").replace("{d}", num(Math.round(Math.abs(off)))); }
      if (ok && !qbHit) buzz(20); qbHit = ok;
      if (Math.abs(d) > 0.3) qbRaf = requestAnimationFrame(qbDraw);
    }
    function page() {
      const c = city(), q = qiblaOf(c), deg = num(Math.round(q.b)), km = num(Math.round(q.km).toLocaleString("en-US"));
      A.post(qbStart);
      const ticks = Array.from({ length: 72 }, (_, i) => { const a = i * 5, L = i % 18 === 0 ? 14 : i % 6 === 0 ? 9 : 5;
        return `<line x1="150" y1="${18}" x2="150" y2="${18 + L}" transform="rotate(${a} 150 150)"${i % 18 ? "" : ' class="maj"'}/>`; }).join("");
      const card = ["N", "E", "S", "W"].map((k, i) => `<text x="150" y="52" transform="rotate(${i * 90} 150 150)" class="${k === "N" ? "n" : ""}">${t("qb_" + k)}</text>`).join("");
      return `<div class="page-head">${back()}<h2>${t("qb_title")}</h2></div>
      <section class="card pad qb">
        <div class="qb-wrap" id="qb-wrap">
          <svg class="qb-fix" viewBox="0 0 300 300" aria-hidden="true"><path d="M150 4l9 14h-18z"/></svg>
          <svg class="qb-dial" id="qb-dial" viewBox="0 0 300 300" role="img" aria-label="${esc(t("qb_deg").replace("{d}", deg))}">
            <circle cx="150" cy="150" r="138" class="ring"/><g class="ticks">${ticks}</g><g class="card">${card}</g>
            <g transform="rotate(${q.b.toFixed(1)} 150 150)"><line x1="150" y1="150" x2="150" y2="88" class="qline"/>
              <g transform="translate(150 76)" class="kaaba"><rect x="-11" y="-11" width="22" height="22" rx="2.5"/><path d="M-11 -4h22" class="band"/></g></g>
            <circle cx="150" cy="150" r="5" class="hub"/>
          </svg>
        </div>
        <p class="qb-state" id="qb-state" role="status" aria-live="polite">${t("qb_wait")}</p>
        <p class="qb-deg">${t("qb_deg").replace("{d}", deg)}</p>
        <p class="note">${t("qb_from").replace("{p}", esc(cname(c))).replace("{k}", km)}</p>
      </section>
      <section class="card pad qb-help"><p class="note">${t("qb_how")}</p><p class="note">${t("qb_cal")}</p></section>`;
    }
    return { page, stop: qbStop };
  };
  make.I18N = { en: {qb_N:"N",qb_E:"E",qb_S:"S",qb_W:"W",qb_wait:"Hold the phone flat…",qb_ok:"You are facing the Qibla",qb_left:"Turn left {d}°",qb_right:"Turn right {d}°",qb_deg:"Qibla: {d}° from north",qb_from:"From {p}, about {k} km to the Ka'bah in Makkah. The direction follows the place chosen in Settings.",qb_nosensor:"This phone's compass is not giving a reading. Use the direction in degrees with another compass.",qb_how:"Hold the phone flat, top pointing away from you, and turn until the Ka'bah mark is under the arrow at the top.",qb_cal:"Phone compasses can be a few degrees off. Keep away from metal and magnets; if it seems wrong, move the phone in a figure 8 a few times. When you can, check it against the direction of a nearby mosque."}, bn: {qb_N:"উ",qb_E:"পূ",qb_S:"দ",qb_W:"প",qb_wait:"ফোনটা সমান করে ধরুন…",qb_ok:"আপনি কিবলার দিকে আছেন",qb_left:"বাঁয়ে {d}° ঘুরুন",qb_right:"ডানে {d}° ঘুরুন",qb_deg:"কিবলা: উত্তর থেকে {d}°",qb_from:"{p} থেকে মক্কার কাবা প্রায় {k} কিমি। দিকটা সেটিংসে বাছা জায়গা অনুযায়ী।",qb_nosensor:"এই ফোনের কম্পাস থেকে কোনো তথ্য আসছে না। অন্য কম্পাসে ডিগ্রি মিলিয়ে দিক ঠিক করুন।",qb_how:"ফোনটা সমান করে ধরুন, ওপরের দিক আপনার সামনে, তারপর ঘুরতে থাকুন যতক্ষণ না কাবার চিহ্নটা ওপরের তীরের নিচে আসে।",qb_cal:"ফোনের কম্পাস কয়েক ডিগ্রি এদিক-ওদিক হতে পারে। লোহা বা চুম্বক থেকে দূরে রাখুন; ভুল মনে হলে ফোনটা কয়েকবার ৮-এর মতো করে ঘোরান। সম্ভব হলে কাছের কোনো মসজিদের দিকের সাথে মিলিয়ে নিন।"} };
  window.IE_QIBLA = make;
})();
