/*
 * Tageslektion – Lernmotor für Olivias Italienisch-Trainer.
 * Aufbau einer Lektion:
 *   1. Grammatik-Wiederholung (Thema der letzten Lektion)
 *   2. Vokabel-Wiederholung (adaptiv / Spaced Repetition)
 *   3. 5 neue Vokabeln einführen + abfragen
 *   4. Neue Übersetzungen mit genau diesen Vokabeln
 *   5. Grammatik-Teil (bleibt 3–4 Tage gleich)
 * Fehler werden nach jeder Aufgabe wiederholt, bis sie richtig sind.
 *
 * Fortschritt/Curriculum wird protokolliert; bei Abschluss von A2 kommt der
 * Vorschlag, zu B1 zu wechseln.
 */
(function () {
  "use strict";
  var C = window.Core;
  var D = window.LESSON_DATA;

  var MODULES = D.grammarModules;
  var CURRICULUM = D.curriculum;

  // Eigene Vokabeln (von Olivia hinzugefügt) – lokal gespeichert
  var USERVOCAB_KEY = "olivia-it-uservocab-v1";
  function loadUserVocab() { try { return JSON.parse(localStorage.getItem(USERVOCAB_KEY)) || []; } catch (e) { return []; } }
  function saveUserVocab(a) { try { localStorage.setItem(USERVOCAB_KEY, JSON.stringify(a)); } catch (e) {} }
  function allVocab() { return D.vocab.concat(loadUserVocab()); }

  // Lektionslängen zur Auswahl (5 / 10 / 15 Min)
  var LENGTHS = {
    short:  { label: "5 Min",  newVoc: 4, review: 6,  base: 5,  gram: 5, gramReview: 3 },
    medium: { label: "10 Min", newVoc: 6, review: 10, base: 9,  gram: 7, gramReview: 4 },
    long:   { label: "15 Min", newVoc: 8, review: 16, base: 14, gram: 8, gramReview: 5 }
  };
  var LENGTH_ORDER = ["short", "medium", "long"];
  function curLen() { return LENGTHS[S.lengthPref] || LENGTHS.medium; }
  var NEW_MIN = 4;            // pro Lektion mindestens so viele neue Vokabeln

  var LEARN_DAYS = 2;         // ein neues Grammatik-Thema wird 2 Lektionen gelernt
  // Auffrischungs-Abstände (in Lektionen) je Box – verdoppeln sich bei Erfolg
  var GRAM_INTERVALS = [2, 4, 8, 16, 32, 64];
  var SRS_INTERVAL = [1, 1, 2, 3, 5, 8]; // Tage bis Wiederfälligkeit je Level
  var MASTER_VOCAB_LEVEL = 4; // ab hier gilt eine Vokabel als "gelernt"
  var MASTER_GRAMMAR_HITS = 36; // so viele richtige Antworten → Modul "gelernt" (über mehrere Tage; bewusst streng)

  var LS_KEY = "olivia-it-lesson-v2";

  /* ---------------- Persistenter Zustand ---------------- */
  function freshState() {
    return {
      schemaVersion: 2,        // für spätere Migrationen
      level: "A2",
      lessonNo: 0,
      lastDate: null,          // "YYYY-MM-DD" der letzten begonnenen Lektion
      completedDate: null,     // Datum der letzten ABGESCHLOSSENEN Lektion
      introduced: [],          // Vokabel-IDs, die schon eingeführt wurden
      srs: {},                 // id -> {level, streak, wrong, due, last}
      conj: {},                // Verb-Konjugations-SRS: verbId -> {level, streak, wrong, due, last}
      baseSeen: {},            // Alltagssatz-ID -> Lektions-Nr., wann zuletzt gezeigt (Cooldown)
      lengthPref: "medium",    // Lektionslänge: short/medium/long (5/10/15 Min)
      // --- Grammatik-SRS (Themen-Ebene) ---
      learnIndex: 0,           // Position im Lern-Plan der Grammatik-Themen
      learnDays: 0,            // wie viele Lektionen schon am aktuellen Lernthema
      gramSrs: {},             // moduleId -> {box, due, wrong, seen}
      gramLessonStats: {},     // moduleId -> {c, w} in DIESER Lektion (für Neuplanung)
      grammarHits: {},         // moduleId -> Anzahl richtiger Antworten (Fortschrittsbalken)
      plan: null,              // aktuell laufender Lektionsplan
      seg: 0,                  // aktueller Segment-Index im Plan
      segSolved: {},           // im aktuellen Segment schon richtig gelöste Fragen (für Resume)
      b1Offered: false
    };
  }
  var S = load();
  function load() {
    try {
      var raw = JSON.parse(localStorage.getItem(LS_KEY));
      if (raw && typeof raw === "object") {
        var base = freshState();
        for (var k in raw) base[k] = raw[k];
        migrateState(base);
        return base;
      }
    } catch (e) {}
    return freshState();
  }
  // Nachträgliche Anpassungen an einem gespeicherten Zustand (z. B. eine bereits
  // laufende Lektion an neue Regeln angleichen).
  function migrateState(st) {
    if (st.plan && st.plan.segments) {
      st.plan.segments.forEach(function (seg) {
        // Alltagssätze: auf höchstens 5 kürzen (neue Regel)
        if (seg.title && seg.title.indexOf("Sätze aus deinem Alltag") !== -1 &&
          seg.questions && seg.questions.length > 5) {
          seg.questions = seg.questions.slice(0, 5);
        }
      });
    }
  }
  function save() { try { localStorage.setItem(LS_KEY, JSON.stringify(S)); } catch (e) {} }

  function todayKey() {
    var d = new Date();
    var m = String(d.getMonth() + 1).padStart(2, "0");
    var day = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + m + "-" + day;
  }

  /* ---------------- Niveau-Reihenfolge ---------------- */
  var LEVEL_ORDER = ["A1", "A2", "B1", "B2"];
  function levelLE(a, b) { return LEVEL_ORDER.indexOf(a) <= LEVEL_ORDER.indexOf(b); }

  function vocabForLevel() {
    // Schwedische Lernende: Baby-/Kleinkind-Thema raus; außerdem nur Vokabeln,
    // für die es eine schwedische Bedeutung gibt (kein deutscher Durchschlag).
    var sv = C.baseLang && C.baseLang() === "sv";
    var svMap = (window.SV && window.SV.vocab) || {};
    return allVocab().filter(function (v) {
      if (!levelLE(v.cefr, S.level)) return false;
      if (sv) {
        if (v.theme === "baby") return false;
        if (svMap[v.id] == null) return false;
      }
      return true;
    });
  }
  function modulesForLevel() {
    // aktuelles Niveau UND darunter (A1-Themen werden bei A2 mitgeübt)
    return MODULES.filter(function (m) { return levelLE(m.cefr, S.level); });
  }
  function moduleById(id) {
    return MODULES.filter(function (m) { return m.id === id; })[0] || null;
  }
  // Pädagogische Lern-Reihenfolge der Grammatik: aus dem Curriculum (A1 → A2 → …),
  // nur vorhandene Module bis zum aktuellen Niveau.
  function learnOrder() {
    var ids = [], seen = {};
    LEVEL_ORDER.forEach(function (lv) {
      if (!levelLE(lv, S.level)) return;
      var g = (CURRICULUM[lv] && CURRICULUM[lv].grammar) || [];
      g.forEach(function (t) {
        if (t.status === "ready" && t.moduleId && moduleById(t.moduleId) && !seen[t.moduleId]) {
          seen[t.moduleId] = 1; ids.push(t.moduleId);
        }
      });
    });
    // eventuelle Module ohne Curriculum-Eintrag hinten anhängen
    modulesForLevel().forEach(function (m) { if (!seen[m.id]) { seen[m.id] = 1; ids.push(m.id); } });
    return ids;
  }
  /* ---------------- Grammatik-SRS (Themen-Ebene) ---------------- */
  function gramFor(id) {
    if (!S.gramSrs[id]) S.gramSrs[id] = { box: 0, due: S.lessonNo, wrong: 0, seen: false };
    return S.gramSrs[id];
  }
  // Nach einer Lektion: Box/Fälligkeit eines Themas anhand richtig/falsch neu setzen.
  function scheduleGram(id, correct, wrong) {
    var e = gramFor(id);
    e.seen = true;
    if (wrong > 0) {
      e.box = Math.max(0, e.box - 1);   // Fehler → zurück, kommt schneller wieder
      e.wrong += wrong;
    } else if (correct > 0) {
      e.box = Math.min(GRAM_INTERVALS.length - 1, e.box + 1); // Erfolg → längerer Abstand
    }
    e.due = S.lessonNo + GRAM_INTERVALS[e.box];
    save();
  }
  // Wähle ein Auffrischungs-Thema: fällig & schwach zuerst; nie das Lernthema.
  function pickRefresher(excludeId) {
    var cand = Object.keys(S.gramSrs).filter(function (id) {
      return id !== excludeId && S.gramSrs[id].seen && moduleById(id);
    });
    if (!cand.length) return null;
    var due = cand.filter(function (id) { return S.gramSrs[id].due <= S.lessonNo; });
    var pool = due.length ? due : cand; // sonst das am ehesten fällige
    pool.sort(function (a, b) {
      var ea = S.gramSrs[a], eb = S.gramSrs[b];
      if ((eb.wrong || 0) !== (ea.wrong || 0)) return (eb.wrong || 0) - (ea.wrong || 0);
      return ea.due - eb.due;
    });
    return pool[0];
  }

  /* ---------------- SRS-Helfer ---------------- */
  function srsFor(id) {
    if (!S.srs[id]) S.srs[id] = { level: 0, streak: 0, wrong: 0, due: S.lessonNo, last: null };
    return S.srs[id];
  }
  function srsUpdate(id, ok) {
    var e = srsFor(id);
    if (ok) {
      e.streak++;
      e.level = Math.min(SRS_INTERVAL.length - 1, e.level + 1);
      e.last = "ok";
    } else {
      e.streak = 0;
      e.level = Math.max(0, e.level - 1);
      e.wrong++;
      e.last = "no";
    }
    e.due = S.lessonNo + SRS_INTERVAL[e.level];
    save();
  }

  /* ---------------- Fortschritt / Curriculum ---------------- */
  function vocabMasteredCount(level) {
    var pool = allVocab().filter(function (v) { return levelLE(v.cefr, level); });
    var n = 0;
    pool.forEach(function (v) {
      var e = S.srs[v.id];
      if (e && e.level >= MASTER_VOCAB_LEVEL) n++;
    });
    return { done: n, total: pool.length };
  }
  function grammarMastered(moduleId) {
    return (S.grammarHits[moduleId] || 0) >= MASTER_GRAMMAR_HITS;
  }
  function grammarPct(moduleId) {
    return Math.min(100, Math.round(((S.grammarHits[moduleId] || 0) / MASTER_GRAMMAR_HITS) * 100));
  }
  function curriculumProgress(level) {
    var g = (CURRICULUM[level] && CURRICULUM[level].grammar) || [];
    var readyItems = g.filter(function (t) { return t.status === "ready"; });
    var doneG = readyItems.filter(function (t) { return grammarMastered(t.moduleId); }).length;
    var voc = vocabMasteredCount(level);
    return {
      grammarReady: readyItems.length,
      grammarDone: doneG,
      grammarPlanned: g.filter(function (t) { return t.status === "planned"; }).length,
      vocabDone: voc.done,
      vocabTotal: voc.total,
      items: g
    };
  }
  // Realistischer Kernwortschatz je Niveau (statt des gesamten Vokabel-Bergs) –
  // so ist ein Niveau erreichbar und der Prozentwert bewegt sich sichtbar.
  var LEVEL_VOCAB_TARGET = { A1: 120, A2: 200, B1: 150, B2: 150 };
  function vocabTargetFor(level, total) {
    var t = LEVEL_VOCAB_TARGET[level] || 150;
    return Math.max(1, Math.min(t, total || t));
  }
  // Ein Niveau gilt als geschafft, wenn alle "ready"-Grammatikthemen gemeistert
  // sind UND der Kernwortschatz (fast) sitzt.
  function levelComplete(level) {
    var p = curriculumProgress(level);
    var voc = levelVocabStats(level);
    var target = vocabTargetFor(level, voc.total);
    var grammarOk = p.grammarReady > 0 && p.grammarDone >= p.grammarReady;
    var vocabOk = voc.total > 0 && voc.mastered >= Math.ceil(target * 0.9);
    return grammarOk && vocabOk;
  }

  /* ================= LEKTIONSPLAN BAUEN ================= */
  function buildPlan() {
    S.lessonNo += 1;
    S.lastDate = todayKey();
    S.gramLessonStats = {};
    var L = curLen();

    // --- Grammatik: neues Lernthema bestimmen (LEARN_DAYS Lektionen lang) ---
    var order = learnOrder();
    if (order.length === 0) order = modulesForLevel().map(function (m) { return m.id; });
    if (S.learnDays >= LEARN_DAYS) {
      S.learnIndex = (S.learnIndex + 1) % order.length;
      S.learnDays = 1;
    } else {
      S.learnDays = (S.learnDays || 0) + 1;
    }
    var learnMod = moduleById(order[S.learnIndex % order.length]) || moduleById(order[0]);

    // --- Grammatik: Auffrischungsthema (fällig/schwach, nie das Lernthema) ---
    var rid = pickRefresher(learnMod ? learnMod.id : null);
    var refresherMod = rid ? moduleById(rid) : null;

    var segments = [];

    // 1. Auffrischung eines früheren Grammatik-Themas (Spaced Repetition)
    if (refresherMod) {
      segments.push({
        type: "quiz",
        title: "🔁 Auffrischung: " + refresherMod.title,
        questions: pickGrammarQuestions(refresherMod, L.gramReview)
      });
    }

    // 2. Vokabel-Wiederholung (adaptiv)
    var due = vocabForLevel().filter(function (v) {
      return S.introduced.indexOf(v.id) !== -1 &&
        (S.srs[v.id] ? S.srs[v.id].due <= S.lessonNo : true);
    });
    due.sort(function (a, b) {
      var ea = S.srs[a.id] || { wrong: 0, level: 0 };
      var eb = S.srs[b.id] || { wrong: 0, level: 0 };
      if (eb.wrong !== ea.wrong) return eb.wrong - ea.wrong;
      return ea.level - eb.level;
    });
    due = due.slice(0, L.review);
    if (due.length) {
      segments.push({
        type: "quiz",
        title: "🗂️ Vokabel-Wiederholung",
        questions: due.map(vocabQuestion),
        srs: true
      });
    }

    // 3. neue Vokabeln + sofortige Abfrage (immer mindestens NEW_MIN)
    var newTarget = Math.max(L.newVoc, NEW_MIN);
    var fresh = vocabForLevel().filter(function (v) {
      return S.introduced.indexOf(v.id) === -1;
    }).slice(0, newTarget);

    if (fresh.length) {
      segments.push({
        type: "vocabIntro",
        title: "✨ " + fresh.length + " neue Vokabeln",
        vocab: fresh
      });
      segments.push({
        type: "quiz",
        title: "✨ Neue Vokabeln abfragen",
        questions: fresh.map(vocabQuestion),
        srs: true,
        introduce: fresh.map(function (v) { return v.id; })
      });
      // 4. Übersetzungen mit den neuen Vokabeln
      var transQs = fresh.filter(function (v) { return v.ex; }).map(function (v) {
        return { kind: "type", id: v.id + "_ex", prompt: v.ex.de, accept: v.ex.it };
      });
      if (transQs.length) {
        segments.push({
          type: "quiz",
          title: "✍️ Übersetzen mit den neuen Vokabeln",
          questions: transQs,
          srs: true
        });
      }
    }

    // 5. Alltagssätze – immer genau 5 (unabhängig von der Lektionslänge)
    var baseQs = pickBaseSentences(5).map(function (s) {
      return { kind: "type", id: s.id, prompt: s.de, accept: s.it };
    });
    if (baseQs.length) {
      segments.push({
        type: "quiz",
        title: "✍️ Sätze aus deinem Alltag",
        questions: baseQs,
        srs: true
      });
    }

    // 6. Neues Grammatik-Thema: erst Regel erklären, dann üben
    if (learnMod) {
      segments.push({
        type: "info",
        title: "🧩 Grammatik: " + learnMod.title,
        html: C.mdInline(learnMod.rule),
        note: "Neu · Tag " + S.learnDays + " von " + LEARN_DAYS + " – danach im Auffrischungs-Rhythmus.",
        progressModuleId: learnMod.id,
        progressLabel: learnMod.title
      });
      segments.push({
        type: "quiz",
        title: "🧩 Grammatik üben",
        questions: pickGrammarQuestions(learnMod, L.gram),
        grammarModuleId: learnMod.id
      });
    }

    S.plan = { segments: segments, lessonNo: S.lessonNo };
    S.seg = 0;
    S.segSolved = {};
    save();
  }

  // "kenne ich schon": Vokabel als bekannt+sicher markieren und durch eine
  // neue ersetzen, bis die Einheit aus lauter unbekannten besteht.
  function markVocabKnownInIntro(seg, id) {
    if (S.introduced.indexOf(id) === -1) S.introduced.push(id);
    var e = srsFor(id);
    e.level = SRS_INTERVAL.length - 1; // gilt als "sicher"
    e.streak = 3; e.wrong = 0; e.last = "ok";
    e.due = S.lessonNo + SRS_INTERVAL[e.level];
    // die als bekannt markierte Vokabel aus der Einheit entfernen …
    var idx = -1;
    for (var i = 0; i < seg.vocab.length; i++) { if (seg.vocab[i].id === id) { idx = i; break; } }
    if (idx >= 0) seg.vocab.splice(idx, 1);
    // … und die Einheit wieder auf das Ziel (mind. NEW_MIN) mit neuen auffüllen.
    var target = Math.max(curLen().newVoc, NEW_MIN);
    var used = {}; seg.vocab.forEach(function (v) { used[v.id] = 1; });
    var pool = vocabForLevel().filter(function (v) {
      return S.introduced.indexOf(v.id) === -1 && !used[v.id];
    });
    while (seg.vocab.length < target && pool.length) {
      var next = pool.shift();
      used[next.id] = 1;
      seg.vocab.push(next);
    }
    seg.title = "✨ " + seg.vocab.length + " neue Vokabeln";
    syncFreshSegments(seg.vocab);
    save();
    render(root);
  }
  // Abfrage- und Übersetzungs-Segment an die geänderte Vokabel-Auswahl anpassen
  function syncFreshSegments(fresh) {
    S.plan.segments.forEach(function (s) {
      if (s.type === "quiz" && s.introduce) {
        s.questions = fresh.map(vocabQuestion);
        s.introduce = fresh.map(function (v) { return v.id; });
      }
      if (s.type === "quiz" && s.title && s.title.indexOf("Übersetzen mit den neuen") !== -1) {
        s.questions = fresh.filter(function (v) { return v.ex; }).map(function (v) {
          return { kind: "type", id: v.id + "_ex", prompt: v.ex.de, accept: v.ex.it };
        });
      }
    });
  }

  function vocabQuestion(v) {
    // Kein "explain" – die richtige Lösung zeigt schon die grüne Zeile.
    return {
      kind: "type",
      id: v.id,
      vocabId: v.id,   // markiert: dies ist eine Vokabel → „Sitzt schon"-Knopf möglich
      prompt: C.known(v),
      accept: [v.it]
    };
  }

  // „Sitzt schon – erstmal pausieren": Vokabel als sicher markieren und mit
  // WACHSENDER Pause zurückstellen; sie kommt aber garantiert irgendwann wieder
  // zur Kontrolle (smarte Wiedervorlage).
  var SNOOZE_STEPS = [15, 30, 60, 120]; // Lektionen Pause, steigt bei jedem „Sitzt"
  function snoozeVocab(id) {
    var e = srsFor(id);
    e.level = SRS_INTERVAL.length - 1; // gilt als „sicher"
    e.streak = (e.streak || 0) + 3;
    e.wrong = 0;
    e.last = "ok";
    e.snooze = (e.snooze || 0) + 1;
    var step = SNOOZE_STEPS[Math.min(e.snooze - 1, SNOOZE_STEPS.length - 1)];
    e.due = S.lessonNo + step;
    if (S.introduced.indexOf(id) === -1) S.introduced.push(id);
    save();
  }
  // Dasselbe für ein GRAMMATIK-THEMA: gilt als gelernt und pausiert wachsend.
  var GRAM_SNOOZE_STEPS = [16, 32, 64, 120];
  function snoozeGrammar(id) {
    var e = gramFor(id);
    e.seen = true;
    e.box = GRAM_INTERVALS.length - 1;
    e.wrong = 0;
    e.snooze = (e.snooze || 0) + 1;
    var step = GRAM_SNOOZE_STEPS[Math.min(e.snooze - 1, GRAM_SNOOZE_STEPS.length - 1)];
    e.due = S.lessonNo + step;
    S.grammarHits[id] = MASTER_GRAMMAR_HITS; // zählt als „gelernt"
    if (S.gramLessonStats && S.gramLessonStats[id]) delete S.gramLessonStats[id];
    save();
  }
  // … und für ein VERB im Konjugations-Trainer (eigene SRS S.conj).
  function snoozeVerb(id) {
    var e = conjFor(id);
    e.level = SRS_INTERVAL.length - 1;
    e.streak = (e.streak || 0) + 3;
    e.wrong = 0;
    e.last = "ok";
    e.snooze = (e.snooze || 0) + 1;
    var step = SNOOZE_STEPS[Math.min(e.snooze - 1, SNOOZE_STEPS.length - 1)];
    e.due = S.lessonNo + step;
    save();
  }

  // Alltagssätze aus dem Satz-Pool (data.js) – nach Niveau, Fokus auf Wackliges.
  var BASE_COOLDOWN = 3; // so viele Lektionen pausiert ein gerade gezeigter Satz
  function pickBaseSentences(n) {
    var pool = (window.APP_DATA && window.APP_DATA.sentences || [])
      .filter(function (s) { return levelLE(s.cefr, S.level); });
    if (!S.baseSeen) S.baseSeen = {};
    var scored = pool.map(function (s) {
      var e = C.getEntry(s.id) || { correct: 0, wrong: 0, last: null };
      var w = 1 + (e.wrong || 0) * 1.5;                 // Fehler weiter bevorzugt (etwas milder)
      if (e.correct === 0 && e.wrong === 0) w += 2;     // noch nie geübt: klar bevorzugen
      if (e.last === "no") w += 2;                      // zuletzt falsch: wieder dran
      w -= Math.min(e.correct || 0, 4) * 0.4;           // oft richtig → seltener
      // Cooldown: kürzlich gezeigte Sätze deutlich (aber nur zeitweise) zurückstellen
      var last = S.baseSeen[s.id];
      if (last != null) {
        var ago = S.lessonNo - last;
        if (ago <= BASE_COOLDOWN) w -= (BASE_COOLDOWN - ago + 1) * 3;
      }
      return { s: s, w: w + Math.random() * 1.5 };      // mehr Zufall → mehr Abwechslung
    });
    scored.sort(function (a, b) { return b.w - a.w; });
    var chosen = scored.slice(0, n).map(function (x) { return x.s; });
    // Merken, wann diese Sätze zuletzt dran waren (für den Cooldown)
    chosen.forEach(function (s) { S.baseSeen[s.id] = S.lessonNo; });
    return chosen;
  }

  function pickGrammarQuestions(module, n) {
    var ex = C.shuffle(module.slice ? module : module.exercises).slice(0, n);
    return ex.map(function (q, i) {
      if (q.kind === "choice") {
        return {
          kind: "choice",
          id: module.id + "_c" + i,
          prompt: q.prompt,
          options: q.options,
          answer: q.answer,
          explain: q.explain,
          moduleId: module.id
        };
      }
      return {
        kind: "type",
        id: module.id + "_f" + i,
        prompt: q.prompt,
        accept: q.accept,
        explain: q.explain,
        moduleId: module.id
      };
    });
  }

  function registerGrammarHit(moduleId) {
    if (!moduleId) return;
    S.grammarHits[moduleId] = (S.grammarHits[moduleId] || 0) + 1;
    save();
  }

  /* ================= RENDERING ================= */
  var root;
  function render(container) {
    root = container;
    root.innerHTML = "";

    // Kein Plan oder Plan fertig?
    var hasActivePlan = S.plan && S.seg < S.plan.segments.length;
    var doneToday = S.completedDate === todayKey();

    if (!hasActivePlan) {
      if (doneToday) return renderDoneToday();
      return renderStartScreen();
    }
    renderSegment();
  }

  function header(title, sub) {
    var h = C.el('<div class="lesson-head"></div>');
    h.appendChild(C.el('<p class="lesson-step">Lektion ' + S.lessonNo +
      ' · Schritt ' + (S.seg + 1) + '/' + S.plan.segments.length + '</p>'));
    h.appendChild(C.el('<h2 class="lesson-title">' + C.esc(title) + '</h2>'));
    if (sub) h.appendChild(C.el('<p class="hint">' + C.esc(sub) + '</p>'));
    return h;
  }

  // aktueller Fortschritt (in %) des laufenden Niveaus – für den Ring
  function levelPct() {
    var all = getLevelProgress();
    for (var i = 0; i < all.length; i++) { if (all[i].level === S.level) return all[i].pct; }
    return 0;
  }
  // Fokus-Hero: großer Fortschritts-Ring (Niveau → nächstes), Start-Knopf,
  // Längenwahl und Schnellzugriffe.
  function ringHero(done) {
    var pct = levelPct();
    var next = LEVEL_ORDER[LEVEL_ORDER.indexOf(S.level) + 1] || S.level;
    var CIRC = 515, off = Math.round(CIRC * (1 - pct / 100));
    var card = C.el('<div class="card focus-hero"></div>');
    card.appendChild(C.el('<div class="level-pill">' + C.esc(C.tt("Niveau ")) + S.level + '</div>'));
    card.appendChild(C.el(
      '<div class="ringwrap"><svg class="ring" viewBox="0 0 200 200" role="img" aria-label="' +
      S.level + ' zu ' + next + ', ' + pct + ' Prozent">' +
      '<circle cx="100" cy="100" r="82" fill="none" stroke="var(--line)" stroke-width="16"/>' +
      '<circle cx="100" cy="100" r="82" fill="none" stroke="var(--brand)" stroke-width="16" stroke-linecap="round" ' +
      'stroke-dasharray="' + CIRC + '" stroke-dashoffset="' + off + '" transform="rotate(-90 100 100)"/>' +
      '<text x="100" y="98" text-anchor="middle" class="ring-pc">' + pct + '%</text>' +
      '<text x="100" y="124" text-anchor="middle" class="ring-lb">' + S.level + ' → ' + next + '</text>' +
      '</svg></div>'));
    var status = done
      ? '🎉 <b>Heute geschafft!</b> Morgen geht’s weiter.'
      : (S.lessonNo > 0 ? 'Weiter mit <b>Lektion ' + (S.lessonNo + 1) + '</b>' : '<b>Deine erste Lektion</b> wartet');
    card.appendChild(C.el('<p class="focus-status">' + status + '</p>'));

    var chips = C.el('<div class="len-row focus-len"></div>');
    LENGTH_ORDER.forEach(function (key) {
      var c = C.el('<button class="chip" aria-pressed="' + (S.lengthPref === key) + '">' +
        C.esc(LENGTHS[key].label) + '</button>');
      c.onclick = function () { S.lengthPref = key; save(); renderStartScreen_refresh(); };
      chips.appendChild(c);
    });
    card.appendChild(chips);

    var btn = C.el('<button class="btn primary focus-cta">' +
      (done ? C.esc(C.tt('Trotzdem üben →')) : C.esc(C.tt('Lektion starten →'))) + '</button>');
    btn.onclick = function () { buildPlan(); render(root); };
    card.appendChild(btn);

    var q = C.el('<div class="focus-quick"></div>');
    [["vokabeln", "📇", "Vokabeln"], ["verben", "🔤", "Verben"], ["uebersetzen", "✍️", "Übersetzen"]].forEach(function (t) {
      var a = C.el('<button class="fq"><span class="fq-ic">' + t[1] + '</span>' + t[2] + '</button>');
      a.onclick = function () { if (C.goTab) C.goTab(t[0]); };
      q.appendChild(a);
    });
    card.appendChild(q);
    return card;
  }

  function renderStartScreen() {
    root.appendChild(ringHero(false));
    renderProgressCard();
  }
  // Startbildschirm neu zeichnen (nach Längenauswahl), ohne Plan zu bauen
  function renderStartScreen_refresh() { root.innerHTML = ""; renderStartScreen(); }

  function renderDoneToday() {
    root.appendChild(ringHero(true));
    renderProgressCard();
  }

  function renderProgressCard() {
    var p = curriculumProgress(S.level);
    var card = C.el('<div class="card"></div>');
    card.appendChild(C.el('<p class="section-title" style="margin-top:0">🗺️ Dein Lernpfad · Niveau ' + S.level + '</p>'));

    // Nächster Meilenstein = erstes fertiges, noch nicht gemeistertes Thema
    var next = null;
    for (var i = 0; i < p.items.length; i++) {
      var t0 = p.items[i];
      if (t0.status === "ready" && !grammarMastered(t0.moduleId)) { next = t0; break; }
    }
    if (next) {
      var np = grammarPct(next.moduleId);
      var mb = C.el('<div class="milestone"></div>');
      mb.appendChild(C.el('<div class="ms-label">' + C.esc(C.tt('Als Nächstes dran')) + '</div>'));
      mb.appendChild(C.el('<div class="ms-topic">' + C.esc(next.topic) + '</div>'));
      mb.appendChild(bar(np));
      mb.appendChild(C.el('<div class="ms-sub">' + (np > 0 ? np + '% geübt – weiter so' : 'Noch nicht geübt') + '</div>'));
      var goBtn = C.el('<button class="btn primary" style="width:100%;margin-top:10px">' + C.esc(C.tt('▶ Jetzt üben')) + '</button>');
      goBtn.onclick = function () { startGrammarPractice(next.moduleId); };
      mb.appendChild(goBtn);
      card.appendChild(mb);
    } else {
      card.appendChild(C.el('<p class="hint" style="margin:6px 0 10px">🎉 Alle ' + S.level + '-Grammatikthemen gemeistert!</p>'));
    }

    var gPct = p.grammarReady ? Math.round((p.grammarDone / p.grammarReady) * 100) : 0;
    card.appendChild(C.el('<p class="hint" style="margin:8px 0 2px">Grammatik-Themen: ' + p.grammarDone + '/' + p.grammarReady + ' gemeistert</p>'));
    card.appendChild(bar(gPct));

    var vPct = p.vocabTotal ? Math.round((p.vocabDone / p.vocabTotal) * 100) : 0;
    card.appendChild(C.el('<p class="hint" style="margin:12px 0 2px">Wortschatz: ' + p.vocabDone + '/' + p.vocabTotal + ' sitzt sicher</p>'));
    card.appendChild(bar(vPct));

    // Meilenstein-Liste (Pfad). Ready-Themen sind anklickbar → gezieltes Üben.
    card.appendChild(C.el('<p class="section-title" style="margin:16px 0 2px">Alle Grammatik-Themen</p>'));
    card.appendChild(C.el('<p class="hint" style="margin:0 0 6px">Tippe ein Thema an, um es gezielt zu üben.</p>'));
    var list = C.el('<div class="path"></div>');
    p.items.forEach(function (t) {
      var isReady = t.status === "ready";
      var pct = isReady ? grammarPct(t.moduleId) : 0;
      var done = isReady && grammarMastered(t.moduleId);
      var icon = t.status === "planned" ? "⏳" : (done ? "✅" : (pct > 0 ? "📘" : "◻️"));
      var extra = t.status === "planned" ? ' <span class="badge gray">geplant</span>' : "";
      var item = C.el('<div class="curr-item' + (isReady ? " curr-clickable" : "") + '" style="margin:9px 0"></div>');
      item.appendChild(C.el('<div class="gp-row"><span>' + icon + " " + C.esc(t.topic) + extra +
        '</span>' + (isReady ? '<span class="gp-pct">' + pct + '% ›</span>' : '') + '</div>'));
      if (isReady) {
        item.appendChild(bar(pct));
        item.onclick = function () { startGrammarPractice(t.moduleId); };
      }
      list.appendChild(item);
    });
    card.appendChild(list);
    root.appendChild(card);

    // B1-Vorschlag
    if (S.level === "A2" && levelComplete("A2")) {
      var up = C.el('<div class="card levelup"></div>');
      up.appendChild(C.el('<div style="font-size:40px">🎉</div>'));
      up.appendChild(C.el('<h2 style="margin:4px 0">Du bist bereit für B1!</h2>'));
      up.appendChild(C.el('<p class="hint">Du hast den A2-Stoff systematisch durchgearbeitet. Willst du ab jetzt Lektionen auf B1-Niveau machen?</p>'));
      var go = C.el('<button class="btn primary">Auf B1 wechseln</button>');
      go.onclick = function () {
        if (confirm("Ab jetzt Lektionen auf B1-Niveau? (Du kannst später zurückwechseln.)")) {
          S.level = "B1"; S.learnIndex = 0; S.learnDays = 0; S.b1Offered = true;
          save(); render(root);
        }
      };
      up.appendChild(go);
      root.appendChild(up);
    } else if (p.grammarPlanned > 0) {
      root.appendChild(C.el('<p class="offline-note">⏳ ' + p.grammarPlanned +
        ' weitere ' + S.level + '-Themen sind offiziell gelistet und werden noch als Übungen ergänzt.</p>'));
    }

    // Niveau manuell umstellen
    var sw = C.el('<p class="offline-note" style="margin-top:14px"></p>');
    LEVEL_ORDER.slice(0, 3).forEach(function (lv) {
      var a = C.el('<a href="#" style="margin:0 6px;' + (lv === S.level ? "font-weight:700" : "") + '">' + lv + "</a>");
      a.onclick = function (e) {
        e.preventDefault();
        S.level = lv; S.learnIndex = 0; S.learnDays = 0; save(); render(root);
      };
      sw.appendChild(a);
    });
    var lbl = C.el("<span>Niveau: </span>");
    sw.insertBefore(lbl, sw.firstChild);
    root.appendChild(sw);
  }

  function bar(pct) {
    var b = C.el('<div class="bar"><span style="width:' + pct + '%"></span></div>');
    return b;
  }

  function renderSegment() {
    var seg = S.plan.segments[S.seg];
    root.innerHTML = "";
    root.appendChild(header(seg.title, seg.note));

    if (seg.type === "info") {
      var card = C.el('<div class="card"></div>');
      card.appendChild(C.el('<div class="rule">' + seg.html + "</div>"));
      if (seg.progressModuleId) {
        var pct = grammarPct(seg.progressModuleId);
        var gp = C.el('<div class="gram-prog"></div>');
        gp.appendChild(C.el('<div class="gp-row"><span>' + C.esc(seg.progressLabel) +
          '</span><span class="gp-pct">' + pct + '% geschafft</span></div>'));
        gp.appendChild(bar(pct));
        card.appendChild(gp);
      }
      var btn = C.el('<button class="btn primary">Weiter →</button>');
      btn.onclick = nextSegment;
      card.appendChild(btn);
      root.appendChild(card);
      return;
    }

    if (seg.type === "vocabIntro") {
      var c2 = C.el('<div class="card"></div>');
      c2.appendChild(C.el('<p class="hint" style="margin-top:0">Kennst du eins schon sicher? Tippe „kenne ich" – dann kommt ein neues Wort nach.</p>'));
      seg.vocab.forEach(function (v) {
        var row = C.el('<div class="vintro-row"></div>');
        var txt = C.el('<div class="vintro-txt"></div>');
        var itLine = C.el('<span class="vocab-it">' + C.esc(v.it) + "</span>");
        var sbv = C.speakButton(v.it); if (sbv) itLine.appendChild(sbv);
        txt.appendChild(itLine);
        txt.appendChild(C.el('<span class="vocab-de">' + C.esc(C.known(v)) + "</span>"));
        row.appendChild(txt);
        var known = C.el('<button class="vintro-known">' + C.esc(C.tt('kenne ich ✓')) + '</button>');
        known.onclick = function () { markVocabKnownInIntro(seg, v.id); };
        row.appendChild(known);
        c2.appendChild(row);
      });
      var b2 = C.el('<button class="btn primary">' + C.esc(C.tt('Verstanden, abfragen →')) + '</button>');
      b2.onclick = nextSegment;
      c2.appendChild(b2);
      root.appendChild(c2);
      return;
    }

    if (seg.type === "quiz") {
      if (!seg.questions || seg.questions.length === 0) { nextSegment(); return; }
      runQuiz(seg);
      return;
    }
    // Fallback
    nextSegment();
  }

  function nextSegment() {
    S.seg += 1;
    S.segSolved = {}; // neues Segment startet mit leerem Lösungsstand
    if (S.seg >= S.plan.segments.length) {
      finishLesson();
    } else {
      save();
      render(root);
    }
  }

  // Gezieltes Grammatik-Üben: nur ein Thema (Regel + Übungen), zählt NICHT als
  // Tageslektion, aktualisiert aber den Fortschritt/die Fälligkeit des Themas.
  function startGrammarPractice(id) {
    var m = moduleById(id);
    if (!m) return;
    S.gramLessonStats = {};
    S.plan = {
      practice: true,
      segments: [
        { type: "info", title: "🧩 " + m.title, html: C.mdInline(m.rule), note: "Gezieltes Üben", progressModuleId: m.id, progressLabel: m.title },
        { type: "quiz", title: "🧩 " + m.title + " – üben", questions: pickGrammarQuestions(m, 8), grammarModuleId: m.id }
      ]
    };
    S.seg = 0;
    S.segSolved = {};
    save();
    render(root);
  }

  function finishLesson() {
    var wasPractice = S.plan && S.plan.practice;
    // Grammatik-Themen neu einplanen (Box/Fälligkeit nach richtig/falsch)
    Object.keys(S.gramLessonStats || {}).forEach(function (mid) {
      var st = S.gramLessonStats[mid];
      scheduleGram(mid, st.c || 0, st.w || 0);
    });
    S.gramLessonStats = {};
    if (!wasPractice) S.completedDate = todayKey();
    S.plan = null;
    S.seg = 0;
    save();
    root.innerHTML = "";
    var card = C.el('<div class="card" style="text-align:center"></div>');
    card.appendChild(C.el('<div style="font-size:44px">🎉</div>'));
    if (wasPractice) {
      card.appendChild(C.el('<h2 style="margin:4px 0">Grammatik geübt!</h2>'));
      card.appendChild(C.el('<p class="hint">Gut gemacht – das Thema ist aufgefrischt.</p>'));
    } else {
      card.appendChild(C.el('<h2 style="margin:4px 0">Lektion ' + S.lessonNo + ' geschafft!</h2>'));
      card.appendChild(C.el('<p class="hint">Stark! Deine Fehler hast du bis zur richtigen Lösung wiederholt. Morgen geht es weiter.</p>'));
    }
    var b = C.el('<button class="btn primary">Zum Fortschritt</button>');
    b.onclick = function () { render(root); };
    card.appendChild(b);
    root.appendChild(card);
    renderProgressCard();
    C.showReset();
  }

  /* ============ QUIZ-RUNNER mit Fehler-Nachdrill ============ */
  function runQuiz(seg) {
    // Bereits richtig gelöste Fragen (persistiert) überspringen → Resume nach Reload
    if (!S.segSolved) S.segSolved = {};
    var solvedIds = S.segSolved;
    // Warteschlange: nur noch offene Fragen; falsche kommen ans Ende, bis richtig
    var queue = seg.questions.filter(function (q) { return !solvedIds[q.id]; });
    var total = seg.questions.length;
    var redrillActive = false;

    function step() {
      root.innerHTML = "";
      root.appendChild(header(seg.title, redrillActive ? "🔁 Wiederhole deine Fehler, bis sie sitzen" : null));

      var solved = Object.keys(solvedIds).length;
      root.appendChild(C.el('<p class="progress-line">' + solved + ' / ' + total + ' richtig · noch ' + queue.length + ' offen</p>'));

      if (queue.length === 0) {
        var done = C.el('<div class="card" style="text-align:center"><div style="font-size:36px">✅</div><p class="lead ok">Aufgabe geschafft!</p></div>');
        root.appendChild(done);
        var btn = C.el('<button class="btn primary">Weiter →</button>');
        btn.onclick = nextSegment;
        root.appendChild(btn);
        return;
      }
      var q = queue[0];
      if (q.kind === "choice") renderChoice(q);
      else renderType(q);
    }

    function onResult(q, ok) {
      // Statistik + SRS/Grammatik-Protokoll
      C.record(q.id, ok);
      if (seg.srs) srsUpdate(q.id, ok);
      // Grammatik-Protokoll: richtig/falsch pro Thema für die Neuplanung (SRS)
      var mid = q.moduleId || seg.grammarModuleId;
      if (mid) {
        if (!S.gramLessonStats[mid]) S.gramLessonStats[mid] = { c: 0, w: 0 };
        if (ok) { S.gramLessonStats[mid].c++; registerGrammarHit(mid); }
        else { S.gramLessonStats[mid].w++; }
      }

      queue.shift();
      if (ok) {
        solvedIds[q.id] = true;
        save(); // Fortschritt sofort sichern → Reload macht hier weiter
      } else {
        // ans Ende, erneut abfragen
        queue.push(q);
        redrillActive = true;
      }
      // neue Vokabeln erst nach erstem Durchlauf als "eingeführt" markieren
      if (seg.introduce && ok && seg.introduce.indexOf(q.id) !== -1) {
        if (S.introduced.indexOf(q.id) === -1) S.introduced.push(q.id);
        srsFor(q.id); save();
      }
    }

    // "War doch richtig": eine als falsch gewertete Antwort selbst freigeben
    function acceptAsCorrect(q) {
      for (var i = queue.length - 1; i >= 0; i--) { if (queue[i].id === q.id) { queue.splice(i, 1); break; } }
      solvedIds[q.id] = true;
      if (seg.srs) srsUpdate(q.id, true);
      if (seg.introduce && seg.introduce.indexOf(q.id) !== -1 && S.introduced.indexOf(q.id) === -1) S.introduced.push(q.id);
      save();
    }

    function renderType(q) {
      var card = C.el('<div class="card"></div>');
      card.appendChild(C.tappablePrompt(q.prompt));
      card.appendChild(C.el('<p class="hint">' + C.esc(C.tt('Tippe auf Italienisch:')) + '</p>'));
      var ta = C.el('<textarea rows="2" autocapitalize="off" autocorrect="off" spellcheck="false"></textarea>');
      card.appendChild(ta);
      card.appendChild(C.accentBar(ta));
      var fbSlot = C.el("<div></div>");
      card.appendChild(fbSlot);
      var btn = C.el('<button class="btn primary">' + C.esc(C.tt('Prüfen')) + '</button>');
      card.appendChild(btn);
      // „Sitzt schon – erstmal pausieren"
      var gmid = q.moduleId || seg.grammarModuleId;
      if (q.vocabId) {
        var sitzt = C.el('<button type="button" class="sitzt-btn">' + C.esc(C.tt('😌 Sitzt schon – erstmal pausieren')) + '</button>');
        sitzt.onclick = function () {
          snoozeVocab(q.vocabId);
          for (var i = queue.length - 1; i >= 0; i--) { if (queue[i].id === q.id) { queue.splice(i, 1); break; } }
          solvedIds[q.id] = true;
          if (seg.introduce && seg.introduce.indexOf(q.id) !== -1 && S.introduced.indexOf(q.id) === -1) S.introduced.push(q.id);
          save();
          step();
        };
        card.appendChild(sitzt);
      } else if (gmid) {
        // Grammatik-Übung: das ganze Thema pausieren (alle Fragen dazu überspringen)
        var sitztG = C.el('<button type="button" class="sitzt-btn">😌 Thema sitzt – erstmal pausieren</button>');
        sitztG.onclick = function () {
          snoozeGrammar(gmid);
          for (var j = queue.length - 1; j >= 0; j--) {
            var m = queue[j].moduleId || seg.grammarModuleId;
            if (m === gmid) { solvedIds[queue[j].id] = true; queue.splice(j, 1); }
          }
          save();
          step();
        };
        card.appendChild(sitztG);
      } else if (seg.srs) {
        // Satz-Frage (Alltagssätze / Übersetzungen) – diesen Satz pausieren
        var sitztS = C.el('<button type="button" class="sitzt-btn">' + C.esc(C.tt('😌 Sitzt schon – erstmal pausieren')) + '</button>');
        sitztS.onclick = function () {
          snoozeVocab(q.id);
          for (var k = queue.length - 1; k >= 0; k--) { if (queue[k].id === q.id) { queue.splice(k, 1); break; } }
          solvedIds[q.id] = true;
          save();
          step();
        };
        card.appendChild(sitztS);
      }
      card.appendChild(C.noteField(q.prompt));
      root.appendChild(card);

      var answered = false;
      btn.onclick = function () {
        if (!answered) {
          answered = true;
          var res = C.checkAnswer(ta.value, q.accept);
          ta.setAttribute("readonly", "");
          var cls = res === "ok" ? "ok" : res === "near" ? "near" : "no";
          var target = C.pickClosest(ta.value, q.accept);
          var fb = C.el('<div class="feedback ' + cls + '"></div>');
          var lead = C.el('<p class="lead ' + cls + '">' +
            (res === "ok" ? C.tt("✓ Richtig!") : res === "near" ? C.tt("≈ Fast! Nur die Akzente") : C.tt("✗ Nicht ganz")) + "</p>");
          fb.appendChild(lead);
          if (res === "ok") {
            var sol = C.el('<p class="solution">' + C.esc(q.accept[0]) + "</p>");
            var sb0 = C.speakButton(q.accept[0]); if (sb0) sol.appendChild(sb0);
            fb.appendChild(sol);
          } else {
            var d = C.wordDiff(ta.value, target);
            if (ta.value.trim()) {
              fb.appendChild(C.el('<p class="diff-line"><span class="diff-lbl">deine Eingabe</span>' + d.userHtml + "</p>"));
            }
            var rl = C.el('<p class="diff-line"><span class="diff-lbl">richtig</span>' + d.correctHtml + "</p>");
            var sb1 = C.speakButton(target); if (sb1) rl.appendChild(sb1);
            fb.appendChild(rl);
          }
          if (q.explain) fb.appendChild(C.el('<p class="explanation" style="margin-top:8px">' + C.mdInline(q.explain) + "</p>"));
          fbSlot.appendChild(fb);
          onResult(q, res === "ok"); // "near" (nur Akzente) zählt als Fehler → Nachdrill
          C.speak(target); // richtige Lösung vorlesen (im Klick = erlaubt auf iOS)
          if (res !== "ok") {
            var ov = C.el('<button type="button" class="override">war doch richtig ✓</button>');
            ov.onclick = function () {
              acceptAsCorrect(q);
              ov.remove();
              lead.className = "lead ok"; lead.textContent = "✓ Als richtig gewertet";
              fb.className = "feedback ok";
            };
            fb.appendChild(ov);
          }
          btn.textContent = "Weiter →";
        } else {
          step();
        }
      };
      // Enter wird zentral in app.js behandelt (Haupt-Button auslösen).
      setTimeout(function () { ta.focus(); }, 40);
    }

    function renderChoice(q) {
      var card = C.el('<div class="card"></div>');
      card.appendChild(C.el('<p class="prompt-de">' + C.esc(q.prompt) + "</p>"));
      var fbSlot = C.el("<div></div>");
      var answered = false;
      var btns = [];
      C.shuffle(q.options).forEach(function (opt) {
        var b = C.el('<button class="choice">' + C.esc(opt) + "</button>");
        b._ok = (opt === q.answer);
        b.onclick = function () {
          if (answered) return;
          answered = true;
          btns.forEach(function (x) { x.disabled = true; if (x._ok) x.classList.add("correct"); });
          if (!b._ok) b.classList.add("wrong");
          var fb = C.el('<div class="feedback ' + (b._ok ? "ok" : "no") + '"></div>');
          fb.appendChild(C.el('<p class="lead ' + (b._ok ? "ok" : "no") + '">' + (b._ok ? "✓ Genau!" : "✗ Leider falsch — richtig: " + C.esc(q.answer)) + "</p>"));
          if (q.explain) fb.appendChild(C.el('<p class="explanation">' + C.mdInline(q.explain) + "</p>"));
          card.appendChild(fb);
          onResult(q, b._ok);
          var nb = C.el('<button class="btn primary">Weiter →</button>');
          nb.onclick = step;
          card.appendChild(nb);
        };
        btns.push(b);
        card.appendChild(b);
      });
      card.appendChild(fbSlot);
      // „Thema sitzt – erstmal pausieren" (Grammatik-Übung)
      var gmidC = q.moduleId || seg.grammarModuleId;
      if (gmidC) {
        var sitztC = C.el('<button type="button" class="sitzt-btn">😌 Thema sitzt – erstmal pausieren</button>');
        sitztC.onclick = function () {
          snoozeGrammar(gmidC);
          for (var j = queue.length - 1; j >= 0; j--) {
            var m = queue[j].moduleId || seg.grammarModuleId;
            if (m === gmidC) { solvedIds[queue[j].id] = true; queue.splice(j, 1); }
          }
          save();
          step();
        };
        card.appendChild(sitztC);
      }
      card.appendChild(C.noteField(q.prompt));
      root.appendChild(card);
    }

    step();
  }

  /* ============ VOKABEL-TRAINER (Karteikasten, Einheiten à 15) ============ */
  var UNIT_SIZE = 15;
  var vocabUnit = null;    // die 15 Vokabeln der aktuellen Einheit
  var vocabQueue = null;   // noch nicht richtig beantwortete (Warteschlange)
  var vocabSolved = null;  // {id: true} – in dieser Einheit schon richtig
  var showAddVocab = false;
  var vocabMode = "quiz";  // "quiz" = Abfrage · "speak" = Aussprache üben

  function buildVocabUnit() {
    var pool = vocabForLevel();
    if (!pool.length) { vocabUnit = []; vocabQueue = []; vocabSolved = {}; return; }
    var scored = pool.map(function (v) {
      var e = S.srs[v.id];
      var w = e ? (e.wrong || 0) * 2 : 1;   // schwierige öfter, neue einstreuen
      if (e && e.last === "no") w += 2;
      if (e && e.due <= S.lessonNo) w += 2; // fällige bevorzugen
      return { v: v, w: w + Math.random() };
    });
    scored.sort(function (a, b) { return b.w - a.w; });
    vocabUnit = scored.slice(0, Math.min(UNIT_SIZE, pool.length)).map(function (x) { return x.v; });
    vocabQueue = vocabUnit.slice();
    vocabSolved = {};
  }

  function renderVocab(container) {
    root = container;
    root.innerHTML = "";
    var head = C.el('<div class="lesson-head"></div>');
    head.appendChild(C.el('<h2 class="lesson-title">📇 Vokabeln – Karteikasten</h2>'));
    root.appendChild(head);

    // Modus-Umschalter (nur wenn Vorlesen verfügbar)
    if (C.canSpeak) {
      var modeRow = C.el('<div class="len-row" style="margin-bottom:10px"></div>');
      var mq = C.el('<button class="chip" aria-pressed="' + (vocabMode === "quiz") + '">📝 Abfrage</button>');
      var ms = C.el('<button class="chip" aria-pressed="' + (vocabMode === "speak") + '">🎤 Aussprache</button>');
      mq.onclick = function () { vocabMode = "quiz"; renderVocab(root); };
      ms.onclick = function () { vocabMode = "speak"; renderVocab(root); };
      modeRow.appendChild(mq); modeRow.appendChild(ms);
      root.appendChild(modeRow);
    }

    var addBtn = C.el('<button class="btn ghost" style="margin:0 0 10px">➕ Eigene Vokabel hinzufügen</button>');
    addBtn.onclick = function () { showAddVocab = !showAddVocab; renderVocab(root); };
    root.appendChild(addBtn);
    if (showAddVocab) root.appendChild(vocabAddForm());

    if (!vocabUnit) buildVocabUnit();
    if (!vocabUnit.length) {
      root.appendChild(C.el('<p class="empty">Noch keine Vokabeln auf deinem Niveau.<br>Füge oben eigene hinzu! 🇮🇹</p>'));
      return;
    }
    if (vocabMode === "speak") { pronunciationCard(vocabQueue[0] || vocabUnit[0]); return; }
    if (vocabQueue.length === 0) { renderVocabDone(); return; }
    vocabCard(vocabQueue[0]);
  }

  // Aussprache üben: vorlesen → laut nachsprechen → nochmal / weiter
  function pronunciationCard(v) {
    root.appendChild(C.el('<p class="progress-line">🎤 Hör zu und sprich laut nach</p>'));
    var card = C.el('<div class="card" style="text-align:center"></div>');
    var big = C.el('<p class="prompt-de" style="font-size:26px;color:var(--brand);margin:6px 0">' + C.esc(v.it) + "</p>");
    card.appendChild(big);
    card.appendChild(C.el('<p class="vocab-de" style="text-align:center;margin:0 0 10px">' + C.esc(C.known(v)) + "</p>"));
    var hear = C.el('<button class="btn primary">🔊 Anhören</button>');
    hear.onclick = function () { C.speak(v.it); };
    card.appendChild(hear);
    card.appendChild(C.el('<p class="hint" style="margin:10px 0 0">Sprich es jetzt laut nach.</p>'));
    var next = C.el('<button class="btn ghost" style="margin-top:10px">Weiter →</button>');
    next.onclick = function () {
      vocabQueue.push(vocabQueue.shift()); // im Kreis weiter
      renderVocab(root);
    };
    card.appendChild(next);
    root.appendChild(card);
    C.speak(v.it); // beim Öffnen direkt vorlesen (im Klick-Flow → iOS ok)
  }

  function renderVocabDone() {
    var n = Object.keys(vocabSolved).length;
    var card = C.el('<div class="card" style="text-align:center"></div>');
    card.appendChild(C.el('<div style="font-size:44px">🎉</div>'));
    card.appendChild(C.el('<h2 style="margin:4px 0">Einheit geschafft!</h2>'));
    card.appendChild(C.el('<p class="hint">' + n + ' Vokabeln durch – Falsche hast du bis zur richtigen Lösung wiederholt.</p>'));
    var btn = C.el('<button class="btn primary">Neue Einheit (15) →</button>');
    btn.onclick = function () { buildVocabUnit(); renderVocab(root); };
    card.appendChild(btn);
    root.appendChild(card);
  }

  function vocabAddForm() {
    var card = C.el('<div class="card"></div>');
    card.appendChild(C.el('<p class="hint" style="margin-top:0">Neue Vokabel – nur Deutsch und Italienisch, keine Erklärung nötig.</p>'));
    var de = C.el('<input type="text" class="note-input" autocapitalize="off" placeholder="Deutsch (z. B. der Schlüssel)" style="margin-bottom:8px">');
    var it = C.el('<input type="text" class="note-input" autocapitalize="off" placeholder="Italienisch (z. B. la chiave)">');
    var msg = C.el('<p class="note-msg"></p>');
    var save2 = C.el('<button class="btn primary" style="margin-top:10px">Speichern</button>');
    function doSave() {
      var d = de.value.trim(), i = it.value.trim();
      if (!d || !i) { msg.style.color = "var(--red)"; msg.textContent = "Bitte Deutsch UND Italienisch ausfüllen."; return; }
      var arr = loadUserVocab();
      var base = "uv_" + d.toLowerCase().replace(/[^a-zäöü]/g, "").slice(0, 8), id = base, n = 1;
      while (arr.some(function (x) { return x.id === id; })) { id = base + (++n); }
      arr.push({ id: id, it: i, de: d, cefr: S.level, theme: "custom" });
      saveUserVocab(arr);
      msg.style.color = "var(--green)"; msg.textContent = "✓ „" + d + "“ hinzugefügt – kommt in einer nächsten Einheit dran.";
      de.value = ""; it.value = "";
      setTimeout(function () { de.focus(); }, 20);
    }
    save2.onclick = doSave;
    it.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); doSave(); } });
    card.appendChild(de); card.appendChild(it); card.appendChild(save2); card.appendChild(msg);
    return card;
  }

  function vocabCard(v) {
    var solved = Object.keys(vocabSolved).length;
    root.appendChild(C.el('<p class="progress-line">' + solved + ' / ' + vocabUnit.length +
      ' richtig · noch ' + vocabQueue.length + ' offen</p>'));
    var card = C.el('<div class="card"></div>');
    card.appendChild(C.el('<p class="prompt-de">' + C.esc(C.known(v)) + '</p>'));
    card.appendChild(C.el('<p class="hint">' + C.esc(C.tt('Tippe auf Italienisch:')) + '</p>'));
    var ta = C.el('<textarea rows="2" autocapitalize="off" autocorrect="off" spellcheck="false"></textarea>');
    card.appendChild(ta);
    card.appendChild(C.accentBar(ta));
    var fb = C.el("<div></div>");
    card.appendChild(fb);
    var btn = C.el('<button class="btn primary">' + C.esc(C.tt('Prüfen')) + '</button>');
    card.appendChild(btn);
    var sitzt = C.el('<button type="button" class="sitzt-btn">' + C.esc(C.tt('😌 Sitzt schon – erstmal pausieren')) + '</button>');
    sitzt.onclick = function () {
      snoozeVocab(v.id);
      for (var i = vocabQueue.length - 1; i >= 0; i--) { if (vocabQueue[i].id === v.id) { vocabQueue.splice(i, 1); break; } }
      vocabSolved[v.id] = true;
      renderVocab(root);
    };
    card.appendChild(sitzt);
    root.appendChild(card);

    var answered = false;
    btn.onclick = function () {
      if (!answered) {
        answered = true;
        var res = C.checkAnswer(ta.value, [v.it]);
        ta.setAttribute("readonly", "");
        var ok = res === "ok";
        var cls = ok ? "ok" : (res === "near" ? "near" : "no");
        var box = C.el('<div class="feedback ' + cls + '"></div>');
        var lead = C.el('<p class="lead ' + cls + '">' +
          (ok ? C.tt("✓ Richtig!") : res === "near" ? C.tt("≈ Fast! Nur die Akzente") : C.tt("✗ Nicht ganz")) + "</p>");
        box.appendChild(lead);
        if (ok) {
          var sol = C.el('<p class="solution">' + C.esc(v.it) + "</p>");
          var sb0 = C.speakButton(v.it); if (sb0) sol.appendChild(sb0);
          box.appendChild(sol);
        } else {
          var d = C.wordDiff(ta.value, v.it);
          if (ta.value.trim()) box.appendChild(C.el('<p class="diff-line"><span class="diff-lbl">deine Eingabe</span>' + d.userHtml + "</p>"));
          var rl = C.el('<p class="diff-line"><span class="diff-lbl">richtig</span>' + d.correctHtml + "</p>");
          var sb1 = C.speakButton(v.it); if (sb1) rl.appendChild(sb1);
          box.appendChild(rl);
        }
        fb.appendChild(box);
        C.record(v.id, ok);
        srsUpdate(v.id, ok);
        if (S.introduced.indexOf(v.id) === -1) S.introduced.push(v.id);
        save();
        vocabQueue.shift();
        if (ok) vocabSolved[v.id] = true;
        else vocabQueue.push(v); // falsch → hinten dran (Karteikasten)
        C.speak(v.it); // Wort vorlesen
        if (!ok) {
          var ov = C.el('<button type="button" class="override">war doch richtig ✓</button>');
          ov.onclick = function () {
            // aus der Warteschlange nehmen und als richtig zählen
            for (var i = vocabQueue.length - 1; i >= 0; i--) { if (vocabQueue[i].id === v.id) { vocabQueue.splice(i, 1); break; } }
            vocabSolved[v.id] = true; srsUpdate(v.id, true); save();
            ov.remove(); lead.className = "lead ok"; lead.textContent = "✓ Als richtig gewertet"; box.className = "feedback ok";
          };
          box.appendChild(ov);
        }
        btn.textContent = "Weiter →";
      } else {
        renderVocab(root);
      }
    };
    setTimeout(function () { ta.focus(); }, 40);
  }

  /* ============ KONJUGATIONS-TRAINER (Präsens, Karteikasten) ============ */
  var VD = window.VERB_DATA || { pronouns: [], typeLabel: {}, verbs: [] };
  var VERB_UNIT = 6;          // kleine Lektion: 6 Verben pro Einheit
  var PERS_PER_VERB = 3;      // so viele Personen je Verb werden abgefragt
  var verbFilter = "all";     // "all" | "are" | "ere" | "ire" | "isc" | "irr"
  var verbUnit = null;        // Verben der aktuellen Einheit
  var verbPhase = "learn";    // "learn" = Tabellen ansehen · "quiz" = abfragen
  var verbQueue = null;       // offene Frage-Warteschlange (Person-Ebene)
  var verbSolved = null;      // {questionId: true}
  var verbTotalQ = 0;         // Anzahl Fragen der Einheit
  var verbWrong = null;       // {verbId: true} – in dieser Einheit falsch gehabt

  // eigene, von der Vokabel-SRS getrennte Leitner-Logik für Verben
  function conjFor(id) {
    if (!S.conj) S.conj = {};
    if (!S.conj[id]) S.conj[id] = { level: 0, streak: 0, wrong: 0, due: S.lessonNo, last: null };
    return S.conj[id];
  }
  function conjUpdate(id, ok) {
    var e = conjFor(id);
    if (ok) { e.streak++; e.level = Math.min(SRS_INTERVAL.length - 1, e.level + 1); e.last = "ok"; }
    else { e.streak = 0; e.level = Math.max(0, e.level - 1); e.wrong++; e.last = "no"; }
    e.due = S.lessonNo + SRS_INTERVAL[e.level];
    save();
  }
  function verbPool() {
    return VD.verbs.filter(function (v) {
      if (verbFilter === "all") return true;
      return v.type === verbFilter; // are | ere | ire | isc | irr
    });
  }
  function buildVerbUnit() {
    var pool = verbPool();
    if (!pool.length) { verbUnit = []; verbQueue = []; verbSolved = {}; verbTotalQ = 0; verbWrong = {}; return; }
    var scored = pool.map(function (v) {
      var e = S.conj && S.conj[v.id];
      var w = e ? (e.wrong || 0) * 2 : 3;    // Neue bevorzugt einstreuen, Schwere öfter
      if (e && e.last === "no") w += 2;
      if (e && e.due <= S.lessonNo) w += 2;  // fällige nach vorne
      return { v: v, w: w + Math.random() };
    });
    scored.sort(function (a, b) { return b.w - a.w; });
    verbUnit = scored.slice(0, Math.min(VERB_UNIT, pool.length)).map(function (x) { return x.v; });
    verbPhase = "learn";
    verbWrong = {};
    buildVerbQueue();
  }
  function buildVerbQueue() {
    var qs = [];
    verbUnit.forEach(function (v) {
      // PERS_PER_VERB verschiedene Personen je Verb (immer variiert)
      var idx = C.shuffle([0, 1, 2, 3, 4, 5]).slice(0, Math.min(PERS_PER_VERB, 6));
      idx.forEach(function (p) {
        qs.push({
          id: v.id + "_" + p,
          verbId: v.id,
          person: VD.pronouns[p],
          inf: v.inf, de: v.de,
          accept: [v.forms[p]]
        });
      });
    });
    verbQueue = C.shuffle(qs);
    verbSolved = {};
    verbTotalQ = qs.length;
  }

  function renderVerbs(container) {
    root = container;
    root.innerHTML = "";
    var head = C.el('<div class="lesson-head"></div>');
    head.appendChild(C.el('<h2 class="lesson-title">🔤 Verben – Präsens üben</h2>'));
    root.appendChild(head);

    // Filter granular: Alle · -are · -ere · -ire · -ire (-isc-) · unregelmäßig
    var fRow = C.el('<div class="filters" style="flex-wrap:wrap;margin-bottom:8px"></div>');
    [["all", "Alle"], ["are", "-are"], ["ere", "-ere"], ["ire", "-ire"],
     ["isc", "-ire (-isc-)"], ["irr", "unregelmäßig"], ["rifl", "reflexiv"]].forEach(function (f) {
      var c = C.el('<button class="chip" aria-pressed="' + (verbFilter === f[0]) + '">' + f[1] + "</button>");
      c.onclick = function () {
        if (verbFilter === f[0]) return;
        verbFilter = f[0]; verbUnit = null; renderVerbs(root);
      };
      fRow.appendChild(c);
    });
    root.appendChild(fRow);
    // kurze Erklärung des aktiven Typs
    var typeHint = { are: "Verben auf -are (io -o, tu -i, lui -a, noi -iamo, voi -ate, loro -ano)",
      ere: "Verben auf -ere (… -o, -i, -e, -iamo, -ete, -ono)",
      ire: "Verben auf -ire (… -o, -i, -e, -iamo, -ite, -ono)",
      isc: "Sonderform: -isc- wird eingeschoben (io capisco, tu capisci, … noi capiamo, loro capiscono)",
      irr: "Unregelmäßige Verben – eigene Formen, am besten einzeln lernen.",
      rifl: "Reflexive Verben: Reflexivpronomen davor – io mi, tu ti, lui/lei si, noi ci, voi vi, loro si (z. B. mi chiamo, ti alzi, si sveglia)." };
    if (typeHint[verbFilter]) {
      root.appendChild(C.el('<p class="hint" style="margin:0 0 8px">' + typeHint[verbFilter] + "</p>"));
    }

    // Fortschritt: wie viele Verben schon sicher
    var seen = 0, mastered = 0;
    verbPool().forEach(function (v) {
      var e = S.conj && S.conj[v.id];
      if (e) { seen++; if (e.level >= MASTER_VOCAB_LEVEL) mastered++; }
    });
    root.appendChild(C.el('<p class="progress-line">' + verbPool().length + ' Verben · ' +
      seen + ' geübt · ' + mastered + ' sicher</p>'));

    if (!verbUnit) buildVerbUnit();
    if (!verbUnit.length) {
      root.appendChild(C.el('<p class="empty">Keine Verben in dieser Auswahl.</p>'));
      return;
    }
    if (verbPhase === "learn") { verbLearnCard(); return; }
    if (verbQueue.length === 0) { renderVerbsDone(); return; }
    verbQuizCard(verbQueue[0]);
  }

  // Lernphase: Konjugationstabellen der Einheit ansehen (mit Vorlesen)
  function verbLearnCard() {
    root.appendChild(C.el('<p class="hint" style="margin-top:0">Schau dir die ' + verbUnit.length +
      ' Verben an – dann fragen wir einzelne Formen ab.</p>'));
    verbUnit.forEach(function (v) {
      var card = C.el('<div class="card verb-card"></div>');
      var top = C.el('<div class="verb-top"></div>');
      var t = C.el('<span class="verb-inf">' + C.esc(v.inf) + "</span>");
      var sb = C.speakButton(v.inf); if (sb) t.appendChild(sb);
      top.appendChild(t);
      top.appendChild(C.el('<span class="verb-de">' + C.esc(v.de) + "</span>"));
      card.appendChild(top);
      card.appendChild(C.el('<span class="verb-type verb-type-' + v.type + '">' +
        C.esc(VD.typeLabel[v.type] || "") + "</span>"));
      var tbl = C.el('<div class="conj-table"></div>');
      v.forms.forEach(function (form, i) {
        var row = C.el('<div class="conj-row"></div>');
        row.appendChild(C.el('<span class="conj-pron">' + C.esc(VD.pronouns[i]) + "</span>"));
        var f = C.el('<span class="conj-form">' + C.esc(form) + "</span>");
        row.appendChild(f);
        var sbf = C.speakButton(form); if (sbf) row.appendChild(sbf);
        tbl.appendChild(row);
      });
      card.appendChild(tbl);
      root.appendChild(card);
    });
    var go = C.el('<button class="btn primary">' + C.esc(C.tt('Verstanden, abfragen →')) + '</button>');
    go.onclick = function () { verbPhase = "quiz"; buildVerbQueue(); renderVerbs(root); };
    root.appendChild(go);
  }

  function verbQuizCard(q) {
    var solved = Object.keys(verbSolved).length;
    root.appendChild(C.el('<p class="progress-line">' + solved + ' / ' + verbTotalQ +
      ' richtig · noch ' + verbQueue.length + ' offen</p>'));
    var card = C.el('<div class="card"></div>');
    card.appendChild(C.el('<p class="prompt-de"><b>' + C.esc(q.inf) + '</b> <span class="verb-de">(' +
      C.esc(q.de) + ')</span></p>'));
    card.appendChild(C.el('<p class="hint">Konjugiere für <b class="conj-ask">' + C.esc(q.person) + "</b> (Präsens):</p>"));
    var ta = C.el('<textarea rows="1" autocapitalize="off" autocorrect="off" spellcheck="false"></textarea>');
    card.appendChild(ta);
    card.appendChild(C.accentBar(ta));
    var fb = C.el("<div></div>");
    card.appendChild(fb);
    var btn = C.el('<button class="btn primary">' + C.esc(C.tt('Prüfen')) + '</button>');
    card.appendChild(btn);
    var sitztV = C.el('<button type="button" class="sitzt-btn">😌 Verb sitzt – erstmal pausieren</button>');
    sitztV.onclick = function () {
      snoozeVerb(q.verbId);
      for (var i = verbQueue.length - 1; i >= 0; i--) { if (verbQueue[i].verbId === q.verbId) { verbSolved[verbQueue[i].id] = true; verbQueue.splice(i, 1); } }
      renderVerbs(root);
    };
    card.appendChild(sitztV);
    root.appendChild(card);

    var answered = false;
    btn.onclick = function () {
      if (!answered) {
        answered = true;
        var res = C.checkAnswer(ta.value, q.accept);
        ta.setAttribute("readonly", "");
        var ok = res === "ok";
        var cls = ok ? "ok" : (res === "near" ? "near" : "no");
        var box = C.el('<div class="feedback ' + cls + '"></div>');
        var lead = C.el('<p class="lead ' + cls + '">' +
          (ok ? C.tt("✓ Richtig!") : res === "near" ? C.tt("≈ Fast! Nur die Akzente") : C.tt("✗ Nicht ganz")) + "</p>");
        box.appendChild(lead);
        if (ok) {
          var sol = C.el('<p class="solution">' + C.esc(q.person) + " " + C.esc(q.accept[0]) + "</p>");
          var sb0 = C.speakButton(q.accept[0]); if (sb0) sol.appendChild(sb0);
          box.appendChild(sol);
        } else {
          var d = C.wordDiff(ta.value, q.accept[0]);
          if (ta.value.trim()) box.appendChild(C.el('<p class="diff-line"><span class="diff-lbl">deine Eingabe</span>' + d.userHtml + "</p>"));
          var rl = C.el('<p class="diff-line"><span class="diff-lbl">richtig</span>' +
            '<span class="conj-pron-inline">' + C.esc(q.person) + " </span>" + d.correctHtml + "</p>");
          var sb1 = C.speakButton(q.accept[0]); if (sb1) rl.appendChild(sb1);
          box.appendChild(rl);
        }
        fb.appendChild(box);
        C.record("conj_" + q.verbId, ok);
        verbQueue.shift();
        if (ok) { verbSolved[q.id] = true; }
        else { verbWrong[q.verbId] = true; verbQueue.push(q); }
        save();
        C.speak(q.accept[0]);
        if (!ok) {
          var ov = C.el('<button type="button" class="override">war doch richtig ✓</button>');
          ov.onclick = function () {
            for (var i = verbQueue.length - 1; i >= 0; i--) { if (verbQueue[i].id === q.id) { verbQueue.splice(i, 1); break; } }
            verbSolved[q.id] = true;
            ov.remove(); lead.className = "lead ok"; lead.textContent = "✓ Als richtig gewertet"; box.className = "feedback ok";
          };
          box.appendChild(ov);
        }
        btn.textContent = "Weiter →";
      } else {
        renderVerbs(root);
      }
    };
    setTimeout(function () { ta.focus(); }, 40);
  }

  function renderVerbsDone() {
    // Leitner-Wertung je Verb: ohne Fehler in dieser Einheit → hoch, sonst runter
    verbUnit.forEach(function (v) { conjUpdate(v.id, !verbWrong[v.id]); });
    var card = C.el('<div class="card" style="text-align:center"></div>');
    card.appendChild(C.el('<div style="font-size:44px">🎉</div>'));
    card.appendChild(C.el('<h2 style="margin:4px 0">Einheit geschafft!</h2>'));
    card.appendChild(C.el('<p class="hint">' + verbUnit.length +
      ' Verben durch – falsche Formen hast du bis zur richtigen Lösung wiederholt.</p>'));
    var btn = C.el('<button class="btn primary">Neue Einheit (' + VERB_UNIT + ') →</button>');
    btn.onclick = function () { buildVerbUnit(); renderVerbs(root); };
    card.appendChild(btn);
    root.appendChild(card);
    C.showReset();
  }

  /* ------------- Fortschritt pro Niveau (für die Motivations-Balken) ------------- */
  // Vokabeln GENAU dieses Niveaus (nicht kumulativ): begonnen, sicher UND
  // ein anteiliger Lernstand (Teilpunkte je nach SRS-Level), damit sich der
  // Prozentwert mit jeder richtigen Antwort bewegt – nicht erst bei "sicher".
  function levelVocabStats(level) {
    var pool = allVocab().filter(function (v) { return v.cefr === level; });
    var started = 0, mastered = 0, progress = 0;
    pool.forEach(function (v) {
      var e = S.srs[v.id];
      if (!e) return;
      if (e.level > 0 || e.last) started++;
      if (e.level >= MASTER_VOCAB_LEVEL) mastered++;
      progress += Math.min(e.level, MASTER_VOCAB_LEVEL) / MASTER_VOCAB_LEVEL; // 0..1 je Wort
    });
    return { total: pool.length, started: started, mastered: mastered, progress: progress };
  }
  // Grammatik-Themen GENAU dieses Niveaus (nur schon vorhandene = "ready").
  function levelGrammarStats(level) {
    var g = (CURRICULUM[level] && CURRICULUM[level].grammar) || [];
    var ready = g.filter(function (t) { return t.status === "ready"; });
    var started = 0, done = 0, progress = 0;
    ready.forEach(function (t) {
      var h = S.grammarHits[t.moduleId] || 0;
      if (h > 0) started++;
      if (grammarMastered(t.moduleId)) done++;
      progress += Math.min(h / MASTER_GRAMMAR_HITS, 1); // 0..1 je Thema
    });
    return {
      total: ready.length, started: started, done: done, progress: progress,
      planned: g.filter(function (t) { return t.status === "planned"; }).length
    };
  }
  // Kombinierter Prozentwert: Vokabeln und Grammatik je zur Hälfte gewichtet,
  // damit auch Grammatik-Fortschritt den Balken sichtbar bewegt.
  function combinePct(vPart, gPart) {
    var parts = [];
    if (vPart !== null) parts.push(vPart);
    if (gPart !== null) parts.push(gPart);
    if (!parts.length) return 0;
    return parts.reduce(function (a, b) { return a + b; }, 0) / parts.length;
  }
  function getLevelProgress() {
    var levels = ["A1", "A2", "B1", "B2"];
    return levels.map(function (lv) {
      var voc = levelVocabStats(lv);
      var gram = levelGrammarStats(lv);
      var hasContent = voc.total > 0 || gram.total > 0;
      var target = voc.total ? vocabTargetFor(lv, voc.total) : 0;
      // Fortschritt = anteiliger Lernstand am Kernwortschatz-Ziel (bewegt sich
      // mit jeder Antwort und ist realistisch erreichbar).
      var vProg = target ? Math.min(voc.progress, target) / target * 100 : null;
      var gProg = gram.total ? (gram.progress / gram.total) * 100 : null;
      // begonnen = wie viel des Ziels schon einmal angefasst wurde
      var vStart = target ? Math.min(voc.started, target) / target * 100 : null;
      var gStart = gram.total ? (gram.started / gram.total) * 100 : null;
      return {
        level: lv,
        current: lv === S.level,
        hasContent: hasContent,
        planned: gram.planned,
        vocab: voc,
        vocabTarget: target,
        vocabSicher: Math.min(voc.mastered, target),
        grammar: gram,
        pct: Math.round(combinePct(vProg, gProg)),          // Fortschritt (Teilpunkte)
        startedPct: Math.round(combinePct(vStart, gStart)), // begonnen (Abdeckung)
        complete: levelComplete(lv)
      };
    });
  }

  /* ---------------- Kennzahlen für die Statistik ---------------- */
  function getStats() {
    var pool = vocabForLevel();
    var poolIds = {};
    pool.forEach(function (v) { poolIds[v.id] = 1; });
    var learned = S.introduced.filter(function (id) { return poolIds[id]; }).length;
    var mastered = 0, dueToday = 0, itemsSeen = 0, itemsMastered = 0;
    Object.keys(S.srs).forEach(function (id) {
      var e = S.srs[id];
      itemsSeen++;
      if (e.level >= MASTER_VOCAB_LEVEL) itemsMastered++;
      if (poolIds[id] && e.level >= MASTER_VOCAB_LEVEL) mastered++;
      if (e.due <= S.lessonNo && e.level > 0 && e.level < MASTER_VOCAB_LEVEL) dueToday++;
    });
    // Grammatik-Themen des Curriculums
    var cp = curriculumProgress(S.level);
    return {
      lessonNo: S.lessonNo,
      level: S.level,
      vocabTotal: pool.length,
      vocabLearned: learned,
      vocabMastered: mastered,
      itemsSeen: itemsSeen,          // alle Elemente (Wörter + Sätze) mit SRS
      itemsMastered: itemsMastered,
      dueToday: dueToday,            // fällig zur Wiederholung
      grammarReady: cp.grammarReady,
      grammarDone: cp.grammarDone
    };
  }
  // Einheitliche SRS-Schnittstelle (auch für Sätze im Übersetzen-Tab)
  function reviewItem(id, ok) { srsUpdate(id, ok); }
  function getSrs(id) { return S.srs[id] || null; }
  function srsClock() { return S.lessonNo; }

  /* ---------------- Öffentliche API ---------------- */
  window.Lektion = {
    render: render,
    renderVocab: renderVocab,
    renderVerbs: renderVerbs,
    getStats: getStats,
    getLevelProgress: getLevelProgress,
    reviewItem: reviewItem,
    snoozeItem: snoozeVocab,   // „Sitzt schon" für ein einzelnes SRS-Element (z. B. Satz)
    getSrs: getSrs,
    srsClock: srsClock,
    // Wird vom Notizfeld aufgerufen, wenn ein gemerktes Wort einer Vokabel
    // entspricht: Level zurücksetzen und sofort wieder fällig machen.
    markUnknown: function (vocabId) {
      var e = srsFor(vocabId);
      e.level = 0;
      e.wrong = (e.wrong || 0) + 1;
      e.due = S.lessonNo;
      e.last = "no";
      if (S.introduced.indexOf(vocabId) === -1) S.introduced.push(vocabId);
      save();
    },
    reset: function () {
      S = freshState();
      try { localStorage.removeItem(LS_KEY); } catch (e) {}
    }
  };
})();
