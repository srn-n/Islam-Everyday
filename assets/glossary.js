/* Islam Everyday — plain-English help for older words in Pickthall's 1930 English (Phase 5).
 *
 * This is an editorial reading aid written for this app. It is shown under the translation, labelled as word help,
 * and never changes the translation text. Meanings are the ordinary modern equivalents of the older forms, chosen
 * to fit how Pickthall uses them; they are not interpretations of the Qur'an.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.IE_GLOSS = api;
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  // word (lower case) -> modern meaning
  const WORDS = {
    hath: "has", doth: "does", saith: "says", dost: "do", didst: "did", art: "are (you)", wast: "were (you)",
    shalt: "shall", wilt: "will", canst: "can", mayst: "may", mayest: "may", shouldst: "should", wouldst: "would", couldst: "could",
    thee: "you (one person)", thou: "you (one person)", thy: "your (one person)", thine: "your / yours (one person)",
    ye: "you (more than one)", spake: "spoke", bade: "told, commanded",
    lo: "look, indeed", verily: "truly", nay: "no", yea: "yes", aught: "anything", naught: "nothing",
    ere: "before", betwixt: "between", wherefore: "why, for which reason", whereof: "of which", whereby: "by which",
    wherein: "in which", whereon: "on which", thereof: "of it", therein: "in it", thereon: "on it", therefor: "for that reason",
    nigh: "near", unto: "to", whoso: "whoever", whosoever: "whoever", haply: "perhaps", peradventure: "perhaps",
    hearken: "listen", sufficeth: "is enough", vouchsafe: "grant", succour: "help", requite: "repay",
    recompense: "reward, repayment", portents: "signs", portent: "sign", bondmen: "servants (of Allah)", bondman: "servant (of Allah)",
    folk: "people", raiment: "clothing", wroth: "angry", froward: "stubborn, defiant", dolorous: "painful",
    lewdness: "indecency", iniquity: "wrongdoing", abase: "humble", abased: "humbled", beseech: "ask earnestly",
    forsooth: "indeed", howbeit: "however", albeit: "although", withal: "as well", yonder: "over there"
  };
  // The older verb ending -eth (knoweth = knows) is explained once per text, using the first such word as the example.
  const ETH = /^[a-z]{2,}eth$/;
  const NOT_VERB = new Set(["teeth", "beneath", "underneath", "seventh", "eleventh", "twentieth", "thirtieth", "fortieth", "fiftieth", "sixtieth", "hundredth"]);
  function forText(text) {
    const seen = new Set(), out = [];
    for (const m of String(text).matchAll(/[A-Za-z]+/g)) {
      const w = m[0].toLowerCase();
      if (WORDS[w] && !seen.has(w)) { seen.add(w); out.push([w, WORDS[w]]); }
    }
    const eth = [...String(text).matchAll(/[A-Za-z]+/g)].map(m => m[0].toLowerCase()).find(w => ETH.test(w) && !NOT_VERB.has(w) && !WORDS[w]);
    if (eth) out.push(["-eth", "older verb ending for -s, as in “" + eth + "”"]);
    return out;
  }
  return { WORDS, forText };
});
