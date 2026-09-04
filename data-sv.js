/*
 * window.SV – Schwedische Übersetzungen der "bekannten Seite".
 * Lernziel bleibt ITALIENISCH; nur die deutschen Bedeutungen/Texte werden
 * für schwedischsprachige Lernende ins Schwedische übersetzt.
 * Was hier fehlt, fällt automatisch auf Deutsch zurück (stufenweiser Ausbau).
 */
window.SV = {
  // Menü-, Knopf- und Feedback-Texte: Schlüssel = deutscher Originaltext
  ui: {
    // Tabs / Schnellzugriffe
    "Lektion": "Lektion",
    "Übersetzen": "Översätt",
    "Vokabeln": "Glosor",
    "Verben": "Verb",
    "Statistik": "Statistik",
    // Knöpfe
    "Prüfen": "Rätta",
    "Weiter →": "Nästa →",
    "Lektion starten →": "Starta lektion →",
    "Trotzdem üben →": "Öva ändå →",
    "▶ Jetzt üben": "▶ Öva nu",
    "kenne ich ✓": "kan redan ✓",
    "Verstanden, abfragen →": "Klart, testa →",
    "war doch richtig ✓": "var ändå rätt ✓",
    "😌 Sitzt schon – erstmal pausieren": "😌 Kan redan – pausa ett tag",
    // Aufforderungen / Hinweise
    "Tippe auf Italienisch:": "Skriv på italienska:",
    "Tippe die italienische Übersetzung:": "Skriv den italienska översättningen:",
    "👆 Wort antippen, das du nicht kennst": "👆 Tryck på ett ord du inte kan",
    // Feedback
    "✓ Richtig!": "✓ Rätt!",
    "✗ Nicht ganz": "✗ Inte riktigt",
    "≈ Fast! Nur die Akzente": "≈ Nästan! Bara accenterna",
    "≈ Fast! Nur die Akzente stimmen nicht": "≈ Nästan! Bara accenterna stämmer inte",
    "Lösung zeigen": "Visa svar",
    "deine Eingabe": "ditt svar",
    "richtig": "rätt",
    // Start-/Fokus-Screen
    "Niveau ": "Nivå ",
    "Deine erste Lektion wartet": "Din första lektion väntar",
    "Weiter mit deiner nächsten Lektion": "Fortsätt med nästa lektion",
    "Heute geschafft – morgen geht es weiter": "Klart för idag – imorgon fortsätter vi",
    "Sätze aus deinem Alltag": "Meningar från din vardag",
    "Als Nächstes dran": "På tur nu",
    // Vokabel-Einführung
    "Kennst du eins schon sicher? Tippe „kenne ich“ – dann kommt ein neues Wort nach.":
      "Kan du något redan säkert? Tryck ”kan redan” – då kommer ett nytt ord.",
    // Sprachwahl (Statistik)
    "Sprache / Språk": "Sprache / Språk"
  },

  // Vokabel-Bedeutung auf Schwedisch (id → schwedisches Wort). Italienisch bleibt.
  vocab: {
    v001: "ett tåg", v002: "ett flygplan", v003: "en resväska", v004: "en biljett",
    v005: "en station", v006: "resa / åka", v007: "anlända / komma fram", v008: "notan / räkningen",
    v009: "en servitör", v010: "beställa", v011: "vatten", v012: "ett bröd",
    v013: "en frukost", v014: "en lunch", v015: "en middag", v016: "vara hungrig",
    v017: "vara törstig", v018: "en mormor / farmor", v019: "en morfar / farfar", v020: "en svärmor",
    v021: "föräldrar", v022: "en syster", v023: "en make / man", v024: "krama",
    v032: "en strand", v033: "ett hav", v034: "ett parasoll", v035: "sand",
    v036: "en baddräkt", v037: "solkräm", v038: "simma", v039: "ett hus / hem",
    v040: "ett kök", v041: "laga mat", v042: "tvätt", v043: "städa / göra rent",
    v044: "köpa", v045: "en affär / butik", v046: "idag", v047: "imorgon",
    v048: "trött", v049: "lycklig / glad", v050: "det är varmt", v051: "det är kallt",
    v052: "det regnar", v053: "en vecka", v054: "en månad", v055: "en morgon",
    v056: "en kväll", v057: "tidigt", v058: "sent", v059: "en säng",
    v060: "ett rum", v061: "ett badrum", v062: "ett fönster", v063: "en läkare / doktor",
    v064: "ett apotek", v065: "sjuk", v066: "en mataffär", v067: "pengar",
    v068: "dyr", v069: "förstå", v070: "lära sig", v071: "läsa",
    v072: "solen", v073: "ett råd", v074: "rekommendera / råda", v075: "lyckas / klara",
    v076: "hälsa", v077: "miljön", v078: "förbättra", v079: "bestämma / besluta",
    v080: "ett val / beslut", v081: "boka / reservera", v082: "en tid / ett möte", v083: "tillåta",
    v084: "förbjuden", v085: "trots", v086: "en erfarenhet", v087: "huvudvärk",
    v088: "feber", v089: "medicin", v090: "en förkylning", v091: "en tand",
    v092: "kläder", v093: "en t-shirt", v094: "byxor", v095: "skor",
    v096: "en jacka", v097: "en hatt / mössa", v098: "röd", v099: "vit",
    v100: "svart", v101: "grön", v102: "blå", v103: "gul",
    v104: "en stad", v105: "en gata / väg", v106: "ett torg", v107: "en kyrka",
    v108: "till höger", v109: "till vänster", v110: "rakt fram", v111: "nära",
    v112: "långt (borta)", v113: "ett jobb / arbete", v114: "ett kontor", v115: "ett möte",
    v116: "en kollega", v117: "tjäna (pengar)", v118: "gå / åka", v119: "komma",
    v120: "veta / kunna", v121: "känna", v122: "tänka", v123: "hitta",
    v124: "vänta", v125: "fråga / be", v126: "stor", v127: "liten",
    v128: "vacker / fin", v129: "ful / dålig", v130: "svår", v131: "lätt / enkel",
    v132: "men", v133: "alltid", v134: "aldrig", v135: "ofta",
    v136: "kanske", v137: "hej / hej då", v138: "god morgon / goddag", v139: "god kväll",
    v140: "tack så mycket", v141: "varsågod / ingen orsak", v142: "snälla", v143: "ursäkta / förlåt",
    v144: "jag är ledsen", v145: "hur mår du", v146: "trevligt att träffas", v147: "hälsa (på)",
    v148: "bjuda in", v149: "en inbjudan", v150: "presentera", v151: "snäll / vänlig",
    v152: "trevlig / sympatisk", v153: "tillsammans", v154: "gärna", v155: "överens / okej",
    v156: "en present / gåva", v157: "en fest", v158: "en födelsedag", v159: "fira",
    v160: "en vän", v161: "en väninna", v162: "en granne", v163: "en familj",
    v164: "en son", v165: "en dotter", v166: "en bror", v167: "barnbarn / syskonbarn",
    v168: "en faster / moster", v169: "en farbror / morbror", v170: "en kusin", v171: "gift",
    v172: "ett bröllop", v173: "tycka om / hålla av", v174: "bråka / gräla", v175: "vakna",
    v176: "gå upp / stiga upp", v177: "tvätta sig", v178: "klä på sig", v179: "vila",
    v180: "somna", v181: "handla (mat)", v182: "diska", v183: "gå ut",
    v184: "stanna", v185: "glömma", v186: "komma ihåg / minnas", v187: "en nyckel",
    v188: "en telefon", v189: "ringa", v190: "ett meddelande", v191: "lyssna",
    v192: "musik", v193: "titta (på)"
  },

  // Satz-Vorgaben & Grammatik folgen in Stufe 2 (fällt bis dahin auf Deutsch zurück).
  sentences: {}
};
