# 📚 Konzept: Tägliche Lektion (Olivias Lernplan)

Festgehalten am 04.08.2026. Dieses Dokument beschreibt, wie die App zu einem
**strukturierten Tages-Lernprogramm** ausgebaut werden soll. Es ist die
Grundlage für die nächste Ausbaustufe – noch nicht umgesetzt.

## Grundidee

Beim Öffnen der App startet **eine Lektion pro Tag**. Die Lektion hat immer
denselben, festen Ablauf, damit Lernen zur Routine wird. Alles passt sich
**Olivias Niveau** an und **merkt sich, was sie kann und was nicht** – Leichtes
wird nicht endlos wiederholt, Schwieriges kommt öfter.

## Ablauf einer Lektion (immer gleiche Reihenfolge)

### 1. 🔁 Grammatik-Wiederholung der letzten Session
- Zu Beginn wird der **Grammatik-Stoff der vorigen Lektion** kurz wiederholt.
- Kurzer Recap der Regel + ein paar Übungen dazu.

### 2. 🗂️ Vokabel-Wiederholung (adaptiv)
- Wiederholt bekannte Vokabeln – aber **klug**:
  - Vokabeln, die Olivia schon **gut konnte**, werden **nicht** immer wieder
    dreimal abgefragt.
  - Der Fokus liegt auf den **schwierigen** Wörtern (zuletzt falsch / selten
    gekonnt).
- Prinzip: **Spaced Repetition** – jedes Wort hat einen „Beherrschungs-Level".
  Gut gekonnte Wörter rücken nach hinten, schwierige kommen häufig.

### 3. ✨ 5 neue Vokabeln einführen
- Pro Lektion werden **5 neue Vokabeln** vorgestellt (auf Olivias Niveau).
- Sie werden **direkt danach abgefragt**, damit sie gleich sitzen.

### 4. ✍️ Neue Übungsübersetzungen mit den neuen Vokabeln
- Neue Übersetzungssätze, in denen **genau diese 5 neuen Vokabeln** vorkommen.
- Immer **auf Olivias Niveau** (A1 / A2 / B1 …).

### 5. ❌➡️✅ Fehler-Nachdrill (nach jeder Aufgabe)
- Nach dem Abschluss **jeder** Aufgabe werden die **falschen** Antworten
  **erneut abgefragt** – so lange, **bis sie richtig** sind.
- Gilt für alle Teile (Vokabeln, Übersetzungen, Grammatik).

### 6. 🧩 Grammatik-Teil (üben)
- Ein Grammatik-Thema wie **Präpositionen, Konjugationen** usw. – auf Niveau.
- **Wichtig:** Dasselbe Grammatik-Thema bleibt **3–4 Tage lang gleich**, damit
  Olivia es wirklich einüben kann. Erst danach wechselt es zum nächsten Thema.
- Der jeweils aktuelle Grammatik-Teil ist es auch, der am nächsten Tag unter
  Punkt 1 („Wiederholung der letzten Session") wieder auftaucht.

## Was sich die App dauerhaft merken muss (lokal auf dem Handy)

- **Pro Vokabel:** Beherrschungs-Level, letzte Antwort, wann wieder fällig.
- **Pro Satz / Übung:** richtig/falsch, wie oft geübt.
- **Fehler-Liste der aktuellen Lektion** (für den Nachdrill).
- **Aktuelles Grammatik-Thema + an welchem Tag (1–4) es gerade ist.**
- **Welche Vokabeln schon „neu eingeführt" wurden** (damit jeden Tag wirklich
  5 *neue* kommen).
