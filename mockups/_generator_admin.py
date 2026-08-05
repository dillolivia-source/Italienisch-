#!/usr/bin/env python3
# Generator fuer die restlichen Admin-Screens (app-artig, Rot/Serif)
import os, re
OUT = "/home/user/Italienisch-/mockups"

IC = {
 "dash":'<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>',
 "cal":'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
 "users":'<path d="M17 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9.5" cy="7" r="4"/>',
 "chat":'<path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>',
 "book":'<path d="M4 19.5V6a2 2 0 012-2h13v16H6a2 2 0 01-2-2.5z"/><path d="M9 4v16"/>',
 "mail":'<path d="M4 4h16v16H4z"/><path d="M4 7l8 6 8-6"/>',
 "edit":'<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"/>',
}

NAV = [
 ("uebersicht","Übersicht","admin-01-uebersicht.html","dash",""),
 ("veranstaltungen","Veranstaltungen","admin-03-veranstaltungen.html","cal",""),
 ("anmeldungen","Anmeldungen","admin-04-anmeldungen.html","users",'<span class="ndot"></span>'),
 ("nachrichten","Nachrichten","admin-05-nachrichten.html","chat",'<span class="nbadge">2</span>'),
 ("bereiche","Bereiche","admin-06-bereiche.html","book",""),
 ("newsletter","Newsletter","admin-07-newsletter.html","mail",""),
 ("inhalte","Inhalte & Texte","admin-08-inhalte.html","edit",""),
]

def nav(active):
    out=[]
    for key,label,href,icon,extra in NAV:
        on=' class="on"' if key==active else ''
        out.append(f'      <a{on} href="{href}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">{IC[icon]}</svg>{label} {extra}</a>')
    return "\n".join(out)

