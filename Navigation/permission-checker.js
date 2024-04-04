import { parseJwt } from "./jwt.js";

// ennek a szarnak minden oldalbetolteskor lekell futnia hoogy megnezzuk hogy mefelelo joggal
// es valid jwt-vel akarod elerni az oldalt
function redirectToLogin(pageNameTrimmed) {
  const url = "http://127.0.0.1:8080/auth/validate";

  fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      let jwtObject = parseJwt(localStorage.getItem("token"));

      // a data a response amit a backended kuld. ha az false akkor eliranyit
      if (data == false || jwtObject.payload.role != pageNameTrimmed) {
        window.location.href = "/";
      }
    })
    .catch((error) => {
      window.location.href = "/";
    });
}

// ez egy szar megoldas. itt azt csinalom hogy oldalbetoltesekor megnezi hogy milyen url hivta meg pl:
// http://localhost:3000/user-dashboard.html
// ebbol kiszedem a user-dashboard.html szoveget
// majd leszedem belole az elso kotojel elottig mindent tehat marad user
// ami megeggyezik a jogoddal tehat elered :D
window.addEventListener("DOMContentLoaded", function () {
  let param = document.location.pathname.substring(1);
  redirectToLogin(param.split("-")[0]);
});
