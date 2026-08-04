# 🇮🇹 Olivias Italienisch-Trainer

Eine persönliche, **offline-fähige** Lern-App fürs Handy. Trainiert genau
Olivias eigene Stolpersteine und persönliche Übersetzungssätze (Reise,
Restaurant, Oma, Kleinkind, Strand …).

Kein App-Store nötig – läuft im Handy-Browser und kann als Icon auf den
Startbildschirm gelegt werden.

## Was die App kann

- **✍️ Übersetzen** – Deutscher Satz → du tippst die italienische Übersetzung.
  Automatische Prüfung (mit Nachsicht bei Akzenten/Tippfehlern), zeigt alle
  akzeptierten Lösungen und den Grammatik-Fokus. 60 persönliche Sätze.
- **🎯 Stolper-Quiz** – „Welcher Satz ist richtig?" Wähl die korrekte Variante,
  bekomm die Erklärung und die Stelle farbig hervorgehoben. 20 Stolpersteine.
- **📇 Karten** – Karteikarten zum Durchblättern und Nachlesen aller Regeln.
- **📊 Fortschritt** – Trefferquote, gemeisterte Einträge und deine größten
  Stolpersteine. Alles bleibt lokal auf deinem Handy (localStorage).

Schwierige/falsch beantwortete Einträge kommen häufiger dran.

## Auf dem Handy nutzen (offline)

1. Die App muss einmal über eine Web-Adresse (https) geöffnet werden – am
   einfachsten über **GitHub Pages** (siehe unten).
2. Seite im **Safari (iPhone)** oder **Chrome (Android)** öffnen.
3. Teilen-Menü → **„Zum Home-Bildschirm"** hinzufügen.
4. Ab jetzt startet die App wie eine echte App und **funktioniert offline**.

### GitHub Pages aktivieren (einmalig)

Im Repository unter **Settings → Pages**:
- **Source:** „Deploy from a branch"
- **Branch:** `claude/mobile-app-development-mdtiph` · Ordner `/ (root)`
- Speichern. Nach ~1 Minute ist die App unter
  `https://<dein-github-name>.github.io/Italienisch-/` erreichbar.

> Tipp: Zum Testen am Computer reicht auch ein lokaler Server, z. B.
> `python3 -m http.server` im Projektordner, dann `http://localhost:8000`.

## Neue Inhalte hinzufügen

Alles steht in **`data.js`**. Einfach einen neuen Eintrag im gleichen Format
an `stumblingBlocks` (Stolpersteine) oder `sentences` (Übersetzungssätze)
anhängen. In den Erklärungen wird `**fett**` und `*kursiv*` unterstützt.

## Dateien

| Datei | Zweck |
|-------|-------|
| `index.html` | Grundgerüst der App |
| `styles.css` | Design (hell/dunkel automatisch) |
| `app.js` | Logik: Übersetzen, Quiz, Karten, Fortschritt |
| `data.js` | **Deine Inhalte** – Stolpersteine & Sätze |
| `manifest.webmanifest` | App-Infos für „Zum Home-Bildschirm" |
| `sw.js` | Service Worker – macht die App offline nutzbar |
| `icon.svg` | App-Icon |

Kein Build, keine Abhängigkeiten – reines HTML/CSS/JavaScript.
