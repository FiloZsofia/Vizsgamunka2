/* */

$("#navi").html(NAVIGATION_HTML);
$("#footer").html(FOOTER_HTML);

(function () {
  "use strict";

  var API = "http://localhost:8080";

  var sajatTermekek = [];
  var szerkesztett = null;

  function token() { return localStorage.getItem("token"); }
  function felhasznalo() {
    return (window.Auth && window.Auth.username()) || "";
  }

  function forint(n) {
    return (Number(n) || 0).toLocaleString("hu-HU") + " Ft";
  }

  
  function mutatLista() {
    document.getElementById("lista-nezet").hidden = false;
    document.getElementById("szerkeszto-nezet").hidden = true;
    window.scrollTo(0, 0);
  }

  function mutatSzerkeszto() {
    document.getElementById("lista-nezet").hidden = true;
    document.getElementById("szerkeszto-nezet").hidden = false;
    window.scrollTo(0, 0);
  }

  function betolt() {
    return fetch(API + "/product/get-owned-products", {
      headers: { Authorization: token() }
    })
      .then(function (r) {
        if (!r.ok) throw new Error("A szerver " + r.status + " hibakóddal válaszolt");
        return r.json();
      })
      .then(function (data) {
        sajatTermekek = Array.isArray(data) ? data : [];
        rajzolLista();
      })
      .catch(function (err) {
        console.error("Termékek betöltése sikertelen:", err);
        document.getElementById("lista-osszegzes").textContent =
          "A termékek betöltése nem sikerült (" + err.message + "). Fut a backend?";
      });
  }

  function rajzolLista() {
    var grid = document.getElementById("sajat-termekek");
    var ures = document.getElementById("ures-allapot");
    var osszegzes = document.getElementById("lista-osszegzes");

    grid.innerHTML = "";

    if (sajatTermekek.length === 0) {
      osszegzes.textContent =
        felhasznalo()
          ? felhasznalo() + " néven még nincs feltöltött műved."
          : "Nincs feltöltött műved.";
      ures.hidden = false;
      return;
    }

    ures.hidden = true;
    osszegzes.textContent =
      sajatTermekek.length + " feltöltött műved van. Válassz egyet a szerkesztéshez.";

    sajatTermekek.forEach(function (termek) {
      grid.appendChild(kartya(termek));
    });
  }

  function kartya(termek) {
    var box = document.createElement("article");
    box.className = "our-box";

    var imgDiv = document.createElement("div");
    imgDiv.className = "img-div";
    var img = document.createElement("img");
    img.src = termek.imgUrl || "";
    img.alt = termek.title || "";
    imgDiv.appendChild(img);

    var content = document.createElement("div");
    content.className = "our-content";

    var cim = document.createElement("h3");
    cim.textContent = termek.title || "Névtelen mű";

    var meret = document.createElement("p");
    meret.className = "size";
    meret.textContent = (termek.xcm || "?") + " × " + (termek.ycm || "?") + " cm";

    var ar = document.createElement("p");
    ar.className = "price";
    ar.textContent = forint(termek.price);

    var gomb = document.createElement("button");
    gomb.className = "kosar";
    gomb.type = "button";
    gomb.textContent = "Szerkesztés";
    gomb.addEventListener("click", function () { szerkesztesIndit(termek); });

    content.appendChild(cim);
    content.appendChild(meret);
    content.appendChild(ar);
    content.appendChild(gomb);

    box.appendChild(imgDiv);
    box.appendChild(content);
    return box;
  }

  /* filterek */
  function feltoltLegordulo(containerId, gombId, vegpont) {
    var container = document.getElementById(containerId);
    var gomb = document.getElementById(gombId);

    return fetch(API + vegpont)
      .then(function (r) { return r.json(); })
      .then(function (data) {
        container.innerHTML = "";
        (Array.isArray(data) ? data : []).forEach(function (elem) {
          var label = document.createElement("label");
          var input = document.createElement("input");
          input.type = "checkbox";
          input.className = "checkbox";
          input.value = elem.name;
          input.dataset.id = elem.id;
          label.appendChild(input);
          label.appendChild(document.createTextNode(elem.name));
          input.addEventListener("change", function () {
            frissitGombFelirat(containerId, gombId);
          });
          container.appendChild(label);
        });
      })
      .catch(function (err) {
        console.error("Lista betöltése sikertelen (" + vegpont + "):", err);
      });
  }

  // {id, name} alakban adja vissza - ugyanugy, ahogy a backend kuldi,
  // es ahogy a termek-feltoltese.js is elkuldi felvitelkor
  function kivalasztottak(containerId) {
    return [].slice
      .call(document.querySelectorAll("#" + containerId + " input:checked"))
      .map(function (i) { return { id: Number(i.dataset.id), name: i.value }; });
  }

  function frissitGombFelirat(containerId, gombId) {
    var nevek = kivalasztottak(containerId).map(function (e) { return e.name; });
    document.getElementById(gombId).textContent =
      nevek.length ? nevek.join(", ") : "Válassz…";
  }

  function beallitPipak(containerId, gombId, ertekek) {
    var nevek = (ertekek || []).map(function (e) { return e.name; });
    [].slice
      .call(document.querySelectorAll("#" + containerId + " input"))
      .forEach(function (input) {
        input.checked = nevek.indexOf(input.value) !== -1;
      });
    frissitGombFelirat(containerId, gombId);
  }

  /* edit */
  function szerkesztesIndit(termek) {
    szerkesztett = JSON.parse(JSON.stringify(termek));

    document.getElementById("e-productName").value  = termek.title || "";
    document.getElementById("e-artist").value       = termek.artist || "";
    document.getElementById("e-keszitesEve").value  = termek.createdYear || "";
    document.getElementById("e-ar").value           = termek.price || "";
    document.getElementById("e-xcm").value          = termek.xcm || "";
    document.getElementById("e-ycm").value          = termek.ycm || "";
    document.getElementById("e-leiras").value       = termek.description || "";

    beallitPipak("e-technika", "e-technika-btn", termek.material);
    beallitPipak("e-tema", "e-tema-btn", termek.style);

    document.getElementById("e-imgUrl").value = termek.imgUrl || "";
    mutatKepet(termek.imgUrl);
    mutatSzerkeszto();
  }

  function mutatKepet(url) {
    var doboz = document.getElementById("e-upload-form");
    var hint  = document.getElementById("e-upload-hint");

    var regi = doboz.querySelector(".uploaded-image");
    if (regi) regi.remove();

    if (!url) { hint.hidden = false; return; }

    var kep = document.createElement("img");
    kep.className = "uploaded-image";
    kep.src = url;
    kep.alt = "";
    doboz.appendChild(kep);
    hint.hidden = true;
  }

  function statusz(uzenet, sikeres) {
    ["szerkesztes-status", "szerkeszto-status"].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      el.textContent = uzenet;
      el.className = "form-status " + (sikeres ? "form-status--ok" : "form-status--error");
      el.hidden = !uzenet;
    });
  }

  function mentes() {
    if (!szerkesztett) return;
    statusz("", true);

    var adat = {
      id: szerkesztett.id,
      title: document.getElementById("e-productName").value,
      artist: document.getElementById("e-artist").value,
      createdYear: document.getElementById("e-keszitesEve").value,
      price: Number(document.getElementById("e-ar").value) || 0,
      description: document.getElementById("e-leiras").value,
      imgUrl: document.getElementById("e-imgUrl").value.trim(),
      // kisbetus xcm/ycm
      xcm: Number(document.getElementById("e-xcm").value) || 0,
      ycm: Number(document.getElementById("e-ycm").value) || 0,
      material: kivalasztottak("e-technika"),
      style: kivalasztottak("e-tema")
    };

    var gomb = document.getElementById("e-mentes");
    gomb.disabled = true;
    gomb.textContent = "Mentés…";

    fetch(API + "/product/update", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: token() },
      body: JSON.stringify(adat)
    })
      .then(function (r) {
        if (!r.ok) throw new Error("A szerver " + r.status + " hibakóddal válaszolt");
        return r.json();
      })
      .then(function () {
        return betolt();
      })
      .then(function () {
        mutatLista();
        statusz("A módosítás elmentve.", true);
      })
      .catch(function (err) {
        console.error("Mentés sikertelen:", err);
        statusz(
          "A mentés nem sikerült (" + err.message + "). " +
          "A backendben még nincs /product/update végpont — ezt a projekt " +
          "gazdájának kell megírnia. Mock módban (?mock=1) a mentés működik.",
          false
        );
      })
      .then(function () {
        gomb.disabled = false;
        gomb.textContent = "Mentés";
      });
  }

  
  document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("e-megse").addEventListener("click", mutatLista);
    document.getElementById("e-mentes").addEventListener("click", mentes);

    // Kép cseréje: a rejtett fájlmezőt nyitjuk meg
    document.getElementById("e-upload-form").addEventListener("click", function () {
      document.getElementById("e-file-input").click();
    });

    document.getElementById("e-file-input").addEventListener("change", function () {
      if (this.files && this.files[0]) {
        var url = URL.createObjectURL(this.files[0]);
        if (szerkesztett) szerkesztett.imgUrl = url;
        mutatKepet(url);
      }
    });

    feltoltLegordulo("e-technika", "e-technika-btn", "/material/get-all");
    feltoltLegordulo("e-tema", "e-tema-btn", "/style/get-all");
    betolt();
  });
})();