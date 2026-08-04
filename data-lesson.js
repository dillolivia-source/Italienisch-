/*
 * Zusatz-Daten für die Tageslektion:
 *  - vocab: Vokabeln (mit Beispielsatz, der als Übungsübersetzung dient)
 *  - grammarModules: Grammatik-Themen mit Regel + Übungen
 *
 * Du kannst hier jederzeit ergänzen. Neue Vokabeln kommen im Lernplan
 * automatisch als „5 neue pro Tag" dran (in der Reihenfolge dieser Liste,
 * gefiltert nach deinem Niveau).
 */
window.LESSON_DATA = {
  /* ---------------- VOKABELN ----------------
   * it: italienisch (mit Artikel, wo sinnvoll)
   * de: deutsch
   * cefr: Niveau (A1/A2/B1) – wird gegen dein Niveau gefiltert
   * ex: Beispielsatz, der als Übungsübersetzung genutzt wird (de → it[])
   */
  vocab: [
    // --- Reise ---
    { id: "v001", it: "il treno", de: "der Zug", cefr: "A1", theme: "travel", ex: { de: "Wir nehmen den Zug nach Rom.", it: ["Prendiamo il treno per Roma."] } },
    { id: "v002", it: "l'aereo", de: "das Flugzeug", cefr: "A2", theme: "travel", ex: { de: "Das Flugzeug fliegt nach Italien.", it: ["L'aereo vola in Italia."] } },
    { id: "v003", it: "la valigia", de: "der Koffer", cefr: "A2", theme: "travel", ex: { de: "Ich packe den Koffer.", it: ["Preparo la valigia.", "Faccio la valigia."] } },
    { id: "v004", it: "il biglietto", de: "das Ticket / die Fahrkarte", cefr: "A2", theme: "travel", ex: { de: "Wir kaufen die Fahrkarten.", it: ["Compriamo i biglietti."] } },
    { id: "v005", it: "la stazione", de: "der Bahnhof", cefr: "A2", theme: "travel", ex: { de: "Der Bahnhof ist in der Nähe.", it: ["La stazione è vicina.", "La stazione è vicino."] } },
    { id: "v006", it: "partire", de: "abfahren / abreisen", cefr: "A2", theme: "travel", ex: { de: "Morgen reisen wir ab.", it: ["Domani partiamo."] } },
    { id: "v007", it: "arrivare", de: "ankommen", cefr: "A1", theme: "travel", ex: { de: "Wir kommen am Abend an.", it: ["Arriviamo la sera."] } },

    // --- Restaurant / Essen ---
    { id: "v008", it: "il conto", de: "die Rechnung", cefr: "A2", theme: "restaurant", ex: { de: "Die Rechnung, bitte!", it: ["Il conto, per favore!"] } },
    { id: "v009", it: "il cameriere", de: "der Kellner", cefr: "A2", theme: "restaurant", ex: { de: "Der Kellner bringt das Wasser.", it: ["Il cameriere porta l'acqua."] } },
    { id: "v010", it: "ordinare", de: "bestellen", cefr: "A2", theme: "restaurant", ex: { de: "Wir bestellen eine Pizza.", it: ["Ordiniamo una pizza."] } },
    { id: "v011", it: "l'acqua", de: "das Wasser", cefr: "A1", theme: "food", ex: { de: "Ich trinke Wasser.", it: ["Bevo l'acqua.", "Bevo acqua."] } },
    { id: "v012", it: "il pane", de: "das Brot", cefr: "A1", theme: "food", ex: { de: "Das Brot ist frisch.", it: ["Il pane è fresco."] } },
    { id: "v013", it: "la colazione", de: "das Frühstück", cefr: "A2", theme: "food", ex: { de: "Wir frühstücken zusammen.", it: ["Facciamo colazione insieme."] } },
    { id: "v014", it: "il pranzo", de: "das Mittagessen", cefr: "A2", theme: "food", ex: { de: "Das Mittagessen ist um eins.", it: ["Il pranzo è all'una."] } },
    { id: "v015", it: "la cena", de: "das Abendessen", cefr: "A2", theme: "food", ex: { de: "Das Abendessen ist fertig.", it: ["La cena è pronta."] } },
    { id: "v016", it: "avere fame", de: "Hunger haben", cefr: "A2", theme: "food", ex: { de: "Das Baby hat Hunger.", it: ["Il bambino ha fame."] } },
    { id: "v017", it: "avere sete", de: "Durst haben", cefr: "A2", theme: "food", ex: { de: "Ich habe Durst.", it: ["Ho sete."] } },

    // --- Familie / Oma ---
    { id: "v018", it: "la nonna", de: "die Oma", cefr: "A1", theme: "family", ex: { de: "Die Oma wohnt in Bologna.", it: ["La nonna abita a Bologna."] } },
    { id: "v019", it: "il nonno", de: "der Opa", cefr: "A1", theme: "family", ex: { de: "Der Opa liest eine Zeitung.", it: ["Il nonno legge un giornale."] } },
    { id: "v020", it: "la suocera", de: "die Schwiegermutter", cefr: "A2", theme: "family", ex: { de: "Meine Schwiegermutter kocht gut.", it: ["Mia suocera cucina bene."] } },
    { id: "v021", it: "i genitori", de: "die Eltern", cefr: "A2", theme: "family", ex: { de: "Meine Eltern kommen morgen.", it: ["I miei genitori vengono domani."] } },
    { id: "v022", it: "la sorella", de: "die Schwester", cefr: "A1", theme: "family", ex: { de: "Meine Schwester wohnt in Rom.", it: ["Mia sorella abita a Roma."] } },
    { id: "v023", it: "il marito", de: "der Ehemann", cefr: "A2", theme: "family", ex: { de: "Mein Mann arbeitet viel.", it: ["Mio marito lavora molto."] } },
    { id: "v024", it: "abbracciare", de: "umarmen", cefr: "A2", theme: "family", ex: { de: "Die Oma umarmt das Baby.", it: ["La nonna abbraccia il bambino."] } },

    // --- Kleinkind ---
    { id: "v025", it: "il passeggino", de: "der Kinderwagen", cefr: "A2", theme: "baby", ex: { de: "Der Kinderwagen ist im Auto.", it: ["Il passeggino è in macchina."] } },
    { id: "v026", it: "il pannolino", de: "die Windel", cefr: "A2", theme: "baby", ex: { de: "Wir wechseln die Windel.", it: ["Cambiamo il pannolino."] } },
    { id: "v027", it: "il seggiolone", de: "der Hochstuhl", cefr: "A2", theme: "baby", ex: { de: "Das Baby sitzt im Hochstuhl.", it: ["Il bambino è seduto nel seggiolone."] } },
    { id: "v028", it: "dormire", de: "schlafen", cefr: "A1", theme: "baby", ex: { de: "Das Baby schläft am Nachmittag.", it: ["Il bambino dorme il pomeriggio."] } },
    { id: "v029", it: "piangere", de: "weinen", cefr: "A2", theme: "baby", ex: { de: "Das Baby weint nachts.", it: ["Il bambino piange di notte."] } },
    { id: "v030", it: "giocare", de: "spielen", cefr: "A1", theme: "baby", ex: { de: "Wir spielen mit dem Baby.", it: ["Giochiamo con il bambino."] } },
    { id: "v031", it: "il giocattolo", de: "das Spielzeug", cefr: "A2", theme: "baby", ex: { de: "Das Spielzeug ist auf dem Boden.", it: ["Il giocattolo è per terra."] } },

    // --- Strand ---
    { id: "v032", it: "la spiaggia", de: "der Strand", cefr: "A1", theme: "beach", ex: { de: "Wir gehen an den Strand.", it: ["Andiamo in spiaggia.", "Andiamo alla spiaggia."] } },
    { id: "v033", it: "il mare", de: "das Meer", cefr: "A1", theme: "beach", ex: { de: "Das Meer ist warm.", it: ["Il mare è caldo."] } },
    { id: "v034", it: "l'ombrellone", de: "der Sonnenschirm", cefr: "A2", theme: "beach", ex: { de: "Der Sonnenschirm ist auf dem Sand.", it: ["L'ombrellone è sulla sabbia."] } },
    { id: "v035", it: "la sabbia", de: "der Sand", cefr: "A2", theme: "beach", ex: { de: "Das Baby spielt im Sand.", it: ["Il bambino gioca sulla sabbia."] } },
    { id: "v036", it: "il costume da bagno", de: "der Badeanzug", cefr: "A2", theme: "beach", ex: { de: "Ich suche den Badeanzug.", it: ["Cerco il costume da bagno."] } },
    { id: "v037", it: "la crema solare", de: "die Sonnencreme", cefr: "A2", theme: "beach", ex: { de: "Wir brauchen Sonnencreme.", it: ["Abbiamo bisogno della crema solare."] } },
    { id: "v038", it: "nuotare", de: "schwimmen", cefr: "A2", theme: "beach", ex: { de: "Am Meer schwimmen wir jeden Tag.", it: ["Al mare nuotiamo ogni giorno."] } },

    // --- Alltag / Zuhause ---
    { id: "v039", it: "la casa", de: "das Haus / Zuhause", cefr: "A1", theme: "home", ex: { de: "Ich bin zu Hause.", it: ["Sono a casa."] } },
    { id: "v040", it: "la cucina", de: "die Küche", cefr: "A1", theme: "home", ex: { de: "Die Küche ist klein.", it: ["La cucina è piccola."] } },
    { id: "v041", it: "cucinare", de: "kochen", cefr: "A1", theme: "home", ex: { de: "Heute Abend koche ich.", it: ["Stasera cucino."] } },
    { id: "v042", it: "il bucato", de: "die Wäsche", cefr: "B1", theme: "home", ex: { de: "Ich kümmere mich um die Wäsche.", it: ["Mi occupo del bucato."] } },
    { id: "v043", it: "pulire", de: "putzen / sauber machen", cefr: "A2", theme: "home", ex: { de: "Wir putzen das Haus.", it: ["Puliamo la casa."] } },
    { id: "v044", it: "comprare", de: "kaufen", cefr: "A1", theme: "shopping", ex: { de: "Ich kaufe das Brot.", it: ["Compro il pane."] } },
    { id: "v045", it: "il negozio", de: "das Geschäft / der Laden", cefr: "A2", theme: "shopping", ex: { de: "Der Laden ist geschlossen.", it: ["Il negozio è chiuso."] } },

    // --- Zeit / Gefühle / Wetter ---
    { id: "v046", it: "oggi", de: "heute", cefr: "A1", theme: "time", ex: { de: "Heute bleiben wir zu Hause.", it: ["Oggi restiamo a casa.", "Oggi rimaniamo a casa."] } },
    { id: "v047", it: "domani", de: "morgen", cefr: "A1", theme: "time", ex: { de: "Morgen fahren wir ans Meer.", it: ["Domani andiamo al mare."] } },
    { id: "v048", it: "stanco", de: "müde", cefr: "A1", theme: "emotions", ex: { de: "Ich bin müde.", it: ["Sono stanca.", "Sono stanco."] } },
    { id: "v049", it: "felice", de: "glücklich", cefr: "A1", theme: "emotions", ex: { de: "Das Baby ist glücklich.", it: ["Il bambino è felice."] } },
    { id: "v050", it: "fa caldo", de: "es ist warm", cefr: "A1", theme: "weather", ex: { de: "Heute ist es warm.", it: ["Oggi fa caldo."] } },
    { id: "v051", it: "fa freddo", de: "es ist kalt", cefr: "A1", theme: "weather", ex: { de: "Am Morgen ist es kalt.", it: ["La mattina fa freddo."] } },
    { id: "v052", it: "piove", de: "es regnet", cefr: "A2", theme: "weather", ex: { de: "Heute regnet es.", it: ["Oggi piove."] } }
  ],

  /* ---------------- GRAMMATIK-MODULE ----------------
   * Jedes Modul bleibt 3–4 Tage lang aktiv (Rotation im Lernplan).
   * exercises:
   *   kind "choice": prompt + options[] + answer (Text) + explain
   *   kind "fill":   prompt (mit ___) + accept[] (richtige Lösungen) + explain
   */
  grammarModules: [
    {
      id: "g_prep_a_in",
      title: "Präpositionen: a / in bei Orten",
      cefr: "A2",
      rule: "**a** bei **Städten**: *a Bologna, a Roma, a Milano*.\n**in** bei **Ländern & Regionen**: *in Italia, in Sardegna, in Toscana*.\nBei Verkehrsmitteln: **in** → *in macchina, in treno, in aereo*.",
      exercises: [
        { kind: "choice", prompt: "Arriviamo ___ Bologna.", options: ["a", "in"], answer: "a", explain: "Städte → **a**." },
        { kind: "choice", prompt: "Andiamo ___ Sardegna.", options: ["a", "in", "alla"], answer: "in", explain: "Regionen → **in** (ohne Artikel)." },
        { kind: "choice", prompt: "Sabato arriviamo ___ Italia.", options: ["a", "in"], answer: "in", explain: "Länder → **in**." },
        { kind: "choice", prompt: "Andiamo ___ macchina a Bologna.", options: ["con", "in"], answer: "in", explain: "Verkehrsmittel → **in macchina**." },
        { kind: "fill", prompt: "Abitiamo ___ Roma. (in einer Stadt)", accept: ["a"], explain: "Stadt → a Roma." },
        { kind: "choice", prompt: "Partiamo ___ la Sardegna.", options: ["in", "per"], answer: "per", explain: "*partire per + Ort*: **per la Sardegna** (mit Artikel)." },
        { kind: "fill", prompt: "Vado ___ treno. (Verkehrsmittel)", accept: ["in"], explain: "in treno, in aereo, in macchina." },
        { kind: "choice", prompt: "Passiamo l'estate ___ Toscana.", options: ["a", "in"], answer: "in", explain: "Region → in Toscana." }
      ]
    },
    {
      id: "g_prep_da_di",
      title: "Präpositionen: da / di",
      cefr: "A2",
      rule: "**da** = Herkunft/Ursprung ('von, aus') und 'zu jemandem': *vengo **da** Bologna, vado **dal** medico, dai nonni*.\n**di** = Zugehörigkeit ('von jemandem'): *la macchina **di** mia suocera*.",
      exercises: [
        { kind: "choice", prompt: "Vengo ___ Bologna.", options: ["da", "di"], answer: "da", explain: "Herkunft → **da**." },
        { kind: "choice", prompt: "Questa è la macchina ___ mia suocera.", options: ["da", "di"], answer: "di", explain: "Zugehörigkeit → **di**." },
        { kind: "choice", prompt: "Il bambino gattona ___ nonna.", options: ["dalla", "della"], answer: "dalla", explain: "'zur Oma hin' → da+la = **dalla**." },
        { kind: "choice", prompt: "Vado ___ medico.", options: ["dal", "al", "del"], answer: "dal", explain: "'zum Arzt' (zu einer Person) → da+il = **dal**." },
        { kind: "fill", prompt: "Restiamo due giorni ___ nonni. (bei den Großeltern)", accept: ["dai"], explain: "bei jemandem → da+i = dai nonni." },
        { kind: "choice", prompt: "È il giocattolo ___ bambino.", options: ["del", "dal"], answer: "del", explain: "Zugehörigkeit → di+il = **del**." }
      ]
    },
    {
      id: "g_conj_are",
      title: "Konjugation: regelmäßige -are Verben (Präsens)",
      cefr: "A2",
      rule: "Endungen von **-are** Verben (parlare):\nio parl**o** · tu parl**i** · lui/lei parl**a** · noi parl**iamo** · voi parl**ate** · loro parl**ano**.\nAchtung 3. Pl.: **-ano** (costano, mangiano, giocano).",
      exercises: [
        { kind: "fill", prompt: "Noi ___ (mangiare) la pasta.", accept: ["mangiamo"], explain: "noi → -iamo." },
        { kind: "fill", prompt: "Il bambino ___ (giocare) con la palla.", accept: ["gioca"], explain: "lui/lei → -a." },
        { kind: "choice", prompt: "Quanto ___ le scarpe?", options: ["costa", "costano", "costane"], answer: "costano", explain: "loro (le scarpe) → **-ano**." },
        { kind: "fill", prompt: "Io ___ (parlare) italiano.", accept: ["parlo"], explain: "io → -o." },
        { kind: "fill", prompt: "Tu ___ (abitare) a Roma?", accept: ["abiti"], explain: "tu → -i." },
        { kind: "choice", prompt: "I nonni ___ in Italia.", options: ["abita", "abitano"], answer: "abitano", explain: "loro → -ano." },
        { kind: "fill", prompt: "Noi ___ (cucinare) stasera.", accept: ["cuciniamo"], explain: "noi → -iamo." }
      ]
    },
    {
      id: "g_conj_ere_ire",
      title: "Konjugation: -ere / -ire Verben (Präsens)",
      cefr: "A2",
      rule: "**-ere** (prendere): prend**o**, prend**i**, prend**e**, prend**iamo**, prend**ete**, prend**ono**.\n**-ire** (dormire): dorm**o**, dorm**i**, dorm**e**, dorm**iamo**, dorm**ite**, dorm**ono**.\nEinige -ire mit **-isc-**: capire → cap**isco**, cap**isci**, cap**isce**.",
      exercises: [
        { kind: "fill", prompt: "Noi ___ (prendere) il treno.", accept: ["prendiamo"], explain: "noi -ere → -iamo." },
        { kind: "fill", prompt: "Il bambino ___ (dormire) tutto il giorno.", accept: ["dorme"], explain: "lui/lei -ire → -e." },
        { kind: "choice", prompt: "Loro ___ (dormire) bene.", options: ["dormono", "dormano", "dorme"], answer: "dormono", explain: "loro -ire → **-ono**." },
        { kind: "fill", prompt: "Io ___ (prendere) un caffè.", accept: ["prendo"], explain: "io -ere → -o." },
        { kind: "choice", prompt: "Non ___ (capire) — puoi ripetere?", options: ["capo", "capisco", "capisce"], answer: "capisco", explain: "capire ist -isc-: io **capisco**." },
        { kind: "fill", prompt: "Voi ___ (partire) domani.", accept: ["partite"], explain: "voi -ire → -ite." }
      ]
    },
    {
      id: "g_passato_prossimo",
      title: "Passato Prossimo (Vergangenheit)",
      cefr: "A2",
      rule: "Gebildet mit **avere** oder **essere** + Partizip.\nDie meisten Verben: **avere** → *ho mangiato, ho dormito, ho fatto*.\nBewegungs-/Zustandsverben: **essere** → *sono andato/a, siamo partiti/e*.\nBei **essere** passt sich das Partizip an: *siamo andat**i**, sono andat**a***.",
      exercises: [
        { kind: "fill", prompt: "Stamattina ho ___ (fare) colazione.", accept: ["fatto"], explain: "fare → fatto (mit avere)." },
        { kind: "choice", prompt: "Ieri sera ___ andati al ristorante.", options: ["abbiamo", "siamo"], answer: "siamo", explain: "andare → **essere**: siamo andati." },
        { kind: "fill", prompt: "Il bambino ha ___ (dormire) tutto il giorno.", accept: ["dormito"], explain: "dormire → dormito (mit avere)." },
        { kind: "choice", prompt: "Ho ___ la pasta.", options: ["mangiato", "mangiata", "mangiare"], answer: "mangiato", explain: "avere + Partizip: **mangiato**." },
        { kind: "choice", prompt: "Maria è ___ a casa.", options: ["andato", "andata"], answer: "andata", explain: "essere → Partizip passt sich an (feminin): **andata**." },
        { kind: "fill", prompt: "Ha ___ bel tempo. (fare)", accept: ["fatto"], explain: "Wetter mit fare: ha fatto bel tempo." }
      ]
    },
    {
      id: "g_possessive",
      title: "Possessiv & Familienmitglieder",
      cefr: "A2",
      rule: "Artikel + Possessiv + Nomen müssen **übereinstimmen**: *le mie amiche, i miei amici*.\n**Ausnahme:** Familienmitglieder **im Singular** ohne Artikel: *mio marito, mia mamma, mia sorella*.\nAber Plural mit Artikel: *i miei genitori*; Kosename mit Artikel: *la mia mamma*.",
      exercises: [
        { kind: "choice", prompt: "___ marito lavora.", options: ["Il mio", "Mio"], answer: "Mio", explain: "Familie Singular → ohne Artikel: **mio marito**." },
        { kind: "choice", prompt: "Vengono ___ amiche.", options: ["le mie", "le miei", "i miei"], answer: "le mie", explain: "feminin Plural: **le mie amiche**." },
        { kind: "choice", prompt: "___ genitori vengono domani.", options: ["Miei", "I miei"], answer: "I miei", explain: "Plural → **mit** Artikel: i miei genitori." },
        { kind: "fill", prompt: "___ sorella abita a Roma. (meine)", accept: ["mia"], explain: "Familie Singular ohne Artikel: mia sorella." },
        { kind: "choice", prompt: "Questa è la macchina di ___ suocera.", options: ["mia", "la mia"], answer: "mia", explain: "Familie Singular → mia suocera." },
        { kind: "choice", prompt: "Gioco con ___ amici.", options: ["i miei", "le mie"], answer: "i miei", explain: "maskulin Plural: **i miei amici**." }
      ]
    },

    /* ===================== B1-MODULE (Start) ===================== */
    {
      id: "b1_imperfetto",
      title: "Imperfetto (Vergangenheit: Zustände & Gewohnheiten)",
      cefr: "B1",
      rule: "Das **Imperfetto** beschreibt Zustände, Gewohnheiten und Hintergrund in der Vergangenheit ('war', 'pflegte zu').\n-are: parl**avo**, parl**avi**, parl**ava**, parl**avamo**, parl**avate**, parl**avano**.\nWichtig: *ero, eri, era…* (essere) und *avevo…* (avere). Beispiel: *Da bambina abitavo a Roma.*",
      exercises: [
        { kind: "fill", prompt: "Da bambina ___ (abitare) a Roma.", accept: ["abitavo"], explain: "io -are → -avo." },
        { kind: "choice", prompt: "Ogni estate ___ al mare.", options: ["andavamo", "siamo andati"], answer: "andavamo", explain: "Gewohnheit in der Vergangenheit → **Imperfetto**." },
        { kind: "fill", prompt: "Quando ___ (essere) piccolo, dormivo molto.", accept: ["ero"], explain: "essere Imperfetto: io **ero**." },
        { kind: "fill", prompt: "Il bambino ___ (avere) fame.", accept: ["aveva"], explain: "avere Imperfetto: lui **aveva**." },
        { kind: "choice", prompt: "Mentre cucinavo, il bambino ___.", options: ["dormiva", "ha dormito"], answer: "dormiva", explain: "Hintergrund/gleichzeitig → Imperfetto." }
      ]
    },
    {
      id: "b1_futuro",
      title: "Futuro semplice (Zukunft)",
      cefr: "B1",
      rule: "Das **Futuro** drückt Zukunft/Vermutung aus.\n-are/-ere: parl**erò**, parl**erai**, parl**erà**, parl**eremo**, parl**erete**, parl**eranno**.\n-ire: part**irò**… Unregelmäßig: *sarò* (essere), *avrò* (avere), *andrò* (andare).",
      exercises: [
        { kind: "fill", prompt: "Domani ___ (partire, noi) per il mare.", accept: ["partiremo"], explain: "noi -ire → -iremo." },
        { kind: "choice", prompt: "L'anno prossimo ___ in Italia.", options: ["andremo", "andiamo"], answer: "andremo", explain: "Zukunft → Futuro: **andremo**." },
        { kind: "fill", prompt: "___ (essere, io) a casa alle otto.", accept: ["sarò"], explain: "essere Futuro: io **sarò**." },
        { kind: "choice", prompt: "Loro ___ una casa nuova.", options: ["avranno", "hanno"], answer: "avranno", explain: "avere Futuro loro: **avranno**." }
      ]
    },
    {
      id: "b1_condizionale",
      title: "Condizionale (Höflichkeit & Wunsch)",
      cefr: "B1",
      rule: "Das **Condizionale** ('würde') für Höflichkeit und Wünsche.\nparl**erei**, parl**eresti**, parl**erebbe**, parl**eremmo**, parl**ereste**, parl**erebbero**.\nHäufig: *vorrei* (ich möchte), *potrei* (ich könnte), *mi piacerebbe* (ich würde gern).",
      exercises: [
        { kind: "choice", prompt: "___ due caffè, per favore.", options: ["Voglio", "Vorrei"], answer: "Vorrei", explain: "Höflich → **Vorrei**." },
        { kind: "fill", prompt: "Mi ___ (piacere) andare al mare.", accept: ["piacerebbe"], explain: "'ich würde gern' → mi piacerebbe." },
        { kind: "choice", prompt: "___ aiutarmi, per favore?", options: ["Potresti", "Puoi"], answer: "Potresti", explain: "Höflicher Konditional: **Potresti**." },
        { kind: "fill", prompt: "___ (volere, noi) prenotare un tavolo.", accept: ["vorremmo"], explain: "noi: **vorremmo**." }
      ]
    }
  ],

  /* ---------------- LEHRPLAN (CURRICULUM) ----------------
   * Systematische Liste der offiziellen Themen pro Niveau.
   * Jede Grammatik-Kompetenz verweist (moduleId) auf ein Übungsmodul,
   * sofern schon vorhanden. "status" spiegelt den Ausbaustand der App:
   *   "ready"   = Übungen vorhanden (zählt zur Fortschrittsmessung)
   *   "planned" = Thema offiziell gelistet, Übungen folgen noch
   * So siehst du transparent, was schon systematisch geübt werden kann.
   */
  curriculum: {
    A2: {
      grammar: [
        { topic: "Präsens regelmäßig (-are)", moduleId: "g_conj_are", status: "ready" },
        { topic: "Präsens regelmäßig (-ere/-ire, -isc-)", moduleId: "g_conj_ere_ire", status: "ready" },
        { topic: "Präpositionen a/in (Orte, Verkehrsmittel)", moduleId: "g_prep_a_in", status: "ready" },
        { topic: "Präpositionen da/di", moduleId: "g_prep_da_di", status: "ready" },
        { topic: "Passato Prossimo (avere/essere)", moduleId: "g_passato_prossimo", status: "ready" },
        { topic: "Possessivpronomen & Familie", moduleId: "g_possessive", status: "ready" },
        { topic: "Artikel & Präpositionen kombiniert (nel, sul, al…)", moduleId: null, status: "planned" },
        { topic: "Reflexive Verben (mi alzo, mi occupo…)", moduleId: null, status: "planned" },
        { topic: "Modalverben (potere, volere, dovere)", moduleId: null, status: "planned" },
        { topic: "Direkte & indirekte Objektpronomen", moduleId: null, status: "planned" },
        { topic: "Komparativ (più… di / meno… di)", moduleId: null, status: "planned" },
        { topic: "Futuro mit stare per / Gegenwartsbezug", moduleId: null, status: "planned" }
      ]
    },
    B1: {
      grammar: [
        { topic: "Imperfetto", moduleId: "b1_imperfetto", status: "ready" },
        { topic: "Futuro semplice", moduleId: "b1_futuro", status: "ready" },
        { topic: "Condizionale presente", moduleId: "b1_condizionale", status: "ready" },
        { topic: "Imperfetto vs. Passato Prossimo", moduleId: null, status: "planned" },
        { topic: "Congiuntivo presente", moduleId: null, status: "planned" },
        { topic: "Pronomi combinati (glielo, me lo…)", moduleId: null, status: "planned" },
        { topic: "Ci & Ne", moduleId: null, status: "planned" },
        { topic: "Relativsätze (che, cui, il quale)", moduleId: null, status: "planned" },
        { topic: "Passato Prossimo vs. Trapassato", moduleId: null, status: "planned" },
        { topic: "Imperativ (formell & informell)", moduleId: null, status: "planned" }
      ]
    }
  }
};
