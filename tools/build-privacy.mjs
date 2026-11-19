// Builds privacy.html: the Privacy Policy as a plain web page, for Google Play's "Privacy policy URL"
// (19 Nov 2026). Play's reviewers need a normal page, not a screen inside the app (#more/privacy).
// The text comes from assets/legal.js, so the app and this page always say the same thing; a test checks
// that privacy.html is up to date. Run: node tools/build-privacy.mjs
import { readFileSync, writeFileSync } from "node:fs";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { resolve, dirname } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function render(LG) {
  const part = (lang, title, upd) => `<section id="${lang}" lang="${lang}">
<h1>${title}</h1>
<p class="upd">${upd} ${esc(LG.UPDATED[lang])}</p>
${LG.PRIVACY[lang].map(([h, ps]) => `<h2>${esc(h)}</h2>\n${ps.map(p => `<p>${esc(p)}</p>`).join("\n")}`).join("\n")}
</section>`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Privacy Policy · Islam Everyday</title>
<meta name="description" content="Privacy Policy for Islam Everyday, the website and Android app by Simply Made Studio.">
<link rel="icon" href="favicon.ico">
<style>
:root{color-scheme:light dark;--bg:#f7f1e6;--fg:#1f2a28;--mut:#5b6663;--ac:#0f5a52;--ln:#e3d9c8}
@media (prefers-color-scheme:dark){:root{--bg:#121816;--fg:#e8e4dc;--mut:#a5ada9;--ac:#7fc7b9;--ln:#2a3330}}
body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.65 system-ui,-apple-system,"Segoe UI",Roboto,"Noto Sans Bengali",sans-serif}
main{max-width:46rem;margin:0 auto;padding:2rem 1.25rem 4rem}
nav{display:flex;gap:1rem;flex-wrap:wrap;font-size:.95rem;margin-bottom:1.5rem}
a{color:var(--ac)}
h1{font-size:1.9rem;line-height:1.2;margin:.5rem 0 .25rem}
h2{font-size:1.15rem;margin:1.75rem 0 .4rem}
.upd{color:var(--mut);margin:0 0 1rem}
section+section{border-top:1px solid var(--ln);margin-top:3rem;padding-top:1.5rem}
footer{color:var(--mut);font-size:.9rem;margin-top:3rem}
</style>
</head>
<body>
<main>
<nav><a href="./">Islam Everyday</a><a href="#en">English</a><a href="#bn" lang="bn">বাংলা</a></nav>
${part("en", "Privacy Policy", "Last updated")}
${part("bn", "গোপনীয়তা নীতি", "শেষ আপডেট:")}
<footer>Islam Everyday · Simply Made Studio</footer>
</main>
</body>
</html>
`;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const ctx = { self: {} }; vm.runInNewContext(readFileSync(resolve(root, "assets/legal.js"), "utf8"), ctx);
  const LG = ctx.self.IE_LEGAL;
  writeFileSync(resolve(root, "privacy.html"), render(LG));
  console.log("privacy.html written");
}
