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

  var VOCAB = D.vocab;
  var MODULES = D.grammarModules;
  var CURRICULUM = D.curriculum;

  var NEW_PER_DAY = 5;
  var REVIEW_MAX = 8;         // max. Vokabeln in der Wiederholung
  var GRAMMAR_DAYS = 4;       // ein Grammatik-Thema bleibt so viele Tage
  var SRS_INTERVAL = [1, 1, 2, 3, 5, 8]; // Tage bis Wiederfälligkeit je Level
  var MASTER_VOCAB_LEVEL = 4; // ab hier gilt eine Vokabel als "gelernt"
  var MASTER_GRAMMAR_HITS = 12; // so viele richtige Antworten → Modul "gelernt"

  var LS_KEY = "olivia-it-lesson-v2";

  /* ---------------- Persistenter Zustand ---------------- */
  function freshState() {
    return {
      level: "A2",
      lessonNo: 0,
      lastDate: null,          // "YYYY-MM-DD" der letzten begonnenen Lektion
      completedDate: null,     // Datum der letzten ABGESCHLOSSENEN Lektion
      introduced: [],          // Vokabel-IDs, die schon eingeführt wurden
      srs: {},                 // id -> {level, streak, wrong, due, last}
      grammarIndex: 0,         // Position im Modul-Rotationsplan (pro Level)
      dayOnTopic: 0,           // an welchem Tag (1..GRAMMAR_DAYS) des Themas
      lastGrammarModuleId: null, // Modul der vorigen Lektion (für Schritt 1)
      grammarHits: {},         // moduleId -> Anzahl richtiger Antworten
      plan: null,              // aktuell laufender Lektionsplan
      seg: 0,                  // aktueller Segment-Index im Plan
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
        return base;
      }
    } catch (e) {}
    return freshState();
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
    return VOCAB.filter(function (v) { return levelLE(v.cefr, S.level); });
  }
  function modulesForLevel() {
    return MODULES.filter(function (m) { return m.cefr === S.level; });
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
    var pool = VOCAB.filter(function (v) { return levelLE(v.cefr, level); });
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
  // A2 gilt als geschafft, wenn alle "ready"-Grammatikthemen gemeistert sind
  // und (fast) der ganze Wortschatz sitzt.
  function levelComplete(level) {
    var p = curriculumProgress(level);
    var grammarOk = p.grammarReady > 0 && p.grammarDone >= p.grammarReady;
    var vocabOk = p.vocabTotal > 0 && p.vocabDone >= Math.ceil(p.vocabTotal * 0.9);
    return grammarOk && vocabOk;
  }

  /* ================= LEKTIONSPLAN BAUEN ================= */
  function buildPlan() {
    S.lessonNo += 1;
    S.lastDate = todayKey();

    // Grammatik-Rotation bestimmen
    var mods = modulesForLevel();
    if (mods.length === 0) mods = MODULES; // Fallback
    if (S.dayOnTopic === 0 || S.dayOnTopic >= GRAMMAR_DAYS) {
      // neues Thema
      if (S.dayOnTopic !== 0) S.grammarIndex = (S.grammarIndex + 1) % mods.length;
      S.dayOnTopic = 1;
    } else {
      S.dayOnTopic += 1;
    }
    var currentModule = mods[S.grammarIndex % mods.length];

    var segments = [];

    // --- Schritt 1: Grammatik-Wiederholung der letzten Lektion ---
    var prevModule = S.lastGrammarModuleId
      ? MODULES.filter(function (m) { return m.id === S.lastGrammarModuleId; })[0]
      : null;
    if (prevModule) {
      segments.push({
        type: "info",
        title: "🔁 Wiederholung: " + prevModule.title,
        html: C.mdInline(prevModule.rule),
        note: "Kurze Auffrischung vom letzten Mal."
      });
      segments.push({
        type: "quiz",
        title: "🔁 Grammatik-Wiederholung",
        questions: pickGrammarQuestions(prevModule, 3)
      });
    }

    // --- Schritt 2: Vokabel-Wiederholung (adaptiv) ---
    var due = vocabForLevel().filter(function (v) {
      return S.introduced.indexOf(v.id) !== -1 &&
        (S.srs[v.id] ? S.srs[v.id].due <= S.lessonNo : true);
    });
    due.sort(function (a, b) {
      var ea = S.srs[a.id] || { wrong: 0, level: 0 };
      var eb = S.srs[b.id] || { wrong: 0, level: 0 };
      if (eb.wrong !== ea.wrong) return eb.wrong - ea.wrong; // mehr Fehler zuerst
      return ea.level - eb.level;                            // niedrigeres Level zuerst
    });
    due = due.slice(0, REVIEW_MAX);
    if (due.length) {
      segments.push({
        type: "quiz",
        title: "🗂️ Vokabel-Wiederholung",
        questions: due.map(vocabQuestion),
        srs: true
      });
    }

    // --- Schritt 3: 5 neue Vokabeln ---
    var fresh = vocabForLevel().filter(function (v) {
      return S.introduced.indexOf(v.id) === -1;
    }).slice(0, NEW_PER_DAY);

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
      // --- Schritt 4: Übersetzungen mit den neuen Vokabeln ---
      var transQs = fresh.filter(function (v) { return v.ex; }).map(function (v) {
        return {
          kind: "type",
          id: v.id + "_ex",
          prompt: v.ex.de,
          accept: v.ex.it,
          explain: "Vokabel: **" + v.it + "** = " + v.de
        };
      });
      if (transQs.length) {
        segments.push({
          type: "quiz",
          title: "✍️ Übersetzen mit den neuen Vokabeln",
          questions: transQs
        });
      }
    }

    // --- Schritt 5: Grammatik-Teil (aktuelles Thema) ---
    segments.push({
      type: "info",
      title: "🧩 Grammatik: " + currentModule.title,
      html: C.mdInline(currentModule.rule),
      note: "Tag " + S.dayOnTopic + " von " + GRAMMAR_DAYS + " zu diesem Thema."
    });
    segments.push({
      type: "quiz",
      title: "🧩 Grammatik üben",
      questions: pickGrammarQuestions(currentModule, 5),
      grammarModuleId: currentModule.id
    });

    S.plan = { segments: segments, moduleId: currentModule.id, lessonNo: S.lessonNo };
    S.seg = 0;
    S.lastGrammarModuleId = currentModule.id;
    save();
  }

  function vocabQuestion(v) {
    return {
      kind: "type",
      id: v.id,
      prompt: v.de,
      accept: [v.it],
      explain: "**" + v.it + "** = " + v.de
    };
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

  function renderStartScreen() {
    var p = curriculumProgress(S.level);
    var card = C.el('<div class="card lesson-start"></div>');
    card.appendChild(C.el('<div class="level-pill">Niveau ' + S.level + '</div>'));
    card.appendChild(C.el('<h2 style="margin:6px 0 2px">Bereit für deine Lektion?</h2>'));
    var introducedCount = S.introduced.length;
    card.appendChild(C.el('<p class="hint">Heute: kurze Wiederholung, ' +
      NEW_PER_DAY + ' neue Vokabeln und dein Grammatik-Thema.</p>'));

    var btn = C.el('<button class="btn primary">Lektion starten →</button>');
    btn.onclick = function () { buildPlan(); render(root); };
    card.appendChild(btn);
    root.appendChild(card);

    renderProgressCard();
  }

  function renderDoneToday() {
    var card = C.el('<div class="card" style="text-align:center"></div>');
    card.appendChild(C.el('<div style="font-size:44px">✅</div>'));
    card.appendChild(C.el('<h2 style="margin:4px 0">Heute geschafft!</h2>'));
    card.appendChild(C.el('<p class="hint">Komm morgen wieder für die nächste Lektion. Bis dahin kannst du frei weiterüben.</p>'));
    var again = C.el('<button class="btn ghost">Trotzdem nochmal üben</button>');
    again.onclick = function () { buildPlan(); render(root); };
    card.appendChild(again);
    root.appendChild(card);
    renderProgressCard();
  }

  function renderProgressCard() {
    var p = curriculumProgress(S.level);
    var card = C.el('<div class="card"></div>');
    card.appendChild(C.el('<p class="section-title" style="margin-top:0">📊 Dein ' + S.level + '-Fortschritt</p>'));

    var gPct = p.grammarReady ? Math.round((p.grammarDone / p.grammarReady) * 100) : 0;
    card.appendChild(C.el('<p class="hint" style="margin:8px 0 2px">Grammatik-Themen: ' + p.grammarDone + '/' + p.grammarReady + ' gemeistert</p>'));
    card.appendChild(bar(gPct));

    var vPct = p.vocabTotal ? Math.round((p.vocabDone / p.vocabTotal) * 100) : 0;
    card.appendChild(C.el('<p class="hint" style="margin:12px 0 2px">Wortschatz: ' + p.vocabDone + '/' + p.vocabTotal + ' sitzt</p>'));
    card.appendChild(bar(vPct));

    // Themenliste mit Status
    var list = C.el('<div style="margin-top:14px"></div>');
    p.items.forEach(function (t) {
      var done = t.status === "ready" && grammarMastered(t.moduleId);
      var icon = t.status === "planned" ? "⏳" : (done ? "✅" : "◻️");
      var extra = t.status === "planned" ? ' <span class="badge gray">geplant</span>' : "";
      list.appendChild(C.el('<p class="curr-item">' + icon + " " + C.esc(t.topic) + extra + "</p>"));
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
          S.level = "B1"; S.grammarIndex = 0; S.dayOnTopic = 0; S.b1Offered = true;
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
        S.level = lv; S.grammarIndex = 0; S.dayOnTopic = 0; save(); render(root);
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
      var btn = C.el('<button class="btn primary">Weiter →</button>');
      btn.onclick = nextSegment;
      card.appendChild(btn);
      root.appendChild(card);
      return;
    }

    if (seg.type === "vocabIntro") {
      var c2 = C.el('<div class="card"></div>');
      seg.vocab.forEach(function (v) {
        var row = C.el('<div class="vocab-row"></div>');
        row.appendChild(C.el('<span class="vocab-it">' + C.esc(v.it) + "</span>"));
        row.appendChild(C.el('<span class="vocab-de">' + C.esc(v.de) + "</span>"));
        c2.appendChild(row);
      });
      var b2 = C.el('<button class="btn primary">Verstanden, abfragen →</button>');
      b2.onclick = nextSegment;
      c2.appendChild(b2);
      root.appendChild(c2);
      return;
    }

    if (seg.type === "quiz") {
      runQuiz(seg);
      return;
    }
    // Fallback
    nextSegment();
  }

  function nextSegment() {
    S.seg += 1;
    if (S.seg >= S.plan.segments.length) {
      finishLesson();
    } else {
      save();
      render(root);
    }
  }

  function finishLesson() {
    S.completedDate = todayKey();
    S.plan = null;
    S.seg = 0;
    save();
    root.innerHTML = "";
    var card = C.el('<div class="card" style="text-align:center"></div>');
    card.appendChild(C.el('<div style="font-size:44px">🎉</div>'));
    card.appendChild(C.el('<h2 style="margin:4px 0">Lektion ' + S.lessonNo + ' geschafft!</h2>'));
    card.appendChild(C.el('<p class="hint">Stark! Deine Fehler hast du bis zur richtigen Lösung wiederholt. Morgen geht es weiter.</p>'));
    var b = C.el('<button class="btn primary">Zum Fortschritt</button>');
    b.onclick = function () { render(root); };
    card.appendChild(b);
    root.appendChild(card);
    renderProgressCard();
    C.showReset();
  }

  /* ============ QUIZ-RUNNER mit Fehler-Nachdrill ============ */
  function runQuiz(seg) {
    // Warteschlange: falsche Fragen kommen ans Ende, bis alle richtig sind
    var queue = seg.questions.slice();
    var total = queue.length;
    var solvedIds = {};
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
      // Grammatik-Protokoll: pro richtiger Antwort genau einmal zählen
      if (ok) {
        var mid = q.moduleId || seg.grammarModuleId;
        if (mid) registerGrammarHit(mid);
      }

      queue.shift();
      if (ok) {
        solvedIds[q.id] = true;
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

    function renderType(q) {
      var card = C.el('<div class="card"></div>');
      card.appendChild(C.el('<p class="prompt-de">' + C.esc(q.prompt) + "</p>"));
      card.appendChild(C.el('<p class="hint">Tippe auf Italienisch:</p>'));
      var ta = C.el('<textarea rows="2" autocapitalize="off" autocorrect="off" spellcheck="false"></textarea>');
      card.appendChild(ta);
      var fbSlot = C.el("<div></div>");
      card.appendChild(fbSlot);
      var btn = C.el('<button class="btn primary">Prüfen</button>');
      card.appendChild(btn);
      root.appendChild(card);

      var answered = false;
      btn.onclick = function () {
        if (!answered) {
          answered = true;
          var res = C.checkAnswer(ta.value, q.accept);
          ta.setAttribute("readonly", "");
          var cls = res === "ok" ? "ok" : res === "near" ? "near" : "no";
          var lead = res === "ok" ? "✓ Richtig!" : res === "near" ? "≈ Fast! Nur die Akzente" : "✗ Nicht ganz";
          var fb = C.el('<div class="feedback ' + cls + '"></div>');
          fb.appendChild(C.el('<p class="lead ' + cls + '">' + lead + "</p>"));
          q.accept.forEach(function (a, i) {
            fb.appendChild(C.el('<p class="solution' + (i ? " alt" : "") + '">' + (i ? "auch: " : "") + C.esc(a) + "</p>"));
          });
          if (q.explain) fb.appendChild(C.el('<p class="explanation" style="margin-top:6px">' + C.mdInline(q.explain) + "</p>"));
          fbSlot.appendChild(fb);
          onResult(q, res === "ok"); // "near" (nur Akzente) zählt als Fehler → Nachdrill
          btn.textContent = "Weiter →";
        } else {
          step();
        }
      };
      ta.addEventListener("keydown", function (e) {
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); btn.click(); }
      });
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
      root.appendChild(card);
    }

    step();
  }

  /* ---------------- Öffentliche API ---------------- */
  window.Lektion = {
    render: render,
    reset: function () {
      S = freshState();
      try { localStorage.removeItem(LS_KEY); } catch (e) {}
    }
  };
})();