CSS = r"""
  :root{--bg:#f5f3f0;--panel:#fff;--ink:#241f1c;--soft:#6f665f;--line:#e8e2db;--red:#c42e38;--red-deep:#98202c;--red-tint:#fbeceb;--green:#2f7d4f;--green-tint:#e7f3ec;--amber:#b7791f;--amber-tint:#fbf1dd;--gold:#cf9a3f;--serif:"Iowan Old Style","Palatino Linotype",Georgia,serif;--sans:"Avenir Next","Segoe UI",system-ui,-apple-system,"Helvetica Neue",sans-serif}
  *{box-sizing:border-box}
  body{margin:0;background:var(--bg);color:var(--ink);font-family:var(--sans);-webkit-font-smoothing:antialiased}
  a{color:inherit;text-decoration:none}
  .app{display:grid;grid-template-columns:248px 1fr;min-height:100vh}
  .side{background:var(--panel);border-right:1px solid var(--line);padding:22px 16px;display:flex;flex-direction:column;gap:6px;position:sticky;top:0;height:100vh}
  .logo{font-family:var(--serif);font-size:1.25rem;color:var(--red);font-weight:600;padding:6px 10px 16px}
  .logo small{display:block;font-family:var(--sans);font-size:.66rem;letter-spacing:.18em;text-transform:uppercase;color:var(--soft);font-weight:700;margin-top:3px}
  .nav a{display:flex;align-items:center;gap:11px;padding:10px 12px;border-radius:11px;color:var(--soft);font-weight:600;font-size:.93rem}
  .nav a svg{width:19px;height:19px;flex:0 0 auto}
  .nav a:hover{background:var(--bg);color:var(--ink)}
  .nav a.on{background:var(--red-tint);color:var(--red-deep)}.nav a.on svg{color:var(--red)}
  .nbadge{margin-left:auto;background:var(--red);color:#fff;font-size:.7rem;font-weight:800;min-width:20px;height:20px;border-radius:999px;display:inline-grid;place-items:center;padding:0 5px}
  .ndot{margin-left:auto;width:8px;height:8px;border-radius:50%;background:var(--red)}
  .side .foot{margin-top:auto;border-top:1px solid var(--line);padding-top:14px;display:flex;align-items:center;gap:10px}
  .avatar{width:36px;height:36px;border-radius:50%;background:linear-gradient(140deg,var(--red),var(--gold));color:#fff;display:grid;place-items:center;font-weight:700}
  .side .foot .who{font-size:.86rem;font-weight:700}.side .foot .who small{display:block;color:var(--soft);font-weight:500;font-size:.76rem}

  .main{padding:26px 32px 60px;min-width:0}
  .top{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:22px;flex-wrap:wrap}
  .top h1{font-family:var(--serif);font-weight:500;font-size:1.9rem;margin:0}
  .top .sub{color:var(--soft);font-size:.9rem;margin-top:2px}
  .btn{display:inline-flex;align-items:center;justify-content:center;gap:.5em;padding:.7em 1.2em;border-radius:10px;font-weight:700;font-size:.9rem;border:1.5px solid transparent;cursor:pointer}
  .btn-red{background:var(--red);color:#fff}.btn-red:hover{background:var(--red-deep)}
  .btn-ghost{background:var(--panel);border-color:var(--line);color:var(--ink)}.btn-ghost:hover{border-color:var(--soft)}
  .btn-sm{padding:.5em .9em;font-size:.82rem}

  .tabs{display:flex;gap:8px;margin-bottom:18px}
  .tab{padding:.5em 1.1em;border-radius:999px;border:1px solid var(--line);font-size:.85rem;font-weight:700;color:var(--soft);cursor:pointer;background:#fff}
  .tab.on{background:var(--red);border-color:var(--red);color:#fff}

  .card{background:var(--panel);border:1px solid var(--line);border-radius:16px;overflow:hidden}
  .card+.card{margin-top:20px}
  .card .h{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid var(--line);gap:12px}
  .card .h h2{font-family:var(--serif);font-weight:500;font-size:1.15rem;margin:0}
  .card .h a{font-size:.82rem;color:var(--red);font-weight:700}
  .card .pad{padding:20px}

  table{width:100%;border-collapse:collapse;font-size:.9rem}
  th{text-align:left;font-size:.7rem;letter-spacing:.08em;text-transform:uppercase;color:var(--soft);padding:12px 20px;border-bottom:1px solid var(--line)}
  td{padding:13px 20px;border-bottom:1px solid var(--line);vertical-align:middle}
  tr:last-child td{border-bottom:0}
  .who2{font-weight:700}.who2 small{display:block;color:var(--soft);font-weight:500;font-size:.8rem}
  .tnum{font-variant-numeric:tabular-nums;color:var(--soft)}
  .rowlink{display:block;margin-top:5px;font-size:.72rem;font-weight:700;color:var(--red)}
  .pill{display:inline-flex;align-items:center;gap:.4em;font-size:.74rem;font-weight:700;padding:.28em .7em;border-radius:999px}
  .pill.ok{background:var(--green-tint);color:var(--green)}
  .pill.mail{background:var(--amber-tint);color:var(--amber)}
  .pill.manual{background:#eef0f2;color:#5a6470}
  .pill.pub{background:var(--green-tint);color:var(--green)}
  .pill.draft{background:#eef0f2;color:#5a6470}
  .pill.type{background:var(--red-tint);color:var(--red-deep)}
  .legend{display:flex;gap:16px;flex-wrap:wrap;padding:14px 20px;color:var(--soft);font-size:.8rem}
  .legend span{display:inline-flex;align-items:center;gap:.45em}
  .actions{display:flex;gap:8px;justify-content:flex-end}
  .lnk{color:var(--red);font-weight:700;font-size:.84rem}

  .field{margin-bottom:16px}
  label{display:block;font-size:.82rem;font-weight:700;margin-bottom:6px}
  input,select,textarea{width:100%;padding:.7em .85em;border:1px solid var(--line);border-radius:10px;font-size:.95rem;font-family:inherit;background:#fff;color:var(--ink)}
  .hint{font-size:.78rem;color:var(--soft);margin-top:5px}

  .grid2{display:grid;grid-template-columns:1fr 1fr;gap:20px}
  @media(max-width:1000px){.grid2{grid-template-columns:1fr}}

  /* Nachrichten */
  .msg{display:grid;grid-template-columns:auto 1fr auto;gap:14px;align-items:center;padding:16px 20px;border-bottom:1px solid var(--line)}
  .msg:last-child{border-bottom:0}
  .mdot{width:9px;height:9px;border-radius:50%;background:var(--red)}
  .mdot.read{background:transparent}
  .msg .txt b{font-weight:700}.msg.unread .txt b{color:var(--ink)}
  .msg .txt .ex{color:var(--soft);font-size:.86rem;margin-top:2px}
  .msg .txt .em{color:var(--soft);font-size:.78rem}

  /* Bereiche */
  .beritem{display:grid;grid-template-columns:auto 64px 1fr auto auto;gap:16px;align-items:center;padding:16px 20px;border-bottom:1px solid var(--line)}
  .beritem:last-child{border-bottom:0}
  .drag{color:#c9c0b6;cursor:grab;font-size:1.1rem}
  .berthumb{width:64px;height:48px;border-radius:10px;background:linear-gradient(150deg,var(--red-tint),#fff);border:1px solid var(--line);display:grid;place-items:center;color:var(--red);opacity:.8}
  .beritem .t{font-weight:700}.beritem .t small{display:block;color:var(--soft);font-weight:500;font-size:.82rem}
  .switch{position:relative;display:inline-block;width:44px;height:26px;flex:0 0 auto}
  .switch input{opacity:0;width:0;height:0}
  .switch .tk{position:absolute;inset:0;background:var(--line);border-radius:999px;transition:.2s;cursor:pointer}
  .switch .tk::before{content:"";position:absolute;top:3px;left:3px;width:20px;height:20px;background:#fff;border-radius:50%;transition:.2s;box-shadow:0 1px 2px rgba(0,0,0,.25)}
  .switch input:checked + .tk{background:var(--green)}
  .switch input:checked + .tk::before{transform:translateX(18px)}

  /* Newsletter Gruppen */
  .grp{display:flex;align-items:center;justify-content:space-between;padding:13px 0;border-top:1px solid var(--line)}
  .grp:first-child{border-top:0}
  .grp .n{font-weight:700}.grp .c{color:var(--soft);font-variant-numeric:tabular-nums}
  .bignum{font-size:2rem;font-weight:800;font-variant-numeric:tabular-nums}

  .note{margin-top:26px;font-size:.76rem;color:var(--soft);text-align:center;opacity:.8}
  @media(max-width:860px){.app{grid-template-columns:1fr}.side{position:static;height:auto}.hidecol{display:none}}
"""

