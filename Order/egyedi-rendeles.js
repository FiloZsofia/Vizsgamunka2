$("#navi").html(NAVIGATION_HTML)
$("#footer").html(FOOTER_HTML)

var API = "http://localhost:8080";

let material = []
const technika = document.getElementById("technika");


async function materials() {
    const response = await fetch("http://localhost:8080/material/get-all");
    const data = await response.json();
    console.log(data);

    data.forEach((materials) => {
      material = data;
      const option = document.createElement("option");
      option.value = materials.id;
      option.text = materials.name;
      technika.appendChild(option);
    });
    console.log(data);
  }


materials();

// Fájlkiválasztás a formon belülre kattintáskor:
document.getElementById('upload-form').addEventListener('click', function() {
  // Amikor a formon belül bármely helyen kattintunk, megnyitjuk a fájlkiválasztó ablakot
  document.getElementById('file-input').click();
});

// ugyanugy mukodik, mint a termek-feltoltese.js: url csak elonezethez jo, tenylegesen a "Kép útvonala" mezo a mervado
document.getElementById('file-input').addEventListener('change', function() {
  if (this.files && this.files[0]) {
      console.log('Kiválasztott fájl:', this.files[0]);

      var kepUtvonalMezo = document.getElementById('imgUrl');
      if (kepUtvonalMezo && !kepUtvonalMezo.value.trim()) {
        kepUtvonalMezo.value = '../Assets/images/' + this.files[0].name;
      }

      var regiKep = document.querySelector('#upload-form .uploaded-image');
      if (regiKep) regiKep.remove();

      var imagePath = URL.createObjectURL(this.files[0]);
      var imageElement = document.createElement('img');
      imageElement.src = imagePath;
      imageElement.className = 'uploaded-image';
      document.getElementById('upload-form').appendChild(imageElement);

      var hint = document.querySelector('#upload-form .img_upload__hint');
      if (hint) hint.hidden = true;
  }
});

// visszajelzes a felhasznalonak
function statusz(uzenet, sikeres) {
  var el = document.getElementById("rendeles-status");
  if (!el) return;
  el.textContent = uzenet;
  el.className = "form-status " + (sikeres ? "form-status--ok" : "form-status--error");
  el.hidden = false;
}

function urlapUrites() {
  document.getElementById("leiras").value = "";
  document.getElementById("rendeles-xcm").value = "";
  document.getElementById("rendeles-ycm").value = "";
  document.getElementById("imgUrl").value = "";
  technika.selectedIndex = 0;

  var kep = document.querySelector("#upload-form .uploaded-image");
  if (kep) kep.remove();
  var hint = document.querySelector("#upload-form .img_upload__hint");
  if (hint) hint.hidden = false;
}

function rendelesLeadasa() {
  var materialId = Number(technika.value) || null;
  var xcm = Number(document.getElementById("rendeles-xcm").value) || 0;
  var ycm = Number(document.getElementById("rendeles-ycm").value) || 0;
  var leiras = document.getElementById("leiras").value.trim();
  var kepUtvonal = document.getElementById("imgUrl").value.trim();

  if (!materialId) {
    statusz("A technika kiválasztása kötelező.", false);
    return;
  }
  if (!xcm || !ycm) {
    statusz("A méret (hosszúság és szélesség) megadása kötelező.", false);
    return;
  }
  if (!leiras) {
    statusz("A leírás megadása kötelező.", false);
    return;
  }

  var formData = {
    materialId: materialId,
    xcm: xcm, // szandekosan kisbetus
    ycm: ycm, // szandekosan kisbetus
    description: leiras,
    upload: kepUtvonal
  };

  var gomb = document.getElementById("add-product-button");
  gomb.disabled = true;
  gomb.textContent = "Küldés…";

  fetch(API + "/order/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("token")
    },
    body: JSON.stringify(formData)
  })
    .then((response) => {
      if (!response.ok) throw new Error("A szerver " + response.status + " hibakóddal válaszolt");
      return response.json();
    })
    .then((data) => {
      console.log("Success:", data);
      statusz("A megrendelésed megérkezett, hamarosan felvesszük veled a kapcsolatot.", true);
      urlapUrites();
    })
    .catch((error) => {
      console.error("Error:", error);
      statusz("A megrendelés nem sikerült: " + error.message + ". Fut a backend?", false);
    })
    .finally(() => {
      gomb.disabled = false;
      gomb.textContent = "Ajánlat kérése";
    });
}

var hozzaad = document.getElementById("add-product-button");
if (hozzaad) {
  hozzaad.onclick = rendelesLeadasa;
}
