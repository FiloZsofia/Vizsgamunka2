$("#navi").html(NAVIGATION_HTML);
$("#footer").html(FOOTER_HTML);

/* a data-requires-auth gondoskodik a bejelentkezesrol, ez a script csak a role ellenorzeset es a tabok logikajat adja hozza
(backendben @RolesAllowed ADMIN) */

(function () {
  "use strict";

  var API = "http://localhost:8080";

  function token() { return localStorage.getItem("token"); }

  function forint(n) {
    return (Number(n) || 0).toLocaleString("hu-HU") + " Ft";
  }

  /* jogosultsag */
  function ellenorizJogosultsagot() {
    var jogosult = window.Auth && Auth.isLoggedIn() && Auth.isOwner();
    document.getElementById("admin-tartalom").hidden = !jogosult;
    document.getElementById("nincs-jogosultsag").hidden = !!jogosult;
    return jogosult;
  }

  /* tabok */
  function inditsdTabokat() {
    var tabok = document.querySelectorAll(".admin-tab");
    tabok.forEach(function (tab) {
      tab.addEventListener("click", function () {
        tabok.forEach(function (t) { t.classList.remove("is-active"); });
        tab.classList.add("is-active");

        document.querySelectorAll(".admin-panel").forEach(function (panel) {
          panel.hidden = true;
        });
        var aktivPanel = document.getElementById("panel-" + tab.dataset.tab);
        if (aktivPanel) aktivPanel.hidden = false;
      });
    });
  }

  /* ROLUNK */
  function betoltRolunk() {
    fetch(API + "/content/get/about-us")
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        document.getElementById("rolunk-szoveg").value = (data && data.body) || "";
      })
      .catch(function (err) {
        console.error("Rólunk szöveg betöltése sikertelen:", err);
      });
  }

  function mentsdRolunkot() {
    var szoveg = document.getElementById("rolunk-szoveg").value;
    var statusz = document.getElementById("rolunk-status");
    var gomb = document.getElementById("rolunk-mentes");

    gomb.disabled = true;
    fetch(API + "/content/update", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: token() },
      body: JSON.stringify({ key: "about-us", body: szoveg })
    })
      .then(function (r) {
        if (!r.ok) throw new Error("A szerver " + r.status + " hibakóddal válaszolt");
        return r.json();
      })
      .then(function () {
        statusz.textContent = "Elmentve.";
        statusz.className = "form-status form-status--ok";
        statusz.hidden = false;
      })
      .catch(function (err) {
        statusz.textContent = "A mentés nem sikerült: " + err.message;
        statusz.className = "form-status form-status--error";
        statusz.hidden = false;
      })
      .finally(function () { gomb.disabled = false; });
  }

  /* MAGAZIN */
  var szerkesztettCikkId = null;

  function magazinListaNezet() {
    document.getElementById("magazin-lista-nezet").hidden = false;
    document.getElementById("magazin-szerkeszto-nezet").hidden = true;
  }

  function magazinSzerkesztoNezet() {
    document.getElementById("magazin-lista-nezet").hidden = true;
    document.getElementById("magazin-szerkeszto-nezet").hidden = false;
  }

  function betoltMagazin() {
    fetch(API + "/blog/get-all")
      .then(function (r) { return r.json(); })
      .then(function (data) {
        rajzoldMagazinListat(Array.isArray(data) ? data : []);
      })
      .catch(function (err) {
        console.error("Magazin cikkek betöltése sikertelen:", err);
      });
  }

  function rajzoldMagazinListat(cikkek) {
    var lista = document.getElementById("magazin-lista");
    lista.innerHTML = "";

    cikkek.forEach(function (cikk) {
      var sor = document.createElement("article");
      sor.className = "admin-row";

      var info = document.createElement("div");
      info.className = "admin-row__info";

      var cimke = document.createElement("p");
      cimke.className = "admin-meta";
      cimke.textContent = cikk.cimke || "";

      var cim = document.createElement("h3");
      cim.textContent = cikk.cim || "Névtelen cikk";

      var meta = document.createElement("p");
      meta.className = "size";
      meta.textContent = (cikk.szerzo || "") + " · " + (cikk.datum || "");

      info.appendChild(cimke);
      info.appendChild(cim);
      info.appendChild(meta);

      var gombSor = document.createElement("div");
      gombSor.className = "admin-row__actions";

      var szerkeszt = document.createElement("button");
      szerkeszt.type = "button";
      szerkeszt.className = "btn btn--ghost";
      szerkeszt.textContent = "Szerkesztés";
      szerkeszt.addEventListener("click", function () { magazinSzerkesztesIndit(cikk); });

      var torol = document.createElement("button");
      torol.type = "button";
      torol.className = "btn btn--danger";
      torol.textContent = "Törlés";
      torol.addEventListener("click", function () { magazinTorles(cikk); });

      gombSor.appendChild(szerkeszt);
      gombSor.appendChild(torol);

      sor.appendChild(info);
      sor.appendChild(gombSor);
      lista.appendChild(sor);
    });
  }

  function magazinUrlapUrit() {
    szerkesztettCikkId = null;
    ["m-cimke", "m-szerzo", "m-cim", "m-datum", "m-kep", "m-lead", "m-bekezdesek"].forEach(function (id) {
      document.getElementById(id).value = "";
    });
    var statusz = document.getElementById("magazin-szerkeszto-status");
    statusz.hidden = true;
  }

  function magazinSzerkesztesIndit(cikk) {
    szerkesztettCikkId = cikk.id;
    document.getElementById("m-cimke").value = cikk.cimke || "";
    document.getElementById("m-szerzo").value = cikk.szerzo || "";
    document.getElementById("m-cim").value = cikk.cim || "";
    document.getElementById("m-datum").value = cikk.datum || "";
    document.getElementById("m-kep").value = cikk.kep || "";
    document.getElementById("m-lead").value = cikk.lead || "";
    document.getElementById("m-bekezdesek").value = cikk.bekezdesek || "";
    magazinSzerkesztoNezet();
  }

  function magazinMentes() {
    var adat = {
      id: szerkesztettCikkId,
      cimke: document.getElementById("m-cimke").value,
      szerzo: document.getElementById("m-szerzo").value,
      cim: document.getElementById("m-cim").value,
      datum: document.getElementById("m-datum").value,
      kep: document.getElementById("m-kep").value,
      lead: document.getElementById("m-lead").value,
      bekezdesek: document.getElementById("m-bekezdesek").value
    };

    if (!adat.cim) {
      var statusz = document.getElementById("magazin-szerkeszto-status");
      statusz.textContent = "A cím megadása kötelező.";
      statusz.className = "form-status form-status--error";
      statusz.hidden = false;
      return;
    }

    var vegpont = szerkesztettCikkId ? "/blog/update" : "/blog/add";
    var gomb = document.getElementById("magazin-mentes");
    gomb.disabled = true;

    fetch(API + vegpont, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: token() },
      body: JSON.stringify(adat)
    })
      .then(function (r) {
        if (!r.ok) throw new Error("A szerver " + r.status + " hibakóddal válaszolt");
        return r.json();
      })
      .then(function () {
        magazinUrlapUrit();
        magazinListaNezet();
        betoltMagazin();
        window.alert("A cikk elmentve.");
      })
      .catch(function (err) {
        var statusz = document.getElementById("magazin-szerkeszto-status");
        statusz.textContent = "A mentés nem sikerült: " + err.message;
        statusz.className = "form-status form-status--error";
        statusz.hidden = false;
      })
      .finally(function () { gomb.disabled = false; });
  }

  function magazinTorles(cikk) {
    if (!window.confirm('Biztosan törlöd ezt a cikket: "' + cikk.cim + '"?')) return;

    fetch(API + "/blog/delete/" + cikk.id, {
      method: "DELETE",
      headers: { Authorization: token() }
    })
      .then(function (r) {
        if (!r.ok) throw new Error("A szerver " + r.status + " hibakóddal válaszolt");
        betoltMagazin();
      })
      .catch(function (err) {
        window.alert("A törlés nem sikerült: " + err.message);
      });
  }

  /* TERMEKEK */
  var szerkesztettTermek = null;

  function termekekListaNezet() {
    document.getElementById("termekek-lista-nezet").hidden = false;
    document.getElementById("termekek-szerkeszto-nezet").hidden = true;
  }

  function termekekSzerkesztoNezet() {
    document.getElementById("termekek-lista-nezet").hidden = true;
    document.getElementById("termekek-szerkeszto-nezet").hidden = false;
  }

  function betoltTermekeket() {
    fetch(API + "/product/get-all-admin", { headers: { Authorization: token() } })
      .then(function (r) {
        if (!r.ok) throw new Error("A szerver " + r.status + " hibakóddal válaszolt");
        return r.json();
      })
      .then(function (data) {
        rajzoldTermekListat(Array.isArray(data) ? data : []);
      })
      .catch(function (err) {
        document.getElementById("termekek-osszegzes").textContent =
          "A termékek betöltése nem sikerült (" + err.message + ").";
      });
  }

  function rajzoldTermekListat(termekek) {
    var lista = document.getElementById("termekek-lista");
    var osszegzes = document.getElementById("termekek-osszegzes");
    lista.innerHTML = "";
    osszegzes.textContent = termekek.length + " termék az adatbázisban.";

    termekek.forEach(function (termek) {
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

      var feltolto = document.createElement("p");
      feltolto.className = "admin-meta";
      feltolto.textContent = "Feltöltötte: " + (termek.userName || "gazdátlan");

      var cim = document.createElement("h3");
      cim.textContent = termek.title || "Névtelen mű";

      var meret = document.createElement("p");
      meret.className = "size";
      meret.textContent = (termek.xcm || "?") + " × " + (termek.ycm || "?") + " cm";

      var ar = document.createElement("p");
      ar.className = "price";
      ar.textContent = forint(termek.price);

      content.appendChild(feltolto);
      content.appendChild(cim);

      if (termek.basket) {
        var flag = document.createElement("p");
        flag.className = "basket-flag";
        flag.textContent = "Kosárban van";
        content.appendChild(flag);
      }

      content.appendChild(meret);
      content.appendChild(ar);

      var gomb = document.createElement("button");
      gomb.type = "button";
      gomb.className = "kosar";
      gomb.textContent = "Szerkesztés";
      gomb.addEventListener("click", function () { termekSzerkesztesIndit(termek); });
      content.appendChild(gomb);

      box.appendChild(imgDiv);
      box.appendChild(content);
      lista.appendChild(box);
    });
  }

  // {id, name} alakban - ugyanugy, ahogy a backend /material style/get-all + a termekeim oldalak is kuldik
  function kivalasztottak(containerId) {
    return Array.from(document.querySelectorAll("#" + containerId + " input:checked"))
      .map(function (i) { return { id: Number(i.dataset.id), name: i.value }; });
  }

  function feltoltLegordulo(containerId, gombId, vegpont, kivalasztottNevek) {
    var container = document.getElementById(containerId);
    var gomb = document.getElementById(gombId);
    container.innerHTML = "";

    return fetch(API + vegpont)
      .then(function (r) { return r.json(); })
      .then(function (data) {
        (Array.isArray(data) ? data : []).forEach(function (elem) {
          var label = document.createElement("label");
          var input = document.createElement("input");
          input.type = "checkbox";
          input.className = "checkbox";
          input.value = elem.name;
          input.dataset.id = elem.id;
          input.checked = (kivalasztottNevek || []).indexOf(elem.name) !== -1;
          label.appendChild(input);
          label.appendChild(document.createTextNode(elem.name));
          container.appendChild(label);
        });

        var nevek = kivalasztottak(containerId).map(function (e) { return e.name; });
        gomb.textContent = nevek.length ? nevek.join(", ") : gomb.dataset.placeholder;
      })
      .catch(function (err) {
        console.error("Lista betöltése sikertelen (" + vegpont + "):", err);
      });
  }

  function termekSzerkesztesIndit(termek) {
    szerkesztettTermek = termek;

    document.getElementById("t-productName").value = termek.title || "";
    document.getElementById("t-artist").value = termek.artist || "";
    document.getElementById("t-keszitesEve").value = termek.createdYear || "";
    document.getElementById("t-ar").value = termek.price || "";
    document.getElementById("t-xcm").value = termek.xcm || "";
    document.getElementById("t-ycm").value = termek.ycm || "";
    document.getElementById("t-leiras").value = termek.description || "";
    document.getElementById("t-imgUrl").value = termek.imgUrl || "";

    var technikaNevek = (termek.material || []).map(function (m) { return m.name; });
    var temaNevek = (termek.style || []).map(function (s) { return s.name; });

    Promise.all([
      feltoltLegordulo("t-technika", "t-technika-btn", "/material/get-all", technikaNevek),
      feltoltLegordulo("t-tema", "t-tema-btn", "/style/get-all", temaNevek)
    ]).then(function () {
      // a filter.js esemenyfigyelovel mar mukodik az ujonnan beszurt checkboxokra is, szoval itt nem kell kontarkodni
    });

    termekekSzerkesztoNezet();
  }

  function termekMentes() {
    var adat = {
      id: szerkesztettTermek.id,
      title: document.getElementById("t-productName").value,
      artist: document.getElementById("t-artist").value,
      createdYear: document.getElementById("t-keszitesEve").value,
      price: Number(document.getElementById("t-ar").value) || 0,
      description: document.getElementById("t-leiras").value,
      imgUrl: document.getElementById("t-imgUrl").value.trim(),
      xcm: Number(document.getElementById("t-xcm").value) || 0,
      ycm: Number(document.getElementById("t-ycm").value) || 0,
      material: kivalasztottak("t-technika"),
      style: kivalasztottak("t-tema")
    };

    var gomb = document.getElementById("t-mentes");
    var statusz = document.getElementById("termekek-szerkeszto-status");
    gomb.disabled = true;

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
        termekekListaNezet();
        betoltTermekeket();
        window.alert("A termék elmentve.");
      })
      .catch(function (err) {
        statusz.textContent = "A mentés nem sikerült: " + err.message;
        statusz.className = "form-status form-status--error";
        statusz.hidden = false;
      })
      .finally(function () { gomb.disabled = false; });
  }

  function termekTorles() {
    if (!szerkesztettTermek) return;
    if (!window.confirm('Biztosan törlöd ezt a terméket: "' + szerkesztettTermek.title + '"?')) return;

    fetch(API + "/product/delete/" + szerkesztettTermek.id, {
      method: "DELETE",
      headers: { Authorization: token() }
    })
      .then(function (r) {
        if (!r.ok) throw new Error("A szerver " + r.status + " hibakóddal válaszolt");
        termekekListaNezet();
        betoltTermekeket();
        window.alert("A termék törölve.");
      })
      .catch(function (err) {
        window.alert("A törlés nem sikerült: " + err.message);
      });
  }

  /* TECHNIKA + TEMA  */
  function kategoriaKezelo(vegpont, listaId, ujNevId, ujLeirasId, ujGombId, statusId) {
    var lista = document.getElementById(listaId);
    var statusz = document.getElementById(statusId);

    function hibaJelzes(uzenet) {
      statusz.textContent = uzenet;
      statusz.className = "form-status form-status--error";
      statusz.hidden = false;
    }

    function betolt() {
      fetch(API + vegpont + "/get-all")
        .then(function (r) { return r.json(); })
        .then(function (data) { rajzol(Array.isArray(data) ? data : []); })
        .catch(function (err) {
          console.error("Lista betöltése sikertelen (" + vegpont + "):", err);
        });
    }

    function rajzol(elemek) {
      lista.innerHTML = "";
      elemek.forEach(function (elem) {
        var sor = document.createElement("div");
        sor.className = "kategoria-sor";

        var fo = document.createElement("div");
        fo.className = "kategoria-sor__fo";

        var input = document.createElement("input");
        input.type = "text";
        input.value = elem.name;

        var leiras = document.createElement("textarea");
        leiras.rows = 2;
        leiras.placeholder = "Leírás (opcionális)";
        leiras.value = elem.description || "";

        var mentesGomb = document.createElement("button");
        mentesGomb.type = "button";
        mentesGomb.className = "btn btn--ghost";
        mentesGomb.textContent = "Mentés";
        mentesGomb.addEventListener("click", function () {
          var ujNev = input.value.trim();
          if (!ujNev) { hibaJelzes("A név nem lehet üres."); return; }
          fetch(API + vegpont + "/update", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: token() },
            body: JSON.stringify({ id: elem.id, name: ujNev, description: leiras.value.trim() })
          })
            .then(function (r) {
              if (!r.ok) return r.json().then(function (d) { throw new Error(d.message || ("HTTP " + r.status)); });
              statusz.hidden = true;
              betolt();
            })
            .catch(function (err) { hibaJelzes("A mentés nem sikerült: " + err.message); });
        });

        var torlesGomb = document.createElement("button");
        torlesGomb.type = "button";
        torlesGomb.className = "btn btn--danger";
        torlesGomb.textContent = "Törlés";
        torlesGomb.addEventListener("click", function () {
          if (!window.confirm('Biztosan törlöd: "' + elem.name + '"?')) return;
          fetch(API + vegpont + "/delete/" + elem.id, {
            method: "DELETE",
            headers: { Authorization: token() }
          })
            .then(function (r) {
              if (!r.ok) return r.json().then(function (d) { throw new Error(d.message || ("HTTP " + r.status)); });
              statusz.hidden = true;
              betolt();
            })
            .catch(function (err) { hibaJelzes("A törlés nem sikerült: " + err.message); });
        });

        fo.appendChild(input);
        fo.appendChild(mentesGomb);
        fo.appendChild(torlesGomb);
        sor.appendChild(fo);
        sor.appendChild(leiras);
        lista.appendChild(sor);
      });
    }

    document.getElementById(ujGombId).addEventListener("click", function () {
      var nevMezo = document.getElementById(ujNevId);
      var leirasMezo = document.getElementById(ujLeirasId);
      var nev = nevMezo.value.trim();
      if (!nev) { hibaJelzes("A név nem lehet üres."); return; }

      fetch(API + vegpont + "/add", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: token() },
        body: JSON.stringify({ name: nev, description: leirasMezo.value.trim() })
      })
        .then(function (r) {
          if (!r.ok) return r.json().then(function (d) { throw new Error(d.message || ("HTTP " + r.status)); });
          nevMezo.value = "";
          leirasMezo.value = "";
          statusz.hidden = true;
          betolt();
        })
        .catch(function (err) { hibaJelzes("A hozzáadás nem sikerült: " + err.message); });
    });

    betolt();
  }

  /* inditas */
  document.addEventListener("DOMContentLoaded", function () {
    if (!ellenorizJogosultsagot()) return;

    inditsdTabokat();

    betoltRolunk();
    document.getElementById("rolunk-mentes").addEventListener("click", mentsdRolunkot);

    betoltMagazin();
    document.getElementById("magazin-uj").addEventListener("click", function () {
      magazinUrlapUrit();
      magazinSzerkesztoNezet();
    });
    document.getElementById("magazin-megse").addEventListener("click", function () {
      magazinListaNezet();
    });
    document.getElementById("magazin-mentes").addEventListener("click", magazinMentes);

    betoltTermekeket();
    document.getElementById("t-megse").addEventListener("click", function () {
      termekekListaNezet();
    });
    document.getElementById("t-mentes").addEventListener("click", termekMentes);
    document.getElementById("t-torles").addEventListener("click", termekTorles);

    kategoriaKezelo("/material", "technika-lista", "technika-uj-nev", "technika-uj-leiras", "technika-uj-gomb", "technika-status");
    kategoriaKezelo("/style", "tema-lista", "tema-uj-nev", "tema-uj-leiras", "tema-uj-gomb", "tema-status");
  });
})();