SHELL = """<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Verwaltung — %%TITLE%% · Yoga des Singens</title>
<style>%%CSS%%</style>
</head>
<body>
<div class="app">
  <aside class="side">
    <div class="logo">Yoga des Singens<small>Verwaltung</small></div>
    <nav class="nav">
%%NAV%%
    </nav>
    <div class="foot"><div class="avatar">M</div><div class="who">Monia<small>Angemeldet</small></div></div>
  </aside>
  <main class="main">
%%MAIN%%
    <p class="note">Mockup mit Beispiel-Daten</p>
  </main>
</div>
</body>
</html>
"""

PAGES = {}

PAGES["admin-03-veranstaltungen.html"] = ("veranstaltungen","Veranstaltungen", """
    <div class="top"><div><h1>Veranstaltungen</h1><div class="sub">Alle Termine, Kurse und Serien</div></div><a href="admin-02-event-bearbeiten.html" class="btn btn-red">＋ Neue Veranstaltung</a></div>
    <div class="tabs"><span class="tab on">Kommend</span><span class="tab">Laufend</span><span class="tab">Rückblick</span></div>
    <div class="card"><div style="overflow-x:auto"><table>
      <thead><tr><th>Titel</th><th>Typ</th><th>Datum</th><th>Anmeldungen</th><th>Status</th><th></th></tr></thead>
      <tbody>
        <tr><td class="who2">Offener Singabend</td><td><span class="pill type">Einzeltermin</span></td><td class="tnum">18. Jan 2026</td><td class="tnum"><b>14</b> / 25</td><td><span class="pill pub">Veröffentlicht</span></td><td class="actions"><a class="lnk" href="admin-04-anmeldungen.html">Anmeldungen</a><a class="lnk" href="admin-02-event-bearbeiten.html">Bearbeiten</a></td></tr>
        <tr><td class="who2">Bildungswoche: Stress bewältigen</td><td><span class="pill type">Mehrtägig</span></td><td class="tnum">06.–10. Juli 2026</td><td class="tnum"><b>9</b> / 12</td><td><span class="pill pub">Veröffentlicht</span></td><td class="actions"><a class="lnk" href="admin-04-anmeldungen.html">Anmeldungen</a><a class="lnk" href="admin-02-event-bearbeiten.html">Bearbeiten</a></td></tr>
        <tr><td class="who2">Körper – Stimme – Klang</td><td><span class="pill type">Mehrtägig</span></td><td class="tnum">13.–17. Juli 2026</td><td class="tnum"><b>4</b> / 12</td><td><span class="pill pub">Veröffentlicht</span></td><td class="actions"><a class="lnk" href="admin-04-anmeldungen.html">Anmeldungen</a><a class="lnk" href="admin-02-event-bearbeiten.html">Bearbeiten</a></td></tr>
        <tr><td class="who2">Kundalini Yoga am Morgen</td><td><span class="pill type">Serie</span></td><td class="tnum">wöchentlich · Di</td><td class="tnum">—</td><td><span class="pill pub">Veröffentlicht</span></td><td class="actions"><a class="lnk" href="admin-04-anmeldungen.html">Anmeldungen</a><a class="lnk" href="admin-02-event-bearbeiten.html">Bearbeiten</a></td></tr>
        <tr><td class="who2">Neuer Singkreis</td><td><span class="pill type">Einzeltermin</span></td><td class="tnum">22. Feb 2026</td><td class="tnum">0</td><td><span class="pill draft">Entwurf</span></td><td class="actions"><a class="lnk" href="admin-02-event-bearbeiten.html">Bearbeiten</a></td></tr>
      </tbody></table></div></div>
""")