- **Datum der letzten Lektion** (damit „ein Tag = eine Lektion" funktioniert).
- **Olivias Niveau.**

## Noch benötigte Inhalte (damit das gebaut werden kann)

Der bisherige Datenbestand (60 Sätze + 20 Stolpersteine) reicht für den
**Ablauf**, aber für den vollen Plan fehlen noch zwei Bausteine:

1. **Vokabelliste** – für „5 neue Vokabeln pro Tag" braucht es eine Liste
   italienischer Wörter (mit deutscher Übersetzung, Niveau, evtl. Thema).
   → Kann aus den vorhandenen Sätzen gewonnen **oder** von Olivia geliefert werden.
2. **Grammatik-Module** – strukturierte Übungssets zu Themen wie Präpositionen,
   Konjugationen (-are/-ere/-ire), Passato Prossimo … je nach Niveau.
   → Teils aus den Stolpersteinen ableitbar; Konjugationen bräuchten eigene Daten.

## Systematische Stoff-Abdeckung & Niveau-Aufstieg (A2 → B1)

- Die App führt im Hintergrund ein **Protokoll**, welche offiziellen Themen
  eines Niveaus schon **gelernt** sind (Grammatik-Themen + Wortschatz).
- Ein **Lehrplan** (`curriculum` in `data-lesson.js`) listet die offiziellen
  A2- und B1-Themen. Jedes Thema ist entweder `ready` (Übungen vorhanden,
  zählt zum Fortschritt) oder `planned` (offiziell gelistet, Übungen folgen).
- Der **Fortschritt** wird im Lektion-Tab angezeigt: Balken für Grammatik &
  Wortschatz + Themenliste mit ✅ / ◻️ / ⏳.
- Ist A2 systematisch geschafft (alle `ready`-Themen gemeistert + ~90 % des
  Wortschatzes sitzt), schlägt die App vor: **„Du bist bereit für B1!"** – auf
  Knopfdruck laufen die Tageslektionen dann auf **B1-Niveau** (eigene
  B1-Grammatik & B1-Wortschatz). Ein manueller Niveau-Wechsel ist auch möglich.

## Umsetzungsstand (Stand 04.08.2026)

**Fertig & getestet:**
- Kompletter Lektionsablauf (Schritte 1–6) im neuen Tab **„Lektion"**.
- Adaptive Vokabel-Wiederholung (Spaced Repetition), 5 neue Vokabeln/Tag,
  Übersetzungen mit den neuen Vokabeln, **Fehler-Nachdrill bis richtig**.
- Grammatik-Rotation (ein Thema 4 Tage), Wiederholung des Vortags-Themas.
- Fortschritts-Protokoll, A2→B1-Vorschlag und Niveau-Wechsel.

**Auswertung bei Fehlern:**
- Bei falscher Eingabe zeigt die App **nur die falsche Stelle**: rot die eigene
  Eingabe, grün die richtige Lösung (Wort-Diff). Das gelernte Wort steht nicht
  mehr in der Auswertung.

**Unbekannte Wörter merken (offline, ohne API):**
- Bei jeder Übung gibt es das Feld „🤔 Wort, das du nicht kennst?". Dort das
  **deutsche Grundwort** eintippen (z. B. *packen*). Das Wort landet auf der
  **Lernliste** (Statistik-Tab). Ist es schon eine App-Vokabel, kommt es ab
  dann öfter dran; sonst wird es gemerkt und kann später mit Übersetzung
  ergänzt werden.

**Inhalts-Stand:** A2 vollständig (12 Grammatik-Module), B1 mit 10 Modulen,
86 Vokabeln inkl. B1. Weiterer Ausbau (mehr Wortschatz, B2) jederzeit in
`data-lesson.js` möglich.

## Offene Fragen an Olivia

- Welches **Niveau** ist deins (A1 / A2 / B1)? Oder soll die App es aus deinen
  Ergebnissen selbst einschätzen?
- Vokabeln: soll ich sie **automatisch aus deinen Sätzen** ziehen, oder lieferst
  du eine eigene Vokabelliste?
- Grammatik-Themen: soll ich ein **Starter-Set** bauen (Präpositionen +
  Konjugationen), oder hast du eigenes Material?
