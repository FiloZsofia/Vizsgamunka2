/* A magazin rovat tartalma.
   Szandekosan itt van, egy sima tombben: ehhez a reszhez NEM kell backend.
   Ha kesobb mégis adatbazisbol jonne, eleg ezt a fajlt lecserelni egy
   fetch-re, a megjelenites (cikkek.js, cikk.js) valtozatlan maradhat. */

window.CIKKEK = [
  {
    id: 1,
    cimke: "Műterem",
    cim: "„A festék akkor él, ha még nedves” — látogatás Kovács Anna műtermében",
    lead: "Egy régi pécsi bérház tetőterében dolgozik, ahol a fény délutánonként pontosan arra a falra esik, ahol a félkész vásznak sorakoznak.",
    szerzo: "Szerkesztőség",
    ido: "8 perc",
    datum: "2026. július 4.",
    kep: "../Assets/images/pexels-deeana-arts-1646953.jpg",
    bekezdesek: [
      "A műterem ajtaja mögött először a szag csap meg: lenolaj, terpentin és valami halvány kávéillat. Kovács Anna nem véletlenül dolgozik itt tizenkét éve — azt mondja, ez az egyetlen hely, ahol a délutáni fény kiszámítható.",
      "„Nem vázlatolok” — mondja, amikor rákérdezünk a falnak támasztott, félkész vásznakra. „Ha megrajzolom előre, akkor már csak kiszínezem. Az pedig unalmas.” Ehelyett egyszerre három képen dolgozik, és aszerint vált köztük, melyiken van még nedves festék.",
      "A technikáról szívesen beszél, de a magyarázatot mindig visszatereli a gyakorlatra. Szerinte az olajfestés legnagyobb tévhite, hogy türelemjáték. „Nem türelem kell hozzá, hanem időzítés. Tudni kell, mikor NEM szabad hozzányúlni.”",
      "Amikor megkérdezzük, mit tanácsolna annak, aki most kezdi, elneveti magát. „Vegyen kisebb vásznat, mint amekkorát szeretne. Aztán még kisebbet. A nagy vászon megijeszt, és az ijedtség meglátszik a képen.”"
    ]
  },
  {
    id: 2,
    cimke: "Útmutató",
    cim: "Olaj, akril vagy akvarell? Segítünk választani",
    lead: "A három legelterjedtebb technika nem csak látványban különbözik — más türelmet, más helyet és más pénztárcát kíván.",
    szerzo: "Szerkesztőség",
    ido: "6 perc",
    datum: "2026. június 20.",
    kep: "../Assets/images/watercolor-4119156_1280.jpg",
    bekezdesek: [
      "A kérdés, amit a leggyakrabban kapunk: mivel érdemes kezdeni? A rövid válasz az, hogy attól függ, mennyi helyed és mennyi türelmed van.",
      "Az akril gyorsan szárad, vízzel hígítható, és nem kell hozzá szellőztetés. Ez a legmegbocsátóbb kezdés — de éppen a gyors száradás miatt a lágy átmenetek nehezebben jönnek ki.",
      "Az olaj lassú, és ez a lassúság az előnye: napokig dolgozhatsz ugyanazon a felületen. Cserébe helyet kér, ahol a kép nyugodtan száradhat, és a hígítók miatt szellőző helyiséget.",
      "Az akvarell a legkevesebb helyet igényli, és a legkevésbé megbocsátó. Amit egyszer felvittél, azt nem veszed vissza. Sokan éppen ezért szeretik."
    ]
  },
  {
    id: 3,
    cimke: "Interjú",
    cim: "„Nem a madár érdekel, hanem a mozdulat” — Tóth Gergő az állatportrékról",
    lead: "Tizenöt éve fest madarakat, de azt mondja, sosem a fajta volt a téma.",
    szerzo: "Szerkesztőség",
    ido: "7 perc",
    datum: "2026. június 2.",
    kep: "../Assets/images/bird-3342446_1280.jpg",
    bekezdesek: [
      "Tóth Gergő képein a madarak ritkán ülnek nyugodtan. Van bennük egy megbillenés, egy félbehagyott mozdulat — mintha a kép egy pillanattal korábban készült volna, mint kellett volna.",
      "„Ez szándékos” — mondja. „A nyugodt madár dekoráció. Engem az érdekel, ami az elrugaszkodás előtti fél másodpercben történik.”",
      "A munkamódszere ehhez képest meglepően lassú: hetekig fotóz, mielőtt festeni kezdene, és a fotókat sosem másolja le. „A fotó arra jó, hogy megjegyezzem a súlypontot. Utána elteszem.”"
    ]
  },
  {
    id: 4,
    cimke: "Otthon",
    cim: "Hogyan akaszd fel a képet, hogy ne bánd meg",
    lead: "Magasság, fény, távolság — három egyszerű szabály, amit a legtöbben elrontanak.",
    szerzo: "Szerkesztőség",
    ido: "4 perc",
    datum: "2026. május 18.",
    kep: "../Assets/images/pexels-shelagh-murphy-2258795.jpg",
    bekezdesek: [
      "A leggyakoribb hiba, hogy túl magasra kerül a kép. A múzeumi ökölszabály szerint a kép közepe legyen szemmagasságban, azaz nagyjából 145–150 centiméteren.",
      "A második a fény. A közvetlen napfény néhány év alatt kifakítja a pigmenteket — különösen az akvarellt. Ha nincs más fal, legalább üvegezz csillogásmentes üveggel.",
      "A harmadik a távolság. Egy kép akkor működik, ha van körülötte üres fal. Ha bizonytalan vagy, hagyj több helyet, mint amennyit elsőre szeretnél."
    ]
  },
  {
    id: 5,
    cimke: "Piactér",
    cim: "Mitől lesz ára egy festménynek?",
    lead: "Méret, technika, név — és néhány tényező, amiről ritkán esik szó.",
    szerzo: "Szerkesztőség",
    ido: "5 perc",
    datum: "2026. május 3.",
    kep: "../Assets/images/pexels-steve-johnson-1145720.jpg",
    bekezdesek: [
      "A méret a legkézenfekvőbb tényező, és tényleg számít — de nem lineárisan. Egy kétszer akkora vászon ritkán kerül kétszer annyiba.",
      "A technika ennél többet nyom a latban: az olajfestmény anyagköltsége és időigénye is magasabb, mint egy hasonló méretű akvarellé.",
      "Amiről kevesebbet beszélünk: a sorozat. Egy magányos kép nehezebben talál gazdára, mint ugyanaz a kép egy felismerhető sorozat részeként."
    ]
  },
  {
    id: 6,
    cimke: "Műterem",
    cim: "Egy nap Farkas Júliával, aki szénnel rajzol portrét",
    lead: "Reggel hatkor kezd, és azt mondja, délután kettő után már nem érdemes arcot rajzolni.",
    szerzo: "Szerkesztőség",
    ido: "9 perc",
    datum: "2026. április 12.",
    kep: "../Assets/images/Művészet.jpg",
    bekezdesek: [
      "A szén a legolcsóbb és legkíméletlenebb eszköz: nincs benne szín, amivel el lehetne terelni a figyelmet a rajzról.",
      "Farkas Júlia reggel hatkor kezd. „A fény akkor még hideg és egyenletes. Kettő után melegszik, és a meleg fény hazudik az arcformákról.”",
      "A radírt nem hibajavításra használja, hanem rajzeszközként — a világos foltokat kiemeli, nem hozzáadja. „Sokan fordítva csinálják, és csodálkoznak, hogy szürke lesz az egész.”"
    ]
  }
];
