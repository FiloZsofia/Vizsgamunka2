/* ezt ujrairtam, mert a korabbi valtozat a teljes .dropdown konténerre tett event.preventDefault()-ot minden kattintasra
a bongeszo alapvetoen ugy mukodik, hogy a <label> kattintaskor tovabbadodik az azon belul levo checkboxba (ami a jo mukodes), de ezt folyamatosan felulirta az event */

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".dropdown").forEach(function (dropdown) {
    var btn = dropdown.querySelector(".dropbtn");
    var content = dropdown.querySelector(".dropdown-content");
    if (!btn || !content) return;

    btn.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();

      var mostNyitva = content.classList.contains("show");

      // minden mas nyitott dropdown-t csukjunk be, hogy ne maradjon tobb nyitva egyszerre
      document.querySelectorAll(".dropdown-content.show").forEach(function (masikContent) {
        if (masikContent !== content) masikContent.classList.remove("show");
      });

      content.classList.toggle("show", !mostNyitva);
    });

    // a labeleken belul kattintva ne csukodjon be a dropdown, de a child tovabbadast ne legyen akadalyozva (event.stopPropagation())
    content.addEventListener("click", function (event) {
      event.stopPropagation();
    });

    // a gomb szovegenek frissitese a kivalasztott opciokkal
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

  // ha a dropdown-on kivul kattintunk barhova, csukodjon be minden nyitott lista
  document.addEventListener("click", function () {
    document.querySelectorAll(".dropdown-content.show").forEach(function (content) {
      content.classList.remove("show");
    });
  });
});
