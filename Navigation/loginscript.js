(function () {
  "use strict";

  let initialized = false;

  function openPopup() {
    if (localStorage.getItem("token") !== null) return;
    const popup = document.getElementById("popup");
    if (popup) popup.style.display = "block";
  }

  function closePopup() {
    const popup = document.getElementById("popup");
    if (popup) popup.style.display = "none";
  }

  function registration() {
    const regUsername = document.getElementById("user-reg").value;
    const regPassword = document.getElementById("pass-reg").value;
    const email = document.getElementById("email").value;

    const formData = {
      userName: regUsername,
      password: regPassword,
      email: email,
    };

    fetch("http://localhost:8080/auth/registration", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then(function (response) { return response.json(); })
      .then(function (data) {
        if (data.status !== 500) {
          alert("Sikeres regisztráció");
          closePopup();
        } else {
          console.log("Success:", data);
          closePopup();
          alert(data.message);
        }
      })
      .catch(function (error) {
        console.error("Error:", error);
        alert(error);
      });
  }

  function login() {
    const loginUsername = document.getElementById("user-login").value;
    const loginPassword = document.getElementById("pass-login").value;

    fetch("http://localhost:8080/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userName: loginUsername,
        password: loginPassword
      }),
    })
      .then(function (response) {
        if (response.status === 200) {
          return response.json();
        }
        throw new Error("Hibás felhasználónév vagy jelszó");
      })
      .then(function (data) {
        console.log("Sikeres bejelentkezés:", data);
        if (window.Auth) {
          window.Auth.setSession(loginUsername, data.code);
        } else {
          window.localStorage.setItem("token", data.code);
        }
        closePopup();
        alert("Sikeres bejelentkezés!");
      })
      .catch(function (error) {
        console.error("Hiba történt:", error.message);
        alert(error.message);
      });
  }

  function attachEvents() {
    const popupContent = document.querySelector(".popup-content");
    const loginLink = document.querySelector(".login-link");
    const registerLink = document.querySelector(".register-link");
    const loginButton = document.getElementById("login-btn");
    const regButton = document.getElementById("regButton");
    const closeButton = document.getElementById("btnClose");
    const loginTrigger = document.getElementById("btnLogin");

    if (!popupContent || !loginTrigger || !closeButton) return false;

    loginTrigger.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      openPopup();
    });

    closeButton.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      closePopup();
    });

    if (registerLink) {
      registerLink.addEventListener("click", function (event) {
        event.preventDefault();
        popupContent.classList.add("active");
      });
    }

    if (loginLink) {
      loginLink.addEventListener("click", function (event) {
        event.preventDefault();
        popupContent.classList.remove("active");
      });
    }

    if (regButton) {
      regButton.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        registration();
      });
    }

    if (loginButton) {
      loginButton.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        login();
      });
    }

    return true;
  }

  function init() {
    if (initialized) return;
    initialized = true;
    if (attachEvents()) return;

    const observer = new MutationObserver(function () {
      if (attachEvents()) observer.disconnect();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    setTimeout(function () { observer.disconnect(); }, 10000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();