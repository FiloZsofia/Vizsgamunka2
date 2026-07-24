/* egy cikk megjelenitese. Az adat a cikkek-adat.js-bol jon, backend nem kell */

$("#navi").load("../Navigation/navigation.html");
$("#footer").load("../Footer/footer.html");

document.addEventListener("DOMContentLoaded", function () {
  var id = Number(new URLSearchParams(window.location.search).get("id"));
  var cikk = (window.CIKKEK || []).filter(function (c) { return c.id === id; })[0];

  // ha rossz vagy hianyzo id jon, ne ures oldal fogadja a latogatot
  if (!cikk) {
    cikk = (window.CIKKEK || [])[0];
  }
  if (!cikk) return;

  document.title = cikk.cim + " — Festményvilág";

  document.getElementById("cikk-cimke").textContent = cikk.cimke;
  document.getElementById("cikk-cim").textContent = cikk.cim;
  document.getElementById("cikk-meta").textContent =
    cikk.szerzo + " · " + cikk.datum + " · " + cikk.ido + " olvasás";

  var kep = document.getElementById("cikk-kep");
  kep.src = cikk.kep;
  kep.alt = cikk.cim;

  var torzs = document.getElementById("cikk-torzs");
  torzs.innerHTML = "";

  // A lead nagyobb betuvel, bevezetokent
  var lead = document.createElement("p");
  lead.className = "cikk-lead";
  lead.textContent = cikk.lead;
  torzs.appendChild(lead);

  (cikk.bekezdesek || []).forEach(function (szoveg) {
    var p = document.createElement("p");
    p.textContent = szoveg;
    torzs.appendChild(p);
  });
});
