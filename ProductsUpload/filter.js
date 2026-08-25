/* Legordulo (dropdown) checkbox-listak viselkedese - Technika / Meret / Tema.
Ujraírva, mert a korabbi valtozat a TELJES .dropdown konténerre tett
event.preventDefault()-ot minden kattintasra. Ez a checkbox feletti <label>
szoveges reszere kattintva megakadalyozta a bongeszo alapertelmezett
mukodeset (hogy a label kattintas tovabbadodik a benne levo checkboxnak),
ezert csak magara a pici checkbox-negyzetre kattintva "fogott" a kivalasztas.

Az uj logika:
- csak a .dropbtn gombre van rakattintva figyelve a nyitashoz/zarashoz -
  a tartalom (.dropdown-content) sajat kattintasait csak megallitjuk
  (stopPropagation), preventDefault NELKUL, igy a label -> checkbox
  natív tovabbadasa mukodik, akar a szovegre, akar magara a checkboxra
  kattintunk.
- delegalt esemenyfigyeles: a Technika/Tema checkboxok AJAX-szal, kesobb
  kerulnek a DOM-ba, ezert a figyeloket a stabil .dropdown-content elemre
  tesszuk, nem egyenkent a checkboxokra. */

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".dropdown").forEach(function (dropdown) {
    var btn = dropdown.querySelector(".dropbtn");
    var content = dropdown.querySelector(".dropdown-content");
    if (!btn || !content) return;

    btn.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();

      var mostNyitva = content.classList.contains("show");

      // Minden mas nyitott dropdown-ot csukjunk be, hogy ne maradjon tobb nyitva egyszerre.
      document.querySelectorAll(".dropdown-content.show").forEach(function (masikContent) {
        if (masikContent !== content) masikContent.classList.remove("show");
      });

      content.classList.toggle("show", !mostNyitva);
    });

    // A tartalmon (checkboxok/labelek) belul kattintva ne csukodjon be a dropdown,
    // de a label -> checkbox natív kattintas-tovabbadast NE akadalyozzuk.
    content.addEventListener("click", function (event) {
      event.stopPropagation();
    });

    // A gomb szovegenek frissitese a kivalasztott opciokkal - csak ott, ahol
    // ehhez a gombhoz data-placeholder attributumot adtunk (pl. feltoltes urlap).
    var placeholder = btn.dataset.placeholder;
    if (placeholder) {
      var frissitCimke = function () {
        var kijelolt = Array.from(content.querySelectorAll("input.checkbox:checked"))
          .map(function (input) { return input.value; });
        btn.textContent = kijelolt.length ? kijelolt.join(", ") : placeholder;
      };
      content.addEventListener("change", frissitCimke);
    }
  });

  // Ha a dropdown-on kivul kattintunk barhova, csukodjon be minden nyitott lista.
  document.addEventListener("click", function () {
    document.querySelectorAll(".dropdown-content.show").forEach(function (content) {
      content.classList.remove("show");
    });
  });
});
