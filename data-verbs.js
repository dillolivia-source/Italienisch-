/*
 * window.VERB_DATA – Präsens-Konjugationen der häufigsten italienischen Verben.
 * Für den Konjugations-Trainer (Tab „Verben"). Jede Vokabel-artige Karte ist EIN
 * Verb; die Abfrage fragt einzelne Personen ab (Vokabelkasten-/Leitner-Logik).
 *
 * Format je Verb:
 *   { id, inf, de, type, forms:[io, tu, lui/lei, noi, voi, loro] }
 *   type: "are" | "ere" | "ire" | "isc" | "irr"
 *
 * Personen-Reihenfolge IMMER: io · tu · lui/lei · noi · voi · loro
 * Regelmäßige Formen sind bewusst ausgeschrieben (nicht generiert), damit die
 * App offline ohne Regel-Logik auskommt; ein Prüfskript vergleicht sie mit den
 * Bildungsregeln (inkl. -care/-gare→h, -iare→ein i, -isc-).
 */
window.VERB_DATA = {
  pronouns: ["io", "tu", "lui/lei", "noi", "voi", "loro"],
  typeLabel: {
    are: "regelmäßig · -are",
    ere: "regelmäßig · -ere",
    ire: "regelmäßig · -ire",
    isc: "regelmäßig · -ire (-isc-)",
    irr: "unregelmäßig"
  },
  verbs: [
    /* ---------- Unregelmäßige Kernverben ---------- */
    { id: "essere",   inf: "essere",   de: "sein",              type: "irr", forms: ["sono","sei","è","siamo","siete","sono"] },
    { id: "avere",    inf: "avere",    de: "haben",             type: "irr", forms: ["ho","hai","ha","abbiamo","avete","hanno"] },
    { id: "fare",     inf: "fare",     de: "machen, tun",       type: "irr", forms: ["faccio","fai","fa","facciamo","fate","fanno"] },
    { id: "dire",     inf: "dire",     de: "sagen",             type: "irr", forms: ["dico","dici","dice","diciamo","dite","dicono"] },
    { id: "potere",   inf: "potere",   de: "können",            type: "irr", forms: ["posso","puoi","può","possiamo","potete","possono"] },
    { id: "volere",   inf: "volere",   de: "wollen",            type: "irr", forms: ["voglio","vuoi","vuole","vogliamo","volete","vogliono"] },
    { id: "dovere",   inf: "dovere",   de: "müssen",            type: "irr", forms: ["devo","devi","deve","dobbiamo","dovete","devono"] },
    { id: "sapere",   inf: "sapere",   de: "wissen, können",    type: "irr", forms: ["so","sai","sa","sappiamo","sapete","sanno"] },
    { id: "stare",    inf: "stare",    de: "sein, sich fühlen", type: "irr", forms: ["sto","stai","sta","stiamo","state","stanno"] },
    { id: "andare",   inf: "andare",   de: "gehen, fahren",     type: "irr", forms: ["vado","vai","va","andiamo","andate","vanno"] },
    { id: "venire",   inf: "venire",   de: "kommen",            type: "irr", forms: ["vengo","vieni","viene","veniamo","venite","vengono"] },
    { id: "dare",     inf: "dare",     de: "geben",             type: "irr", forms: ["do","dai","dà","diamo","date","danno"] },
    { id: "tenere",   inf: "tenere",   de: "halten",            type: "irr", forms: ["tengo","tieni","tiene","teniamo","tenete","tengono"] },
    { id: "rimanere", inf: "rimanere", de: "bleiben",           type: "irr", forms: ["rimango","rimani","rimane","rimaniamo","rimanete","rimangono"] },
    { id: "bere",     inf: "bere",     de: "trinken",           type: "irr", forms: ["bevo","bevi","beve","beviamo","bevete","bevono"] },
    { id: "uscire",   inf: "uscire",   de: "hinausgehen",       type: "irr", forms: ["esco","esci","esce","usciamo","uscite","escono"] },
    { id: "riuscire", inf: "riuscire", de: "schaffen, gelingen",type: "irr", forms: ["riesco","riesci","riesce","riusciamo","riuscite","riescono"] },
    { id: "salire",   inf: "salire",   de: "hinaufsteigen",     type: "irr", forms: ["salgo","sali","sale","saliamo","salite","salgono"] },
    { id: "morire",   inf: "morire",   de: "sterben",           type: "irr", forms: ["muoio","muori","muore","moriamo","morite","muoiono"] },
    { id: "scegliere",inf: "scegliere",de: "wählen",            type: "irr", forms: ["scelgo","scegli","sceglie","scegliamo","scegliete","scelgono"] },
    { id: "togliere", inf: "togliere", de: "wegnehmen",         type: "irr", forms: ["tolgo","togli","toglie","togliamo","togliete","tolgono"] },
    { id: "spegnere", inf: "spegnere", de: "ausschalten",       type: "irr", forms: ["spengo","spegni","spegne","spegniamo","spegnete","spengono"] },

    /* ---------- Regelmäßig auf -are ---------- */
    { id: "parlare",     inf: "parlare",     de: "sprechen",          type: "are", forms: ["parlo","parli","parla","parliamo","parlate","parlano"] },
    { id: "trovare",     inf: "trovare",     de: "finden",            type: "are", forms: ["trovo","trovi","trova","troviamo","trovate","trovano"] },
    { id: "lasciare",    inf: "lasciare",    de: "lassen",            type: "are", forms: ["lascio","lasci","lascia","lasciamo","lasciate","lasciano"] },
    { id: "guardare",    inf: "guardare",    de: "schauen, ansehen",  type: "are", forms: ["guardo","guardi","guarda","guardiamo","guardate","guardano"] },
    { id: "passare",     inf: "passare",     de: "vorbeigehen, verbringen", type: "are", forms: ["passo","passi","passa","passiamo","passate","passano"] },
    { id: "portare",     inf: "portare",     de: "bringen, tragen",   type: "are", forms: ["porto","porti","porta","portiamo","portate","portano"] },
    { id: "pensare",     inf: "pensare",     de: "denken",            type: "are", forms: ["penso","pensi","pensa","pensiamo","pensate","pensano"] },
    { id: "tornare",     inf: "tornare",     de: "zurückkehren",      type: "are", forms: ["torno","torni","torna","torniamo","tornate","tornano"] },
    { id: "aspettare",   inf: "aspettare",   de: "warten",            type: "are", forms: ["aspetto","aspetti","aspetta","aspettiamo","aspettate","aspettano"] },
    { id: "cercare",     inf: "cercare",     de: "suchen",            type: "are", forms: ["cerco","cerchi","cerca","cerchiamo","cercate","cercano"] },
    { id: "chiamare",    inf: "chiamare",    de: "rufen, heißen",     type: "are", forms: ["chiamo","chiami","chiama","chiamiamo","chiamate","chiamano"] },
    { id: "sembrare",    inf: "sembrare",    de: "scheinen, wirken",  type: "are", forms: ["sembro","sembri","sembra","sembriamo","sembrate","sembrano"] },
    { id: "entrare",     inf: "entrare",     de: "eintreten",         type: "are", forms: ["entro","entri","entra","entriamo","entrate","entrano"] },
    { id: "ricordare",   inf: "ricordare",   de: "erinnern",          type: "are", forms: ["ricordo","ricordi","ricorda","ricordiamo","ricordate","ricordano"] },
    { id: "arrivare",    inf: "arrivare",    de: "ankommen",          type: "are", forms: ["arrivo","arrivi","arriva","arriviamo","arrivate","arrivano"] },
    { id: "diventare",   inf: "diventare",   de: "werden",            type: "are", forms: ["divento","diventi","diventa","diventiamo","diventate","diventano"] },
    { id: "mangiare",    inf: "mangiare",    de: "essen",             type: "are", forms: ["mangio","mangi","mangia","mangiamo","mangiate","mangiano"] },
    { id: "comprare",    inf: "comprare",    de: "kaufen",            type: "are", forms: ["compro","compri","compra","compriamo","comprate","comprano"] },
    { id: "giocare",     inf: "giocare",     de: "spielen",           type: "are", forms: ["gioco","giochi","gioca","giochiamo","giocate","giocano"] },
    { id: "lavorare",    inf: "lavorare",    de: "arbeiten",          type: "are", forms: ["lavoro","lavori","lavora","lavoriamo","lavorate","lavorano"] },
    { id: "studiare",    inf: "studiare",    de: "lernen, studieren", type: "are", forms: ["studio","studi","studia","studiamo","studiate","studiano"] },
    { id: "amare",       inf: "amare",       de: "lieben",            type: "are", forms: ["amo","ami","ama","amiamo","amate","amano"] },
    { id: "ascoltare",   inf: "ascoltare",   de: "zuhören",           type: "are", forms: ["ascolto","ascolti","ascolta","ascoltiamo","ascoltate","ascoltano"] },
    { id: "guidare",     inf: "guidare",     de: "fahren, lenken",    type: "are", forms: ["guido","guidi","guida","guidiamo","guidate","guidano"] },
    { id: "cominciare",  inf: "cominciare",  de: "beginnen",          type: "are", forms: ["comincio","cominci","comincia","cominciamo","cominciate","cominciano"] },
    { id: "aiutare",     inf: "aiutare",     de: "helfen",            type: "are", forms: ["aiuto","aiuti","aiuta","aiutiamo","aiutate","aiutano"] },
    { id: "cambiare",    inf: "cambiare",    de: "wechseln, ändern",  type: "are", forms: ["cambio","cambi","cambia","cambiamo","cambiate","cambiano"] },
    { id: "incontrare",  inf: "incontrare",  de: "treffen",           type: "are", forms: ["incontro","incontri","incontra","incontriamo","incontrate","incontrano"] },
    { id: "spiegare",    inf: "spiegare",    de: "erklären",          type: "are", forms: ["spiego","spieghi","spiega","spieghiamo","spiegate","spiegano"] },
    { id: "pagare",      inf: "pagare",      de: "zahlen",            type: "are", forms: ["pago","paghi","paga","paghiamo","pagate","pagano"] },
    { id: "abitare",     inf: "abitare",     de: "wohnen",            type: "are", forms: ["abito","abiti","abita","abitiamo","abitate","abitano"] },
    { id: "lavare",      inf: "lavare",      de: "waschen",           type: "are", forms: ["lavo","lavi","lava","laviamo","lavate","lavano"] },
    { id: "cucinare",    inf: "cucinare",    de: "kochen",            type: "are", forms: ["cucino","cucini","cucina","cuciniamo","cucinate","cucinano"] },
    { id: "suonare",     inf: "suonare",     de: "spielen, klingeln", type: "are", forms: ["suono","suoni","suona","suoniamo","suonate","suonano"] },
    { id: "viaggiare",   inf: "viaggiare",   de: "reisen",            type: "are", forms: ["viaggio","viaggi","viaggia","viaggiamo","viaggiate","viaggiano"] },
    { id: "telefonare",  inf: "telefonare",  de: "telefonieren",      type: "are", forms: ["telefono","telefoni","telefona","telefoniamo","telefonate","telefonano"] },
    { id: "camminare",   inf: "camminare",   de: "gehen, laufen",     type: "are", forms: ["cammino","cammini","cammina","camminiamo","camminate","camminano"] },
    { id: "dimenticare", inf: "dimenticare", de: "vergessen",         type: "are", forms: ["dimentico","dimentichi","dimentica","dimentichiamo","dimenticate","dimenticano"] },
    { id: "sperare",     inf: "sperare",     de: "hoffen",            type: "are", forms: ["spero","speri","spera","speriamo","sperate","sperano"] },
    { id: "provare",     inf: "provare",     de: "versuchen, probieren", type: "are", forms: ["provo","provi","prova","proviamo","provate","provano"] },
    { id: "usare",       inf: "usare",       de: "benutzen",          type: "are", forms: ["uso","usi","usa","usiamo","usate","usano"] },
    { id: "tagliare",    inf: "tagliare",    de: "schneiden",         type: "are", forms: ["taglio","tagli","taglia","tagliamo","tagliate","tagliano"] },
    { id: "cantare",     inf: "cantare",     de: "singen",            type: "are", forms: ["canto","canti","canta","cantiamo","cantate","cantano"] },

    /* ---------- Regelmäßig auf -ere ---------- */
    { id: "vedere",    inf: "vedere",    de: "sehen",             type: "ere", forms: ["vedo","vedi","vede","vediamo","vedete","vedono"] },
    { id: "prendere",  inf: "prendere",  de: "nehmen",            type: "ere", forms: ["prendo","prendi","prende","prendiamo","prendete","prendono"] },
    { id: "credere",   inf: "credere",   de: "glauben",           type: "ere", forms: ["credo","credi","crede","crediamo","credete","credono"] },
    { id: "mettere",   inf: "mettere",   de: "stellen, legen",    type: "ere", forms: ["metto","metti","mette","mettiamo","mettete","mettono"] },
    { id: "vivere",    inf: "vivere",    de: "leben",             type: "ere", forms: ["vivo","vivi","vive","viviamo","vivete","vivono"] },
    { id: "chiedere",  inf: "chiedere",  de: "fragen, bitten",    type: "ere", forms: ["chiedo","chiedi","chiede","chiediamo","chiedete","chiedono"] },
    { id: "leggere",   inf: "leggere",   de: "lesen",             type: "ere", forms: ["leggo","leggi","legge","leggiamo","leggete","leggono"] },
    { id: "scrivere",  inf: "scrivere",  de: "schreiben",         type: "ere", forms: ["scrivo","scrivi","scrive","scriviamo","scrivete","scrivono"] },
    { id: "perdere",   inf: "perdere",   de: "verlieren",         type: "ere", forms: ["perdo","perdi","perde","perdiamo","perdete","perdono"] },
    { id: "chiudere",  inf: "chiudere",  de: "schließen",         type: "ere", forms: ["chiudo","chiudi","chiude","chiudiamo","chiudete","chiudono"] },
    { id: "conoscere", inf: "conoscere", de: "kennen",            type: "ere", forms: ["conosco","conosci","conosce","conosciamo","conoscete","conoscono"] },
    { id: "correre",   inf: "correre",   de: "rennen, laufen",    type: "ere", forms: ["corro","corri","corre","corriamo","correte","corrono"] },
    { id: "decidere",  inf: "decidere",  de: "entscheiden",       type: "ere", forms: ["decido","decidi","decide","decidiamo","decidete","decidono"] },
    { id: "ripetere",  inf: "ripetere",  de: "wiederholen",       type: "ere", forms: ["ripeto","ripeti","ripete","ripetiamo","ripetete","ripetono"] },
    { id: "rispondere",inf: "rispondere",de: "antworten",         type: "ere", forms: ["rispondo","rispondi","risponde","rispondiamo","rispondete","rispondono"] },
    { id: "ricevere",  inf: "ricevere",  de: "erhalten",          type: "ere", forms: ["ricevo","ricevi","riceve","riceviamo","ricevete","ricevono"] },
    { id: "vincere",   inf: "vincere",   de: "gewinnen",          type: "ere", forms: ["vinco","vinci","vince","vinciamo","vincete","vincono"] },
    { id: "spendere",  inf: "spendere",  de: "ausgeben",          type: "ere", forms: ["spendo","spendi","spende","spendiamo","spendete","spendono"] },
    { id: "vendere",   inf: "vendere",   de: "verkaufen",         type: "ere", forms: ["vendo","vendi","vende","vendiamo","vendete","vendono"] },
    { id: "piangere",  inf: "piangere",  de: "weinen",            type: "ere", forms: ["piango","piangi","piange","piangiamo","piangete","piangono"] },

    /* ---------- Regelmäßig auf -ire ---------- */
    { id: "sentire", inf: "sentire", de: "hören, fühlen",  type: "ire", forms: ["sento","senti","sente","sentiamo","sentite","sentono"] },
    { id: "dormire", inf: "dormire", de: "schlafen",       type: "ire", forms: ["dormo","dormi","dorme","dormiamo","dormite","dormono"] },
    { id: "aprire",  inf: "aprire",  de: "öffnen",         type: "ire", forms: ["apro","apri","apre","apriamo","aprite","aprono"] },
    { id: "offrire", inf: "offrire", de: "anbieten",       type: "ire", forms: ["offro","offri","offre","offriamo","offrite","offrono"] },
    { id: "seguire", inf: "seguire", de: "folgen",         type: "ire", forms: ["seguo","segui","segue","seguiamo","seguite","seguono"] },
    { id: "partire", inf: "partire", de: "abfahren",       type: "ire", forms: ["parto","parti","parte","partiamo","partite","partono"] },
    { id: "servire", inf: "servire", de: "dienen, brauchen", type: "ire", forms: ["servo","servi","serve","serviamo","servite","servono"] },

    /* ---------- Regelmäßig auf -ire mit -isc- ---------- */
    { id: "capire",    inf: "capire",    de: "verstehen",     type: "isc", forms: ["capisco","capisci","capisce","capiamo","capite","capiscono"] },
    { id: "finire",    inf: "finire",    de: "beenden",       type: "isc", forms: ["finisco","finisci","finisce","finiamo","finite","finiscono"] },
    { id: "preferire", inf: "preferire", de: "vorziehen",     type: "isc", forms: ["preferisco","preferisci","preferisce","preferiamo","preferite","preferiscono"] },
    { id: "pulire",    inf: "pulire",    de: "putzen",        type: "isc", forms: ["pulisco","pulisci","pulisce","puliamo","pulite","puliscono"] },
    { id: "costruire", inf: "costruire", de: "bauen",         type: "isc", forms: ["costruisco","costruisci","costruisce","costruiamo","costruite","costruiscono"] },
    { id: "spedire",   inf: "spedire",   de: "verschicken",   type: "isc", forms: ["spedisco","spedisci","spedisce","spediamo","spedite","spediscono"] },
    { id: "guarire",   inf: "guarire",   de: "heilen, gesund werden", type: "isc", forms: ["guarisco","guarisci","guarisce","guariamo","guarite","guariscono"] },
    { id: "unire",     inf: "unire",     de: "verbinden",     type: "isc", forms: ["unisco","unisci","unisce","uniamo","unite","uniscono"] }
  ]
};
