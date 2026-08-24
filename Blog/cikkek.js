/* Cikklista. Az adat a cikkek-adat.js-ben van, backend nem kell hozza. */

$("#navi").html(NAVIGATION_HTML);
$("#footer").html(FOOTER_HTML);

(function () {
  "use strict";

  var LAPMERET = 4;
  var latszik = LAPMERET;

  // A kiemelt cikk kulon blokkban van a HTML-ben, a racsban mar nem ismeteljuk
  function listazando() {
    return (window.CIKKEK || []).filter(function (c) { return c.id !== 1; });
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
    meta.textContent = cikk.datum + " · " + cikk.ido + " olvasás";

    test.appendChild(cimke);
    test.appendChild(cim);
    test.appendChild(lead);
    test.appendChild(meta);

    a.appendChild(kepDoboz);
    a.appendChild(test);
    return a;
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

  document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("tobb-cikk").addEventListener("click", function () {
      latszik += LAPMERET;
      rajzol();
    });
    rajzol();
  });
})();