PAGES["admin-04-anmeldungen.html"] = ("anmeldungen","Anmeldungen", """
    <div class="top"><div><h1>Anmeldungen</h1><div class="sub">Wer ist wofür angemeldet</div></div><div style="display:flex;gap:10px;flex-wrap:wrap"><a class="btn btn-ghost btn-sm" href="#">＋ Anmeldung hinzufügen</a><a class="btn btn-red btn-sm" href="#">✉ Allen schreiben</a></div></div>
    <div class="field" style="max-width:380px"><label>Veranstaltung</label><select><option>Offener Singabend — 14 / 25</option><option>Bildungswoche: Stress bewältigen — 9 / 12</option><option>Körper – Stimme – Klang — 4 / 12</option></select></div>
    <div class="card">
      <div class="h"><h2>Offener Singabend · 14 / 25 Angemeldete</h2><a href="#">Exportieren ⭳</a></div>
      <div style="overflow-x:auto"><table>
        <thead><tr><th>Name</th><th class="hidecol">Telefon</th><th class="hidecol">Nachricht</th><th>Angemeldet</th><th>Status</th></tr></thead>
        <tbody>
          <tr><td class="who2">Anna Bergmann<small>anna.bergmann@email.de</small></td><td class="hidecol tnum">0176 …</td><td class="hidecol" style="color:var(--soft)">Freue mich sehr!</td><td class="tnum">04.08. · 19:12</td><td><span class="pill ok">✓ gespeichert</span></td></tr>
          <tr><td class="who2">Lea Hoffmann<small>lea.h@email.de</small></td><td class="hidecol tnum">—</td><td class="hidecol" style="color:var(--soft)">2 Personen</td><td class="tnum">03.08. · 21:05</td><td><span class="pill ok">✓ gespeichert</span></td></tr>
          <tr><td class="who2">Maria Sonntag<small>telefonisch angemeldet</small></td><td class="hidecol tnum">030 …</td><td class="hidecol" style="color:var(--soft)">—</td><td class="tnum">03.08. · 14:10</td><td><span class="pill manual">✎ manuell</span></td></tr>
          <tr><td class="who2">Peter Klein<small>peter.klein@email.de</small></td><td class="hidecol tnum">—</td><td class="hidecol" style="color:var(--soft)">—</td><td class="tnum">03.08. · 08:22</td><td><span class="pill mail">⚠ nur per E-Mail</span><a href="#" class="rowlink">In Liste übernehmen →</a></td></tr>
        </tbody></table></div>
      <div class="legend"><span><span class="pill ok">✓ gespeichert</span> sicher in der Liste</span><span><span class="pill manual">✎ manuell</span> von Hand (z. B. telefonisch)</span><span><span class="pill mail">⚠ nur per E-Mail</span> 1 Klick zum Nachtragen</span></div>
    </div>
""")

