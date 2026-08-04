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
    { id: "v052", it: "piove", de: "es regnet", cefr: "A2", theme: "weather", ex: { de: "Heute regnet es.", it: ["Oggi piove."] } },

    // --- Weitere A2-Vokabeln ---
    { id: "v053", it: "la settimana", de: "die Woche", cefr: "A1", theme: "time", ex: { de: "Wir bleiben eine Woche.", it: ["Restiamo una settimana.", "Rimaniamo una settimana."] } },
    { id: "v054", it: "il mese", de: "der Monat", cefr: "A2", theme: "time", ex: { de: "Der Monat August ist heiß.", it: ["Il mese di agosto è caldo."] } },
    { id: "v055", it: "la mattina", de: "der Morgen", cefr: "A2", theme: "time", ex: { de: "Am Morgen trinke ich Kaffee.", it: ["La mattina bevo il caffè."] } },
    { id: "v056", it: "la sera", de: "der Abend", cefr: "A2", theme: "time", ex: { de: "Am Abend sind wir müde.", it: ["La sera siamo stanchi."] } },
    { id: "v057", it: "presto", de: "früh", cefr: "A2", theme: "time", ex: { de: "Ich stehe früh auf.", it: ["Mi alzo presto."] } },
    { id: "v058", it: "tardi", de: "spät", cefr: "A2", theme: "time", ex: { de: "Wir kommen spät an.", it: ["Arriviamo tardi."] } },
    { id: "v059", it: "il letto", de: "das Bett", cefr: "A1", theme: "home", ex: { de: "Das Baby schläft im Bett.", it: ["Il bambino dorme nel letto."] } },
    { id: "v060", it: "la camera", de: "das Zimmer", cefr: "A2", theme: "home", ex: { de: "Das Zimmer ist groß.", it: ["La camera è grande."] } },
    { id: "v061", it: "il bagno", de: "das Bad", cefr: "A2", theme: "home", ex: { de: "Das Bad ist dort.", it: ["Il bagno è lì."] } },
    { id: "v062", it: "la finestra", de: "das Fenster", cefr: "A2", theme: "home", ex: { de: "Ich öffne das Fenster.", it: ["Apro la finestra."] } },
    { id: "v063", it: "il medico", de: "der Arzt", cefr: "A2", theme: "routine", ex: { de: "Ich gehe zum Arzt.", it: ["Vado dal medico."] } },
    { id: "v064", it: "la farmacia", de: "die Apotheke", cefr: "A2", theme: "routine", ex: { de: "Die Apotheke ist geschlossen.", it: ["La farmacia è chiusa."] } },
    { id: "v065", it: "malato", de: "krank", cefr: "A2", theme: "emotions", ex: { de: "Das Baby ist krank.", it: ["Il bambino è malato."] } },
    { id: "v066", it: "il supermercato", de: "der Supermarkt", cefr: "A2", theme: "shopping", ex: { de: "Ich gehe in den Supermarkt.", it: ["Vado al supermercato."] } },
    { id: "v067", it: "i soldi", de: "das Geld", cefr: "A2", theme: "shopping", ex: { de: "Ich habe kein Geld.", it: ["Non ho soldi."] } },
    { id: "v068", it: "caro", de: "teuer", cefr: "A2", theme: "shopping", ex: { de: "Das Auto ist teuer.", it: ["La macchina è cara."] } },
    { id: "v069", it: "capire", de: "verstehen", cefr: "A2", theme: "routine", ex: { de: "Ich verstehe nicht.", it: ["Non capisco."] } },
    { id: "v070", it: "imparare", de: "lernen", cefr: "A2", theme: "routine", ex: { de: "Ich lerne Italienisch.", it: ["Imparo l'italiano."] } },
    { id: "v071", it: "leggere", de: "lesen", cefr: "A1", theme: "routine", ex: { de: "Der Opa liest ein Buch.", it: ["Il nonno legge un libro."] } },
    { id: "v072", it: "il sole", de: "die Sonne", cefr: "A1", theme: "weather", ex: { de: "Heute scheint die Sonne.", it: ["Oggi c'è il sole."] } },

    // --- B1-Vokabeln ---
    { id: "v073", it: "il consiglio", de: "der Rat / Tipp", cefr: "B1", theme: "routine", ex: { de: "Ich gebe dir einen Rat.", it: ["Ti do un consiglio."] } },
    { id: "v074", it: "consigliare", de: "empfehlen / raten", cefr: "B1", theme: "restaurant", ex: { de: "Ich empfehle dieses Restaurant.", it: ["Consiglio questo ristorante."] } },
    { id: "v075", it: "riuscire", de: "schaffen / gelingen", cefr: "B1", theme: "emotions", ex: { de: "Ich schaffe es nicht.", it: ["Non ci riesco."] } },
    { id: "v076", it: "la salute", de: "die Gesundheit", cefr: "B1", theme: "emotions", ex: { de: "Die Gesundheit ist wichtig.", it: ["La salute è importante."] } },
    { id: "v077", it: "l'ambiente", de: "die Umwelt", cefr: "B1", theme: "routine", ex: { de: "Wir müssen die Umwelt schützen.", it: ["Dobbiamo proteggere l'ambiente."] } },
    { id: "v078", it: "migliorare", de: "verbessern", cefr: "B1", theme: "routine", ex: { de: "Ich will mein Italienisch verbessern.", it: ["Voglio migliorare il mio italiano."] } },
    { id: "v079", it: "decidere", de: "entscheiden", cefr: "B1", theme: "routine", ex: { de: "Wir müssen jetzt entscheiden.", it: ["Dobbiamo decidere adesso.", "Dobbiamo decidere ora."] } },
    { id: "v080", it: "la scelta", de: "die Wahl / Entscheidung", cefr: "B1", theme: "routine", ex: { de: "Es ist eine schwierige Wahl.", it: ["È una scelta difficile."] } },
    { id: "v081", it: "prenotare", de: "reservieren / buchen", cefr: "B1", theme: "restaurant", ex: { de: "Ich reserviere einen Tisch.", it: ["Prenoto un tavolo."] } },
    { id: "v082", it: "l'appuntamento", de: "der Termin / die Verabredung", cefr: "B1", theme: "routine", ex: { de: "Ich habe morgen einen Termin.", it: ["Ho un appuntamento domani."] } },
    { id: "v083", it: "permettere", de: "erlauben", cefr: "B1", theme: "family", ex: { de: "Meine Eltern erlauben es nicht.", it: ["I miei genitori non lo permettono."] } },
    { id: "v084", it: "vietato", de: "verboten", cefr: "B1", theme: "routine", ex: { de: "Rauchen ist verboten.", it: ["È vietato fumare."] } },
    { id: "v085", it: "nonostante", de: "trotz", cefr: "B1", theme: "time", ex: { de: "Trotz des Regens gehen wir aus.", it: ["Nonostante la pioggia usciamo."] } },
    { id: "v086", it: "l'esperienza", de: "die Erfahrung", cefr: "B1", theme: "travel", ex: { de: "Es war eine schöne Erfahrung.", it: ["È stata una bella esperienza."] } },

    // --- Gesundheit ---
    { id: "v087", it: "il mal di testa", de: "die Kopfschmerzen", cefr: "A2", theme: "health", ex: { de: "Ich habe Kopfschmerzen.", it: ["Ho mal di testa."] } },
    { id: "v088", it: "la febbre", de: "das Fieber", cefr: "A2", theme: "health", ex: { de: "Das Baby hat Fieber.", it: ["Il bambino ha la febbre."] } },
    { id: "v089", it: "la medicina", de: "das Medikament", cefr: "A2", theme: "health", ex: { de: "Ich nehme das Medikament.", it: ["Prendo la medicina."] } },
    { id: "v090", it: "il raffreddore", de: "die Erkältung", cefr: "B1", theme: "health", ex: { de: "Ich habe eine Erkältung.", it: ["Ho il raffreddore."] } },
    { id: "v091", it: "il dente", de: "der Zahn", cefr: "A2", theme: "health", ex: { de: "Mir tut der Zahn weh.", it: ["Mi fa male il dente."] } },

    // --- Kleidung ---
    { id: "v092", it: "i vestiti", de: "die Kleidung", cefr: "A2", theme: "clothing", ex: { de: "Ich kaufe neue Kleidung.", it: ["Compro vestiti nuovi."] } },
    { id: "v093", it: "la maglietta", de: "das T-Shirt", cefr: "A2", theme: "clothing", ex: { de: "Das T-Shirt ist rot.", it: ["La maglietta è rossa."] } },
    { id: "v094", it: "i pantaloni", de: "die Hose", cefr: "A2", theme: "clothing", ex: { de: "Die Hose ist zu groß.", it: ["I pantaloni sono troppo grandi."] } },
    { id: "v095", it: "le scarpe", de: "die Schuhe", cefr: "A1", theme: "clothing", ex: { de: "Die Schuhe sind neu.", it: ["Le scarpe sono nuove."] } },
    { id: "v096", it: "la giacca", de: "die Jacke", cefr: "A2", theme: "clothing", ex: { de: "Nimm die Jacke mit.", it: ["Prendi la giacca."] } },
    { id: "v097", it: "il cappello", de: "der Hut / die Mütze", cefr: "A2", theme: "clothing", ex: { de: "Das Baby trägt eine Mütze.", it: ["Il bambino porta il cappello."] } },

    // --- Farben ---
    { id: "v098", it: "rosso", de: "rot", cefr: "A1", theme: "basics", ex: { de: "Das Auto ist rot.", it: ["La macchina è rossa."] } },
    { id: "v099", it: "bianco", de: "weiß", cefr: "A1", theme: "basics", ex: { de: "Der Weißwein ist gut.", it: ["Il vino bianco è buono."] } },
    { id: "v100", it: "nero", de: "schwarz", cefr: "A1", theme: "basics", ex: { de: "Der Kaffee ist schwarz.", it: ["Il caffè è nero."] } },
    { id: "v101", it: "verde", de: "grün", cefr: "A1", theme: "basics", ex: { de: "Der Apfel ist grün.", it: ["La mela è verde."] } },
    { id: "v102", it: "blu", de: "blau", cefr: "A1", theme: "basics", ex: { de: "Das Meer ist blau.", it: ["Il mare è blu."] } },
    { id: "v103", it: "giallo", de: "gelb", cefr: "A1", theme: "basics", ex: { de: "Die Sonne ist gelb.", it: ["Il sole è giallo."] } },

    // --- Stadt & Wegbeschreibung ---
    { id: "v104", it: "la città", de: "die Stadt", cefr: "A1", theme: "city", ex: { de: "Die Stadt ist schön.", it: ["La città è bella."] } },
    { id: "v105", it: "la strada", de: "die Straße", cefr: "A2", theme: "city", ex: { de: "Die Straße ist lang.", it: ["La strada è lunga."] } },
    { id: "v106", it: "la piazza", de: "der Platz", cefr: "A2", theme: "city", ex: { de: "Der Platz ist groß.", it: ["La piazza è grande."] } },
    { id: "v107", it: "la chiesa", de: "die Kirche", cefr: "A2", theme: "city", ex: { de: "Die Kirche ist alt.", it: ["La chiesa è antica."] } },
    { id: "v108", it: "a destra", de: "rechts", cefr: "A2", theme: "city", ex: { de: "Das Restaurant ist rechts.", it: ["Il ristorante è a destra."] } },
    { id: "v109", it: "a sinistra", de: "links", cefr: "A2", theme: "city", ex: { de: "Die Apotheke ist links.", it: ["La farmacia è a sinistra."] } },
    { id: "v110", it: "dritto", de: "geradeaus", cefr: "A2", theme: "city", ex: { de: "Geh geradeaus.", it: ["Vai dritto.", "Vai sempre dritto."] } },
    { id: "v111", it: "vicino", de: "nah / in der Nähe", cefr: "A2", theme: "city", ex: { de: "Der Bahnhof ist nah.", it: ["La stazione è vicina."] } },
    { id: "v112", it: "lontano", de: "weit / weit weg", cefr: "A2", theme: "city", ex: { de: "Das Meer ist weit weg.", it: ["Il mare è lontano."] } },

    // --- Arbeit ---
    { id: "v113", it: "il lavoro", de: "die Arbeit", cefr: "A2", theme: "work", ex: { de: "Die Arbeit ist interessant.", it: ["Il lavoro è interessante."] } },
    { id: "v114", it: "l'ufficio", de: "das Büro", cefr: "A2", theme: "work", ex: { de: "Ich gehe ins Büro.", it: ["Vado in ufficio."] } },
    { id: "v115", it: "la riunione", de: "die Besprechung", cefr: "B1", theme: "work", ex: { de: "Die Besprechung ist um zehn.", it: ["La riunione è alle dieci."] } },
    { id: "v116", it: "il collega", de: "der Kollege", cefr: "B1", theme: "work", ex: { de: "Mein Kollege ist nett.", it: ["Il mio collega è simpatico."] } },
    { id: "v117", it: "guadagnare", de: "verdienen", cefr: "B1", theme: "work", ex: { de: "Ich verdiene genug.", it: ["Guadagno abbastanza."] } },

    // --- Häufige Verben ---
    { id: "v118", it: "andare", de: "gehen / fahren", cefr: "A1", theme: "routine", ex: { de: "Wir gehen nach Hause.", it: ["Andiamo a casa."] } },
    { id: "v119", it: "venire", de: "kommen", cefr: "A1", theme: "routine", ex: { de: "Kommst du mit mir?", it: ["Vieni con me?"] } },
    { id: "v120", it: "sapere", de: "wissen / können", cefr: "A2", theme: "routine", ex: { de: "Ich weiß es nicht.", it: ["Non lo so."] } },
    { id: "v121", it: "conoscere", de: "kennen", cefr: "A2", theme: "routine", ex: { de: "Ich kenne Rom gut.", it: ["Conosco bene Roma."] } },
    { id: "v122", it: "pensare", de: "denken", cefr: "A2", theme: "routine", ex: { de: "Ich denke an dich.", it: ["Penso a te."] } },
    { id: "v123", it: "trovare", de: "finden", cefr: "A2", theme: "routine", ex: { de: "Ich finde den Schlüssel nicht.", it: ["Non trovo la chiave."] } },
    { id: "v124", it: "aspettare", de: "warten", cefr: "A2", theme: "routine", ex: { de: "Ich warte auf dich.", it: ["Ti aspetto."] } },
    { id: "v125", it: "chiedere", de: "fragen / bitten", cefr: "B1", theme: "routine", ex: { de: "Ich frage den Kellner.", it: ["Chiedo al cameriere."] } },

    // --- Häufige Adjektive ---
    { id: "v126", it: "grande", de: "groß", cefr: "A1", theme: "basics", ex: { de: "Das Haus ist groß.", it: ["La casa è grande."] } },
    { id: "v127", it: "piccolo", de: "klein", cefr: "A1", theme: "basics", ex: { de: "Das Baby ist klein.", it: ["Il bambino è piccolo."] } },
    { id: "v128", it: "bello", de: "schön", cefr: "A1", theme: "basics", ex: { de: "Der Tag ist schön.", it: ["La giornata è bella."] } },
    { id: "v129", it: "brutto", de: "hässlich / schlecht", cefr: "A2", theme: "basics", ex: { de: "Das Wetter ist schlecht.", it: ["Il tempo è brutto."] } },
    { id: "v130", it: "difficile", de: "schwierig", cefr: "A2", theme: "basics", ex: { de: "Die Übung ist schwierig.", it: ["L'esercizio è difficile."] } },
    { id: "v131", it: "facile", de: "einfach / leicht", cefr: "A2", theme: "basics", ex: { de: "Die Frage ist einfach.", it: ["La domanda è facile."] } },

    // --- Bindewörter & Adverbien ---
    { id: "v132", it: "però", de: "aber", cefr: "A2", theme: "basics", ex: { de: "Ich bin müde, aber glücklich.", it: ["Sono stanca, però felice."] } },
    { id: "v133", it: "sempre", de: "immer", cefr: "A1", theme: "basics", ex: { de: "Ich trinke immer Kaffee.", it: ["Bevo sempre il caffè."] } },
    { id: "v134", it: "mai", de: "nie", cefr: "A2", theme: "basics", ex: { de: "Ich rauche nie.", it: ["Non fumo mai."] } },
    { id: "v135", it: "spesso", de: "oft", cefr: "A2", theme: "basics", ex: { de: "Wir gehen oft ans Meer.", it: ["Andiamo spesso al mare."] } },
    { id: "v136", it: "forse", de: "vielleicht", cefr: "A2", theme: "basics", ex: { de: "Vielleicht regnet es.", it: ["Forse piove."] } }
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
    {
      id: "g_prep_articolate",
      title: "Zusammengesetzte Präpositionen (nel, sul, al, del…)",
      cefr: "A2",
      rule: "Präposition + bestimmter Artikel verschmelzen:\n**a**+il=**al**, a+la=**alla**, a+i=**ai** · **in**+il=**nel**, in+la=**nella** · **su**+il=**sul**, su+la=**sulla** · **di**+il=**del** · **da**+il=**dal**, da+i=**dai**.\nVor **unbestimmtem** Artikel NICHT verschmelzen: *in un, a un*.",
      exercises: [
        { kind: "fill", prompt: "Il libro è ___ tavolo. (su + il)", accept: ["sul"], explain: "su+il = **sul**." },
        { kind: "choice", prompt: "Andiamo ___ cinema.", options: ["al", "a il", "nel"], answer: "al", explain: "a+il = **al**." },
        { kind: "fill", prompt: "La crema è ___ borsa. (in + la)", accept: ["nella"], explain: "in+la = **nella**." },
        { kind: "choice", prompt: "Abito ___ appartamento.", options: ["in un", "nell'un", "nel un"], answer: "in un", explain: "Vor unbestimmtem Artikel: **in un** (keine Verschmelzung)." },
        { kind: "fill", prompt: "Torniamo ___ nonni. (da + i)", accept: ["dai"], explain: "da+i = **dai**." },
        { kind: "choice", prompt: "È la macchina ___ mamma.", options: ["della", "dalla", "di la"], answer: "della", explain: "di+la = **della**." },
        { kind: "fill", prompt: "Il bambino gioca ___ sabbia. (su + la)", accept: ["sulla"], explain: "su+la = **sulla**." }
      ]
    },
    {
      id: "g_reflexive",
      title: "Reflexive Verben (mi alzo, mi occupo…)",
      cefr: "A2",
      rule: "Reflexivpronomen vor dem Verb: **mi, ti, si, ci, vi, si**.\nalzarsi: mi alz**o**, ti alz**i**, si alz**a**, ci alz**iamo**, vi alz**ate**, si alz**ano**.\nNach Modalverb/Infinitiv wird das Pronomen **angehängt & angepasst**: *voglio alzarmi, devo occuparmi*.",
      exercises: [
        { kind: "fill", prompt: "La mattina io ___ (alzarsi) presto.", accept: ["mi alzo"], explain: "io → **mi alzo**." },
        { kind: "fill", prompt: "Il bambino ___ (mettersi) in piedi.", accept: ["si mette"], explain: "lui/lei → **si mette**." },
        { kind: "fill", prompt: "Noi ___ (svegliarsi) alle sette.", accept: ["ci svegliamo"], explain: "noi → **ci svegliamo**." },
        { kind: "choice", prompt: "Voglio ___ del bucato.", options: ["occuparmi", "occuparsi", "mi occupare"], answer: "occuparmi", explain: "nach Modalverb angehängt & angepasst: **occuparmi**." },
        { kind: "fill", prompt: "A che ora ___ (tu, alzarsi)?", accept: ["ti alzi"], explain: "tu → **ti alzi**." },
        { kind: "choice", prompt: "I bambini ___ al mare.", options: ["si riposano", "si riposa", "ci riposano"], answer: "si riposano", explain: "loro → **si riposano**." }
      ]
    },
    {
      id: "g_modal",
      title: "Modalverben: potere, volere, dovere",
      cefr: "A2",
      rule: "Unregelmäßig im Präsens, danach **+ Infinitiv**:\n**potere** (können): posso, puoi, può, possiamo, potete, possono.\n**volere** (wollen): voglio, vuoi, vuole, vogliamo, volete, vogliono.\n**dovere** (müssen): devo, devi, deve, dobbiamo, dovete, devono.",
      exercises: [
        { kind: "fill", prompt: "___ (io, volere) un caffè.", accept: ["voglio"], explain: "io volere → **voglio**." },
        { kind: "fill", prompt: "Non ___ (noi, potere) venire stasera.", accept: ["possiamo"], explain: "noi potere → **possiamo**." },
        { kind: "fill", prompt: "Il bambino ___ (dovere) dormire.", accept: ["deve"], explain: "lui dovere → **deve**." },
        { kind: "choice", prompt: "___ aiutarmi, per favore?", options: ["Puoi", "Poti", "Vuoi"], answer: "Puoi", explain: "tu potere → **puoi**." },
        { kind: "fill", prompt: "Loro ___ (volere) andare al mare.", accept: ["vogliono"], explain: "loro volere → **vogliono**." },
        { kind: "choice", prompt: "Che cosa ___ mangiare, ragazzi?", options: ["volete", "vogliete", "volere"], answer: "volete", explain: "voi volere → **volete**." }
      ]
    },
    {
      id: "g_pronouns",
      title: "Objektpronomen (direkt & indirekt)",
      cefr: "A2",
      rule: "**Direkt** (wen/was): mi, ti, **lo, la**, ci, vi, **li, le**. → *Lo vedo* (ich sehe ihn).\n**Indirekt** (wem): mi, ti, **gli, le**, ci, vi, **gli**. → *Le parlo* (ich spreche mit ihr).\nlo/la werden vor Vokal zu **l'**: *L'amo*.",
      exercises: [
        { kind: "choice", prompt: "Vedi Marco? Sì, ___ vedo.", options: ["lo", "gli", "la"], answer: "lo", explain: "Marco = direktes Objekt maskulin → **lo**." },
        { kind: "choice", prompt: "Scrivo a Maria: ___ scrivo una mail.", options: ["le", "la", "gli"], answer: "le", explain: "'a Maria' = indirekt feminin → **le**." },
        { kind: "choice", prompt: "Conosci i miei amici? No, non ___ conosco.", options: ["li", "gli", "le"], answer: "li", explain: "'i miei amici' = direkt mask. Plural → **li**." },
        { kind: "choice", prompt: "Do il regalo a Luca: ___ do il regalo.", options: ["gli", "lo", "le"], answer: "gli", explain: "'a Luca' = indirekt maskulin → **gli**." },
        { kind: "choice", prompt: "Ami tua sorella? Sì, ___ amo.", options: ["l'", "la", "le"], answer: "l'", explain: "la + amo → **l'amo** (vor Vokal)." },
        { kind: "choice", prompt: "Chiami la nonna? Sì, ___ chiamo.", options: ["la", "le", "lo"], answer: "la", explain: "'la nonna' = direkt feminin → **la**." }
      ]
    },
    {
      id: "g_comparativo",
      title: "Komparativ (più… di / meno… di / come)",
      cefr: "A2",
      rule: "**più … di** = mehr als · **meno … di** = weniger als · **(così)… come** = so … wie.\n*di* verschmilzt mit Artikel: più grande **della** casa.\nVor zwei Nomen im Vergleich steht **che**: *più turisti **che** abitanti*.",
      exercises: [
        { kind: "fill", prompt: "Roma è più grande ___ Bologna.", accept: ["di"], explain: "Vergleich → **di**." },
        { kind: "fill", prompt: "Marco è più alto ___ me.", accept: ["di"], explain: "vor Pronomen → **di me**." },
        { kind: "choice", prompt: "Questo gelato è ___ caro di quello.", options: ["meno", "come", "che"], answer: "meno", explain: "'weniger teuer als' → **meno … di**." },
        { kind: "fill", prompt: "Lei è alta ___ te. (so groß wie)", accept: ["come"], explain: "'so … wie' → **come**." },
        { kind: "choice", prompt: "Ci sono più turisti ___ abitanti.", options: ["che", "di", "come"], answer: "che", explain: "Vergleich zweier Nomen → **che**." },
        { kind: "fill", prompt: "Oggi ho più tempo ___ ieri.", accept: ["di"], explain: "più … di → **di**." }
      ]
    },
    {
      id: "g_stare",
      title: "stare + gerundio & stare per (gerade / kurz davor)",
      cefr: "A2",
      rule: "**stare + gerundio** = gerade dabei sein: *sto mangiando, stai facendo*.\nGerundio: -are → **-ando**, -ere/-ire → **-endo**.\n**stare per + Infinitiv** = kurz davor: *sto per partire, il treno sta per arrivare*.",
      exercises: [
        { kind: "fill", prompt: "Il traghetto ___ per partire. (stare)", accept: ["sta"], explain: "lui/lei stare → **sta** per partire." },
        { kind: "fill", prompt: "Sto ___ (mangiare) adesso.", accept: ["mangiando"], explain: "-are → **-ando**." },
        { kind: "fill", prompt: "Che cosa stai ___ (fare)?", accept: ["facendo"], explain: "fare → **facendo**." },
        { kind: "choice", prompt: "I bambini stanno ___.", options: ["dormendo", "dormando", "dormire"], answer: "dormendo", explain: "-ire → **-endo**: dormendo." },
        { kind: "choice", prompt: "___ per uscire. (io)", options: ["Sto", "Vado", "Faccio"], answer: "Sto", explain: "kurz davor → **sto per**." },
        { kind: "fill", prompt: "Stiamo ___ (preparare) la cena.", accept: ["preparando"], explain: "-are → **-ando**." }
      ]
    },

    /* ===================== B1-MODULE ===================== */
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
    },
    {
      id: "b1_impf_vs_pp",
      title: "Imperfetto vs. Passato Prossimo",
      cefr: "B1",
      rule: "**Imperfetto** = Hintergrund, Zustände, Gewohnheiten, gleichzeitige Handlungen ('war', 'immer').\n**Passato Prossimo** = eine abgeschlossene, einmalige Handlung.\nOft zusammen: *Mentre cucinavo (Imperf.), è arrivato Marco (P.P.)*.",
      exercises: [
        { kind: "choice", prompt: "Mentre ___ (io, cucinare), è arrivato Marco.", options: ["cucinavo", "ho cucinato"], answer: "cucinavo", explain: "gleichzeitiger Hintergrund → **Imperfetto**." },
        { kind: "choice", prompt: "Ieri ___ (noi) al mare.", options: ["siamo andati", "andavamo"], answer: "siamo andati", explain: "einmalig, abgeschlossen → **Passato Prossimo**." },
        { kind: "choice", prompt: "Da bambino ___ sempre a calcio.", options: ["giocavo", "ho giocato"], answer: "giocavo", explain: "Gewohnheit ('immer') → **Imperfetto**." },
        { kind: "fill", prompt: "Quando ___ (io, essere) piccola, abitavo a Roma.", accept: ["ero"], explain: "Zustand → Imperfetto: **ero**." },
        { kind: "choice", prompt: "Improvvisamente il telefono ___.", options: ["ha suonato", "suonava"], answer: "ha suonato", explain: "plötzliche Einzelhandlung → **Passato Prossimo**." },
        { kind: "choice", prompt: "___ bel tempo, così siamo usciti.", options: ["Faceva", "Ha fatto"], answer: "Faceva", explain: "Hintergrund/Beschreibung → **Imperfetto**." }
      ]
    },
    {
      id: "b1_congiuntivo",
      title: "Congiuntivo presente",
      cefr: "B1",
      rule: "Nach *penso che, credo che, voglio che, è importante che, benché, spero che* steht der **Congiuntivo**.\n-are → **-i** (che io parli), -ere/-ire → **-a** (che io prenda, dorma).\nUnregelmäßig: **sia** (essere), **abbia** (avere), **faccia** (fare), **vada** (andare).",
      exercises: [
        { kind: "fill", prompt: "Penso che Marco ___ (essere) stanco.", accept: ["sia"], explain: "essere → **sia**." },
        { kind: "fill", prompt: "Voglio che tu ___ (venire) con me.", accept: ["venga"], explain: "venire → **venga**." },
        { kind: "choice", prompt: "È importante che il bambino ___ presto.", options: ["dorma", "dorme"], answer: "dorma", explain: "Congiuntivo: **dorma**." },
        { kind: "fill", prompt: "Spero che domani ___ (fare) bel tempo.", accept: ["faccia"], explain: "fare → **faccia**." },
        { kind: "choice", prompt: "Credo che loro ___ ragione.", options: ["abbiano", "hanno"], answer: "abbiano", explain: "avere Congiuntivo loro → **abbiano**." },
        { kind: "choice", prompt: "Benché ___ stanca, esco.", options: ["sia", "sono"], answer: "sia", explain: "nach *benché* → Congiuntivo **sia**." }
      ]
    },
    {
      id: "b1_ci_ne",
      title: "Ci & Ne",
      cefr: "B1",
      rule: "**ci** ersetzt einen Ort oder 'daran/darüber': *Ci vado* (da gehe ich hin), *Ci penso* (ich denke daran).\n**ne** = 'davon/darüber': *Ne voglio due* (davon will ich zwei), *Ne parliamo* (wir reden darüber).",
      exercises: [
        { kind: "fill", prompt: "Vai a Roma? Sì, ___ vado domani.", accept: ["ci"], explain: "Ort → **ci**." },
        { kind: "fill", prompt: "Quante mele vuoi? ___ voglio due.", accept: ["ne"], explain: "'davon' → **ne**." },
        { kind: "choice", prompt: "Pensi al lavoro? Sì, ___ penso spesso.", options: ["ci", "ne"], answer: "ci", explain: "pensare a → **ci**." },
        { kind: "choice", prompt: "Parli del problema? Sì, ___ parlo.", options: ["ne", "ci"], answer: "ne", explain: "parlare di → **ne**." },
        { kind: "fill", prompt: "Sei mai stato in Italia? Sì, ___ sono stato.", accept: ["ci"], explain: "Ort → **ci sono stato**." },
        { kind: "fill", prompt: "Hai del pane? Sì, ___ ho un po'.", accept: ["ne"], explain: "Menge 'davon' → **ne**." }
      ]
    },
    {
      id: "b1_pronomi_combinati",
      title: "Pronomi combinati (glielo, me lo…)",
      cefr: "B1",
      rule: "Indirekt **vor** direkt, und **i → e**: mi+lo = **me lo**, ti+la = **te la**, ci+lo = **ce lo**, vi+le = **ve le**.\ngli/le + lo/la/li/le verschmelzen zu **glielo, gliela, glieli, gliele** (für ihm UND ihr).",
      exercises: [
        { kind: "choice", prompt: "Mi dai il libro? Sì, ___ do.", options: ["me lo", "mi lo", "te lo"], answer: "me lo", explain: "mi+lo → **me lo**." },
        { kind: "choice", prompt: "Do il regalo a Luca: ___ do.", options: ["glielo", "gli lo", "lo gli"], answer: "glielo", explain: "gli+lo → **glielo**." },
        { kind: "choice", prompt: "Ci portano il conto: ___ portano.", options: ["ce lo", "ci lo", "ce li"], answer: "ce lo", explain: "ci+lo → **ce lo**." },
        { kind: "choice", prompt: "Ti mando la foto: ___ mando.", options: ["te la", "ti la", "me la"], answer: "te la", explain: "ti+la → **te la**." },
        { kind: "choice", prompt: "Le spiego la regola: ___ spiego.", options: ["gliela", "glielo", "le la"], answer: "gliela", explain: "le+la → **gliela**." },
        { kind: "choice", prompt: "Vi do le chiavi: ___ do.", options: ["ve le", "vi le", "ce le"], answer: "ve le", explain: "vi+le → **ve le**." }
      ]
    },
    {
      id: "b1_relative",
      title: "Relativsätze (che, cui)",
      cefr: "B1",
      rule: "**che** = der/die/das/den (Subjekt oder Objekt, ohne Präposition): *Il libro **che** leggo*.\n**cui** = nach einer **Präposition**: *la città in **cui** abito, l'amica con **cui** esco, il motivo per **cui**…*",
      exercises: [
        { kind: "fill", prompt: "Ho un fratello ___ vive a Roma.", accept: ["che"], explain: "Subjekt, keine Präposition → **che**." },
        { kind: "choice", prompt: "La città in ___ abito è Bologna.", options: ["cui", "che"], answer: "cui", explain: "nach Präposition → **cui**." },
        { kind: "fill", prompt: "Il libro ___ leggo è interessante.", accept: ["che"], explain: "direktes Objekt → **che**." },
        { kind: "choice", prompt: "L'amica con ___ esco è simpatica.", options: ["cui", "che"], answer: "cui", explain: "con + **cui**." },
        { kind: "fill", prompt: "La ragazza ___ ho visto è mia sorella.", accept: ["che"], explain: "Objekt → **che**." },
        { kind: "choice", prompt: "Il motivo per ___ sono qui è semplice.", options: ["cui", "che"], answer: "cui", explain: "per + **cui**." }
      ]
    },
    {
      id: "b1_trapassato",
      title: "Trapassato Prossimo (Vorvergangenheit)",
      cefr: "B1",
      rule: "Das **Trapassato** beschreibt etwas, das **vor** einer anderen Vergangenheit passiert war ('hatte gemacht').\nGebildet mit **Imperfetto von avere/essere + Partizip**: *avevo mangiato, ero andato/a*.",
      exercises: [
        { kind: "fill", prompt: "Quando sono arrivato, lui aveva già ___ (mangiare).", accept: ["mangiato"], explain: "aveva + **mangiato**." },
        { kind: "choice", prompt: "Non sono venuto perché ___ troppo.", options: ["avevo lavorato", "ho lavorato"], answer: "avevo lavorato", explain: "vorher passiert → **Trapassato**." },
        { kind: "fill", prompt: "Lei ___ (essere) già partita quando ho chiamato.", accept: ["era"], explain: "essere Imperfetto: **era** partita." },
        { kind: "fill", prompt: "Avevo ___ (finire) prima di uscire.", accept: ["finito"], explain: "avevo + **finito**." },
        { kind: "choice", prompt: "Ho mangiato la torta che tu ___.", options: ["avevi fatto", "hai fatto"], answer: "avevi fatto", explain: "vorher gebacken → **Trapassato**." }
      ]
    },
    {
      id: "b1_imperativo",
      title: "Imperativ (Befehl/Aufforderung)",
      cefr: "B1",
      rule: "**Informell (tu):** -are → **-a** (parla!), -ere/-ire → **-i** (prendi!, dormi!).\n**Verneint (tu):** non + Infinitiv → *non parlare!*\n**Höflich (Lei):** parli!, prenda!, dorma!\nUnregelmäßig (tu): **va', fa', da', di', sta'**.",
      exercises: [
        { kind: "fill", prompt: "___ (tu, parlare) più piano!", accept: ["parla"], explain: "-are tu → **parla!**" },
        { kind: "choice", prompt: "___ così forte! (tu, verneint)", options: ["Non parlare", "Non parli", "Non parla"], answer: "Non parlare", explain: "verneint tu → non + Infinitiv." },
        { kind: "fill", prompt: "___ (tu, prendere) il libro!", accept: ["prendi"], explain: "-ere tu → **prendi!**" },
        { kind: "choice", prompt: "Signora, ___! (entrare, höflich)", options: ["entri", "entra", "entrare"], answer: "entri", explain: "höflich Lei → **entri!**" },
        { kind: "fill", prompt: "___ (tu, dormire) bene!", accept: ["dormi"], explain: "-ire tu → **dormi!**" },
        { kind: "choice", prompt: "___ attenzione! (tu, fare)", options: ["Fa'", "Fai", "Fa"], answer: "Fa'", explain: "unregelmäßig tu: **fa'** (auch 'fai')." }
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
        { topic: "Zusammengesetzte Präpositionen (nel, sul, al…)", moduleId: "g_prep_articolate", status: "ready" },
        { topic: "Passato Prossimo (avere/essere)", moduleId: "g_passato_prossimo", status: "ready" },
        { topic: "Possessivpronomen & Familie", moduleId: "g_possessive", status: "ready" },
        { topic: "Reflexive Verben (mi alzo, mi occupo…)", moduleId: "g_reflexive", status: "ready" },
        { topic: "Modalverben (potere, volere, dovere)", moduleId: "g_modal", status: "ready" },
        { topic: "Direkte & indirekte Objektpronomen", moduleId: "g_pronouns", status: "ready" },
        { topic: "Komparativ (più… di / meno… di / come)", moduleId: "g_comparativo", status: "ready" },
        { topic: "stare + gerundio & stare per", moduleId: "g_stare", status: "ready" }
      ]
    },
    B1: {
      grammar: [
        { topic: "Imperfetto", moduleId: "b1_imperfetto", status: "ready" },
        { topic: "Imperfetto vs. Passato Prossimo", moduleId: "b1_impf_vs_pp", status: "ready" },
        { topic: "Trapassato Prossimo", moduleId: "b1_trapassato", status: "ready" },
        { topic: "Futuro semplice", moduleId: "b1_futuro", status: "ready" },
        { topic: "Condizionale presente", moduleId: "b1_condizionale", status: "ready" },
        { topic: "Congiuntivo presente", moduleId: "b1_congiuntivo", status: "ready" },
        { topic: "Ci & Ne", moduleId: "b1_ci_ne", status: "ready" },
        { topic: "Pronomi combinati (glielo, me lo…)", moduleId: "b1_pronomi_combinati", status: "ready" },
        { topic: "Relativsätze (che, cui)", moduleId: "b1_relative", status: "ready" },
        { topic: "Imperativ (informell & höflich)", moduleId: "b1_imperativo", status: "ready" }
      ]
    }
  }
};
