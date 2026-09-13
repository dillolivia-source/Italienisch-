/*
 * window.Exam – Abschlusstest je Niveau (Standard-orientiert, CEFR).
 * Deckt alle Bereiche ab: Wortschatz, Grammatik, Verben (Konjugation),
 * Übersetzung (Produktion), Leseverständnis, Hören. Nutzt ausschließlich die
 * bereits vorhandenen Daten (Vokabeln, Grammatik-Module, Sätze, Verben).
 * Jederzeit startbar; am Ende Auswertung pro Bereich + Bestanden/Noch-nicht.
 */
(function () {
  "use strict";
  var C = window.Core;
  var D = window.LESSON_DATA;
  var SENT = (window.APP_DATA && window.APP_DATA.sentences) || [];
  var VD = window.VERB_DATA || { pronouns: [], verbs: [] };

  var root, onExit, LEVEL, questions, idx, results;

  var PASS_OVERALL = 0.75;   // Gesamt-Schwelle
  var PASS_SECTION = 0.60;   // je Bereich

  function isSv() { return !!(window.Lang && window.Lang.is && window.Lang.is("sv")); }
  var ORDER = ["A1", "A2", "B1", "B2"];
  function levelLE(a, b) { return ORDER.indexOf(a) <= ORDER.indexOf(b); }
  function svVocabOK(v) {
    if (!isSv()) return true;
    if (v.theme === "baby") return false;
    return !(window.SV && window.SV.vocab && window.SV.vocab[v.id] == null);
  }
  function svSentOK(s) { return !isSv() || (s.themes || []).indexOf("baby") === -1; }
  function pick(arr, n) { return C.shuffle(arr.slice()).slice(0, n); }

  /* ---- Lesetexte (Italienisch bleibt gleich; Aussagen als Vero/Falso) ---- */
  var READINGS = [
    {
      text: "Domani vado a Roma in treno. Parto la mattina presto e arrivo alle dieci. A Roma abita mia sorella con il suo bambino. Restiamo insieme tre giorni. Mi piace molto viaggiare, ma non mi piace la stazione quando c'è troppa gente.",
      items: [
        { s: "Vado a Roma in aereo.", a: false },
        { s: "Parto la mattina presto.", a: true },
        { s: "A Roma abita mia sorella.", a: true },
        { s: "Mi piace la stazione con tanta gente.", a: false }
      ]
    },
    {
      text: "La sera cucino a casa con mio marito. Oggi facciamo la pasta e un'insalata. Dopo cena guardiamo un film insieme. Il fine settimana andiamo al mercato e compriamo frutta e verdura. Non compriamo mai la carne, perché non ci piace.",
      items: [
        { s: "La sera mangiano al ristorante.", a: false },
        { s: "Dopo cena guardano un film.", a: true },
        { s: "Il fine settimana vanno al mercato.", a: true },
        { s: "Comprano spesso la carne.", a: false }
      ]
    }
  ];

  function build() {
    var qs = [];
    // 1) Wortschatz (Bedeutung → Italienisch tippen)
    var vocab = D.vocab.filter(function (v) {
      return /^(v|e)\d+$/.test(v.id) && levelLE(v.cefr, LEVEL) && svVocabOK(v) && v.it;
    });
    pick(vocab, 8).forEach(function (v) {
      qs.push({ section: "Wortschatz", kind: "type", prompt: C.known(v), accept: [v.it] });
    });
    // 2) Grammatik (aus den Modulen bis zum Niveau)
    var gEx = [];
    D.grammarModules.filter(function (m) { return levelLE(m.cefr, LEVEL); })
      .forEach(function (m) { (m.exercises || []).forEach(function (e) { gEx.push(e); }); });
    pick(gEx, 10).forEach(function (e) {
      if (e.kind === "choice") qs.push({ section: "Grammatik", kind: "choice", prompt: C.gramText(e.prompt), options: e.options, answer: e.answer });
      else qs.push({ section: "Grammatik", kind: "type", prompt: C.gramText(e.prompt), accept: e.accept });
    });
    // 3) Verben (Präsens konjugieren)
    pick(VD.verbs.filter(function (v) { return v.forms && v.forms.length === 6; }), 5).forEach(function (v) {
      var p = Math.floor(Math.random() * 6);
      qs.push({ section: "Verben", kind: "type", verb: true, inf: v.inf, meaning: C.knownVerb(v),
        person: VD.pronouns[p], accept: [v.forms[p]] });
    });
    // 4) Übersetzung (Alltagssätze → Italienisch)
    var sents = SENT.filter(function (s) { return levelLE(s.cefr || "A2", LEVEL) && svSentOK(s) && s.it && s.it.length; });
    pick(sents, 6).forEach(function (s) {
      qs.push({ section: "Übersetzung", kind: "type", prompt: C.knownSentence(s), accept: s.it });
    });
    // 5) Leseverständnis
    var r = pick(READINGS, 1)[0];
    qs.push({ section: "Lesen", kind: "reading", text: r.text, items: r.items });
    // 6) Hören (nur wenn Sprache verfügbar)
    if (C.canSpeak) {
      var lsents = sents.filter(function (s) { return s.it[0].length < 60; });
      pick(lsents, 5).forEach(function (s) {
        var others = pick(sents.filter(function (x) { return x.id !== s.id; }), 2);
        var right = C.knownSentence(s);
        var opts = C.shuffle([right, C.knownSentence(others[0]), C.knownSentence(others[1])]);
        qs.push({ section: "Hören", kind: "listen", play: s.it[0], options: opts, answer: right });
      });
    }
    return qs;
  }

  function totalScreens() { return questions.length; }

  function header() {
    var h = C.el('<div class="lesson-head"></div>');
    var top = C.el('<div style="display:flex;justify-content:space-between;align-items:center"></div>');
    top.appendChild(C.el('<p class="lesson-step" style="margin:0">🎓 ' + LEVEL + '-Abschlusstest · Teil ' + (idx + 1) + '/' + totalScreens() + '</p>'));
    var cancel = C.el('<button type="button" class="exam-cancel">✕ Abbrechen</button>');
    cancel.onclick = function () { if (onExit) onExit(); };
    top.appendChild(cancel);
    h.appendChild(top);
    var q = questions[idx];
    h.appendChild(C.el('<h2 class="lesson-title" style="margin:2px 0">Bereich: ' + C.esc(q.section) + '</h2>'));
    var pct = Math.round((idx / totalScreens()) * 100);
    h.appendChild(C.el('<div class="bar"><span style="width:' + pct + '%"></span></div>'));
    return h;
  }

  function record(section, ok) { results.push({ section: section, ok: !!ok }); }

  function nextBtn() {
    var b = C.el('<button class="btn primary" style="margin-top:12px">Weiter →</button>');
    b.onclick = function () { idx++; step(); };
    return b;
  }

  function renderType(q) {
    var card = C.el('<div class="card"></div>');
    if (q.verb) {
      card.appendChild(C.el('<p class="prompt-de"><b>' + C.esc(q.inf) + '</b> <span class="verb-de">(' + C.esc(q.meaning) + ')</span></p>'));
      card.appendChild(C.el('<p class="hint">Konjugiere für <b class="conj-ask">' + C.esc(q.person) + '</b> (Präsens):</p>'));
    } else {
      card.appendChild(C.el('<p class="prompt-de">' + C.esc(q.prompt) + '</p>'));
      card.appendChild(C.el('<p class="hint">' + C.esc(C.tt("Tippe auf Italienisch:")) + '</p>'));
    }
    var ta = C.el('<textarea rows="2" autocapitalize="off" autocorrect="off" spellcheck="false"></textarea>');
    card.appendChild(ta);
    card.appendChild(C.accentBar(ta));
    var fb = C.el("<div></div>"); card.appendChild(fb);
    var btn = C.el('<button class="btn primary">' + C.esc(C.tt("Prüfen")) + '</button>');
    card.appendChild(btn);
    root.appendChild(card);
    var answered = false;
    btn.onclick = function () {
      if (answered) return; answered = true;
      var res = C.checkAnswer(ta.value, q.accept);
      var ok = (res === "ok" || res === "near");
      ta.setAttribute("readonly", "");
      var box = C.el('<div class="feedback ' + (ok ? "ok" : "no") + '"></div>');
      box.appendChild(C.el('<p class="lead ' + (ok ? "ok" : "no") + '">' + (ok ? C.esc(C.tt("✓ Richtig!")) : C.esc(C.tt("✗ Nicht ganz"))) + '</p>'));
      box.appendChild(C.el('<p class="solution">' + C.esc(q.accept[0]) + '</p>'));
      var sb = C.speakButton && C.speakButton(q.accept[0]); if (sb) box.appendChild(sb);
      fb.appendChild(box);
      btn.disabled = true;
      record(q.section, ok);
      card.appendChild(nextBtn());
    };
  }

  function renderChoice(q) {
    var card = C.el('<div class="card"></div>');
    card.appendChild(C.el('<p class="prompt-de">' + C.esc(q.prompt) + '</p>'));
    root.appendChild(card);
    var answered = false, btns = [];
    C.shuffle(q.options).forEach(function (opt) {
      var b = C.el('<button class="choice">' + C.esc(opt) + '</button>');
      b._ok = (opt === q.answer);
      b.onclick = function () {
        if (answered) return; answered = true;
        btns.forEach(function (x) { x.disabled = true; if (x._ok) x.classList.add("correct"); });
        if (!b._ok) b.classList.add("wrong");
        var fb = C.el('<div class="feedback ' + (b._ok ? "ok" : "no") + '"></div>');
        fb.appendChild(C.el('<p class="lead ' + (b._ok ? "ok" : "no") + '">' + (b._ok ? "✓ Genau!" : C.esc(C.tt("✗ Nicht ganz")) + " — " + C.esc(q.answer)) + '</p>'));
        card.appendChild(fb);
        record(q.section, b._ok);
        card.appendChild(nextBtn());
      };
      btns.push(b); card.appendChild(b);
    });
  }

  function renderReading(q) {
    var card = C.el('<div class="card"></div>');
    card.appendChild(C.el('<p class="hint" style="margin-top:0">Lies den Text und entscheide: richtig (Vero) oder falsch (Falso)?</p>'));
    card.appendChild(C.el('<p class="reading-text">' + C.esc(q.text) + '</p>'));
    var picks = [];
    q.items.forEach(function (it, i) {
      var wrap = C.el('<div class="exam-vf"></div>');
      wrap.appendChild(C.el('<p class="vf-stmt">' + (i + 1) + '. ' + C.esc(it.s) + '</p>'));
      var rowBtns = [];
      var brow = C.el('<div class="vf-row"></div>');
      ["Vero", "Falso"].forEach(function (lbl, k) {
        var val = (k === 0);
        var b = C.el('<button type="button" class="vf-btn">' + lbl + '</button>');
        b.onclick = function () {
          picks[i] = val;
          rowBtns.forEach(function (x) { x.classList.remove("sel"); });
          b.classList.add("sel");
        };
        rowBtns.push(b); brow.appendChild(b);
      });
      wrap.appendChild(brow);
      card.appendChild(wrap);
    });
    var msg = C.el('<p class="note-msg"></p>'); card.appendChild(msg);
    var submit = C.el('<button class="btn primary" style="margin-top:6px">Auswerten →</button>');
    submit.onclick = function () {
      if (picks.length < q.items.length || picks.some(function (x) { return x === undefined; })) {
        msg.style.color = "var(--red)"; msg.textContent = "Bitte alle Aussagen beantworten."; return;
      }
      q.items.forEach(function (it, i) { record("Lesen", picks[i] === it.a); });
      submit.disabled = true;
      // kurze Auflösung
      q.items.forEach(function (it, i) {
        card.appendChild(C.el('<p class="ex" style="margin:4px 0">' + (picks[i] === it.a ? "✓" : "✗") + " " + (i + 1) + ". " + (it.a ? "Vero" : "Falso") + '</p>'));
      });
      card.appendChild(nextBtn());
    };
    card.appendChild(submit);
    root.appendChild(card);
  }

  function renderListen(q) {
    var card = C.el('<div class="card"></div>');
    card.appendChild(C.el('<p class="hint" style="margin-top:0">Hör zu und wähle die richtige Bedeutung.</p>'));
    var play = C.el('<button class="btn primary" style="margin-bottom:10px">🔊 Abspielen</button>');
    play.onclick = function () { C.speak(q.play); };
    card.appendChild(play);
    root.appendChild(card);
    C.speak(q.play);
    var answered = false, btns = [];
    C.shuffle(q.options).forEach(function (opt) {
      var b = C.el('<button class="choice">' + C.esc(opt) + '</button>');
      b._ok = (opt === q.answer);
      b.onclick = function () {
        if (answered) return; answered = true;
        btns.forEach(function (x) { x.disabled = true; if (x._ok) x.classList.add("correct"); });
        if (!b._ok) b.classList.add("wrong");
        record(q.section, b._ok);
        card.appendChild(nextBtn());
      };
      btns.push(b); card.appendChild(b);
    });
  }

  function step() {
    root.innerHTML = "";
    if (idx >= questions.length) { renderResult(); return; }
    root.appendChild(header());
    var q = questions[idx];
    if (q.kind === "type") renderType(q);
    else if (q.kind === "choice") renderChoice(q);
    else if (q.kind === "reading") renderReading(q);
    else if (q.kind === "listen") renderListen(q);
    root.scrollTop = 0; try { window.scrollTo(0, 0); } catch (e) {}
    if (window.Core.localize) window.Core.localize(root);
  }

  function renderResult() {
    root.innerHTML = "";
    var bySec = {};
    results.forEach(function (r) {
      if (!bySec[r.section]) bySec[r.section] = { ok: 0, n: 0 };
      bySec[r.section].n++; if (r.ok) bySec[r.section].ok++;
    });
    var totOk = results.filter(function (r) { return r.ok; }).length;
    var tot = results.length || 1;
    var overall = totOk / tot;
    var allSectionsOk = Object.keys(bySec).every(function (s) { return bySec[s].ok / bySec[s].n >= PASS_SECTION; });
    var passed = overall >= PASS_OVERALL && allSectionsOk;

    var card = C.el('<div class="card" style="text-align:center"></div>');
    card.appendChild(C.el('<div style="font-size:46px">' + (passed ? "🎉" : "💪") + '</div>'));
    card.appendChild(C.el('<h2 style="margin:4px 0">' + (passed
      ? (LEVEL + " geschafft!")
      : ("Noch nicht ganz – " + LEVEL)) + '</h2>'));
    card.appendChild(C.el('<p class="big-pct" style="font-size:34px;font-weight:800;color:var(--brand);margin:6px 0">' + Math.round(overall * 100) + '%</p>'));
    card.appendChild(C.el('<p class="hint">' + totOk + ' / ' + tot + ' richtig</p>'));
    root.appendChild(card);

    var list = C.el('<div class="card"></div>');
    list.appendChild(C.el('<p class="section-title" style="margin-top:0">Ergebnis pro Bereich</p>'));
    Object.keys(bySec).forEach(function (s) {
      var o = bySec[s], p = Math.round((o.ok / o.n) * 100);
      var row = C.el('<div class="lvl-row"></div>');
      row.appendChild(C.el('<div class="lvl-head"><span class="lvl-name">' + C.esc(s) +
        '</span><span class="lvl-pct">' + o.ok + '/' + o.n + ' · ' + p + '%</span></div>'));
      row.appendChild(C.el('<div class="lvl-bar"><span class="lvl-fill' + (p >= PASS_SECTION * 100 ? '' : ' weak') + '" style="width:' + p + '%"></span></div>'));
      list.appendChild(row);
    });
    root.appendChild(list);

    var note = passed
      ? "Super! Du erfüllst den " + LEVEL + "-Standard in allen Bereichen."
      : "Fast! Für " + LEVEL + " brauchst du überall mind. 60 % und insgesamt 75 %. Übe die schwächeren Bereiche und teste erneut.";
    root.appendChild(C.el('<p class="offline-note" style="text-align:center">' + note + '</p>'));

    var again = C.el('<button class="btn primary" style="margin-top:14px">🔁 Test wiederholen</button>');
    again.onclick = function () { start(root, { level: LEVEL, onExit: onExit }); };
    root.appendChild(again);
    var back = C.el('<button class="btn ghost" style="margin-top:10px">← Zurück</button>');
    back.onclick = function () { if (onExit) onExit(); };
    root.appendChild(back);
    if (window.Core.localize) window.Core.localize(root);
  }

  function start(container, opts) {
    root = container; opts = opts || {};
    LEVEL = opts.level || "A2";
    onExit = opts.onExit || null;
    questions = build();
    idx = 0; results = [];
    step();
  }

  window.Exam = { start: start };
})();
