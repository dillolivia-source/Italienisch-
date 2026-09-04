/*
 * window.Lang – Grundsprache (bekannte Seite) umschalten: Deutsch / Svenska.
 * Lernziel bleibt Italienisch. Fehlt eine schwedische Übersetzung, wird
 * automatisch der deutsche Text angezeigt.
 */
window.Lang = (function () {
  "use strict";
  var KEY = "olivia-baselang";
  var cur = "de";
  try { cur = localStorage.getItem(KEY) || "de"; } catch (e) {}
  function t(de) {
    if (cur === "sv" && window.SV && window.SV.ui && window.SV.ui[de] != null) return window.SV.ui[de];
    return de;
  }
  return {
    get: function () { return cur; },
    is: function (l) { return cur === l; },
    set: function (l) { cur = (l === "sv" ? "sv" : "de"); try { localStorage.setItem(KEY, cur); } catch (e) {} },
    t: t,
    // bekannte Bedeutung einer Vokabel (Schwedisch, sonst Deutsch)
    vocab: function (v) {
      if (cur === "sv" && v && window.SV && window.SV.vocab && window.SV.vocab[v.id] != null) return window.SV.vocab[v.id];
      return v ? v.de : "";
    },
    // Satz-Vorgabe (Schwedisch, sonst Deutsch)
    sent: function (s) {
      if (cur === "sv" && s && window.SV && window.SV.sentences && window.SV.sentences[s.id] != null) return window.SV.sentences[s.id];
      return s ? s.de : "";
    }
  };
})();
