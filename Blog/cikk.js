/* korabban a cikkek-adat.js-bok hardcode-oltkent jott, mar a backend blog/get/{id}-bol, igy az admin altal szerkesztett tartalom is megjelenik */

$("#navi").html(NAVIGATION_HTML);
$("#footer").html(FOOTER_HTML);

(function () {
  "use strict";

  var API = "http://localhost:8080";

  function olvasasiIdo(cikk) {
    var szoveg = [cikk.lead || "", cikk.bekezdesek || ""].join(" ");
    var szoszam = szoveg.trim().length ? szoveg.trim().split(/\s+/).length : 0;
    return Math.max(1, Math.round(szoszam / 200)) + " perc";
  }

  function rajzold(cikk) {
    document.title = cikk.cim + " — Festményvilág";

    document.getElementById("cikk-cimke").textContent = cikk.cimke || "";
    document.getElementById("cikk-cim").textContent = cikk.cim || "";
    document.getElementById("cikk-meta").textContent =
      (cikk.szerzo || "Szerkesztőség") + " · " + (cikk.datum || "") + " · " + olvasasiIdo(cikk) + " olvasás";

    var kep = document.getElementById("cikk-kep");
    kep.src = cikk.kep || "";
    kep.alt = cikk.cim || "";

    var torzs = document.getElementById("cikk-torzs");
    torzs.innerHTML = "";

    if (cikk.lead) {
      var lead = document.createElement("p");
      lead.className = "cikk-lead";
      lead.textContent = cikk.lead;
      torzs.appendChild(lead);
    }

    (cikk.bekezdesek || "").split(/\n\s*\n/).forEach(function (szoveg) {
      if (!szoveg.trim()) return;
      var p = document.createElement("p");
      p.textContent = szoveg.trim();
      torzs.appendChild(p);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var id = new URLSearchParams(window.location.search).get("id");

    fetch(API + "/blog/get/" + id)
      .then(function (r) {
        if (!r.ok) throw new Error("A szerver " + r.status + " hibakóddal válaszolt");
        return r.json();
      })
      .then(function (cikk) {
        // ha rossz vagy hianyzo id jon, akkor a legfrissebb cikket hozza, ne egy ures oldal jelenjen meg
        if (cikk && cikk.id) { rajzold(cikk); return; }
        return fetch(API + "/blog/get-all")
          .then(function (r) { return r.json(); })
          .then(function (lista) {
            if (Array.isArray(lista) && lista.length) rajzold(lista[0]);
          });
      })
      .catch(function (err) {
        console.error("A cikk betöltése sikertelen:", err);
        document.getElementById("cikk-torzs").innerHTML =
          "<p class=\"muted\">A cikk betöltése nem sikerült. Fut a backend?</p>";
      });
  });
})();