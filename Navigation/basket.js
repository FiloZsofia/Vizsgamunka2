/* ezt total atdolgoztam, a lenyeg:
ha nem vagy belepve, akkor a tetelek a "localStorage"-ban tarolodnak, igy belepes nelkul is kosarba lehet tenni termekeket
ha nem belepettkent valamit a kosarba teszel, majd belepsz, a "mergeGuestCart" function reven megmarad a kosarban (ez eddig is igy volt, de egy bug miattxd)
a mar belepett kosarba helyezes logikajahoz nem nyultam, az franko */

(function () {
  "use strict";

  var API = "http://localhost:8080";
  var GUEST_KEY = "festmenyvilag:cart";

  function token() { return localStorage.getItem("token"); }
  function loggedIn() { return token() !== null; }

  /* nem belepett kosar tarolasa */
  function guestRead() {
    try { return JSON.parse(localStorage.getItem(GUEST_KEY)) || []; }
    catch (e) { return []; }
  }

  function guestWrite(items) {
    try { localStorage.setItem(GUEST_KEY, JSON.stringify(items)); }
    catch (e) { console.error("Kosár mentése sikertelen:", e); }
  }

  // csak annyi infot tartunk meg, amit a basketban megjelenitunk
  function normalize(p) {
    return {
      id: p.id,
      title: p.title,
      price: Number(p.price) || 0,
      imgUrl: p.imgUrl,
      xcm: p.xcm,
      ycm: p.ycm,
      basket: p.basket
    };
  }

  function sameId(a, b) { return String(a) === String(b); }

  var Cart = {
    items: function () {
      if (!loggedIn()) return Promise.resolve(guestRead());

      return fetch(API + "/basket/get", { headers: { Authorization: token() } })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          return Array.isArray(data) ? data.map(normalize) : [];
        })
        .catch(function (err) {
          console.error("Kosár betöltése sikertelen:", err);
          return [];
        });
    },

    add: function (product) {
      if (!product || product.id == null) return Promise.resolve();

      var done;
      if (!loggedIn()) {
        var items = guestRead();
        if (!items.some(function (i) { return sameId(i.id, product.id); })) {
          items.push(normalize(product));
          guestWrite(items);
        }
        done = Promise.resolve();
      } else {
        done = fetch(API + "/basket/save", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: token() },
          body: JSON.stringify({ id: product.id })
        }).catch(function (err) {
          console.error("Kosárba tétel sikertelen:", err);
        });
      }

      return done.then(function () { return render(); }).then(openDrawer);
    },

    remove: function (item) {
      var done;
      if (!loggedIn()) {
        guestWrite(guestRead().filter(function (i) { return !sameId(i.id, item.id); }));
        done = Promise.resolve();
      } else {
        done = fetch(API + "/basket/remove-art-from-basket", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: token() },
          body: JSON.stringify({
            id: item.id,
            basket: { id: item.basket ? item.basket.id : null }
          })
        }).catch(function (err) {
          console.error("Törlés sikertelen:", err);
        });
      }

      return done.then(function () { return render(); });
    },

    open: function () { return render().then(openDrawer); },
    close: closeDrawer
  };

  window.Cart = Cart;

  /* nem belepett basket tartalmanak transzferalasa, ha belepett */
  function mergeGuestCart() {
    var pending = guestRead();
    if (!loggedIn() || pending.length === 0) return Promise.resolve();

    return Promise.all(pending.map(function (item) {
      return fetch(API + "/basket/save", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: token() },
        body: JSON.stringify({ id: item.id })
      }).catch(function (err) {
        console.error("Vendég kosár átvitele sikertelen:", err);
      });
    })).then(function () {
      localStorage.removeItem(GUEST_KEY);
    });
  }

  /* kinezet */
  function forint(n) {
    return (Number(n) || 0).toLocaleString("hu-HU") + " Ft";
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function renderEmpty(body) {
    var wrap = el("div", "cart-empty");
    var icon = document.createElement("ion-icon");
    icon.setAttribute("name", "cart-outline");
    wrap.appendChild(icon);
    wrap.appendChild(el("p", null, "A kosár üres."));
    body.appendChild(wrap);
  }

  function renderLine(item, body) {
    var line = el("div", "cart-line");

    var img = document.createElement("img");
    img.className = "cart-line__img";
    img.src = item.imgUrl || "";
    img.alt = item.title || "";
    line.appendChild(img);

    var info = el("div", "cart-line__info");
    info.appendChild(el("span", "cart-line__title", item.title || "Névtelen mű"));

    if (item.xcm && item.ycm) {
      info.appendChild(el("span", "cart-line__meta", item.xcm + " × " + item.ycm + " cm"));
    }
    info.appendChild(el("p", "cart-line__price", forint(item.price)));
    line.appendChild(info);

    var remove = el("button", "cart-line__remove");
    remove.type = "button";
    remove.title = "Eltávolítás";
    var x = document.createElement("ion-icon");
    x.setAttribute("name", "close");
    remove.appendChild(x);
    remove.addEventListener("click", function () { Cart.remove(item); });
    line.appendChild(remove);

    body.appendChild(line);
  }

  function render() {
    return Cart.items().then(function (items) {
      var body  = document.getElementById("cartItems");
      var foot  = document.getElementById("cart-foot");
      var total = document.getElementById("cart-total");
      var count = document.getElementById("cart-count");

      if (count) {
        count.textContent = items.length;
        count.hidden = items.length === 0;
      }

      if (!body) return items;
      body.innerHTML = "";

      if (items.length === 0) {
        renderEmpty(body);
        if (foot) foot.hidden = true;
        return items;
      }

      items.forEach(function (item) { renderLine(item, body); });

      if (total) {
        total.textContent = forint(items.reduce(function (sum, i) {
          return sum + (Number(i.price) || 0);
        }, 0));
      }
      if (foot) foot.hidden = false;

      return items;
    });
  }

  /* open/close mechanika */
  function drawer() { return document.getElementById("cart-drawer"); }

  function openDrawer() {
    var d = drawer();
    if (d) d.classList.add("open");
  }

  function closeDrawer() {
    var d = drawer();
    if (d) d.classList.remove("open");
  }

  /* */

  function whenPresent(id, callback) {
    var existing = document.getElementById(id);
    if (existing) { callback(existing); return; }

    var observer = new MutationObserver(function () {
      var node = document.getElementById(id);
      if (node) { observer.disconnect(); callback(node); }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });

    // timeout, hogy ne varjunk orokke
    setTimeout(function () { observer.disconnect(); }, 10000);
  }

  whenPresent("fentikosar", function (button) {
    button.addEventListener("click", function (event) {
      event.preventDefault();
      Cart.open();
    });

    document.querySelectorAll("[data-cart-close]").forEach(function (node) {
      node.addEventListener("click", closeDrawer);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeDrawer();
    });

    var checkout = document.getElementById("cart-checkout");
    if (checkout) {
      checkout.addEventListener("click", function () {
        alert("A fizetési folyamat még nem készült el.");
      });
    }

    // indulaskor vegrehajtas
    mergeGuestCart().then(render);
  });
})();