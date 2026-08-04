/* Olivias Italienisch-Trainer — App-Logik (Vanilla JS, offline-fähig) */
(function () {
  "use strict";

  const SB = window.APP_DATA.stumblingBlocks;
  const SENT = window.APP_DATA.sentences;

  const CAT_LABEL = {
    grammar: "Grammatik",
    vocab: "Vokabeln",
    preposition: "Präposition",
    spelling: "Rechtschreibung"
  };
  const THEME_LABEL = {
    travel: "Reise", family: "Familie", baby: "Kleinkind", beach: "Strand",
    restaurant: "Restaurant", food: "Essen", routine: "Alltag", phone: "Telefon",
    shopping: "Einkauf", home: "Zuhause", emotions: "Gefühle", weather: "Wetter",
    time: "Zeit", health: "Gesundheit", clothing: "Kleidung", city: "Stadt",
    work: "Arbeit", basics: "Grundlagen"
  };

  /* ---------- Fortschritt (localStorage) ---------- */
  const STORE_KEY = "olivia-it-progress-v1";
  function loadProgress() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; }
    catch (e) { return {}; }
  }
  function saveProgress(p) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(p)); } catch (e) {}
  }
  let progress = loadProgress(); // { id: {correct, wrong, last} }

  function record(id, ok) {
    const e = progress[id] || { correct: 0, wrong: 0 };
    if (ok) e.correct++; else e.wrong++;
    e.last = ok ? "ok" : "no";
    progress[id] = e;
    saveProgress(progress);
  }

  /* ---------- Text-Normalisierung & Vergleich ---------- */
  function norm(s) {
    return s
      .toLowerCase()
      .replace(/[’`]/g, "'")
      .replace(/\s*'\s*/g, "'")
      .replace(/[.,!?;:]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }
  function stripAccents(s) {
    return s.normalize("NFD").replace(/[̀-ͯ]/g, "");
  }
  // returns "ok", "near" (nur Akzente vergessen) oder "no".
  // Bewusst STRENG: ein falscher Buchstabe bei Präpositionen (da/di, a/in) oder
  // ein fehlender Doppelbuchstabe (machina/macchina) ist ein echter Fehler,
  // kein verzeihbarer Tippfehler – genau das soll die App aufdecken.
  function checkAnswer(input, accepted) {
    const ni = norm(input);
    if (!ni) return "no";
    for (const a of accepted) {
      if (ni === norm(a)) return "ok";
    }
    // Einziger Nachsicht-Fall: nur die Akzente fehlen (caffè → caffe),
    // ansonsten identisch. Handytastatur-freundlich, mit Hinweis.
    for (const a of accepted) {
      if (stripAccents(ni) === stripAccents(norm(a))) return "near";
    }
    return "no";
  }

  /* ---------- Wort-Diff für Hervorhebung ---------- */
  function diffHighlight(wrong, correct) {
    const w = wrong.split(/(\s+)/), c = correct.split(/(\s+)/);
    let pre = 0;
    while (pre < w.length && pre < c.length && w[pre] === c[pre]) pre++;
    let sw = w.length - 1, sc = c.length - 1;
    while (sw >= pre && sc >= pre && w[sw] === c[sc]) { sw--; sc--; }
    const wMid = w.slice(pre, sw + 1).join("");
    const cMid = c.slice(pre, sc + 1).join("");
    const wrongHtml = esc(w.slice(0, pre).join("")) +
      (wMid ? '<span class="diff-del">' + esc(wMid) + "</span>" : "") +
      esc(w.slice(sw + 1).join(""));
    const correctHtml = esc(c.slice(0, pre).join("")) +
      (cMid ? '<span class="diff-add">' + esc(cMid) + "</span>" : "") +
      esc(c.slice(sc + 1).join(""));
    return { wrongHtml, correctHtml };
  }

  // Wort-Diff, der Groß/Klein & Satzzeichen beim Vergleich ignoriert –
  // hebt nur die tatsächlich falsche Stelle hervor (rot = Eingabe, grün = richtig).
  function tokKey(t) { return norm(t); }
  function wordDiffSmart(userStr, correctStr) {
    const u = String(userStr).trim().split(/\s+/).filter(Boolean);
    const c = String(correctStr).trim().split(/\s+/).filter(Boolean);
    let pre = 0;
    while (pre < u.length && pre < c.length && tokKey(u[pre]) === tokKey(c[pre])) pre++;
    let su = u.length - 1, sc = c.length - 1;
    while (su >= pre && sc >= pre && tokKey(u[su]) === tokKey(c[sc])) { su--; sc--; }
    function line(tokens, from, to, cls) {
      const before = tokens.slice(0, from).map(esc).join(" ");
      const mid = tokens.slice(from, to + 1).map(esc).join(" ");
      const after = tokens.slice(to + 1).map(esc).join(" ");
      const parts = [];
      if (before) parts.push(before);
      if (mid) parts.push('<span class="' + cls + '">' + mid + "</span>");
      if (after) parts.push(after);
      return parts.join(" ") || "—";
    }
    return {
      userHtml: line(u, pre, su, "diff-del"),
      correctHtml: line(c, pre, sc, "diff-add"),
      hasDiff: su >= pre || sc >= pre
    };
  }
  function levDist(a, b) {
    const m = a.length, n = b.length;
    if (!m) return n; if (!n) return m;
    const d = Array.from({ length: n + 1 }, (_, i) => i);
    for (let i = 1; i <= m; i++) {
      let prev = d[0]; d[0] = i;
      for (let j = 1; j <= n; j++) {
        const tmp = d[j];
        d[j] = Math.min(d[j] + 1, d[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
        prev = tmp;
      }
    }
    return d[n];
  }
  // wählt die akzeptierte Lösung, die der Eingabe am ähnlichsten ist
  function pickClosest(input, accepted) {
    const ni = norm(input);
    let best = accepted[0], bestD = Infinity;
    accepted.forEach(a => { const dd = levDist(ni, norm(a)); if (dd < bestD) { bestD = dd; best = a; } });
    return best;
  }

  /* ---------- Merkliste: Wörter, die Olivia nicht kennt ---------- */
  const WISH_KEY = "olivia-it-wishlist-v1";
  function loadWish() { try { return JSON.parse(localStorage.getItem(WISH_KEY)) || []; } catch (e) { return []; } }
  function saveWish(w) { try { localStorage.setItem(WISH_KEY, JSON.stringify(w)); } catch (e) {} }
  function stripArticle(de) { return de.replace(/^\s*(der|die|das|l'|il|la|lo|i|le|gli)\s+/i, ""); }
  function matchVocab(word) {
    if (!window.LESSON_DATA) return null;
    const w = norm(word);
    if (!w) return null;
    return window.LESSON_DATA.vocab.filter(v => {
      const de = norm(stripArticle(v.de));
      const parts = de.split(/[\s/]+/);
      return de === w || parts.indexOf(w) !== -1;
    })[0] || null;
  }
  function addWishword(word, context) {
    word = (word || "").trim();
    if (!word) return { added: false };
    const w = loadWish();
    const matched = matchVocab(word);
    if (!w.some(x => norm(x.word) === norm(word))) {
      w.push({ word: word, context: context || "", matchedId: matched ? matched.id : null });
      saveWish(w);
      return { added: true, matched: matched };
    }
    return { added: false, duplicate: true, matched: matched };
  }

  // kleines Notizfeld "Wort, das du nicht kennst?" für jede Übung
  function noteField(context) {
    const wrap = $('<div class="notebox"></div>');
    const toggle = $('<button type="button" class="note-toggle">🤔 Wort, das du nicht kennst?</button>');
    const inner = $('<div class="note-inner" hidden></div>');
    const inp = $('<input type="text" class="note-input" autocapitalize="none" autocorrect="off" placeholder="deutsches Grundwort, z. B. packen">');
    const btn = $('<button type="button" class="note-save">merken</button>');
    const msg = $('<p class="note-msg"></p>');
    toggle.onclick = () => { inner.hidden = !inner.hidden; if (!inner.hidden) setTimeout(() => inp.focus(), 30); };
    function save() {
      const word = inp.value.trim();
      if (!word) return;
      const res = addWishword(word, context);
      if (res.matched && window.Lektion && window.Lektion.markUnknown) {
        window.Lektion.markUnknown(res.matched.id);
      }
      msg.textContent = res.matched
        ? "✓ „" + word + "“ kommt jetzt öfter dran."
        : "✓ „" + word + "“ ist auf deiner Lernliste gemerkt.";
      inp.value = "";
    }
    btn.onclick = save;
    inp.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); save(); } });
    inner.appendChild(inp); inner.appendChild(btn); inner.appendChild(msg);
    wrap.appendChild(toggle); wrap.appendChild(inner);
    return wrap;
  }

  /* ---------- Helpers ---------- */
  function esc(s) {
    return String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  }
  // **fett** und *kursiv* → HTML
  function mdInline(s) {
    return esc(s)
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/\n/g, "<br>");
  }
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  // priorisiert Einträge, die zuletzt falsch waren / selten geübt
  function weightedPick(items, idOf) {
    const scored = items.map(it => {
      const p = progress[idOf(it)] || { correct: 0, wrong: 0, last: null };
      let weight = 1 + p.wrong * 2;
      if (p.last === "no") weight += 3;
      if (p.correct === 0 && p.wrong === 0) weight += 1; // noch nie gesehen
      return { it, weight: weight + Math.random() };
    });
    scored.sort((a, b) => b.weight - a.weight);
    return scored[0].it;
  }
  function $(html) {
    const t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }

  /* ---------- App-State ---------- */
  const state = {
    view: "lektion",
    transThemes: new Set(),   // aktive Theme-Filter
    transCefr: new Set(),
    transCurrent: null,
    quizCat: new Set(),
    quizCurrent: null,
    cardCat: new Set(),
    cardIndex: 0,
    cardFlipped: false
  };

  const viewEl = document.getElementById("view");
  const resetBtn = document.getElementById("reset-btn");

  /* ---------- Gemeinsame Helfer für das Lektions-Modul (lesson.js) ---------- */
  window.Core = {
    esc: esc,
    mdInline: mdInline,
    norm: norm,
    stripAccents: stripAccents,
    checkAnswer: checkAnswer,
    shuffle: shuffle,
    el: $,
    record: record,
    getProgress: function () { return progress; },
    getEntry: function (id) { return progress[id] || null; },
    THEME_LABEL: THEME_LABEL,
    wordDiff: wordDiffSmart,
    pickClosest: pickClosest,
    noteField: noteField,
    addWishword: addWishword,
    getWishlist: loadWish,
    removeWishword: function (word) {
      saveWish(loadWish().filter(x => norm(x.word) !== norm(word)));
    },
    // erlaubt lesson.js, den Reset-Knopf sichtbar zu machen
    showReset: function () { if (resetBtn.hidden) resetBtn.hidden = false; }
  };

  /* ============ VIEW: ÜBERSETZEN ============ */
  function filteredSentences() {
    return SENT.filter(s => {
      const themeOk = state.transThemes.size === 0 ||
        s.themes.some(t => state.transThemes.has(t));
      const cefrOk = state.transCefr.size === 0 || state.transCefr.has(s.cefr);
      return themeOk && cefrOk;
    });
  }

  function nextTranslation() {
    const pool = filteredSentences();
    if (!pool.length) { state.transCurrent = null; return; }
    // nicht dieselbe zweimal hintereinander
    let pick = weightedPick(pool, s => s.id);
    if (pool.length > 1 && state.transCurrent && pick.id === state.transCurrent.id) {
      pick = weightedPick(pool.filter(s => s.id !== state.transCurrent.id), s => s.id);
    }
    state.transCurrent = pick;
  }

  function renderUebersetzen() {
    const allThemes = [...new Set(SENT.flatMap(s => s.themes))];
    const cefrs = [...new Set(SENT.map(s => s.cefr))].sort();

    const filters = $('<div class="filters"></div>');
    for (const t of allThemes) {
      const c = $(`<button class="chip" aria-pressed="${state.transThemes.has(t)}">${esc(THEME_LABEL[t] || t)}</button>`);
      c.onclick = () => { toggle(state.transThemes, t); nextTranslation(); renderUebersetzen(); };
      filters.appendChild(c);
    }
    for (const lv of cefrs) {
      const c = $(`<button class="chip" aria-pressed="${state.transCefr.has(lv)}">${esc(lv)}</button>`);
      c.onclick = () => { toggle(state.transCefr, lv); nextTranslation(); renderUebersetzen(); };
      filters.appendChild(c);
    }

    if (!state.transCurrent) nextTranslation();

    viewEl.innerHTML = "";
    viewEl.appendChild(filters);

    const pool = filteredSentences();
    if (!state.transCurrent) {
      viewEl.appendChild($('<p class="empty">Keine Sätze für diese Auswahl.<br>Filter anpassen.</p>'));
      return;
    }

    const s = state.transCurrent;
    viewEl.appendChild($(`<p class="progress-line">${pool.length} Sätze in dieser Auswahl</p>`));

    const card = $('<div class="card"></div>');
    const meta = $('<div class="meta-row"></div>');
    meta.appendChild($(`<span class="badge cefr">${esc(s.cefr)}</span>`));
    s.themes.forEach(t => meta.appendChild($(`<span class="badge">${esc(THEME_LABEL[t] || t)}</span>`)));
    card.appendChild(meta);

    card.appendChild($(`<p class="prompt-de">${esc(s.de)}</p>`));
    card.appendChild($('<p class="hint">Tippe die italienische Übersetzung:</p>'));

    const ta = $('<textarea rows="2" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="…"></textarea>');
    card.appendChild(ta);

    const fbSlot = $("<div></div>");
    card.appendChild(fbSlot);

    const checkBtn = $('<button class="btn primary">Prüfen</button>');
    const showBtn = $('<button class="btn ghost">Lösung zeigen</button>');
    const row = $('<div class="btn-row"></div>');
    row.appendChild(showBtn); row.appendChild(checkBtn);
    card.appendChild(row);

    let answered = false;
    function reveal(result) {
      if (answered) return;
      answered = true;
      ta.setAttribute("readonly", "");
      let cls = result === "ok" ? "ok" : result === "near" ? "near" : "no";
      const fb = $(`<div class="feedback ${cls}"></div>`);
      if (result === "ok") {
        fb.appendChild($('<p class="lead ok">✓ Richtig!</p>'));
        fb.appendChild($(`<p class="solution">${esc(s.it[0])}</p>`));
        s.it.slice(1).forEach(sol => fb.appendChild($(`<p class="solution alt">auch: ${esc(sol)}</p>`)));
      } else {
        fb.appendChild($(`<p class="lead ${cls}">${result === "near" ? "≈ Fast! Nur die Akzente stimmen nicht" : "✗ Nicht ganz"}</p>`));
        const target = pickClosest(ta.value, s.it);
        const d = wordDiffSmart(ta.value, target);
        if (ta.value.trim()) {
          fb.appendChild($(`<p class="diff-line"><span class="diff-lbl">deine Eingabe</span>${d.userHtml}</p>`));
        }
        fb.appendChild($(`<p class="diff-line"><span class="diff-lbl">richtig</span>${d.correctHtml}</p>`));
      }
      if (s.grammar_focus && s.grammar_focus.length) {
        fb.appendChild($(`<p class="hint" style="margin:8px 0 0">🔎 Fokus: ${esc(s.grammar_focus.map(prettyFocus).join(", "))}</p>`));
      }
      fbSlot.appendChild(fb);
      record(s.id, result === "ok");
      row.innerHTML = "";
      const nextBtn = $('<button class="btn primary">Nächster Satz →</button>');
      nextBtn.onclick = () => { nextTranslation(); renderUebersetzen(); };
      row.appendChild(nextBtn);
      if (resetBtn.hidden) resetBtn.hidden = false;
    }

    checkBtn.onclick = () => reveal(checkAnswer(ta.value, s.it));
    showBtn.onclick = () => reveal(ta.value.trim() ? checkAnswer(ta.value, s.it) : "no");
    ta.addEventListener("keydown", e => {
      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); if (!answered) checkBtn.click(); }
    });

    card.appendChild(noteField(s.de));
    viewEl.appendChild(card);
    viewEl.appendChild($('<p class="offline-note">💡 Enter = Prüfen · funktioniert offline</p>'));
    setTimeout(() => ta.focus(), 50);
  }

  function prettyFocus(f) {
    return f.replace(/_/g, " ");
  }

  /* ============ VIEW: STOLPER-QUIZ ============ */
  function quizPool() {
    return SB.filter(b => state.quizCat.size === 0 || state.quizCat.has(b.category));
  }
  function nextQuiz() {
    const pool = quizPool();
    if (!pool.length) { state.quizCurrent = null; return; }
    let pick = weightedPick(pool, b => b.id);
    if (pool.length > 1 && state.quizCurrent && pick.id === state.quizCurrent.id) {
      pick = weightedPick(pool.filter(b => b.id !== state.quizCurrent.id), b => b.id);
    }
    state.quizCurrent = pick;
  }

  function renderQuiz() {
    const cats = [...new Set(SB.map(b => b.category))];
    const filters = $('<div class="filters"></div>');
    for (const c of cats) {
      const chip = $(`<button class="chip" aria-pressed="${state.quizCat.has(c)}">${esc(CAT_LABEL[c] || c)}</button>`);
      chip.onclick = () => { toggle(state.quizCat, c); nextQuiz(); renderQuiz(); };
      filters.appendChild(chip);
    }

    if (!state.quizCurrent) nextQuiz();
    viewEl.innerHTML = "";
    viewEl.appendChild(filters);

    if (!state.quizCurrent) {
      viewEl.appendChild($('<p class="empty">Keine Stolpersteine für diese Auswahl.</p>'));
      return;
    }

    const b = state.quizCurrent;
    const ex = b.examples && b.examples[0];
    viewEl.appendChild($(`<p class="progress-line">Welcher Satz ist richtig?</p>`));

    const card = $('<div class="card"></div>');
    card.appendChild($(`<div class="meta-row"><span class="badge">${esc(CAT_LABEL[b.category] || b.category)}</span></div>`));

    if (!ex) {
      // Kein Beispielsatz → Wort-Vergleich
      card.appendChild($(`<p class="prompt-de">Was ist korrekt?</p>`));
    }

    const options = ex
      ? shuffle([{ text: ex.correct, ok: true }, { text: ex.wrong, ok: false }])
      : shuffle([{ text: b.correct, ok: true }, { text: b.wrong, ok: false }]);

    const fbSlot = $("<div></div>");
    let answered = false;
    const btns = [];
    options.forEach(opt => {
      const btn = $(`<button class="choice">${esc(opt.text)}</button>`);
      btn.onclick = () => {
        if (answered) return;
        answered = true;
        const ok = opt.ok;
        btns.forEach(x => {
          x.disabled = true;
          if (x._ok) x.classList.add("correct");
        });
        if (!ok) btn.classList.add("wrong");
        record(b.id, ok);

        const fb = $(`<div class="feedback ${ok ? "ok" : "no"}"></div>`);
        fb.appendChild($(`<p class="lead ${ok ? "ok" : "no"}">${ok ? "✓ Genau!" : "✗ Leider falsch"}</p>`));
        if (ex) {
          const d = diffHighlight(ex.wrong, ex.correct);
          fb.appendChild($(`<p class="solution">${d.correctHtml}</p>`));
          fb.appendChild($(`<p class="solution alt" style="text-decoration:none">statt: ${d.wrongHtml}</p>`));
        }
        fb.appendChild($(`<p class="explanation">${mdInline(b.explanation)}</p>`));
        fbSlot.appendChild(fb);

        const nextBtn = $('<button class="btn primary">Weiter →</button>');
        nextBtn.onclick = () => { nextQuiz(); renderQuiz(); };
        card.appendChild(nextBtn);
        if (resetBtn.hidden) resetBtn.hidden = false;
      };
      btn._ok = opt.ok;
      btns.push(btn);
      card.appendChild(btn);
    });
    card.appendChild(fbSlot);

    viewEl.appendChild(card);
  }

  /* ============ VIEW: KARTEN (Lernen) ============ */
  function cardPool() {
    return SB.filter(b => state.cardCat.size === 0 || state.cardCat.has(b.category));
  }
  function renderKarten() {
    const cats = [...new Set(SB.map(b => b.category))];
    const filters = $('<div class="filters"></div>');
    for (const c of cats) {
      const chip = $(`<button class="chip" aria-pressed="${state.cardCat.has(c)}">${esc(CAT_LABEL[c] || c)}</button>`);
      chip.onclick = () => { toggle(state.cardCat, c); state.cardIndex = 0; state.cardFlipped = false; renderKarten(); };
      filters.appendChild(chip);
    }

    const pool = cardPool();
    viewEl.innerHTML = "";
    viewEl.appendChild(filters);
    if (!pool.length) { viewEl.appendChild($('<p class="empty">Keine Karten.</p>')); return; }

    if (state.cardIndex >= pool.length) state.cardIndex = 0;
    const b = pool[state.cardIndex];
    viewEl.appendChild($(`<p class="progress-line">Karte ${state.cardIndex + 1} / ${pool.length}</p>`));

    const card = $('<div class="card"></div>');
    card.appendChild($(`<div class="meta-row"><span class="badge">${esc(CAT_LABEL[b.category] || b.category)}</span></div>`));

    if (!state.cardFlipped) {
      card.appendChild($(`<p class="wrong-line">✗ ${esc(b.wrong)}</p>`));
      const flipBtn = $('<button class="btn primary">Auflösung →</button>');
      flipBtn.onclick = () => { state.cardFlipped = true; renderKarten(); };
      card.appendChild(flipBtn);
    } else {
      card.appendChild($(`<p class="wrong-line">✗ ${esc(b.wrong)}</p>`));
      card.appendChild($(`<p class="correct-line">✓ ${esc(b.correct)}</p>`));
      card.appendChild($(`<p class="explanation" style="margin-top:12px">${mdInline(b.explanation)}</p>`));
      (b.examples || []).forEach(ex => {
        const d = diffHighlight(ex.wrong, ex.correct);
        card.appendChild($(`<p class="ex"><span class="lbl">falsch:</span> <span class="diff-del">${esc(ex.wrong)}</span></p>`));
        card.appendChild($(`<p class="ex"><span class="lbl">richtig:</span> ${d.correctHtml}</p>`));
      });
    }
    viewEl.appendChild(card);

    const nav = $('<div class="btn-row"></div>');
    const prev = $('<button class="btn ghost">← Zurück</button>');
    const next = $('<button class="btn ghost">Weiter →</button>');
    prev.onclick = () => { state.cardIndex = (state.cardIndex - 1 + pool.length) % pool.length; state.cardFlipped = false; renderKarten(); };
    next.onclick = () => { state.cardIndex = (state.cardIndex + 1) % pool.length; state.cardFlipped = false; renderKarten(); };
    nav.appendChild(prev); nav.appendChild(next);
    viewEl.appendChild(nav);
  }

  /* ============ VIEW: FORTSCHRITT ============ */
  function renderFortschritt() {
    viewEl.innerHTML = "";
    const allIds = [...SB.map(b => b.id), ...SENT.map(s => s.id)];
    let seen = 0, totalCorrect = 0, totalWrong = 0, mastered = 0;
    allIds.forEach(id => {
      const p = progress[id];
      if (p) {
        seen++;
        totalCorrect += p.correct; totalWrong += p.wrong;
        if (p.correct >= 2 && p.last === "ok") mastered++;
      }
    });
    const total = allIds.length;
    const attempts = totalCorrect + totalWrong;
    const rate = attempts ? Math.round((totalCorrect / attempts) * 100) : 0;

    const grid = $('<div class="stat-grid"></div>');
    grid.appendChild($(`<div class="stat"><div class="num">${seen}/${total}</div><div class="lbl">geübt</div></div>`));
    grid.appendChild($(`<div class="stat"><div class="num">${mastered}</div><div class="lbl">gemeistert</div></div>`));
    grid.appendChild($(`<div class="stat"><div class="num">${rate}%</div><div class="lbl">Trefferquote</div></div>`));
    grid.appendChild($(`<div class="stat"><div class="num">${attempts}</div><div class="lbl">Antworten</div></div>`));
    viewEl.appendChild(grid);

    const pct = total ? Math.round((seen / total) * 100) : 0;
    const barCard = $('<div class="card"></div>');
    barCard.appendChild($(`<p class="section-title" style="margin-top:0">Insgesamt geübt</p>`));
    barCard.appendChild($(`<div class="bar"><span style="width:${pct}%"></span></div>`));
    barCard.appendChild($(`<p class="hint" style="margin:6px 0 0">${seen} von ${total} Einträgen mindestens einmal geübt.</p>`));
    viewEl.appendChild(barCard);

    // schwierigste Einträge (meiste Fehler)
    const trouble = allIds
      .map(id => ({ id, p: progress[id] }))
      .filter(x => x.p && x.p.wrong > 0)
      .sort((a, b) => b.p.wrong - a.p.wrong)
      .slice(0, 5);
    if (trouble.length) {
      viewEl.appendChild($('<p class="section-title">Deine größten Stolpersteine</p>'));
      const list = $('<div class="card"></div>');
      trouble.forEach(x => {
        const label = labelForId(x.id);
        list.appendChild($(`<p class="ex" style="margin:4px 0"><span class="diff-del" style="text-decoration:none">${x.p.wrong}×</span> falsch — ${esc(label)}</p>`));
      });
      viewEl.appendChild(list);
    } else {
      viewEl.appendChild($('<p class="empty">Noch keine Fehler erfasst.<br>Leg im Übersetzen- oder Quiz-Modus los! 🇮🇹</p>'));
    }

    // Merkliste: Wörter, die Olivia nicht kannte
    const wish = loadWish();
    if (wish.length) {
      viewEl.appendChild($('<p class="section-title">📝 Deine Wörter zum Lernen</p>'));
      const wcard = $('<div class="card"></div>');
      wish.slice().reverse().forEach(w => {
        const known = w.matchedId ? " · in App vorhanden" : "";
        const rowEl = $('<div class="wish-row"></div>');
        rowEl.appendChild($(`<span class="wish-word">${esc(w.word)}${known ? '<span class="wish-note">' + known + '</span>' : ''}</span>`));
        const del = $('<button class="wish-del" title="entfernen">✕</button>');
        del.onclick = () => { saveWish(loadWish().filter(x => norm(x.word) !== norm(w.word))); renderFortschritt(); };
        rowEl.appendChild(del);
        wcard.appendChild(rowEl);
      });
      viewEl.appendChild(wcard);
      viewEl.appendChild($('<p class="offline-note">Diese Wörter kommen (falls in der App vorhanden) öfter dran. Neue Wörter kann Claude dir später mit Übersetzung einbauen.</p>'));
    }
  }

  function labelForId(id) {
    const s = SENT.find(x => x.id === id);
    if (s) return s.de;
    const b = SB.find(x => x.id === id);
    if (b) return (b.correct || "").split("/")[0].trim();
    return id;
  }

  /* ---------- Utilities ---------- */
  function toggle(set, v) { set.has(v) ? set.delete(v) : set.add(v); }

  /* ---------- Router ---------- */
  function render() {
    if (state.view === "lektion") {
      if (window.Lektion) window.Lektion.render(viewEl);
      else viewEl.innerHTML = '<p class="empty">Lektion wird geladen…</p>';
    }
    else if (state.view === "uebersetzen") renderUebersetzen();
    else if (state.view === "quiz") renderQuiz();
    else if (state.view === "karten") renderKarten();
    else if (state.view === "fortschritt") renderFortschritt();
    viewEl.scrollTop = 0;
    window.scrollTo(0, 0);
  }

  document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => {
      state.view = tab.dataset.view;
      document.querySelectorAll(".tab").forEach(t =>
        t.setAttribute("aria-selected", t === tab ? "true" : "false"));
      render();
    });
  });

  resetBtn.hidden = Object.keys(progress).length === 0;
  resetBtn.addEventListener("click", () => {
    if (confirm("Deinen ganzen Fortschritt wirklich löschen?")) {
      progress = {};
      saveProgress(progress);
      if (window.Lektion && window.Lektion.reset) window.Lektion.reset();
      resetBtn.hidden = true;
      render();
    }
  });

  // Erst rendern, wenn alle Skripte (inkl. lesson.js) geladen sind
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render);
  } else {
    render();
  }

  /* ---------- Service Worker (Offline) ---------- */
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    });
  }
})();