PAGES["admin-05-nachrichten.html"] = ("nachrichten","Nachrichten", """
    <div class="top"><div><h1>Nachrichten</h1><div class="sub">Anfragen über das Kontaktformular</div></div></div>
    <div class="card">
      <div class="msg unread"><span class="mdot"></span><div class="txt"><b>Sabine Vogel</b> <span class="em">· sabine.vogel@email.de</span><div class="ex">Hallo Monia, kann man beim Singabend auch als Anfängerin ohne Erfahrung …</div></div><div style="text-align:right"><div class="tnum" style="font-size:.8rem">vor 2 Std.</div><a class="lnk" href="#">Antworten</a></div></div>
      <div class="msg unread"><span class="mdot"></span><div class="txt"><b>Thomas Reh</b> <span class="em">· t.reh@email.de</span><div class="ex">Frage zur Bildungswoche: Gibt es Übernachtungsmöglichkeiten in der Nähe?</div></div><div style="text-align:right"><div class="tnum" style="font-size:.8rem">gestern</div><a class="lnk" href="#">Antworten</a></div></div>
      <div class="msg"><span class="mdot read"></span><div class="txt"><b style="font-weight:600;color:var(--soft)">Klara Loos</b> <span class="em">· klara@email.de</span><div class="ex">Vielen Dank für den wunderschönen Abend – es war so berührend!</div></div><div style="text-align:right"><div class="tnum" style="font-size:.8rem">01.08.</div><a class="lnk" href="#">Antworten</a></div></div>
      <div class="msg"><span class="mdot read"></span><div class="txt"><b style="font-weight:600;color:var(--soft)">Michael Bauer</b> <span class="em">· m.bauer@email.de</span><div class="ex">Bietest du auch Einzelbegleitung im Raum Prenzlau an?</div></div><div style="text-align:right"><div class="tnum" style="font-size:.8rem">28.07.</div><a class="lnk" href="#">Antworten</a></div></div>
    </div>
""")

