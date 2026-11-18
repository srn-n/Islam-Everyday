// Islam Everyday: the pictures shown for the Android widgets in the phone's widget list (Nov 2026, 14th).
// Android shows a widget's own layout as its preview, and ours is empty until the app fills it, so the list showed
// blank white cards. These pictures are drawn the way the phone draws the widgets (the widget picture, the same dark
// wash, white text with a gold highlight), with real content: the verses are copied word for word from the app's
// widget data (Rowwad translation), the prayer times are Sydney's on a November day.
//   node tools/widget-previews.mjs     (needs Playwright with Chrome)
// -> android-app/android/app/src/main/res/drawable-nodpi/wg_prev_{prayer,verse,verse_large}.webp (Pillow converts the
//    screenshots to WebP, keeping the rounded corners transparent)
import { chromium } from "playwright";
import { readFileSync, writeFileSync, mkdirSync, unlinkSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
const root = new URL("../", import.meta.url), out = new URL("android-app/android/app/src/main/res/drawable-nodpi/", root);
mkdirSync(out, { recursive: true });
const pic = k => "data:image/webp;base64," + readFileSync(new URL(`assets/widgets-img/${k}.webp`, root)).toString("base64");
const card = (k, w, h, body) => `<div class="w" style="width:${w}px;height:${h}px;background-image:linear-gradient(rgba(0,0,0,.45),rgba(0,0,0,.65)),url(${pic(k)})">${body}</div>`;
const P = [["Fajr", "4:09 am"], ["Dhuhr", "12:40 pm"], ["Asr", "4:23 pm"], ["Maghrib", "7:35 pm"], ["Isha", "9:05 pm"]];
const prayer = card("orchard", 720, 330, `<div class="top"><span>Current prayer</span><span>Next prayer</span></div>
  <div class="next"><b class="m">Dhuhr</b><b>Asr</b></div>
  <div class="row">${P.map(([n, t], i) => `<div class="${i === 1 ? "cur" : ""}"><span>${n}</span><b>${t}</b></div>`).join("")}</div>`);
const verse = (k, w, h, cls, t, r) => card(k, w, h, `<div class="lab">Verse for today</div><p class="${cls}">${t}</p><div class="ref">${r}</div>`);
// 18 Nov 2026 (Notion): the large one has the reference at the top in the middle, the verse centred, and share and save
const SH = `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M18 16.1c-.8 0-1.5.3-2 .8l-7.1-4.2c.1-.2.1-.5.1-.7s0-.5-.1-.7l7-4.1c.5.5 1.3.8 2.1.8 1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3c0 .2 0 .5.1.7L8 9.8C7.5 9.3 6.8 9 6 9c-1.7 0-3 1.3-3 3s1.3 3 3 3c.8 0 1.5-.3 2-.8l7.1 4.2c-.1.2-.1.4-.1.6 0 1.6 1.3 2.9 2.9 2.9s2.9-1.3 2.9-2.9-1.2-2.9-2.8-2.9z"/></svg>`,
  SV = `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M11 3h2v9.2l3.3-3.3 1.4 1.4L12 16 6.3 10.3l1.4-1.4L11 12.2zM4 15h2v3h12v-3h2v5H4z"/></svg>`;
const verseLg = (k, t, r) => card(k, 720, 720, `<div class="ref c g b">${r}</div><div class="lab c sm">Verse for today</div><p class="t lg c mid">${t}</p><div class="btns">${SH}${SV}</div>`);
const items = {
  wg_prev_prayer: prayer,
  wg_prev_verse: verse("maple", 720, 330, "t", "We have certainly made the Qur’an easy to understand and remember; is there anyone to take heed?", "Al-Qamar · 54:17"),
  wg_prev_verse_large: verseLg("glacier", "Do you not see how Allah compares a good word to a good tree? Its root is firm and its branches reach the sky, yielding its fruit all the times, by the permission of its Lord. Allah makes such comparisons for people, so that they may take heed.", "Ibrahim · 14:24–25"),
};
const css = `body{margin:0;background:transparent;font-family:Roboto,"Noto Sans","Liberation Sans",Arial,sans-serif;color:#fff}
.w{box-sizing:border-box;border-radius:44px;background-size:cover;background-position:center;padding:30px 34px;display:flex;flex-direction:column;overflow:hidden}
.top{display:flex;justify-content:space-between;font-size:24px;opacity:.9}.next{display:flex;justify-content:space-between;margin-top:6px;font-size:44px}
.g{color:#FFE2A6}.next .sm{font-size:36px;align-self:flex-end}.row{display:flex;margin-top:auto}.row div{flex:1;text-align:center;display:flex;flex-direction:column;gap:6px}
.row span{font-size:22px;opacity:.9}.row b{font-size:25px;font-weight:400}.row .on span,.row .on b{color:#FFE2A6;font-weight:700;opacity:1}.m,.row .cur span,.row .cur b{color:#FFE2A6;font-weight:700;opacity:1} /* only the current prayer (PIC_CUR = PIC_ACCENT) */
.lab{color:#FFE2A6;font-weight:700;font-size:25px}.t{margin:14px 0 0;font-size:31px;line-height:1.35;flex:1}.t.lg{font-size:40px;line-height:1.45;margin-top:22px}
.ref{font-size:24px;opacity:.9;margin-top:10px}
.c{text-align:center}.ref.b{font-weight:700;font-size:28px;opacity:1;margin-top:0}.lab.sm{color:#fff;opacity:.85;font-weight:400;font-size:21px;margin-top:2px}
.mid{display:flex;align-items:center;justify-content:center}.btns{display:flex;justify-content:center;gap:34px;opacity:.85}.btns svg{width:34px;height:34px;padding:10px}`;
const b = await chromium.launch(); const pg = await b.newPage({ deviceScaleFactor: 1 });
for (const [name, html] of Object.entries(items)) {
  await pg.setContent(`<style>${css}</style>${html}`); const el = await pg.$(".w");
  const png = await el.screenshot({ omitBackground: true });
  const f = fileURLToPath(new URL(`${name}.png`, out)); writeFileSync(f, png);
  execFileSync("python3", ["-c", "import sys;from PIL import Image;Image.open(sys.argv[1]).save(sys.argv[2],'WEBP',quality=82,method=6)", f, f.replace(/\.png$/, ".webp")]);
  unlinkSync(f); console.log(name, "ok");
}
await b.close();
