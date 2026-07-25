/* egy helyen kezeli, hogy be van-e lepve a felhasználo, ennek fuggvenyeben alakitja a navbart
nincs belepve = login popup nyilik meg
be van lepbe = dropdown menu nyilik meg

a felhasznalonevet login utan menti el, mert a backend csak egy tokent ad vissza, viszont a termekeim listahoz kell a nev. */

(function () {
  "use strict";

  var TOKEN_KEY = "token"; // ezt hasznalja a projekt tobbi resze is
  var USER_KEY  = "festmenyvilag:user";

  var Auth = {
    isLoggedIn: function () {
      return localStorage.getItem(TOKEN_KEY) !== null;
    },

    token: function () {
      return localStorage.getItem(TOKEN_KEY);
    },

    username: function () {
      return localStorage.getItem(USER_KEY) || "";
    },

    // loginscript.js hivja, ha sikeres a login
    setSession: function (username, token) {
      if (token != null) localStorage.setItem(TOKEN_KEY, token);
      if (username) localStorage.setItem(USER_KEY, username);
      renderUserMenu();
    },

    logout: function () {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      window.location.href = "../Main/index.html";
    },

    // csak lokalis ellenorzes, szerintem nem is kellxd
    requireLogin: function () {
      if (Auth.isLoggedIn()) return true;
      alert("Ehhez az oldalhoz be kell jelentkezned.");
      window.location.href = "../Main/index.html";
      return false;
    }
  };

  window.Auth = Auth;

  /* csak logged in lehessen elerni */
  if (document.body && document.body.hasAttribute("data-requires-auth")) {
    Auth.requireLogin();
  } else {
    document.addEventListener("DOMContentLoaded", function () {
      if (document.body.hasAttribute("data-requires-auth")) Auth.requireLogin();
    });
  }

  
  function menu()     { return document.getElementById("user-menu"); }
  function dropdown() { return document.getElementById("user-dropdown"); }

  function openDropdown() {
    var m = menu();
    if (m) m.classList.add("open");
  }

  function closeDropdown() {
    var m = menu();
    if (m) m.classList.remove("open");
  }

  function renderUserMenu() {
    var m = menu();
    if (!m) return;

    var authed = Auth.isLoggedIn();
    m.classList.toggle("is-authed", authed);

    var nameEl = document.getElementById("user-menu-name");
    if (nameEl) nameEl.textContent = Auth.username() || "Felhasználó";

    var trigger = document.getElementById("btnLogin");
    if (trigger) {
      trigger.setAttribute("title", authed ? "Fiók" : "Bejelentkezés");
    }

    if (!authed) closeDropdown();
  }

  
  function whenPresent(id, callback) {
    var existing = document.getElementById(id);
    if (existing) { callback(existing); return; }

    var observer = new MutationObserver(function () {
      var node = document.getElementById(id);
      if (node) { observer.disconnect(); callback(node); }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    setTimeout(function () { observer.disconnect(); }, 10000);
  }

  whenPresent("user-menu", function () {
    renderUserMenu();

    var trigger = document.getElementById("btnLogin");
    if (trigger) {
      trigger.addEventListener("click", function (event) {
        // logoutnal a loginscript.js nyitja a popupot
        if (!Auth.isLoggedIn()) return;
        event.preventDefault();
        event.stopPropagation();
        menu().classList.toggle("open");
      });
    }

    var logout = document.getElementById("logout-btn");
    if (logout) {
      logout.addEventListener("click", function () { Auth.logout(); });
    }

    // diven kivulre kattintassal bezarodik
    document.addEventListener("click", function (event) {
      var m = menu();
      if (m && !m.contains(event.target)) closeDropdown();
    });

    // eszkeppel bezarodik
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeDropdown();
    });
  });
})();