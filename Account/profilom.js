/* mivel a backend nem tarol felhasznaloi adatot (amugy wtf), ezert csak a loginkor elmentett nev jelenik meg */

$("#navi").html(NAVIGATION_HTML);
$("#footer").html(FOOTER_HTML);

var PROFILE_IMAGE_KEY = "festmenyvilag:profile-image";

function renderAvatar(initials, imageDataUrl) {
  var avatar = document.getElementById("profil-monogram");
  var actionButton = document.getElementById("changing-profile-picture");
  if (!avatar) return;

  if (imageDataUrl) {
    avatar.textContent = "";
    avatar.style.backgroundImage = "url(" + imageDataUrl + ")";
    avatar.style.backgroundSize = "cover";
    avatar.style.backgroundPosition = "center";
    avatar.style.color = "transparent";
    if (actionButton) actionButton.textContent = "Profilkép törlése";
    return;
  }

  avatar.style.backgroundImage = "";
  avatar.style.backgroundSize = "";
  avatar.style.backgroundPosition = "";
  avatar.style.color = "";
  avatar.textContent = initials || "?";
  if (actionButton) actionButton.textContent = "Profilkép hozzáadása";
}

function loadSavedAvatar(initials) {
  var savedImage = localStorage.getItem(PROFILE_IMAGE_KEY);
  renderAvatar(initials, savedImage || "");
}

document.addEventListener("DOMContentLoaded", function () {
  var nev = (window.Auth && window.Auth.username()) || "Felhasználó";
  var initials = (nev || "Felhasználó").trim().charAt(0).toUpperCase() || "?";

  document.getElementById("profil-nev").textContent = nev;
  loadSavedAvatar(initials);

  var avatar = document.getElementById("profil-monogram");
  var fileInput = document.getElementById("profil-kep-input");
  var removeButton = document.getElementById("changing-profile-picture");
  var changeUsernameBtn = document.getElementById("changing-username");

  if (avatar && fileInput) {
    avatar.addEventListener("click", function () {
      fileInput.click();
    });

    avatar.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        fileInput.click();
      }
    });

    fileInput.addEventListener("change", function (event) {
      var file = event.target.files && event.target.files[0];
      if (!file) return;

      var reader = new FileReader();
      reader.onload = function (e) {
        var dataUrl = e.target.result;
        localStorage.setItem(PROFILE_IMAGE_KEY, dataUrl);
        renderAvatar(initials, dataUrl);
      };
      reader.readAsDataURL(file);
      fileInput.value = "";
    });
  }

  if (removeButton && fileInput) {
    removeButton.addEventListener("click", function () {
      if (removeButton.textContent === "Profilkép hozzáadása") {
        fileInput.click();
        return;
      }

      localStorage.removeItem(PROFILE_IMAGE_KEY);
      renderAvatar(initials, "");
    });
  }

/* --- Felhasználónév módosítása logika --- */
// Ahhoz, hogy ez kijelentkezés után is működjön, meg kell még írni a Backend API hívást, majd ezt a végpontot meghívni
if (changeUsernameBtn) {
  changeUsernameBtn.addEventListener("click", function () {
    var currentName = document.getElementById("profil-nev").textContent;
    var newName = prompt("Add meg az új felhasználónevedet:", currentName);

    if (newName && newName.trim() !== "" && newName.trim() !== currentName) {
      var cleanName = newName.trim();

      // 1. Frissítjük a megfelelő kulcsot a localStorage-ban, amit az Auth modul olvas
      localStorage.setItem("festmenyvilag:user", cleanName);

      // Biztonsági kedvéért frissítjük a sima kulcsokat is, ha más script használná
      localStorage.setItem("username", cleanName);
      localStorage.setItem("festmenyvilag:username", cleanName);

      // 2. Frissítjük a kijelzőt a Profilom oldalon
      document.getElementById("profil-nev").textContent = cleanName;

      // 3. Frissítjük a navigációs sávban lévő nevet is (ha nyitva van/látható)
      var navNameEl = document.getElementById("user-menu-name");
      if (navNameEl) navNameEl.textContent = cleanName;

      // 4. Újrageneráljuk a monogramot az új név alapján
      initials = cleanName.charAt(0).toUpperCase() || "?";
      loadSavedAvatar(initials);

      alert("Felhasználónév sikeresen módosítva!");
    }
  });
}

  document.getElementById("profil-kilepes").addEventListener("click", function () {
    window.Auth.logout();
  });
});