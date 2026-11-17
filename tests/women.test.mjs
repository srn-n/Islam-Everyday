// For women (16 Nov 2026, Notion): the For women page in More, period days in the tracker, gentle reminders on those
// days, and the tracker shared as an image. Texts are published sources copied unchanged.
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { read, p, loadBrowser } from "./helpers.mjs";

const app = read("assets/app.js"), css = read("assets/app.css"), D = loadBrowser("assets/data.js").DINSATHI.I18N;
const W = loadBrowser("assets/women.js").IE_WOMEN, RW = loadBrowser("assets/en-rwwad.js").IE_RWWAD, LIB = loadBrowser("assets/hadith.js").IE_HADITH;
const q = (l, s) => { const j = JSON.parse(read(`data/quran/${l}/${String(s).padStart(3, "0")}.json`)); return Array.isArray(j) ? j : j.t; };

test("women texts are the published texts, unchanged", () => {
  const all = [W.WELCOME, ...W.WORTH, ...W.DHIKR, ...W.DEEDS];
  for (const x of all) {
    if (x.k === "q") {
      for (let k = x.a; k <= x.b; k++) {
        assert.equal(x.ar[k - x.a], q("ar", x.s)[k - 1]); assert.equal(x.bn[k - x.a], q("bn", x.s)[k - 1]);
        assert.equal(x.en[k - x.a], RW.get(x.s, k)[0], `Rowwad ${x.s}:${k}`);
      }
    } else if (/^he/.test(x.id)) {
      const he = l => JSON.parse(readFileSync(p(`tools/women/hadeethenc/${x.id.slice(2)}-${l}.json`), "utf8"));
      for (const l of ["ar", "en", "bn"]) assert.equal(x[l], he(l).hadeeth.normalize("NFC"), `${x.id} ${l}`);
      assert.match(x.att.en, /Muslim|Bukhari/); assert.match(x.grade.en, /^Authentic/);
      assert.ok(x.refs.every(r => /^https:\/\/sunnah\.com\/(muslim|bukhari):/.test(r.url) && ["shown", "close"].includes(r.wording)));
    } else {
      const h = LIB.HADITH.find(z => z.id === x.id); assert.ok(h, x.id);
      for (const l of ["ar", "en", "bn"]) assert.equal(x[l], h[l]);
    }
  }
  // the welcome verse (3:195) is not one of the reminder verses
  assert.equal(W.WELCOME.s + ":" + W.WELCOME.a, "3:195");
  assert.ok(![...W.WORTH, ...W.DEEDS].some(x => x.k === "q" && x.s === 3 && x.a <= 195 && x.b >= 195));
  assert.equal(W.forDay(20000).length, 3);
  assert.equal(JSON.stringify(W.forDay(20000).map(x => [W.WORTH, W.DHIKR, W.DEEDS].findIndex(L => L.includes(x)))), "[0,1,2]");
});

