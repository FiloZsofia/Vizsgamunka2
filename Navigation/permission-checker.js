// a helytelen location hivatkozasokat javitottam
//
// A "Termek feltoltese" es az "Egyedi rendeles" mar nem a fo navigacioban van,
// hanem a fiok menuben (Navigation/auth.js), es csak belepve latszik. Ezert a
// korabbi checkUpload/checkOrder atiranyito fuggvenyek es a hozzajuk tartozo
// #feltoltes / #rendeles bekotes kikerult: azok a nav elemek mar nem leteznek,
// es a bekotes null-on hasalt volna el.
//
// Ami maradt: a redirectToLogin(), amivel a vedett oldalak (check-feltoltes.js,
// check-rendeles.js) ellenorzik a backenden, hogy ervenyes-e meg a token.

export function redirectToLogin() {
  const url = "http://127.0.0.1:8080/auth/validate";

  fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data == false) {
        alert("Bejelentkezés szükséges");
        window.location.href = "../Main/index.html";
      } else {
        console.log("Be vagy jelentkezve");
      }
    })
    .catch((error) => {
      console.log(error);
      window.location.href = "../Main/index.html";
    });
}
