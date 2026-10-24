/* Islam Everyday — interface language variants (Phase 5.2).
 *
 * The app has two content languages, English and Bangla (st.lang = "en" | "bn"). English comes in two interface
 * variants (st.loc): English (India), the default, and English (US). The variant changes only the interface:
 *   - dates and numbers are formatted with Intl for "en-IN" or "en-US" (Bangla uses "bn-BD");
 *   - "am"/"pm" is written "AM"/"PM" in the US variant;
 *   - in the US variant, interface strings written in British/Indian spelling use US spelling (see US below).
 * Religious texts (the Qur'an translation, tafsir, hadith, duas, the 99 Names explanations) are never
 * respelled or reworded: the variant applies to interface strings passed through t() and to the app's own notes.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.IE_LOCALE = api;
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  const VARIANTS = [
    { id: "en-IN", lang: "en", label: "English (India)", short: "EN" },
    { id: "en-US", lang: "en", label: "English (US)", short: "EN" },
    { id: "bn", lang: "bn", label: "বাংলা", short: "বাং" }
  ];
  const ENGLISH = ["en-IN", "en-US"];
  const variant = loc => (ENGLISH.includes(loc) ? loc : "en-IN");
  /* BCP 47 tag for Intl and for <html lang>. */
  const tag = (lang, loc) => (lang === "bn" ? "bn-BD" : variant(loc));
  /* Interface strings that differ by more than spelling. */
  const OVERRIDES = { "en-US": { am: "AM", pm: "PM" }, "en-IN": {} };
  /* British/Indian → US spelling, whole words only. Kept to words the interface actually uses (and their forms). */
  const US = {
    colour: "color", colours: "colors", favourite: "favorite", favourites: "favorites", centre: "center", centred: "centered",
    summarise: "summarize", summarised: "summarized", recognise: "recognize", recognised: "recognized", organise: "organize",
    organised: "organized", personalise: "personalize", minimise: "minimize", maximise: "maximize", prioritise: "prioritize",
    analyse: "analyze", behaviour: "behavior", honour: "honor", labelled: "labeled", labelling: "labeling",
    cancelled: "canceled", travelling: "traveling", jewellery: "jewelry", practise: "practice", grey: "gray",
    visualisation: "visualization", standardised: "standardized", normalised: "normalized", synchronise: "synchronize",
    licence: "license", licences: "licenses", modelled: "modeled", fulfil: "fulfill", enrol: "enroll", towards: "toward"
  };
  const keepCase = (w, r) => (w === w.toUpperCase() && w.length > 1 ? r.toUpperCase() : w[0] === w[0].toUpperCase() ? r[0].toUpperCase() + r.slice(1) : r);
  const usSpell = s => String(s).replace(/[A-Za-z]+/g, w => { const r = US[w.toLowerCase()]; return r ? keepCase(w, r) : w; });
  const spell = (s, loc) => (variant(loc) === "en-US" ? usSpell(s) : String(s));
  return { VARIANTS, ENGLISH, variant, tag, OVERRIDES, US, usSpell, spell };
});
