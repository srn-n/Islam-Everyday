// Writes every position of the prayer figure, as solved by the app's own code, for the Blender source scene.
//   node tools/prayer-figure/export-poses.mjs        ->  tools/prayer-figure/poses.json
import { readFileSync, writeFileSync } from "node:fs";
import vm from "node:vm";
const root = new URL("../../", import.meta.url), rd = f => readFileSync(new URL(f, root));
const ctx = { console, TextDecoder }; ctx.window = ctx; ctx.self = ctx; ctx.globalThis = ctx; vm.createContext(ctx);
for (const f of ["assets/salah-fig.js", "assets/salah.js", "assets/salah-3d.js"]) vm.runInContext(rd(f).toString("utf8"), ctx);
const F = ctx.IE_SALAH_FIG, S3 = ctx.IE_SALAH_3D, r = v => Math.round(v * 1e5) / 1e5, out = {};
for (const who of ["man", "woman"]) {
  const b = rd(`assets/figure/${who}.bin`), c = S3.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.length));
  out[who] = {};
  for (const name of Object.keys(F.POSE)) { const fr = S3.frame(c, F, name, name, 1, 0); out[who][name] = { q: fr.Q.map(q => Array.from(q, r)), p: fr.pos.map((p, i) => [0, 1, 2].map(k => r(p[k] + fr.off[k]))) }; }
}
writeFileSync(new URL("tools/prayer-figure/poses.json", root), JSON.stringify(out));
console.log("poses:", Object.keys(out.man).length, "per figure");
