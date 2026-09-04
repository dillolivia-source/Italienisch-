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
    },
    // Satz-Vorgabe direkt über id + deutschen Text (z. B. Beispielsätze v###_ex)
    sentById: function (id, de) {
      if (cur === "sv" && id && window.SV && window.SV.sentences && window.SV.sentences[id] != null) return window.SV.sentences[id];
      return de;
    },
    // Verb-Bedeutung (Schwedisch, sonst Deutsch)
    verb: function (v) {
      if (cur === "sv" && v && window.SV && window.SV.verbs && window.SV.verbs[v.id] != null) return window.SV.verbs[v.id];
      return v ? v.de : "";
    },
    // Grammatik: Titel / Regel (Schwedisch, sonst Deutsch)
    gramTitle: function (m) {
      if (cur === "sv" && m && window.SV && window.SV.grammar && window.SV.grammar[m.id]) return window.SV.grammar[m.id].title || m.title;
      return m ? m.title : "";
    },
    gramRule: function (m) {
      if (cur === "sv" && m && window.SV && window.SV.grammar && window.SV.grammar[m.id]) return window.SV.grammar[m.id].rule || m.rule;
      return m ? m.rule : "";
    },
    // Grammatik: freie Textstücke (Aufgaben-Hinweise, Erklärungen) per deutschem Original
    gramText: function (de) {
      if (cur === "sv" && de != null && window.SV && window.SV.gramEx && window.SV.gramEx[de] != null) return window.SV.gramEx[de];
      return de;
    },
    // Grammatik: Curriculum-Themen-Label (Lernpfad)
    gramTopic: function (de) {
      if (cur === "sv" && de != null && window.SV && window.SV.topic && window.SV.topic[de] != null) return window.SV.topic[de];
      return de;
    }
  };
})();
