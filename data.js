/*
 * Olivias Italienisch-Trainer – Datenbasis
 * Diese Datei enthält beide Datensätze. Du kannst hier jederzeit
 * neue Stolpersteine oder Sätze ergänzen (einfach am Ende der Listen
 * einen neuen Eintrag im gleichen Format anhängen).
 */
window.APP_DATA = {
  stumblingBlocks: [
    {
      id: "sb001",
      category: "grammar",
      wrong: "chi vive",
      correct: "che vive",
      explanation: "**che** verbindet Sätze ('der/die/das'). **chi** ist nur ein Fragewort ('wer?'). Merke: 'Ich habe einen Bruder, DER lebt' → *che*",
      examples: [{ wrong: "Ho un fratello chi vive a Roma.", correct: "Ho un fratello che vive a Roma." }]
    },
    {
      id: "sb002",
      category: "vocab",
      wrong: "l'invitato",
      correct: "l'invito",
      explanation: "**l'invito** = die Einladung. **l'invitato** = der Gast (eingeladene Person). Verwechsel sie nicht!",
      examples: [{ wrong: "Grazie per l'invitato!", correct: "Grazie per l'invito!" }]
    },
    {
      id: "sb003",
      category: "preposition",
      wrong: "vengo di Bologna",
      correct: "vengo da Bologna",
      explanation: "**da** zeigt Herkunft/Ursprung ('von, aus'). **di** ist Zugehörigkeit ('von jemandem').",
      examples: [{ wrong: "Vengo di Bologna.", correct: "Vengo da Bologna." }]
    },
    {
      id: "sb004",
      category: "spelling",
      wrong: "machina",
      correct: "macchina",
      explanation: "**macchina** hat Doppel-cch! Merke: mac-chi-na",
      examples: [{ wrong: "Vado con la machina.", correct: "Vado in macchina." }]
    },
    {
      id: "sb005",
      category: "preposition",
      wrong: "con la macchina",
      correct: "in macchina",
      explanation: "Bei Verkehrsmitteln nutzt Italienisch **in**, nicht *con*: *in macchina, in treno, in aereo*.",
      examples: [{ wrong: "Vengo con la macchina.", correct: "Vengo in macchina." }]
    },
    {
      id: "sb006",
      category: "preposition",
      wrong: "costume di bagno",
      correct: "costume da bagno",
      explanation: "**da bagno** = zum Baden gemacht. **di** wäre 'aus/von'. Feste Wendung: costume da bagno.",
      examples: [{ wrong: "il costume di bagno", correct: "il costume da bagno" }]
    },
    {
      id: "sb007",
      category: "vocab",
      wrong: "fare un bagno",
      correct: "fare il bagno",
      explanation: "Feste Wendung: **fare IL bagno** = schwimmen gehen. Immer mit bestimmtem Artikel.",
      examples: [{ wrong: "Facciamo un bagno.", correct: "Facciamo il bagno." }]
    },
    {
      id: "sb008",
      category: "grammar",
      wrong: "il mio marito",
      correct: "mio marito",
      explanation: "Bei **Familienmitgliedern im Singular** KEIN Artikel: *mio marito, mia mamma, mia sorella*. AUSNAHME: Plural (i miei genitori) und Kosenamen (la mia mamma).",
      examples: [{ wrong: "Il mio marito lavora.", correct: "Mio marito lavora." }]
    },
    {
      id: "sb009",
      category: "grammar",
      wrong: "le mie amici",
      correct: "le mie amiche / i miei amici",
      explanation: "Die 'Musketiere-Regel': Artikel + Possessiv + Nomen müssen ALLE im Genus und Numerus übereinstimmen. *le mie amiche* (alle feminin Plural) oder *i miei amici* (alle maskulin Plural).",
      examples: [{ wrong: "le mie amici", correct: "le mie amiche" }]
    },
    {
      id: "sb010",
      category: "preposition",
      wrong: "fra due giorni / per due giorni verwechselt",
      correct: "fra due giorni = in 2 Tagen (Zukunft) | per due giorni = für 2 Tage (Dauer)",
      explanation: "**fra/tra + Zeit** = wann etwas in der Zukunft passiert (in 2 Tagen). **per + Zeit** = wie lange etwas dauert (für 2 Tage).",
      examples: [{ wrong: "Restiamo fra due giorni al mare.", correct: "Restiamo per due giorni al mare." }]
    },
    {
      id: "sb011",
      category: "grammar",
      wrong: "nel un appartamento",
      correct: "in un appartamento",
      explanation: "**nel** ist bereits 'in + il'. Vor unbestimmtem Artikel: *in un* (kein *nel un*!).",
      examples: [{ wrong: "Abito nel un appartamento.", correct: "Abito in un appartamento." }]
    },
    {
      id: "sb012",
      category: "spelling",
      wrong: "apartamento / capotto / passegino",
      correct: "appartamento / cappotto / passeggino",
      explanation: "Italienisch liebt Doppelbuchstaben! *appartamento (pp), cappotto (pp), passeggino (ss+gg), tappeto (pp)*.",
      examples: [{ wrong: "il apartamento", correct: "l'appartamento" }]
    },
    {
      id: "sb013",
      category: "grammar",
      wrong: "costane",
      correct: "costano",
      explanation: "3. Person Plural bei -are Verben endet auf **-ano**: costano, parlano, mangiano, giocano.",
      examples: [{ wrong: "Quanto costane le scarpe?", correct: "Quanto costano le scarpe?" }]
    },
    {
      id: "sb014",
      category: "preposition",
      wrong: "in la Sardegna / per Sardegna",
      correct: "in Sardegna (ohne Artikel) / per la Sardegna (mit Artikel)",
      explanation: "Bei Regionen: **in** verschluckt den Artikel, **per** behält ihn. *Vado in Sardegna* vs. *Parto per la Sardegna*.",
      examples: [{ wrong: "Andiamo in la Sardegna.", correct: "Andiamo in Sardegna." }]
    },
    {
      id: "sb015",
      category: "preposition",
      wrong: "in Bologna",
      correct: "a Bologna",
      explanation: "Städte nehmen **a**, nicht *in*: *a Bologna, a Roma, a Milano*.",
      examples: [{ wrong: "Arriviamo in Bologna.", correct: "Arriviamo a Bologna." }]
    },
    {
      id: "sb016",
      category: "spelling",
      wrong: "biznonna",
      correct: "bisnonna",
      explanation: "**bisnonna** = Urgroßmutter, mit **s** (nicht z). Vorsilbe *bis-* = Ur-.",
      examples: [{ wrong: "la biznonna", correct: "la bisnonna" }]
    },
    {
      id: "sb017",
      category: "spelling",
      wrong: "Augusto",
      correct: "agosto",
      explanation: "Monatsnamen werden **kleingeschrieben**: agosto, settembre, ottobre. *Augusto* wäre ein Vorname!",
      examples: [{ wrong: "in Augusto", correct: "in agosto" }]
    },
    {
      id: "sb018",
      category: "vocab",
      wrong: "la vista (für Besuch)",
      correct: "la visita",
      explanation: "**la visita** = der Besuch. **la vista** = die Aussicht. *Fare visita a* = jemanden besuchen.",
      examples: [{ wrong: "Fare vista a nonna.", correct: "Fare visita a nonna." }]
    },
    {
      id: "sb019",
      category: "grammar",
      wrong: "voglio occuparsi (mit -si)",
      correct: "voglio occuparmi",
      explanation: "Bei reflexiven Verben nach Modalverb/vorrei/ho intenzione di wird das Pronomen an den Infinitiv angehängt und der Person angepasst: *occuparmi* (ich mich), *occuparti* (du dich).",
      examples: [{ wrong: "Voglio occuparsi del bucato.", correct: "Voglio occuparmi del bucato." }]
    },
    {
      id: "sb020",
      category: "preposition",
      wrong: "alla spiaggia / nel mare / al bambino verwechselt",
      correct: "sulla spiaggia (auf/an) / nel mare (in) / al bambino (dem)",
      explanation: "**su** für Position 'auf/an' (sulla spiaggia). **in+il=nel** für 'im' Meer (nel mare). **a+il=al** für indirektes Objekt 'dem' (al bambino).",
      examples: [{ wrong: "L'ombrellone è alla spiaggia.", correct: "L'ombrellone è sulla spiaggia." }]
    }
  ],

  sentences: [
    { id: "s001", de: "Wir fahren mit dem Auto nach Bologna.", it: ["Andiamo in macchina a Bologna."], themes: ["travel"], cefr: "A2", grammar_focus: ["preposition_a_in"] },
    { id: "s002", de: "Am Samstag kommen wir in Italien an.", it: ["Sabato arriviamo in Italia."], themes: ["travel"], cefr: "A2", grammar_focus: ["preposition_in"] },
    { id: "s003", de: "Wir bleiben zwei Tage bei den Großeltern.", it: ["Restiamo due giorni dai nonni.", "Rimaniamo per due giorni dai nonni."], themes: ["travel", "family"], cefr: "A2", grammar_focus: ["preposition_per_dauer"] },
    { id: "s004", de: "In drei Tagen fahren wir ans Meer ab.", it: ["Fra tre giorni partiamo per il mare.", "Tra tre giorni partiamo per il mare."], themes: ["travel", "beach"], cefr: "A2", grammar_focus: ["preposition_fra_tra"] },
    { id: "s005", de: "Wir nehmen die Fähre nach Sardinien.", it: ["Prendiamo il traghetto per la Sardegna."], themes: ["travel"], cefr: "A2", grammar_focus: ["preposition_per_regione"] },
    { id: "s006", de: "Meine Schwiegermutter besucht uns heute Abend.", it: ["Mia suocera ci fa visita stasera.", "Mia suocera viene a trovarci stasera."], themes: ["family"], cefr: "A2", grammar_focus: ["family_no_article"] },
    { id: "s007", de: "Die Oma umarmt das Baby.", it: ["La nonna abbraccia il bambino."], themes: ["family", "baby"], cefr: "A1" },
    { id: "s008", de: "Wir verstehen uns gut mit meiner Schwiegermutter.", it: ["Andiamo d'accordo con mia suocera."], themes: ["family"], cefr: "A2" },
    { id: "s009", de: "Das Baby krabbelt zur Oma.", it: ["Il bambino gattona dalla nonna."], themes: ["baby", "family"], cefr: "A2", grammar_focus: ["preposition_da"] },
    { id: "s010", de: "Das Baby zieht sich am Sofa hoch.", it: ["Il bambino si mette in piedi al divano."], themes: ["baby"], cefr: "A2", grammar_focus: ["reflexive_verbs"] },
    { id: "s011", de: "Das Baby fällt hin und weint.", it: ["Il bambino cade e piange."], themes: ["baby"], cefr: "A1" },
    { id: "s012", de: "Der Hochstuhl ist im Restaurant.", it: ["Il seggiolone è al ristorante."], themes: ["baby", "restaurant"], cefr: "A2" },
    { id: "s013", de: "Wir setzen dem Baby das Lätzchen um.", it: ["Mettiamo il bavaglino al bambino."], themes: ["baby"], cefr: "A2", grammar_focus: ["preposition_a_indirect"] },
    { id: "s014", de: "Das Baby isst ein Stück Brot.", it: ["Il bambino mangia un pezzo di pane."], themes: ["baby", "food"], cefr: "A1" },
    { id: "s015", de: "Die Oma füttert das Baby.", it: ["La nonna dà da mangiare al bambino."], themes: ["baby", "family"], cefr: "A2" },
    { id: "s016", de: "Am Strand cremen wir das Baby mit Sonnencreme ein.", it: ["Sulla spiaggia mettiamo la crema solare al bambino."], themes: ["beach", "baby"], cefr: "A2", grammar_focus: ["preposition_su_a"] },
    { id: "s017", de: "Wir stellen den Sonnenschirm in den Sand.", it: ["Mettiamo l'ombrellone sulla sabbia."], themes: ["beach"], cefr: "A2", grammar_focus: ["preposition_su"] },
    { id: "s018", de: "Wir gehen im Meer schwimmen.", it: ["Facciamo il bagno nel mare."], themes: ["beach"], cefr: "A2", grammar_focus: ["preposition_in_nel"] },
    { id: "s019", de: "Am Meer bleiben wir zwei Wochen.", it: ["Al mare restiamo due settimane.", "Al mare rimaniamo per due settimane."], themes: ["beach"], cefr: "A2" },
    { id: "s020", de: "Am Sonntag schauen wir den Sonnenuntergang.", it: ["Domenica guardiamo il tramonto."], themes: ["beach"], cefr: "A2" },
    { id: "s021", de: "Im Restaurant essen wir Pasta.", it: ["Al ristorante mangiamo la pasta."], themes: ["restaurant"], cefr: "A1" },
    { id: "s022", de: "Wir hätten gern zwei Kaffee, bitte.", it: ["Vorremmo due caffè, per favore.", "Vorrei due caffè, per favore."], themes: ["restaurant"], cefr: "A2" },
    { id: "s023", de: "Wie viel kostet das Menü?", it: ["Quanto costa il menù?"], themes: ["restaurant"], cefr: "A1" },
    { id: "s024", de: "Wir zahlen an der Kasse.", it: ["Paghiamo alla cassa."], themes: ["restaurant", "shopping"], cefr: "A2", grammar_focus: ["preposition_a"] },
    { id: "s025", de: "Ich habe vor, heute Abend zu kochen.", it: ["Ho intenzione di cucinare stasera."], themes: ["food", "routine"], cefr: "A2", grammar_focus: ["avere_intenzione_di"] },
    { id: "s026", de: "Während das Baby schläft, koche ich.", it: ["Mentre il bambino dorme, cucino."], themes: ["routine", "baby"], cefr: "A2", grammar_focus: ["mentre"] },
    { id: "s027", de: "Ich habe heute Morgen gefrühstückt.", it: ["Stamattina ho fatto colazione."], themes: ["routine", "food"], cefr: "A2", grammar_focus: ["passato_prossimo"] },
    { id: "s028", de: "Wir sind gestern Abend ins Restaurant gegangen.", it: ["Ieri sera siamo andati al ristorante."], themes: ["restaurant", "routine"], cefr: "A2", grammar_focus: ["passato_prossimo_essere"] },
    { id: "s029", de: "Das Baby hat den ganzen Tag geschlafen.", it: ["Il bambino ha dormito tutto il giorno."], themes: ["baby"], cefr: "A2", grammar_focus: ["passato_prossimo"] },
    { id: "s030", de: "Ich rufe meine Mutter an.", it: ["Chiamo la mia mamma.", "Chiamo mia mamma."], themes: ["phone", "family"], cefr: "A1", grammar_focus: ["chiamare_no_con"] },
    { id: "s031", de: "Wer spricht? Hier ist Anna.", it: ["Chi parla? Sono Anna."], themes: ["phone"], cefr: "A1", grammar_focus: ["chi_vs_che"] },
    { id: "s032", de: "Ich habe einen Bruder, der in Italien lebt.", it: ["Ho un fratello che vive in Italia."], themes: ["family"], cefr: "A2", grammar_focus: ["che_relative"] },
    { id: "s033", de: "Meine Freundinnen kommen heute Abend zu mir.", it: ["Le mie amiche vengono da me stasera."], themes: ["family"], cefr: "A2", grammar_focus: ["possessive_agreement", "preposition_da"] },
    { id: "s034", de: "Kommst du mit mir in den Park?", it: ["Vieni con me al parco?"], themes: ["family"], cefr: "A2", grammar_focus: ["preposition_con_a"] },
    { id: "s035", de: "Ich gehe zum Arzt.", it: ["Vado dal medico."], themes: ["routine"], cefr: "A2", grammar_focus: ["preposition_da"] },
    { id: "s036", de: "Ich wohne in einem großen Apartment.", it: ["Abito in un appartamento grande."], themes: ["home"], cefr: "A2", grammar_focus: ["in_un"] },
    { id: "s037", de: "Der Kinderwagen ist im Auto.", it: ["Il passeggino è in macchina."], themes: ["baby", "travel"], cefr: "A2" },
    { id: "s038", de: "Wir machen einen Spaziergang mit dem Kinderwagen.", it: ["Facciamo una passeggiata con il passeggino."], themes: ["baby", "routine"], cefr: "A2" },
    { id: "s039", de: "Der Großvater spielt mit dem Baby.", it: ["Il nonno gioca con il bambino."], themes: ["family", "baby"], cefr: "A1" },
    { id: "s040", de: "Ich bin müde, aber glücklich.", it: ["Sono stanca ma felice."], themes: ["emotions"], cefr: "A1", grammar_focus: ["essere_adjective"] },
    { id: "s041", de: "Mir geht's gut, danke.", it: ["Sto bene, grazie."], themes: ["emotions", "phone"], cefr: "A1", grammar_focus: ["stare_bene"] },
    { id: "s042", de: "Ich bin schläfrig.", it: ["Ho sonno."], themes: ["emotions"], cefr: "A1", grammar_focus: ["avere_noun"] },
    { id: "s043", de: "Heute ist es warm.", it: ["Oggi fa caldo."], themes: ["weather"], cefr: "A1", grammar_focus: ["fare_weather"] },
    { id: "s044", de: "Es hat schönes Wetter gemacht.", it: ["Ha fatto bel tempo."], themes: ["weather"], cefr: "A2", grammar_focus: ["passato_prossimo_weather"] },
    { id: "s045", de: "Mitte August fahren wir nach Bologna.", it: ["A metà agosto partiamo per Bologna."], themes: ["travel", "time"], cefr: "A2" },
    { id: "s046", de: "Wir verbringen den Rest des Sommers am Meer.", it: ["Passiamo il resto dell'estate al mare."], themes: ["beach", "time"], cefr: "B1" },
    { id: "s047", de: "Das ist das Auto meiner Schwiegermutter.", it: ["Questa è la macchina di mia suocera."], themes: ["family", "travel"], cefr: "A2", grammar_focus: ["questo_agreement", "preposition_di"] },
    { id: "s048", de: "Ich bin gerade dabei, das Baby anzuziehen.", it: ["Sto per vestire il bambino."], themes: ["baby", "routine"], cefr: "B1", grammar_focus: ["stare_per"] },
    { id: "s049", de: "Die Fähre ist kurz davor abzufahren.", it: ["Il traghetto sta per partire."], themes: ["travel"], cefr: "B1", grammar_focus: ["stare_per"] },
    { id: "s050", de: "Ich sehe meinen Mann heute Abend.", it: ["Lo vedo stasera.", "Vedo mio marito stasera."], themes: ["family"], cefr: "A2", grammar_focus: ["direct_object_pronoun"] },
    { id: "s051", de: "Ich umarme sie.", it: ["L'abbraccio."], themes: ["family"], cefr: "A2", grammar_focus: ["pronoun_apostrophe"] },
    { id: "s052", de: "Ich kenne sie nicht.", it: ["Non li conosco.", "Non le conosco."], themes: ["family"], cefr: "A2", grammar_focus: ["non_pronoun_order"] },
    { id: "s053", de: "Meine Mutter und ich gehen ins Kino.", it: ["Mia mamma e io andiamo al cinema."], themes: ["family", "routine"], cefr: "A2", grammar_focus: ["io_e_persona_noi"] },
    { id: "s054", de: "Wir bringen ein Geschenk für die Großmutter mit.", it: ["Portiamo un regalo per la nonna."], themes: ["family"], cefr: "A2" },
    { id: "s055", de: "Ich habe vor, mich um die Wäsche zu kümmern.", it: ["Ho intenzione di occuparmi del bucato."], themes: ["home"], cefr: "B1", grammar_focus: ["reflexive_infinitive"] },
    { id: "s056", de: "Der Sonnenschirm ist auf dem Sand.", it: ["L'ombrellone è sulla sabbia."], themes: ["beach"], cefr: "A2" },
    { id: "s057", de: "Ich gehe an die Kasse.", it: ["Vado alla cassa."], themes: ["shopping"], cefr: "A2" },
    { id: "s058", de: "Wir verbringen zwei Wochen an der Küste bei den Großeltern.", it: ["Passiamo due settimane sulla costa dai nonni."], themes: ["beach", "family"], cefr: "B1" },
    { id: "s059", de: "Mein Mann kocht für uns.", it: ["Mio marito cucina per noi."], themes: ["family", "food"], cefr: "A2" },
    { id: "s060", de: "Ich komme aus Bologna.", it: ["Vengo da Bologna."], themes: ["family", "travel"], cefr: "A1", grammar_focus: ["preposition_da_origin"] }
  ]
};