test("For women: only in More, confirmed by the woman herself; period days stay on the phone", () => {
  const more = app.slice(app.indexOf("function vMore()"), app.indexOf("function vDev()"));
  assert.match(more, /\["women", "women", t\("women_s"\)\]/);
  const settings = app.slice(app.indexOf("function vSettings()"), app.indexOf("function vSettings()") + 30000);
  assert.doesNotMatch(settings.slice(0, settings.indexOf("\nfunction ", 10)), /women|data-act="pd"/, "not in Settings");
  assert.match(app, /const womenOn = \(\) => !!st\.women;/);
  assert.match(app, /const isPd = k => womenOn\(\) && !!\(st\.pd && st\.pd\[k\]\);/);
  assert.match(app, /case "wconfirm": st\.women = 1;/);
  assert.match(app, /\$\{on \? `\$\{verse\}/, "the verse shows after confirming");
  // kept 120 days like the log; never in a URL or sent anywhere
  assert.match(app, /for \(const k of Object\.keys\(st\.pd \|\| \{\}\)\) if \(!keep\.has\(k\)\) delete st\.pd\[k\];/);
  for (const k of ["women", "women_s", "pd_btn", "pd_on", "pd_ex", "pd_ex_key", "t_share", "tsh_title", "tsh_by", "wn_t0", "wn_t1", "wn_t2", "nf_gentle"])
    for (const l of ["en", "bn"]) assert.ok(D[l][k], `${l} ${k}`);
  // the page's own words load with its texts (assets/women.js), not with the first screen
  const W = loadBrowser("assets/women.js").IE_WOMEN.I18N;
  for (const k of ["w_intro", "w_l1", "w_l2", "w_l3", "w_private", "w_confirm", "w_confirm_n", "w_on", "w_offd", "w_welcome", "w_nf", "w_nf_h", "w_nf_off", "w_fiqh", "w_src", "w_clear", "w_cleared", "w_off"])
    for (const l of ["en", "bn"]) { assert.ok(W[l][k], `${l} ${k}`); assert.equal(D[l][k], undefined, `${k} is not on the first screen`); }
  assert.match(app, /if \(WM && WM\.I18N && !WM\._in\) \{ WM\._in = 1; for \(const l in WM\.I18N\) if \(I18N\[l\]\) Object\.assign\(I18N\[l\], WM\.I18N\[l\]\); \}/);
});

test("tracker: a period day keeps the streak without adding to it; excused prayers look different", () => {
  assert.match(app, /for \(let i = 0; i < 400; i\+\+\) \{ const k = dkey\(y, m, d\); if \(full\(k\)\) n\+\+; else if \(!isPd\(k\)\) break;/);
  assert.match(app, /const ex = pd && !o\[p\];/);
  assert.match(app, /<i class="fg-c\$\{on \? " on" : isPd\(k\) \? " ex" : ""\}/);
  assert.match(css, /\.tick\.ex\[aria-pressed="false"\] i\{border:1\.8px solid var\(--pd\);background:radial-gradient/, "a ring with a dot, not filled");
  for (const sel of [':root{--pd:', ':root[data-palette="sky"]{--pd:', ':root[data-palette="sandstone"]{--pd:', ':root[data-theme="dark"]{--pd:', ':root[data-palette="indigo"][data-theme="dark"]{--pd:', ':root[data-palette="teal"][data-theme="dark"]{--pd:',
    ':root[data-palette="sage"]{--pd:', ':root[data-palette="rose"]{--pd:', ':root[data-palette="ember"][data-theme="dark"]{--pd:', ':root[data-palette="violet"][data-theme="dark"]{--pd:'])
    assert.ok(css.includes(sel), "a period-day colour for " + sel);
});

test("reminders on a period day: three gentle ones in place of the prayer reminders, never naming the period", () => {
  assert.match(app, /if \(pd\) \{\n      if \(st\.nf\.pray && st\.wnf !== false && WM\) WM\.forDay\(n\)\.forEach\(\(x, j\) => out\.push\(\{ id: n \* 16 \+ 13 \+ j, at: D\.abs\(\["dhuhr", "asr", "isha"\]\[j\]\), ch: "gentle"/);
  assert.match(app, /\["gentle", "nf_gentle", 3\]/);
  assert.match(app, /const nfGo = \(\) => womenOn\(\) && Object\.keys\(st\.pd \|\| \{\}\)\.length && !lazyDone\.has\("women"\) \? need\("women"\)\.then\(nfRun, nfRun\) : nfRun\(\);/);
  for (const l of ["en", "bn"]) for (const k of ["wn_t0", "wn_t1", "wn_t2", "nf_gentle"]) assert.doesNotMatch(D[l][k], /period|menstru|পিরিয়ড|মাসিক|হায়েয/i, `${l} ${k}`);
  // reminder texts themselves: the Qur'an and hadith texts only
  assert.match(app, /const wNote = x => x\.k === "q" \? `“\$\{wTr\(x\)\}” — \$\{wRef\(x\)\}` : `\$\{x\[st\.lang\] \|\| x\.en\} — \$\{wRef\(x\)\}`;/);
});

test("tracker share image (17 Nov): last seven days, streak, a verse on answering the call, the studio's name; period days only as Excused", () => {
  const img = read("assets/share-img.js"), sh = loadBrowser("assets/share.js").IE_SHARE;
  assert.match(app, /case "trkshare": trkShare\(\); break;/);
  assert.match(app, /try \{ blob = await \(await shareImg\(\)\)\.trkImage\(s\); \}/);
  assert.match(app, /const shareImg = \(\) => need\("share"\)\.then\(\(\) => SI \|\| \(SI = window\.IE_SHARE_IMG\(\{/);
  assert.match(img, /x\.fillText\("Simply Made Studio", W \/ 2, H - foot \+ 108\)/);
  assert.doesNotMatch(img + JSON.stringify(D), /simplymadestudio\.net/, "no web address on the picture (owner, 17 Nov)");
  assert.match(img, /\[t\("pd_ex_key"\), "ex"\]/); assert.doesNotMatch(img.slice(img.indexOf("async function trkImage")), /pd_btn/);
  assert.equal(D.en.pd_ex_key, "Excused");
  assert.match(app, /if \(NATIVE\) \{ try \{ await natShareFile\(blob, name, title\);/);
  // the verse: Qur'an only, references as in tools/share/source.mjs, texts as published (Arabic, Bangla from data/quran)
  assert.equal(sh.TRACK.map(v => v.s + ":" + v.a).join(" "), "8:24 2:186 20:14 62:9 2:238 2:43");
  for (const v of sh.TRACK) {
    const ar = JSON.parse(read(`data/quran/ar/${String(v.s).padStart(3, "0")}.json`)), bn = JSON.parse(read(`data/quran/bn/${String(v.s).padStart(3, "0")}.json`));
    const A = Array.isArray(ar) ? ar : ar.t, B = Array.isArray(bn) ? bn : bn.t;
    assert.equal(v.ar[0], A[v.a - 1]); assert.equal(v.bn[0], B[v.a - 1]); assert.ok(v.en[0].length > 20);
  }
  assert.equal(sh.trackFor(0).s + ":" + sh.trackFor(0).a, "8:24"); assert.equal(sh.trackFor(-1).a, 43);
});

test("17 Nov (owner): the page is named as the Qur'an addresses women (al-mu'minat, 24:31, 33:35), with a girl in a hijab as its mark", () => {
  assert.equal(D.en.women, "For the believing women"); assert.equal(D.bn.women, "মুমিন নারীদের জন্য");
  assert.doesNotMatch(D.en.women + D.bn.women, /queen|রানি/i, "a name the Qur'an uses, not a made-up title");
  assert.match(app, /women: '<path data-solid fill="currentColor" stroke="none" fill-rule="evenodd" d="M12 2\.2c-3\.9 0-6\.8 3\.1/);
});