PAGES["admin-06-bereiche.html"] = ("bereiche","Bereiche", """
    <div class="top"><div><h1>Bereiche</h1><div class="sub">Deine Angebote – jeder Bereich hat eine eigene Seite mit Foto-Karussell</div></div><a class="btn btn-red" href="#">＋ Neuer Bereich</a></div>
    <div class="card">
      <div class="beritem"><span class="drag">⠿</span><div class="berthumb">♪</div><div class="t">Kraft des Singens<small>5 Fotos · Singkreise, Wandersingen, Rituale …</small></div><label class="switch"><input type="checkbox" checked><span class="tk"></span></label><a class="lnk" href="detail-bereich-kraft-des-singens.html">Bearbeiten</a></div>
      <div class="beritem"><span class="drag">⠿</span><div class="berthumb">☯</div><div class="t">Kundalini Yoga<small>3 Fotos · wöchentliche Kurse &amp; Workshops</small></div><label class="switch"><input type="checkbox" checked><span class="tk"></span></label><a class="lnk" href="#">Bearbeiten</a></div>
      <div class="beritem"><span class="drag">⠿</span><div class="berthumb">≈</div><div class="t">Breathwalking<small>2 Fotos · Atem, Gehen &amp; Achtsamkeit</small></div><label class="switch"><input type="checkbox" checked><span class="tk"></span></label><a class="lnk" href="#">Bearbeiten</a></div>
      <div class="beritem"><span class="drag">⠿</span><div class="berthumb">⌂</div><div class="t">Bildungswochen<small>4 Fotos · mehrtägige Bildungsurlaube</small></div><label class="switch"><input type="checkbox" checked><span class="tk"></span></label><a class="lnk" href="#">Bearbeiten</a></div>
      <div class="beritem"><span class="drag">⠿</span><div class="berthumb">✈</div><div class="t">Yoga- &amp; Singreisen<small>3 Fotos · gemeinsam unterwegs</small></div><label class="switch"><input type="checkbox"><span class="tk"></span></label><a class="lnk" href="#">Bearbeiten</a></div>
    </div>
    <p class="hint" style="margin-top:12px">Tipp: Reihenfolge per ⠿ ziehen · Schalter = auf der Website sichtbar/verborgen.</p>
""")

PAGES["admin-07-newsletter.html"] = ("newsletter","Newsletter", """
    <div class="top"><div><h1>Newsletter</h1><div class="sub">290 Abonnenten</div></div><a class="btn btn-red" href="#">✎ Newsletter erstellen</a></div>
    <div class="grid2">
      <div class="card"><div class="h"><h2>Gruppen</h2><a href="#">＋ Gruppe</a></div><div class="pad" style="padding-top:6px">
        <div class="grp"><span class="n">Singen</span><span class="c">180 Abonnenten</span></div>
        <div class="grp"><span class="n">Yoga</span><span class="c">152 Abonnenten</span></div>
        <div class="grp"><span class="n" style="color:var(--soft)">Alle</span><span class="c">290 Abonnenten</span></div>
        <p class="hint">Beim Anmelden wählen Besucher ihre Interessen – du sendest gezielt an die passende Gruppe.</p>
      </div></div>
      <div class="card"><div class="h"><h2>Schnellstart</h2></div><div class="pad">
        <label>Aus einer Veranstaltung erstellen</label>
        <select style="margin-bottom:12px"><option>Offener Singabend</option><option>Bildungswoche: Stress bewältigen</option></select>
        <a class="btn btn-red" href="#" style="width:100%">✎ Newsletter vorbereiten</a>
        <p class="hint">Foto &amp; Einladungstext der Veranstaltung sind schon drin – du passt sie nur an.</p>
      </div></div>
    </div>
    <div class="card"><div class="h"><h2>Versendete Newsletter</h2></div><div style="overflow-x:auto"><table>
      <thead><tr><th>Betreff</th><th>Gruppe</th><th>Datum</th><th>Empfänger</th><th>Öffnungsrate</th></tr></thead>
      <tbody>
        <tr><td class="who2">Singen zur Sonnenwende</td><td>Alle</td><td class="tnum">28.06.2026</td><td class="tnum">264</td><td><b>61 %</b></td></tr>
        <tr><td class="who2">Neue Singkreise im Mai</td><td>Singen</td><td class="tnum">12.05.2026</td><td class="tnum">178</td><td><b>58 %</b></td></tr>
        <tr><td class="who2">Yoga-Workshop Ostern</td><td>Yoga</td><td class="tnum">20.03.2026</td><td class="tnum">150</td><td><b>63 %</b></td></tr>
      </tbody></table></div></div>
""")

