/* ezt csak magam celjara, hogy hozzaferjek a backendhez, igy tesztelhessem a dizajn modositasokat - ignorald, de ne torold a scriptet! */

(function () {
  "use strict";

  var FLAG = "festmenyvilag:mock";

  try {
    var param = new URLSearchParams(location.search).get("mock");
    if (param !== null) {
      if (param === "0" || param === "false") {
        sessionStorage.removeItem(FLAG);
      } else {
        sessionStorage.setItem(FLAG, "1");
      }
    }
    if (sessionStorage.getItem(FLAG) !== "1") return; // kilepes
  } catch (e) {
    return;
  }

  var IMG = "../Assets/images/";

  var MATERIALS = [
    { id: 1, name: "Olaj" },
    { id: 2, name: "Akril" },
    { id: 3, name: "Akvarell" },
    { id: 4, name: "Pasztell" },
    { id: 5, name: "Grafit" },
    { id: 6, name: "Szén" },
    { id: 7, name: "Színes ceruza" }
  ];

  var STYLES = [
    { id: 1, name: "Tájkép" },
    { id: 2, name: "Portré" },
    { id: 3, name: "Csendélet" },
    { id: 4, name: "Absztrakt" },
    { id: 5, name: "Állat" },
    { id: 6, name: "Városkép" },
    { id: 7, name: "Virág" }
  ];

  function mat(name) {
    return MATERIALS.filter(function (m) { return m.name === name; });
  }
  function sty(name) {
    return STYLES.filter(function (s) { return s.name === name; });
  }

  var PRODUCTS = [
    {
      id: 1, title: "Hajnali kikötő", artist: "Kovács Anna", createdYear: 2021,
      price: 60000, xcm: 80, ycm: 60, imgUrl: IMG + "boat-6686809_1920.jpg",
      description: "Csendes kikötő a hajnali fényben, vastag ecsetkezeléssel felvitt olajfestékkel.",
      material: mat("Olaj"), style: sty("Tájkép")
    },
    {
      id: 2, title: "Akvarell álom", artist: "Szabó Péter", createdYear: 2022,
      price: 40000, xcm: 50, ycm: 40, imgUrl: IMG + "watercolor-4119156_1280.jpg",
      description: "Lágy, egymásba folyó színfoltok nedves technikával, kézműves akvarellpapíron.",
      material: mat("Akvarell"), style: sty("Absztrakt")
    },
    {
      id: 3, title: "Színrobbanás", artist: "Nagy Eszter", createdYear: 2020,
      price: 45000, xcm: 70, ycm: 50, imgUrl: IMG + "pexels-steve-johnson-1145720.jpg",
      description: "Élénk akrilfestékkel készült absztrakt kompozíció, erős kontrasztokkal.",
      material: mat("Akril"), style: sty("Absztrakt")
    },
    {
      id: 4, title: "Papagáj", artist: "Tóth Gergő", createdYear: 2023,
      price: 52000, xcm: 60, ycm: 60, imgUrl: IMG + "parrot-2289943_1280.jpg",
      description: "Aprólékosan kidolgozott madárportré, élénk tollazattal.",
      material: mat("Akril"), style: sty("Állat")
    },
    {
      id: 5, title: "Hegyek csendje", artist: "Kiss Márta", createdYear: 2019,
      price: 75000, xcm: 100, ycm: 70,
      imgUrl: IMG + "pexels-eberhard-grossgasteiger-2086361.jpg",
      description: "Havas hegygerincek a reggeli ködben, hideg kék és szürke tónusokban.",
      material: mat("Olaj"), style: sty("Tájkép")
    },
    {
      id: 6, title: "Műterem", artist: "Kovács Anna", createdYear: 2022,
      price: 38000, xcm: 40, ycm: 30, imgUrl: IMG + "pexels-deeana-arts-1646953.jpg",
      description: "Ecsetek és festékek csendélete a művész asztalán.",
      material: mat("Olaj"), style: sty("Csendélet")
    },
    {
      id: 7, title: "Cseresznyevirágzás", artist: "Farkas Júlia", createdYear: 2023,
      price: 68000, xcm: 90, ycm: 60,
      imgUrl: IMG + "cherry-blossoms-impressionist-lourry-legarde.jpg",
      description: "Impresszionista cseresznyefa-tanulmány, pasztellrózsaszín és fehér foltokkal.",
      material: mat("Pasztell"), style: sty("Virág")
    },
    {
      id: 8, title: "Kolibri", artist: "Tóth Gergő", createdYear: 2021,
      price: 44000, xcm: 50, ycm: 50, imgUrl: IMG + "bird-3342446_1280.jpg",
      description: "Mozgás közben megörökített madár, finom színes ceruza rétegekkel.",
      material: mat("Színes ceruza"), style: sty("Állat")
    },
    {
      id: 9, title: "Halak", artist: "Nagy Eszter", createdYear: 2020,
      price: 41000, xcm: 60, ycm: 40, imgUrl: IMG + "fish-3735501_1920.jpg",
      description: "Víz alatti világ élénk akrillal, dekoratív vonalvezetéssel.",
      material: mat("Akril"), style: sty("Állat")
    },
    {
      id: 10, title: "Napnyugta", artist: "Szabó Péter", createdYear: 2018,
      price: 58000, xcm: 80, ycm: 50, imgUrl: IMG + "pexels-lumn-587958.jpg",
      description: "Meleg narancs és lila tónusok találkozása a horizonton.",
      material: mat("Olaj"), style: sty("Tájkép")
    },
    {
      id: 11, title: "Textúrák", artist: "Kiss Márta", createdYear: 2024,
      price: 35000, xcm: 40, ycm: 40, imgUrl: IMG + "pexels-shelagh-murphy-2258795.jpg",
      description: "Vastagon felhordott festékrétegek, tapintható felülettel.",
      material: mat("Akril"), style: sty("Absztrakt")
    },
    {
      id: 12, title: "Szénrajz tanulmány", artist: "Farkas Júlia", createdYear: 2022,
      price: 28000, xcm: 30, ycm: 40, imgUrl: IMG + "Művészet.jpg",
      description: "Klasszikus szénrajz, széles tónusskálával és lágy elmosásokkal.",
      material: mat("Szén"), style: sty("Portré")
    }
  ];

  /* termekek megorzese oldalbetoltesek kozott
     enelkul a fenti PRODUCTS minden oldalbetoltesnel visszaallt az eredetire */
  var PRODUCTS_KEY = "festmenyvilag:mock:products";

  try {
    if (new URLSearchParams(location.search).get("mock") === "reset") {
      sessionStorage.removeItem(PRODUCTS_KEY);
    }
    var mentett = JSON.parse(sessionStorage.getItem(PRODUCTS_KEY) || "null");
    if (Array.isArray(mentett) && mentett.length) PRODUCTS = mentett;
  } catch (e) { /* ha nem olvashato, marad az eredeti lista */ }

  function saveProducts() {
    try { sessionStorage.setItem(PRODUCTS_KEY, JSON.stringify(PRODUCTS)); }
    catch (e) { /* tele a tar - nem kritikus */ }
  }

  var BASKET_KEY = "festmenyvilag:mock:basket";

  function basketIds() {
    try { return JSON.parse(sessionStorage.getItem(BASKET_KEY)) || []; }
    catch (e) { return []; }
  }
  function saveBasket(ids) {
    sessionStorage.setItem(BASKET_KEY, JSON.stringify(ids));
  }
  function basketItems() {
    return basketIds().map(function (id) {
      var p = PRODUCTS.filter(function (x) { return x.id === id; })[0];
      if (!p) return null;
      var copy = JSON.parse(JSON.stringify(p));
      copy.basket = { id: 1 };
      return copy;
    }).filter(Boolean);
  }

  function loggedIn() {
    return localStorage.getItem("token") !== null;
  }

  function json(body, status) {
    return Promise.resolve(new Response(JSON.stringify(body), {
      status: status || 200,
      headers: { "Content-Type": "application/json" }
    }));
  }

  function route(path, method, body) {
    var m;

    if (path === "/product/get-all") return json(PRODUCTS);

    if ((m = path.match(/^\/product\/get\/(.+)$/))) {
      var id = parseInt(m[1], 10);
      var found = PRODUCTS.filter(function (p) { return p.id === id; })[0];
      return found ? json(found) : json({ status: 404, message: "Nincs ilyen termék" }, 404);
    }

    if (path === "/product/add") {
      var next = Math.max.apply(null, PRODUCTS.map(function (p) { return p.id; })) + 1;
      var added = Object.assign({
        id: next, material: [], style: [], xcm: 40, ycm: 20,
        imgUrl: IMG + "kep1.jpg"
      }, body || {});
      PRODUCTS.push(added);
      saveProducts();
      return json({ status: 200, message: "Termék hozzáadva (mock)", id: next });
    }

    if (path === "/product/get-owned-products") {
      if (!loggedIn()) return json({ status: 401, message: "Nincs bejelentkezve" }, 401);
      var nev = (localStorage.getItem("festmenyvilag:user") || "").trim().toLowerCase();
      return json(PRODUCTS.filter(function (p) {
        return (p.artist || "").trim().toLowerCase() === nev;
      }));
    }

    // A backendben ez meg nincs meg - a termekeim oldal szerkesztes utan ide kuldi a mentest, hogy a design tesztelheto legyen
    if (path === "/product/update") {
      var uid = parseInt(body && body.id, 10);
      var idx = -1;
      PRODUCTS.forEach(function (p, i) { if (p.id === uid) idx = i; });
      if (idx === -1) return json({ status: 404, message: "Nincs ilyen termék" }, 404);

      var current = PRODUCTS[idx];
      current.title       = body.title !== undefined ? body.title : current.title;
      current.artist      = body.artist !== undefined ? body.artist : current.artist;
      current.price       = Number(body.price) || current.price;
      current.description = body.description !== undefined ? body.description : current.description;
      current.createdYear = body.createdYear || current.createdYear;
      current.imgUrl      = body.imgUrl || current.imgUrl;
      if (body.xCm) current.xcm = Number(body.xCm);
      if (body.yCm) current.ycm = Number(body.yCm);

      // a nevek listajat vissza kell alakitani {id,name} objektumokka
      if (Array.isArray(body.material)) {
        current.material = MATERIALS.filter(function (m) {
          return body.material.indexOf(m.name) !== -1;
        });
      }
      if (Array.isArray(body.style)) {
        current.style = STYLES.filter(function (s) {
          return body.style.indexOf(s.name) !== -1;
        });
      }

      saveProducts();
      return json({ status: 200, message: "Termék módosítva (mock)", id: uid });
    }

    if (path === "/material/get-all") return json(MATERIALS);
    if (path === "/style/get-all") return json(STYLES);

    if (path === "/auth/login") {
      return json({ code: "mock-token", message: "Sikeres bejelentkezés (mock)" });
    }
    if (path === "/auth/registration") {
      return json({ status: 200, message: "Sikeres regisztráció (mock)" });
    }
    if (path === "/auth/validate") {
      return json(loggedIn());
    }

    if (path === "/basket/get") {
      return json(loggedIn() ? basketItems() : []);
    }
    if (path === "/basket/save") {
      var pid = parseInt(body && body.id, 10);
      var ids = basketIds();
      if (pid && ids.indexOf(pid) === -1) { ids.push(pid); saveBasket(ids); }
      return json({ status: 200, message: "Kosárba téve (mock)" });
    }
    if (path === "/basket/remove-art-from-basket") {
      var rid = parseInt(body && body.id, 10);
      saveBasket(basketIds().filter(function (x) { return x !== rid; }));
      return json({ status: 200, message: "Törölve (mock)" });
    }

    return json({ status: 404, message: "Mock: ismeretlen végpont " + path }, 404);
  }

  var realFetch = window.fetch.bind(window);
  var BACKEND = /^https?:\/\/(localhost|127\.0\.0\.1):8080/;

  window.fetch = function (input, init) {
    var url = typeof input === "string" ? input : (input && input.url) || "";

    if (!BACKEND.test(url)) return realFetch(input, init);

    var path = url.replace(BACKEND, "").split("?")[0];
    var method = ((init && init.method) || "GET").toUpperCase();
    var body = null;
    if (init && init.body) {
      try { body = JSON.parse(init.body); } catch (e) { body = null; }
    }

    console.info("[mock-api] " + method + " " + path);

    return new Promise(function (resolve) {
      setTimeout(function () { resolve(route(path, method, body)); }, 120);
    });
  };

  // function badge() {
  //   if (document.getElementById("mock-api-badge")) return;
  //   var el = document.createElement("div");
  //   el.id = "mock-api-badge";
  //   el.textContent = "MOCK ADAT";
  //   el.title = "Kitalált adatok. Kikapcsolás: tedd az URL végére ?mock=0";
  //   el.setAttribute("style", [
  //     "position:fixed", "left:12px", "bottom:12px", "z-index:100000",
  //     "background:#B4542F", "color:#fff", "font:600 11px/1 system-ui,sans-serif",
  //     "letter-spacing:.08em", "padding:7px 10px", "border-radius:4px",
  //     "box-shadow:0 2px 8px rgba(0,0,0,.25)", "pointer-events:none",
  //     "user-select:none"
  //   ].join(";"));
  //   document.body.appendChild(el);
  // }

  // a badge() definiciojat kikommentelted, ezert a hivasat is ki kellett venni, mert igy ReferenceError-t dobott ("badge is not defined")

  console.info("[mock-api] Bekapcsolva — kitalált adatok. Kikapcsolás: ?mock=0");
})();