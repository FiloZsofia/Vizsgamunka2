/* ez korabban a cikkek-adat.js-bol jott, mert nem volt mogotte a backend, de mar a backendbol (blog/get-all) tolt be */

$("#navi").html(NAVIGATION_HTML);
$("#footer").html(FOOTER_HTML);

(function () {
  "use strict";

  var API = "http://localhost:8080";
  var LAPMERET = 4;
  var latszik = LAPMERET;
  var osszesCikk = [];
  var kiemeltId = null;

  // durva becsles: kb. 200 szo/perc, minimum 1 perc
  function olvasasiIdo(cikk) {
    var szoveg = [cikk.lead || "", cikk.bekezdesek || ""].join(" ");
    var szoszam = szoveg.trim().length ? szoveg.trim().split(/\s+/).length : 0;
    return Math.max(1, Math.round(szoszam / 200)) + " perc";
  }

  function listazando() {
    return osszesCikk.filter(function (c) { return c.id !== kiemeltId; });
  }

  function kartya(cikk) {
    var a = document.createElement("a");
    a.className = "cikk-kartya";
    a.href = "cikk.html?id=" + cikk.id;

    var kepDoboz = document.createElement("div");
    kepDoboz.className = "cikk-kartya__kep";
    var img = document.createElement("img");
    img.src = cikk.kep;
    img.alt = "";
    img.loading = "lazy";
    kepDoboz.appendChild(img);

    var test = document.createElement("div");
    test.className = "cikk-kartya__test";

    var cimke = document.createElement("span");
    cimke.className = "cikk-cimke";
    cimke.textContent = cikk.cimke;

    var cim = document.createElement("h3");
    cim.textContent = cikk.cim;

    var lead = document.createElement("p");
    lead.className = "muted";
    lead.textContent = cikk.lead;

    var meta = document.createElement("p");
    meta.className = "cikk-meta";
    meta.textContent = cikk.datum + " · " + olvasasiIdo(cikk) + " olvasás";

    test.appendChild(cimke);
    test.appendChild(cim);
    test.appendChild(lead);
    test.appendChild(meta);

    a.appendChild(kepDoboz);
    a.appendChild(test);
    return a;
  }

  function rajzoldKiemeltet(cikk) {
    var blokk = document.getElementById("cikk-kiemelt");
    if (!cikk) { blokk.hidden = true; return; }

    blokk.hidden = false;
    document.getElementById("kiemelt-kep-link").href = "cikk.html?id=" + cikk.id;
    document.getElementById("kiemelt-kep").src = cikk.kep || "";
    document.getElementById("kiemelt-cimke").textContent = cikk.cimke || "";
    var cimLink = document.getElementById("kiemelt-cim-link");
    cimLink.href = "cikk.html?id=" + cikk.id;
    cimLink.textContent = cikk.cim || "";
    document.getElementById("kiemelt-lead").textContent = cikk.lead || "";
    document.getElementById("kiemelt-meta").textContent =
      (cikk.szerzo || "Szerkesztőség") + " · " + olvasasiIdo(cikk) + " olvasás";
  }

  function rajzol() {
    var racs = document.getElementById("cikk-racs");
    var lista = listazando();
    racs.innerHTML = "";

    lista.slice(0, latszik).forEach(function (cikk) {
      racs.appendChild(kartya(cikk));
    });

    var gomb = document.getElementById("tobb-cikk");
    gomb.hidden = latszik >= lista.length;
  }

  function betolt() {
    fetch(API + "/blog/get-all")
      .then(function (r) { return r.json(); })
      .then(function (data) {
        osszesCikk = Array.isArray(data) ? data : [];
        // a legfrissebb (a lista elso eleme, a backend mar datum szerint rendezve adja vissza) kerul a kiemelt blokkba
        kiemeltId = osszesCikk.length ? osszesCikk[0].id : null;
        rajzoldKiemeltet(osszesCikk[0]);
        rajzol();
      })
      .catch(function (err) {
        console.error("Magazin cikkek betöltése sikertelen:", err);
        document.getElementById("cikk-racs").innerHTML =
          "<p class=\"muted\">A cikkek betöltése nem sikerült. Fut a backend?</p>";
      });
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("tobb-cikk").addEventListener("click", function () {
      latszik += LAPMERET;
      rajzol();
    });
    betolt();
  });
})();