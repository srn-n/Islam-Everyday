/* Islam Everyday — display-time repair of old Bangla font-encoding leftovers.
 *
 * The Bengali Al-Mukhtasar text (QuranEnc v1.0.0) is bundled exactly as published. About 1,100 entries still
 * contain characters left over from a legacy (Bijoy/SutonnyMJ) font conversion, for example "ত্রæটি" for
 * "ত্রুটি" or "কর্মকাÐ" for "কর্মকাণ্ড". This function maps those characters back to the Unicode Bangla the
 * publisher intended, only when the text is displayed. The stored data is not changed.
 * Every word it touches in the current data is checked in tests/bnfix.test.mjs.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.IE_BNFIX = api;
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  // Order matters: multi-character patterns first.
  const RULES = [
    [/তী²/g, "তীক্ষ্ণ"],            // only occurrence of ² that stands for ক্ষ্ণ
    [/্ব¡/g, "্ব"],                 // "সমুজ্জ্ব¡ল": the ba-phala is already present
    [/ে([Ÿ¡¦])/g, "্বে"],           // "সত্তে¡ও" -> সত্ত্বেও (vowel sign stored before the ba-phala)
    [/াে/g, "ো"],                   // "¯্রােত" -> স্রোত (two halves of o stored in reverse order)
    [/›েদ্ব/g, "ন্দ্বে"],            // "দ্ব›েদ্ব" -> দ্বন্দ্বে (vowel sign stored before the conjunct)
    [/([¯¤])([িে])œ/g, (m, c, v) => (c === "¯" ? "স" : "ম") + "্ন" + v],   // "¯েœহ" -> স্নেহ, "নি¤েœাক্ত" -> নিম্নোক্ত
    [/ণœ/g, "ণ্ণ"],                 // "ক্ষুণœ" -> ক্ষুণ্ণ, "বিষণœতা" -> বিষণ্ণতা
    [/œ/g, "্ন"],                  // na-phala: "যতœ" -> যত্ন, "নি¤œ" -> নিম্ন (after ¤ is mapped below)
    [/¯/g, "স"],                   // "¯্রষ্টা" -> স্রষ্টা
    [/¤/g, "ম"],                   // "ন¤্র" -> নম্র
    [/æ/g, "ু"],                   // "ত্রæটি" -> ত্রুটি
    [/Ð/g, "ণ্ড"],                 // "কর্মকাÐ" -> কর্মকাণ্ড
    [/[‚ƒ]/g, "ূ"],                // "ভ‚মি" -> ভূমি, "ভ্রƒক্ষেপ" -> ভ্রূক্ষেপ
    [/[Ÿ¡¦]/g, "্ব"],              // "আহŸান" -> আহ্বান, "মহত্ত¡" -> মহত্ত্ব, "সান্ত¦না" -> সান্ত্বনা
    [/›/g, "ন্"],                  // "দ্ব›দ্ব" -> দ্বন্দ্ব
    [/²/g, "ক্ষ্ম"]                // "সূ²" -> সূক্ষ্ম
  ];
  const LEFTOVER = /[æÐ‚Ÿ¡¯›ƒ¤œ²¦]/;
  function repair(s) {
    if (!s || !LEFTOVER.test(s)) return s;
    let out = s;
    for (const [re, to] of RULES) out = out.replace(re, to);
    return out.normalize("NFC");
  }
  return { repair, LEFTOVER };
});
