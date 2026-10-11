// Arabic "skeleton" normalisation shared by the 99 Names tooling and tests.
// Removes vowel signs and Qur'anic annotation marks and folds letter variants, so a plain spelling
// (e.g. "الرحمن") can be matched against the Uthmani text (e.g. "ٱلرَّحْمَٰنِ").
"use strict";
function skeleton(s) {
  return String(s)
    .replace(/[ؐ-ًؚ-ٰٟۖ-ۭـ]/g, "") // harakat, dagger alef, Quranic marks, tatweel
    .replace(/[ٱآأإا]/g, "")   // all alef forms dropped (Uthmani often omits them)
    .replace(/ؤ/g, "و").replace(/[ئىی]/g, "ي").replace(/ء/g, "") // hamza carriers, alif maqsura
    .replace(/ة/g, "ه")                        // ta marbuta
    .replace(/[^؀-ۿ ]/g, " ").replace(/\s+/g, " ").trim();
}
module.exports = { skeleton };
