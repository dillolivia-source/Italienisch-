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

## Offene Fragen an Olivia

- Welches **Niveau** ist deins (A1 / A2 / B1)? Oder soll die App es aus deinen
  Ergebnissen selbst einschätzen?
- Vokabeln: soll ich sie **automatisch aus deinen Sätzen** ziehen, oder lieferst
  du eine eigene Vokabelliste?
- Grammatik-Themen: soll ich ein **Starter-Set** bauen (Präpositionen +
  Konjugationen), oder hast du eigenes Material?