PAGES["admin-08-inhalte.html"] = ("inhalte","Inhalte & Texte", """
    <div class="top"><div><h1>Inhalte &amp; Texte</h1><div class="sub">Feste Texte der Website bearbeiten</div></div></div>
    <div class="card">
      <div class="beritem" style="grid-template-columns:1fr auto"><div class="t">Startseite – Begrüßung<small>„Ich bin Monia und ich liebe Singen und Yoga …"</small></div><a class="lnk" href="#">Bearbeiten</a></div>
      <div class="beritem" style="grid-template-columns:1fr auto"><div class="t">Über mich<small>Werdegang, Motivation, Ausbildungen</small></div><a class="lnk" href="#">Bearbeiten</a></div>
      <div class="beritem" style="grid-template-columns:1fr auto"><div class="t">Stimmen (Teilnehmerstimmen)<small>3 Einträge · Zitate mit Vorname &amp; Ort</small></div><a class="lnk" href="#">Verwalten</a></div>
      <div class="beritem" style="grid-template-columns:1fr auto"><div class="t">Kontakt<small>E-Mail, Region, Kontaktformular-Text</small></div><a class="lnk" href="#">Bearbeiten</a></div>
      <div class="beritem" style="grid-template-columns:1fr auto"><div class="t">Impressum<small>Pflichtangaben</small></div><a class="lnk" href="#">Bearbeiten</a></div>
      <div class="beritem" style="grid-template-columns:1fr auto"><div class="t">Datenschutzerklärung<small>Pflichtangaben</small></div><a class="lnk" href="#">Bearbeiten</a></div>
    </div>
    <div class="card"><div class="h"><h2>Stimmen</h2><a href="#">＋ Stimme hinzufügen</a></div>
      <div class="beritem" style="grid-template-columns:1fr auto auto"><div class="t">„Ich habe mich zum ersten Mal seit Jahren getraut zu singen …"<small>— Teilnehmerin, Singkreis Uckermark</small></div><label class="switch"><input type="checkbox" checked><span class="tk"></span></label><a class="lnk" href="#">Bearbeiten</a></div>
      <div class="beritem" style="grid-template-columns:1fr auto auto"><div class="t">„Nach der Bildungswoche ging ich ruhiger und klarer …"<small>— Teilnehmer, Bildungsurlaub Gerswalde</small></div><label class="switch"><input type="checkbox" checked><span class="tk"></span></label><a class="lnk" href="#">Bearbeiten</a></div>
    </div>
""")

for fname,(active,title,main) in PAGES.items():
    html = SHELL.replace("%%TITLE%%",title).replace("%%CSS%%",CSS).replace("%%NAV%%",nav(active)).replace("%%MAIN%%",main)
    open(os.path.join(OUT,fname),"w",encoding="utf-8").write(html)
    print(fname, "->", html.count("%%"), "offene Platzhalter")

# Nav-Links in admin-01 und admin-02 auf die neuen Seiten zeigen lassen
linkmap = {"Übersicht":"admin-01-uebersicht.html","Veranstaltungen":"admin-03-veranstaltungen.html","Anmeldungen":"admin-04-anmeldungen.html","Nachrichten":"admin-05-nachrichten.html","Bereiche":"admin-06-bereiche.html","Newsletter":"admin-07-newsletter.html","Inhalte &amp; Texte":"admin-08-inhalte.html"}
for f in ["admin-01-uebersicht.html","admin-02-event-bearbeiten.html"]:
    p=os.path.join(OUT,f); s=open(p,encoding="utf-8").read()
    for label,href in linkmap.items():
        # ersetze href der Nav-Anker (die auf # oder auf den alten Editor zeigen) anhand des Labels
        s=re.sub(r'<a href="(?:#|admin-02-event-bearbeiten\.html)">((?:(?!</a>).)*?</svg>\s*'+re.escape(label)+r')', r'<a href="'+href+r'">\1', s, count=1)
    open(p,"w",encoding="utf-8").write(s)
    print("patched nav:",f)
print("fertig")
