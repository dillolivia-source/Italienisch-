/* Olivias Italienisch-Trainer — App-Logik (Vanilla JS, offline-fähig) */
(function () {
  "use strict";

  const SENT = window.APP_DATA.sentences;

  const THEME_LABEL = {
    travel: "Reise", family: "Familie", baby: "Kleinkind", beach: "Strand",
    restaurant: "Restaurant", food: "Essen", routine: "Alltag", phone: "Telefon",
    shopping: "Einkauf", home: "Zuhause", emotions: "Gefühle", weather: "Wetter",
    time: "Zeit", health: "Gesundheit", clothing: "Kleidung", city: "Stadt",
    work: "Arbeit", basics: "Grundlagen", social: "Soziales", body: "Körper",
    nature: "Natur", animals: "Tiere", school: "Schule", tech: "Technik",
    abstract: "Abstrakt", spirit: "Spiritualität", material: "Material"
  };

  /* ---------- Speicher-Prüfung (localStorage verfügbar?) ---------- */
  function storageWorks() {
    try {
      const k = "__olivia_test__";
      localStorage.setItem(k, "1");
      const ok = localStorage.getItem(k) === "1";
      localStorage.removeItem(k);
      return ok;
    } catch (e) { return false; }
  }
  const STORAGE_OK = storageWorks();

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
    transCurrent: null
  };

  const viewEl = document.getElementById("view");
  const resetBtn = document.getElementById("reset-btn");

  /* ---------- Sprachausgabe (Hören) – kostenlos via Web Speech API ---------- */
  const TTS = ("speechSynthesis" in window);
  let _itVoice = null;
  function loadVoices() {
    if (!TTS) return;
    try {
      const vs = window.speechSynthesis.getVoices() || [];
      _itVoice = vs.find(v => /^it([-_]|$)/i.test(v.lang)) ||
        vs.find(v => /it/i.test(v.lang)) || null;
    } catch (e) {}
  }
  if (TTS) {
    loadVoices();
    try { window.speechSynthesis.onvoiceschanged = loadVoices; } catch (e) {}
  }
  function speak(text) {
    if (!TTS || !text) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(String(text));
      u.lang = "it-IT";
      if (_itVoice) u.voice = _itVoice;
      u.rate = 0.95; u.pitch = 1;
      window.speechSynthesis.speak(u);
    } catch (e) {}
  }
  function speakButton(text) {
    if (!TTS) return null;
    const b = $('<button type="button" class="spk" aria-label="anhören" title="anhören">🔊</button>');
    b.onclick = e => { e.preventDefault(); e.stopPropagation(); speak(text); };
    return b;
  }

  /* ---------- Akzent-Schnelltasten (Reibung reduzieren) ---------- */
  function insertAtCursor(ta, ch) {
    const start = ta.selectionStart != null ? ta.selectionStart : ta.value.length;
    const end = ta.selectionEnd != null ? ta.selectionEnd : ta.value.length;
    ta.value = ta.value.slice(0, start) + ch + ta.value.slice(end);
    const pos = start + ch.length;
    try { ta.setSelectionRange(pos, pos); } catch (e) {}
    ta.focus();
  }
  function accentBar(ta) {
    const bar = $('<div class="acc-bar"></div>');
    ["à", "è", "é", "ì", "ò", "ù", "'"].forEach(ch => {
      const k = $('<button type="button" class="acc-key">' + ch + "</button>");
      k.addEventListener("mousedown", e => e.preventDefault()); // Fokus behalten
      k.onclick = e => { e.preventDefault(); insertAtCursor(ta, ch); };
      bar.appendChild(k);
    });
    return bar;
  }

  /* ---------- Sichern & Übertragen (versioniertes Format) ---------- */
  const BACKUP_KEYS = [
    "olivia-it-progress-v1", "olivia-it-lesson-v2",
    "olivia-it-uservocab-v1", "olivia-it-wishlist-v1"
  ];
  function collectBackup() {
    const store = {};
    BACKUP_KEYS.forEach(k => { const v = localStorage.getItem(k); if (v != null) store[k] = v; });
    return { app: "olivia-italienisch", schema: 2, exportedAt: new Date().toISOString(), store };
  }
  function downloadBackup() {
    const data = JSON.stringify(collectBackup());
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const d = new Date();
    a.href = url;
    a.download = "italienisch-sicherung-" + d.toISOString().slice(0, 10) + ".json";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function restoreBackup(text) {
    let obj;
    try { obj = JSON.parse(text); } catch (e) { return false; }
    if (!obj || obj.app !== "olivia-italienisch" || !obj.store) return false;
    Object.keys(obj.store).forEach(k => {
      if (BACKUP_KEYS.indexOf(k) !== -1) { try { localStorage.setItem(k, obj.store[k]); } catch (e) {} }
    });
    return true;
  }

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
    canSpeak: TTS,
    speak: speak,
    speakButton: speakButton,
    accentBar: accentBar,
    storageOk: STORAGE_OK,
    addWishword: addWishword,
    getWishlist: loadWish,
    removeWishword: function (word) {
      saveWish(loadWish().filter(x => norm(x.word) !== norm(word)));
    },
    // erlaubt lesson.js, den Reset-Knopf sichtbar zu machen
    showReset: function () { if (resetBtn.hidden) resetBtn.hidden = false; }
  };

  /* ============ VIEW: ÜBERSETZEN ============ */
  // Satz-Pool = feste Sätze (data.js) + Beispielsätze aus den Vokabeln (wächst mit).
  let _sentCache = null;
  function allSentences() {
    if (_sentCache) return _sentCache;
    const out = SENT.slice();
    const V = (window.LESSON_DATA && window.LESSON_DATA.vocab) || [];
    V.forEach(v => {
      if (v.ex && v.ex.de && Array.isArray(v.ex.it)) {
        out.push({ id: v.id + "_ex", de: v.ex.de, it: v.ex.it, themes: [v.theme || "basics"], cefr: v.cefr || "A2" });
      }
    });
    _sentCache = out;
    return out;
  }
  function filteredSentences() {
    return allSentences().filter(s => {
      const themeOk = state.transThemes.size === 0 ||
        (s.themes || []).some(t => state.transThemes.has(t));
      const cefrOk = state.transCefr.size === 0 || state.transCefr.has(s.cefr);
      return themeOk && cefrOk;
    });
  }

  // SRS-gesteuerte Auswahl: fällige & schwache Sätze zuerst (einheitliches Modell)
  function nextTranslation() {
    const pool = filteredSentences();
    if (!pool.length) { state.transCurrent = null; return; }
    const L = window.Lektion;
    const clock = L ? L.srsClock() : 0;
    const scored = pool.map(s => {
      const e = L ? L.getSrs(s.id) : null;
      let w;
      if (!e) w = 3; // neu → bevorzugt
      else {
        w = (e.wrong || 0) * 2 + (e.last === "no" ? 2 : 0) + Math.max(0, 3 - (e.level || 0));
        if (e.due <= clock) w += 3; // fällig
      }
      return { s, w: w + Math.random() };
    });
    scored.sort((a, b) => b.w - a.w);
    let pick = scored[0].s;
    if (pool.length > 1 && state.transCurrent && pick.id === state.transCurrent.id) pick = scored[1].s;
    state.transCurrent = pick;
  }

  function renderUebersetzen() {
    const allThemes = [...new Set(allSentences().flatMap(s => s.themes || []))];
    const cefrs = [...new Set(allSentences().map(s => s.cefr))].sort();

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
    card.appendChild(accentBar(ta));

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
      const lead = $(`<p class="lead ${cls}">${result === "ok" ? "✓ Richtig!" : result === "near" ? "≈ Fast! Nur die Akzente stimmen nicht" : "✗ Nicht ganz"}</p>`);
      fb.appendChild(lead);
      const target = result === "ok" ? s.it[0] : pickClosest(ta.value, s.it);
      if (result === "ok") {
        const sol = $(`<p class="solution">${esc(s.it[0])}</p>`);
        const sb0 = speakButton(s.it[0]); if (sb0) sol.appendChild(sb0);
        fb.appendChild(sol);
        s.it.slice(1).forEach(sol2 => fb.appendChild($(`<p class="solution alt">auch: ${esc(sol2)}</p>`)));
      } else {
        const d = wordDiffSmart(ta.value, target);
        if (ta.value.trim()) {
          fb.appendChild($(`<p class="diff-line"><span class="diff-lbl">deine Eingabe</span>${d.userHtml}</p>`));
        }
        const rl = $(`<p class="diff-line"><span class="diff-lbl">richtig</span>${d.correctHtml}</p>`);
        const sb1 = speakButton(target); if (sb1) rl.appendChild(sb1);
        fb.appendChild(rl);
      }
      if (s.grammar_focus && s.grammar_focus.length) {
        fb.appendChild($(`<p class="hint" style="margin:8px 0 0">🔎 Fokus: ${esc(s.grammar_focus.map(prettyFocus).join(", "))}</p>`));
      }
      record(s.id, result === "ok");
      if (window.Lektion && window.Lektion.reviewItem) window.Lektion.reviewItem(s.id, result === "ok");
      speak(target); // Lösung vorlesen (im Klick-Flow → iOS ok)
      if (result !== "ok") {
        const ov = $('<button type="button" class="override">war doch richtig ✓</button>');
        ov.onclick = () => {
          record(s.id, true);
          if (window.Lektion && window.Lektion.reviewItem) window.Lektion.reviewItem(s.id, true);
          ov.remove(); lead.className = "lead ok"; lead.textContent = "✓ Als richtig gewertet"; fb.className = "feedback ok";
        };
        fb.appendChild(ov);
      }
      fbSlot.appendChild(fb);
      row.innerHTML = "";
      const nextBtn = $('<button class="btn primary">Nächster Satz →</button>');
      nextBtn.onclick = () => { nextTranslation(); renderUebersetzen(); };
      row.appendChild(nextBtn);
      if (resetBtn.hidden) resetBtn.hidden = false;
    }

    checkBtn.onclick = () => reveal(checkAnswer(ta.value, s.it));
    showBtn.onclick = () => reveal(ta.value.trim() ? checkAnswer(ta.value, s.it) : "no");
    // Enter wird zentral behandelt (löst den Haupt-Button "Prüfen"/"Weiter" aus).

    card.appendChild(noteField(s.de));
    viewEl.appendChild(card);
    viewEl.appendChild($('<p class="offline-note">💡 Enter = Prüfen · funktioniert offline</p>'));
    setTimeout(() => ta.focus(), 50);
  }

  function prettyFocus(f) {
    return f.replace(/_/g, " ");
  }

  /* ============ VIEW: FORTSCHRITT ============ */
  function statTile(num, label, sub) {
    return $(`<div class="stat"><div class="num">${num}</div><div class="lbl">${label}</div>` +
      (sub ? `<div class="sub">${sub}</div>` : "") + `</div>`);
  }
  // Verständliches Etikett für eine ID (nur Vokabeln & Sätze; Grammatik-IDs überspringen)
  function labelFor(id) {
    const V = (window.LESSON_DATA && window.LESSON_DATA.vocab) || [];
    let base = id, isSentence = false;
    if (/_ex$/.test(id)) base = id.slice(0, -3); // Beispielsatz zu einer Vokabel
    const v = V.find(x => x.id === base);
    if (v) return v.de + " → " + v.it;
    const s = SENT.find(x => x.id === id);
    if (s) return s.de;
    return null; // Grammatik/andere → in der Liste auslassen
  }

  function renderFortschritt() {
    viewEl.innerHTML = "";
    const st = (window.Lektion && window.Lektion.getStats)
      ? window.Lektion.getStats()
      : { lessonNo: 0, level: "A2", vocabTotal: 0, vocabLearned: 0, vocabMastered: 0 };

    // Trefferquote über alle aufgezeichneten Antworten
    let totalCorrect = 0, totalWrong = 0;
    Object.keys(progress).forEach(id => {
      totalCorrect += progress[id].correct || 0;
      totalWrong += progress[id].wrong || 0;
    });
    const attempts = totalCorrect + totalWrong;
    const rate = attempts ? Math.round((totalCorrect / attempts) * 100) : 0;

    viewEl.appendChild($('<h2 class="lesson-title" style="margin:2px 0 4px">📊 Deine Statistik</h2>'));
    viewEl.appendChild($('<p class="hint" style="margin:0 0 12px">Was du bisher geschafft hast – alles nur auf diesem Gerät gespeichert.</p>'));

    const grid = $('<div class="stat-grid"></div>');
    grid.appendChild(statTile(st.lessonNo, "Lektionen", "ganz abgeschlossen"));
    grid.appendChild(statTile(st.vocabLearned + "/" + st.vocabTotal, "Vokabeln gelernt", "schon mind. 1× geübt"));
    grid.appendChild(statTile(st.vocabMastered, "Vokabeln sicher", "sitzen fest"));
    grid.appendChild(statTile(rate + "%", "Trefferquote", totalCorrect + " von " + attempts + " richtig"));
    viewEl.appendChild(grid);

    if (st.dueToday) {
      viewEl.appendChild($(`<p class="hint" style="margin:2px 0 0">🔁 <b>${st.dueToday}</b> Wörter/Sätze sind zur Wiederholung fällig – üben in Lektion, Vokabeln oder Übersetzen.</p>`));
    }

    // Wortschatz-Balken
    const pct = st.vocabTotal ? Math.round((st.vocabLearned / st.vocabTotal) * 100) : 0;
    const barCard = $('<div class="card"></div>');
    barCard.appendChild($(`<p class="section-title" style="margin-top:0">Wortschatz · Niveau ${esc(st.level)}</p>`));
    barCard.appendChild($(`<div class="bar"><span style="width:${pct}%"></span></div>`));
    barCard.appendChild($(`<p class="hint" style="margin:6px 0 0">${st.vocabLearned} von ${st.vocabTotal} Vokabeln auf deinem Niveau begonnen · ${st.vocabMastered} sitzen sicher.</p>`));
    viewEl.appendChild(barCard);

    // schwierigste Wörter (verständliche Labels)
    const trouble = Object.keys(progress)
      .map(id => ({ id, p: progress[id], label: labelFor(id) }))
      .filter(x => x.p.wrong > 0 && x.label)
      .sort((a, b) => b.p.wrong - a.p.wrong)
      .slice(0, 5);
    if (trouble.length) {
      viewEl.appendChild($('<p class="section-title">Das fällt dir noch schwer</p>'));
      const list = $('<div class="card"></div>');
      trouble.forEach(x => {
        list.appendChild($(`<p class="ex" style="margin:5px 0"><span class="diff-del" style="text-decoration:none">${x.p.wrong}×</span> falsch — ${esc(x.label)}</p>`));
      });
      viewEl.appendChild(list);
      viewEl.appendChild($('<p class="offline-note">Diese kommen im Training häufiger dran, bis sie sitzen.</p>'));
    }

    // Merkliste: Wörter aus „Wort, das du nicht kennst?"
    const wish = loadWish();
    if (wish.length) {
      viewEl.appendChild($('<p class="section-title">📝 Deine Merkliste</p>'));
      const wcard = $('<div class="card"></div>');
      wish.slice().reverse().forEach(w => {
        const known = w.matchedId ? " · schon in der App" : " · noch ohne Übersetzung";
        const rowEl = $('<div class="wish-row"></div>');
        rowEl.appendChild($(`<span class="wish-word">${esc(w.word)}<span class="wish-note">${known}</span></span>`));
        const del = $('<button class="wish-del" title="entfernen">✕</button>');
        del.onclick = () => { saveWish(loadWish().filter(x => norm(x.word) !== norm(w.word))); renderFortschritt(); };
        rowEl.appendChild(del);
        wcard.appendChild(rowEl);
      });
      viewEl.appendChild(wcard);
      viewEl.appendChild($('<p class="offline-note">Wörter, die du dir gemerkt hast. Eigene Vokabeln legst du im Tab „Vokabeln" an.</p>'));
    }

    // Sichern & Übertragen (Backup / anderes Gerät)
    viewEl.appendChild($('<p class="section-title">💾 Sichern & Übertragen</p>'));
    viewEl.appendChild($('<p class="hint" style="margin:0 0 8px">Lade eine Sicherung herunter oder spiele sie auf einem anderen Gerät wieder ein.</p>'));
    const bcard = $('<div class="card"></div>');
    const brow = $('<div class="backup-row"></div>');
    const dl = $('<button class="btn primary">⬇︎ Sicherung laden</button>');
    dl.onclick = () => downloadBackup();
    const upLabel = $('<label class="file-label">⬆︎ Wiederherstellen<input type="file" accept="application/json,.json"></label>');
    const fileInp = upLabel.querySelector("input");
    fileInp.onchange = () => {
      const f = fileInp.files && fileInp.files[0];
      if (!f) return;
      const reader = new FileReader();
      reader.onload = () => {
        if (restoreBackup(String(reader.result))) {
          alert("✓ Sicherung wiederhergestellt. Die App wird neu geladen.");
          location.reload();
        } else {
          alert("Das war keine gültige Sicherungsdatei.");
        }
      };
      reader.readAsText(f);
    };
    brow.appendChild(dl); brow.appendChild(upLabel);
    bcard.appendChild(brow);
    // Fallback per Code (z. B. Handy → Computer ohne Datei)
    const codeToggle = $('<button class="btn ghost" style="margin-top:10px">🔡 Per Code übertragen</button>');
    const codeWrap = $('<div hidden style="margin-top:10px"></div>');
    const codeArea = $('<textarea rows="3" class="note-input" placeholder="Hier den Sicherungs-Code einfügen…"></textarea>');
    const codeRow = $('<div class="backup-row" style="margin-top:8px"></div>');
    const showCode = $('<button class="btn ghost">Code anzeigen</button>');
    const applyCode = $('<button class="btn primary">Code einspielen</button>');
    showCode.onclick = () => { codeArea.value = JSON.stringify(collectBackup()); codeArea.focus(); codeArea.select(); };
    applyCode.onclick = () => {
      if (restoreBackup(codeArea.value)) { alert("✓ Wiederhergestellt. Neu laden."); location.reload(); }
      else alert("Ungültiger Code.");
    };
    codeToggle.onclick = () => { codeWrap.hidden = !codeWrap.hidden; };
    codeRow.appendChild(showCode); codeRow.appendChild(applyCode);
    codeWrap.appendChild(codeArea); codeWrap.appendChild(codeRow);
    bcard.appendChild(codeToggle); bcard.appendChild(codeWrap);
    viewEl.appendChild(bcard);
  }

  /* ---------- Utilities ---------- */
  function toggle(set, v) { set.has(v) ? set.delete(v) : set.add(v); }

  /* ---------- Router ---------- */
  function render() {
    if (state.view === "lektion") {
      if (window.Lektion) window.Lektion.render(viewEl);
      else viewEl.innerHTML = '<p class="empty">Lektion wird geladen…</p>';
    }
    else if (state.view === "vokabeln") {
      if (window.Lektion) window.Lektion.renderVocab(viewEl);
      else viewEl.innerHTML = '<p class="empty">Vokabeln werden geladen…</p>';
    }
    else if (state.view === "uebersetzen") renderUebersetzen();
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

  // Enter bestätigt immer den Haupt-Button (Weiter / Prüfen / Starten …).
  // Ausnahme: das Notizfeld "Wort, das du nicht kennst?" hat eigenes Enter.
  document.addEventListener("keydown", e => {
    if (e.key !== "Enter" || e.shiftKey || e.isComposing) return;
    const t = e.target;
    if (t && t.classList && t.classList.contains("note-input")) return;
    const ctas = Array.prototype.slice
      .call(viewEl.querySelectorAll("button.btn.primary"))
      .filter(btn => !btn.disabled && btn.offsetParent !== null &&
        !(btn.closest && btn.closest(".levelup")));
    if (!ctas.length) return;
    e.preventDefault();
    ctas[ctas.length - 1].click();
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

  // Warnung, falls der Browser nichts speichern kann (z. B. privater Modus)
  if (!STORAGE_OK) {
    const banner = $('<div class="storage-warn">⚠️ <b>Dein Browser speichert gerade nichts</b> – dein Fortschritt geht beim Schließen verloren.<br>Tipp: <b>nicht im privaten Modus</b> surfen und die App über „Zum Home-Bildschirm" öffnen.</div>');
    const tb = document.querySelector(".topbar");
    if (tb) tb.insertAdjacentElement("afterend", banner);
  }

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
