/*
 * Schwedische Übersetzungen der NEUEN A1-Grammatikmodule (Ergänzung).
 * Muss NACH data-sv-data.js geladen werden (ergänzt SV.grammar/gramEx/topic).
 * Italienische Beispiele bleiben unverändert; nur die deutsche Prosa wird
 * ins Schwedische übersetzt.
 */
(function () {
  "use strict";
  var SV = window.SV;
  if (!SV) return;
  SV.grammar = SV.grammar || {};
  SV.gramEx = SV.gramEx || {};
  SV.topic = SV.topic || {};

  // --- Modul-Titel & -Regeln ---
  var grammar = {
    a1_presente_regolare: {
      title: "Presens: regelbundna verb (-are/-ere/-ire)",
      rule: "**-are** (parlare): parl**o**, parl**i**, parl**a**, parl**iamo**, parl**ate**, parl**ano**.\n**-ere** (prendere): prend**o**, prend**i**, prend**e**, prend**iamo**, prend**ete**, prend**ono**.\n**-ire** (dormire): dorm**o**, dorm**i**, dorm**e**, dorm**iamo**, dorm**ite**, dorm**ono**."
    },
    a1_ci_sono: {
      title: "c'è / ci sono (det finns)",
      rule: "**c'è** + singular: *c'è un problema* = det finns ett problem.\n**ci sono** + plural: *ci sono due libri* = det finns två böcker.\nFråga: *c'è …? / ci sono …?* – Nekande: *non c'è / non ci sono*."
    },
    a1_aggettivi: {
      title: "Adjektiv: kongruens (genus & numerus)",
      rule: "Adjektiv böjs: **-o/-a/-i/-e**.\n*rosso*: il libro ross**o**, la casa ross**a**, i libri ross**i**, le case ross**e**.\nAdjektiv på **-e** (grande) är lika för m/f, plural **-i** (grand**i**).\nOftast **efter** substantivet: *una macchina rossa*."
    },
    a1_piacere: {
      title: "Tycka om: mi piace / mi piacciono",
      rule: "**mi piace** + singular eller infinitiv: *mi piace il caffè*, *mi piace viaggiare*.\n**mi piacciono** + plural: *mi piacciono i gatti*.\nPersoner: **mi/ti/gli/le/ci/vi** piace. Nekande: *non mi piace*."
    },
    a1_articoli: {
      title: "Artiklar: bestämd & obestämd (il/lo/la, un/uno/una)",
      rule: "**Bestämd** (den/det): **il** (m: il libro), **lo** (m före s+konsonant, z, ps, gn: lo studente, lo zaino), **l'** (före vokal: l'amico), **la** (f: la casa).\nPlural: **i** (i libri), **gli** (m före vokal/s+konsonant/z: gli amici), **le** (le case).\n**Obestämd** (en/ett): **un** (m: un libro, un amico), **uno** (m före s+konsonant, z, ps, gn: uno studente), **una** (f: una casa), **un'** (f före vokal: un'amica)."
    },
    a1_preposizioni: {
      title: "Prepositioner: a, in, di, da, con, su, per",
      rule: "**a** = i/till (stad): *a Roma, a casa*.\n**in** = i (land, slutet rum): *in Italia, in ufficio*.\n**di** = av/från (ursprung, ägande): *di Milano, il libro di Anna*.\n**da** = från/hos (person): *da Marco*.\n**con** = med · **su** = på · **per** = för."
    }
  };
  Object.keys(grammar).forEach(function (k) { SV.grammar[k] = grammar[k]; });

  // --- Curriculum-Themen (Lernpfad) ---
  var topic = {
    "Präsens: regelmäßige Verben (-are/-ere/-ire)": "Presens: regelbundna verb (-are/-ere/-ire)",
    "Adjektive: Angleichung (Geschlecht & Zahl)": "Adjektiv: kongruens (genus & numerus)",
    "c'è / ci sono (es gibt)": "c'è / ci sono (det finns)",
    "Gefallen: mi piace / mi piacciono": "Tycka om: mi piace / mi piacciono",
    "Artikel: bestimmt & unbestimmt (il/lo/la, un/uno/una)": "Artiklar: bestämd & obestämd (il/lo/la, un/uno/una)",
    "Präpositionen: a, in, di, da, con, su, per": "Prepositioner: a, in, di, da, con, su, per"
  };
  Object.keys(topic).forEach(function (k) { SV.topic[k] = topic[k]; });

  // --- Aufgaben-Hinweise & Erklärungen mit deutschem Text ---
  var gramEx = {
    // Aufgaben-Prompts mit deutschem Hinweis in Klammern
    "la casa ___ (rot, rosso)": "la casa ___ (röd, rosso)",
    "i libri ___ (neu, nuovo)": "i libri ___ (ny, nuovo)",
    "le ragazze ___ (italienisch, italiano)": "le ragazze ___ (italiensk, italiano)",
    "un cane ___ (klein, piccolo)": "un cane ___ (liten, piccolo)",
    "una borsa ___ (groß, grande)": "una borsa ___ (stor, grande)",
    "i film sono ___ (schön, bello)": "i film sono ___ (fin, bello)",
    "In cucina ___ due sedie. (es gibt)": "In cucina ___ due sedie. (det finns)",
    "___ un supermercato qui vicino? (es gibt …?)": "___ un supermercato qui vicino? (finns det …?)",
    "Non mi ___ le verdure. (gefallen, Plural)": "Non mi ___ le verdure. (tycka om, plural)",
    "Mi ___ questo film. (Singular)": "Mi ___ questo film. (singular)",
    // Erklärungen mit deutschem Text
    "Singular → **c'è**": "Singular → **c'è**",
    "Plural → **ci sono**": "Plural → **ci sono**",
    "Singular (latte) → **c'è**": "Singular (latte) → **c'è**",
    "feminin Sg → **-a**": "femininum sg → **-a**",
    "maskulin Pl → **-i**": "maskulinum pl → **-i**",
    "feminin Pl → **-e**": "femininum pl → **-e**",
    "maskulin Sg → **-o**": "maskulinum sg → **-o**",
    "*grande* endet auf -e: für m/f gleich.": "*grande* slutar på -e: lika för m/f.",
    "Singular → **piace**": "Singular → **piace**",
    "Plural → **piacciono**": "Plural → **piacciono**",
    "Infinitiv → **piace**": "Infinitiv → **piace**",
    // Artikel-Modul: Prompts mit deutschem Hinweis
    "___ libro (bestimmt, m)": "___ libro (bestämd, m)",
    "___ studente (bestimmt)": "___ studente (bestämd)",
    "___ amico (bestimmt)": "___ amico (bestämd)",
    "___ amici (bestimmt, Plural)": "___ amici (bestämd, plural)",
    "___ zaino (unbestimmt)": "___ zaino (obestämd)",
    "___ amico (unbestimmt, m)": "___ amico (obestämd, m)",
    "___ amica (unbestimmt, f)": "___ amica (obestämd, f)",
    "___ case (bestimmt, Plural)": "___ case (bestämd, plural)",
    // Artikel-Modul: Erklärungen
    "m + Konsonant → **il**": "m + konsonant → **il**",
    "vor s+Konsonant → **lo**": "före s+konsonant → **lo**",
    "vor Vokal → **l'**": "före vokal → **l'**",
    "m Plural vor Vokal → **gli**": "m plural före vokal → **gli**",
    "vor z → **uno**": "före z → **uno**",
    "m vor Vokal → **un** (ohne Apostroph)": "m före vokal → **un** (utan apostrof)",
    "f vor Vokal → **un'**": "f före vokal → **un'**",
    "f Plural → **le**": "f plural → **le**",
    // Präpositionen-Modul: Erklärungen
    "Stadt → **a**": "stad → **a**",
    "Land → **in**": "land → **in**",
    "Besitz → **di**": "ägande → **di**",
    "Herkunft → **di**": "ursprung → **di**",
    "bei einer Person → **da**": "hos en person → **da**",
    "mit → **con**": "med → **con**"
  };
  Object.keys(gramEx).forEach(function (k) { SV.gramEx[k] = gramEx[k]; });
})();
