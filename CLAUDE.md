# CLAUDE.md — Olivias Italienisch-Trainer

Persönliche, **offline-fähige** Lern-App (PWA) für Olivia. Deutsch → Italienisch,
Niveau A1–B1 (B2 geplant). Läuft im Handy-Browser, „Zum Home-Bildschirm",
funktioniert offline. **Kein Build-Schritt** – reines HTML/CSS/JS.

## Nutzer & Sprache
- Ziel-Nutzerin: Olivia (lernt Italienisch, Muttersprache Deutsch).
- **Alle UI-Texte auf Deutsch.** Erklärungen Deutsch, Übungsinhalte Italienisch.
- Kontexte: Reise, Familie/Oma, Kleinkind, Strand, Restaurant, Alltag.

## Dateien
| Datei | Zweck |
|-------|-------|
| `index.html` | Grundgerüst, Tab-Bar (Lektion · Übersetzen · Statistik), Skript-Reihenfolge |
| `styles.css` | Design (Pomodoro-Palette, **immer hell, kein Dark Mode**) |
| `app.js` | Freie Modi (Übersetzen, Statistik), Router, `window.Core`-Helfer, Enter-Handler |
| `lesson.js` | `window.Lektion` – Tageslektion, Spaced Repetition, Grammatik-Rotation, Fortschritt/Niveau |
| `data.js` | `window.APP_DATA`: `stumblingBlocks` (Alt-Daten), `sentences` (60 Übersetzungssätze) |
| `data-lesson.js` | `window.LESSON_DATA`: `vocab`, `grammarModules`, `curriculum` (A1/A2/B1) |
| `sw.js` | Service Worker (Offline). **Bei jeder Änderung `CACHE`-Version hochzählen!** |
| `manifest.webmanifest`, `icon.svg` | PWA-Metadaten & Icon |
| `KONZEPT-LEKTION.md` | Fachliches Konzept der Tageslektion |

Skript-Reihenfolge in `index.html`: `data.js` → `data-lesson.js` → `app.js` → `lesson.js`.
`app.js` stellt `window.Core` bereit (esc, mdInline, checkAnswer, wordDiff,
pickClosest, noteField, record, …); `lesson.js` nutzt diese über `C`.

## Farb-Logik (Pomodoro, in styles.css als CSS-Variablen)
- **Gelb `--action`** = Aktion/Prüfen/Weiter/Starten (`.btn.primary`).
- **Grün `--green`** = **richtig** (Feedback ok, Diff-Zusatz).
- **Rot `--red`** = **falsch** (Feedback, Diff-Streichung).
- **Tomate `--brand`** = Identität (aktiver Tab, Fortschritt, Badges, Kopf).
Diese Zuordnung bitte beibehalten.

## Kernverhalten (nicht brechen)
- **Antwortprüfung streng**: nur fehlende Akzente werden verziehen („near"),
  ein falscher Buchstabe/Präposition zählt als Fehler. Siehe `checkAnswer` in app.js.
- **Fehler-Auswertung**: nur die falsche Stelle zeigen – rot die Eingabe, grün
  richtig (Wort-Diff `wordDiffSmart`). Kein Vokabel-Hinweis in der Auswertung.
- **Fehler-Nachdrill**: falsche Aufgaben werden wiederholt, bis richtig.
- **Tageslektion** (lesson.js): Grammatik-Wiederholung → adaptive Vokabel-
  Wiederholung (Leitner) → 5 neue Vokabeln + Abfrage → Übersetzungen mit diesen
  Vokabeln → „Sätze aus deinem Alltag" → Grammatik-Teil (bleibt 4 Tage gleich).
  Grammatik: **erst Regel erklären, dann üben**.
- **Enter** löst überall den primären CTA aus (zentraler Handler in app.js).
- **„Wort, das du nicht kennst?"**: deutsches Grundwort → Merkliste (Statistik);
  vorhandene Vokabel wird häufiger abgefragt (`window.Lektion.markUnknown`).
- **Fortschritt/Niveau**: Curriculum je Niveau; bei A2-Abschluss B1-Vorschlag.
  Grammatik-Rotation schließt niedrigere Niveaus mit ein.

## Inhalte pflegen
Neue Vokabeln/Module/Sätze in `data-lesson.js` bzw. `data.js` im gleichen Format
anhängen. In Erklärungen ist `**fett**` / `*kursiv*` erlaubt. Jedes Grammatik-
Modul: `{ id, title, cefr, rule, exercises:[{kind:"choice"|"fill", …}] }`.
Neue `theme`-Keys brauchen ein Label in `THEME_LABEL` (app.js).

## Prüfen vor Commit
- `node --check app.js lesson.js data.js data-lesson.js sw.js` (Syntax).
- Datenintegrität: keine doppelten IDs; jede `choice` hat `answer ∈ options`;
  jede `fill` hat `accept`; Curriculum-`moduleId`s existieren.
- Möglichst Browser-Smoke-Test (Playwright, Chromium unter `/opt/pw-browsers`),
  Viewport 390×844; auf `PAGEERR`/Konsolenfehler achten.
- **`sw.js` `CACHE`-Version erhöhen**, sonst lädt offline die alte Version.

## Deployment
Statisch über **GitHub Pages** (Repo ist public), Branch
`claude/mobile-app-development-mdtiph`, Ordner `/`. Nach Push ~1 Min live unter
`https://dillolivia-source.github.io/Italienisch-/`. `.nojekyll` liegt vor.

## Git
Entwicklung/Push auf Branch `claude/mobile-app-development-mdtiph`.
Commits/PRs ohne internen Modell-Identifier.
