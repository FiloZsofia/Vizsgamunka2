/* mivel a backend nem tarol felhasznaloi adatot (amugy wtf), ezert csak a loginkor elmentett nev jelenik meg */

$("#navi").load("../Navigation/navigation.html");
$("#footer").load("../Footer/footer.html");

document.addEventListener("DOMContentLoaded", function () {
  var nev = (window.Auth && window.Auth.username()) || "Felhasználó";

  document.getElementById("profil-nev").textContent = nev;
  document.getElementById("profil-monogram").textContent =
    nev.trim().charAt(0).toUpperCase() || "?";

  document.getElementById("profil-kilepes").addEventListener("click", function () {
    window.Auth.logout();
  });
});