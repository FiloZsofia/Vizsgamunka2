$("#navi").html(NAVIGATION_HTML)
$("#footer").html(FOOTER_HTML)

/* kiemelt termekek (fooldali slideshow) es tema szerinti ajanlok

eddig ez az egesz statikus html volt, kitalalt cimekkel meg arakkal, a
"Bővebben" gombok mindig csak a termekek.html-re vittek (mert nem is volt hozzajuk valodi id)

mar tenyleges adat van betoltve a backendrol
+ a Bővebben gomb is a helyes product-details.html?id=... cimre navigal */

var API = "http://localhost:8080";

function forint(n) {
  return (Number(n) || 0).toLocaleString("hu-HU") + " Ft";
}

function termekKartya(termek) {
  var article = document.createElement("article");
  article.className = "our-box";

  var img = document.createElement("img");
  img.src = termek.imgUrl || "";
  img.alt = termek.title || "";
  article.appendChild(img);

  var content = document.createElement("div");
  content.className = "our-content";

  var cim = document.createElement("h3");
  cim.textContent = termek.title || "Névtelen mű";
  content.appendChild(cim);

  var meret = document.createElement("p");
  meret.className = "size";
  meret.textContent = (termek.xcm || "?") + " × " + (termek.ycm || "?") + " cm";
  content.appendChild(meret);

  var ar = document.createElement("p");
  ar.className = "price";
  ar.textContent = forint(termek.price);
  content.appendChild(ar);

  var gomb = document.createElement("button");
  gomb.type = "button";
  gomb.className = "kosar";
  gomb.textContent = "Bővebben";
  gomb.addEventListener("click", function () {
    window.location.href = "../ProductDetails/product-details.html?id=" + termek.id;
  });
  content.appendChild(gomb);

  article.appendChild(content);
  return article;
}

// a slides.js pontosan 5 diaval es 3 ponttal szamol (korlatos lapozgatas), ezert legfeljebb 5 kiemelt termeket rakunk a slideshow-ba
function renderKiemeltek(termekek) {
  var sor = document.getElementById("kiemelt-termekek");
  if (!sor) return;
  sor.innerHTML = "";

  var kivalasztott = termekek.slice(0, 5);
  kivalasztott.forEach(function (termek) {
    var kartya = termekKartya(termek);
    kartya.classList.add("mySlides");
    sor.appendChild(kartya);
  });

  var vezerlok = document.querySelector(".slideshow-controls");
  // a slides.js legalabb 3 diat felteteleez (azaz egyszerre 3-at mutat), kevesebb termeknel inkabb elrejtjuk a lapozot
  if (vezerlok) vezerlok.hidden = kivalasztott.length < 3;

  if (typeof showSlides === "function" && kivalasztott.length >= 3) {
    showSlides(1);
  }
}

// csak nehany temat mutatunk a fooldalon (ne az osszeset, mert tul hosszura nyujtana az oldalt), a legtobb termekkel rendelkezoket eloreveve
var MAX_TEMA_BLOKK = 4;

function renderTemakSzerint(termekek, temak) {
  var wrap = document.getElementById("theme-sections");
  if (!wrap) return;
  wrap.innerHTML = "";

  var temakTermekekkel = temak
    .map(function (tema) {
      var idetartozok = termekek.filter(function (termek) {
        return (termek.style || []).some(function (s) { return s.id === tema.id; });
      });
      return { tema: tema, idetartozok: idetartozok };
    })
    .filter(function (bejegyzes) { return bejegyzes.idetartozok.length > 0; })
    .sort(function (a, b) { return b.idetartozok.length - a.idetartozok.length; })
    .slice(0, MAX_TEMA_BLOKK);

  temakTermekekkel.forEach(function (bejegyzes) {
    var tema = bejegyzes.tema;
    var idetartozok = bejegyzes.idetartozok;

    var blokk = document.createElement("div");
    blokk.className = "theme-block";

    // a tema neve es a "Tovább" hivatkozas egy sorban, jobb szelen a link
    var fejlec = document.createElement("div");
    fejlec.className = "theme-block__head";

    var cim = document.createElement("h3");
    cim.textContent = tema.name;
    fejlec.appendChild(cim);

    var tovabb = document.createElement("a");
    tovabb.className = "theme-block__more";
    tovabb.href = "../Products/termekek.html?tema=" + encodeURIComponent(tema.name);
    tovabb.textContent = "Tovább";
    fejlec.appendChild(tovabb);

    blokk.appendChild(fejlec);

    var racs = document.createElement("div");
    racs.className = "grid-cards";
    idetartozok.slice(0, 4).forEach(function (termek) {
      racs.appendChild(termekKartya(termek));
    });
    blokk.appendChild(racs);

    wrap.appendChild(blokk);
  });
}

// a technika nev es leiras mostantol a backendbol jon, de az nem tarol ikont (nem is szutykolnek vele, ha nem muszaj), ezert csinaltam egy nev szerinti listat az ikonokhoz
// ha nem allitasz be ikont, akkor alapertelmezettkent egy random shapes-outline-t ad neki, hogy ne legyen mar kep nelkuli
var TECHNIKA_IKONOK = {
  "olaj": "brush-outline",
  "akril": "color-palette-outline",
  "akvarell": "water-outline",
  "pasztell": "color-filter-outline",
  "grafit": "pencil-outline",
  "szén": "ellipse-outline",
  "színes ceruza": "create-outline"
};
var TECHNIKA_ALAPERTELMEZETT_IKON = "shapes-outline";

function renderTechnikakat(technikak) {
  var racs = document.getElementById("techniques-grid");
  if (!racs) return;
  racs.innerHTML = "";

  technikak.forEach(function (technika) {
    var box = document.createElement("div");
    box.className = "s-box";

    var icon = document.createElement("ion-icon");
    icon.setAttribute("name", TECHNIKA_IKONOK[(technika.name || "").toLowerCase()] || TECHNIKA_ALAPERTELMEZETT_IKON);
    box.appendChild(icon);

    var cim = document.createElement("h3");
    cim.textContent = technika.name || "";
    box.appendChild(cim);

    if (technika.description) {
      var leiras = document.createElement("p");
      leiras.textContent = technika.description;
      box.appendChild(leiras);
    }

    racs.appendChild(box);
  });
}

function toltsBeFooldalatData() {
  Promise.all([
    fetch(API + "/product/get-all").then(function (r) { return r.json(); }),
    fetch(API + "/style/get-all").then(function (r) { return r.json(); }),
    fetch(API + "/material/get-all").then(function (r) { return r.json(); })
  ]).then(function (eredmenyek) {
    var termekek = eredmenyek[0] || [];
    var temak = eredmenyek[1] || [];
    var technikak = eredmenyek[2] || [];
    renderKiemeltek(termekek);
    renderTemakSzerint(termekek, temak);
    renderTechnikakat(technikak);
  }).catch(function (error) {
    console.error("Nem sikerült betölteni a termékeket a főoldalra:", error);
  });
}

toltsBeFooldalatData();