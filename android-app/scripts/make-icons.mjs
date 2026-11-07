// Renders the launcher icons and Play Store graphics from the brand artwork (run once; outputs are committed).
// node scripts/make-icons.mjs <path to IslamEverydayWeb>
import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)("playwright"); // dev tool only: npm i -D playwright
import { readFileSync, writeFileSync, mkdirSync, rmSync, readdirSync } from "node:fs";
import { join } from "node:path";
const web = process.argv[2] || "../IslamEverydayWeb", RES = "android/app/src/main/res";
const master = readFileSync(join(web, "brand/islam-everyday-icon.svg"), "utf8");
const mask = readFileSync(join(web, "brand/islam-everyday-icon-maskable.svg"), "utf8");
const inner = s => s.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "").replace(/<title>[\s\S]*?<\/title>/, "");
// foreground: the maskable artwork without its background, shrunk so the doorway sits inside Android's 66dp safe circle
const fg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">${inner(mask).replace(/<rect width="512" height="512" fill="url\(#bg\)"\/>/, "")
  .replace(/(<\/defs>)([\s\S]*)$/, '$1<g transform="translate(256 256) scale(.88) translate(-256 -253)">$2</g>')}</svg>`;
const round = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><defs><clipPath id="c"><circle cx="256" cy="256" r="256"/></clipPath></defs><g clip-path="url(#c)">${inner(mask)}</g></svg>`;
const square = master;
const D = { mdpi: 1, hdpi: 1.5, xhdpi: 2, xxhdpi: 3, xxxhdpi: 4 };
const b = await chromium.launch(), pg = await b.newPage();
async function png(svg, w, h, out, transparent = true) {
  await pg.setViewportSize({ width: w, height: h });
  await pg.setContent(`<html><body style="margin:0;background:transparent">${svg.replace("<svg ", `<svg width="${w}" height="${h}" `)}</body></html>`);
  mkdirSync(out.replace(/\/[^/]+$/, ""), { recursive: true });
  await pg.screenshot({ path: out, omitBackground: transparent, clip: { x: 0, y: 0, width: w, height: h } });
}
for (const d of readdirSync(RES)) if (/^(drawable-(land|port)-|mipmap-(m|h|xh|xxh|xxxh)dpi)/.test(d)) rmSync(join(RES, d), { recursive: true, force: true });
rmSync(join(RES, "drawable/splash.png"), { force: true }); rmSync(join(RES, "drawable-v24"), { recursive: true, force: true });
for (const [k, f] of Object.entries(D)) {
  await png(fg, 108 * f, 108 * f, `${RES}/mipmap-${k}/ic_launcher_foreground.png`);
  await png(square, 48 * f, 48 * f, `${RES}/mipmap-${k}/ic_launcher.png`);
  await png(round, 48 * f, 48 * f, `${RES}/mipmap-${k}/ic_launcher_round.png`);
}
mkdirSync("play", { recursive: true });
await png(mask, 512, 512, "play/icon-512.png", false);
// Feature graphic 1024x500: the doorway at dawn and the name, in the app's colours
const fgx = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 500"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0E6B5C"/><stop offset="1" stop-color="#0A4A40"/></linearGradient></defs>
<rect width="1024" height="500" fill="url(#g)"/><g transform="translate(70 40) scale(.82)">${inner(master).replace(/<rect width="512" height="512" rx="112" fill="url\(#bg\)"\/>/, "")}</g>
<text x="520" y="232" font-family="Georgia,serif" font-size="64" fill="#F6EEDC">Islam Everyday</text>
<text x="522" y="290" font-family="system-ui,sans-serif" font-size="26" fill="#CFE3DC">Prayer times · Qur'an · Duas</text>
<text x="522" y="352" font-family="system-ui,sans-serif" font-size="18" letter-spacing="5" fill="#F2C66D">SIMPLY MADE STUDIO</text></svg>`;
await png(fgx, 1024, 500, "play/feature-graphic-1024x500.png", false);
await b.close();
console.log("icons written");
