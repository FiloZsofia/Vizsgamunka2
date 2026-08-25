$("#navi").html(NAVIGATION_HTML)
$("#footer").html(FOOTER_HTML)

//REST API technikák betöltése:

let material = []
const technika = document.getElementById("technika");


async function materials() {
    const response = await fetch("http://localhost:8080/material/get-all");
    const data = await response.json();
    console.log(data);

    data.forEach((materials) => {
      material = data;
      const input = document.createElement("input");
      const label = document.createElement("label");

      label.innerText = materials.name;
      input.className = "checkbox";
      input.type = "checkbox";
      // Ertek es id nelkul nem lehetett kiolvasni, mit pipalt be a felhasznalo,
      // ezert nem is kerult bele a feltoltendo adatokba.
      input.value = materials.name;
      input.dataset.id = materials.id;
      label.insertBefore(input, label.firstChild); // A checkboxot az input elem elé szúrjuk be a labelben
      technika.appendChild(label); // Hozzáadjuk a labelt a technikához

    });
    console.log(data);
  }
  
  
materials();


//REST API témák betöltése:

let style = []
const tema = document.getElementById("tema");


async function styles() {
    const response = await fetch("http://localhost:8080/style/get-all");
    const data = await response.json();
    console.log(data);

    data.forEach((styles) => {
      style = data;
      const input = document.createElement("input");
      const label = document.createElement("label");

      label.innerText = styles.name;
      input.className = "checkbox";
      input.type = "checkbox";
      input.value = styles.name;
      input.dataset.id = styles.id;
      label.insertBefore(input, label.firstChild); // A checkboxot az input elem elé szúrjuk be a labelben
      tema.appendChild(label); // Hozzáadjuk a labelt a technikához

    });
    console.log(data);
  }
  
  
styles();

//Termék feltöltése:
let cim = document.getElementById("productName");
let muvesz = document.getElementById("artist");
let ar = document.getElementById("ar");
let leiras = document.getElementById("leiras");
let keszitve = document.getElementById("keszitesEve");
let meretHossz = document.getElementById("meretHossz");
let meretSzeles = document.getElementById("meretSzeles");
let kepUtvonal = document.getElementById("imgUrl");

// A bepipalt technikak / temak kiolvasasa {id, name} alakban - ugyanabban a
// formaban, ahogy a backend a /material/get-all es /style/get-all vegponton
// visszaadja oket.
function kivalasztottak(containerId) {
  return Array.from(
    document.querySelectorAll("#" + containerId + " input.checkbox:checked")
  ).map(function (input) {
    return { id: Number(input.dataset.id), name: input.value };
  });
}

// Korabban egy fix "20x40"/"40x60"/"60x80" legordulobol jott a meret - most
// a feltolto szabadon megadhatja ket kulon szammezoben (hosszusag x szelesseg).
//
// A mezonev SZANDEKOSAN xcm/ycm kisbetuvel: a backend ArtDto-jaban a mezo
// neve xCm, de a Jackson ezt "xcm"-kent teszi ki a drotra (a GET valasz is
// igy adja vissza). Ha xCm-et kuldunk, nem kot be, es 0 kerul az adatbazisba.
function meretek() {
  return {
    xcm: Number(meretHossz && meretHossz.value) || 0,
    ycm: Number(meretSzeles && meretSzeles.value) || 0
  };
}

// Visszajelzes a felhasznalonak. Korabban csak console.log volt, ezert tunt
// ugy, hogy a gomb megnyomasara egyaltalan nem tortenik semmi.
function statusz(uzenet, sikeres) {
  var el = document.getElementById("feltoltes-status");
  if (!el) return;
  el.textContent = uzenet;
  el.className = "form-status " + (sikeres ? "form-status--ok" : "form-status--error");
  el.hidden = false;
}

function urlapUrites() {
  cim.value = "";
  muvesz.value = "";
  ar.value = "";
  leiras.value = "";
  keszitve.value = "";
  if (meretHossz) meretHossz.value = "";
  if (meretSzeles) meretSzeles.value = "";
  if (kepUtvonal) kepUtvonal.value = "";
  document.querySelectorAll("#technika input:checked, #tema input:checked")
    .forEach(function (i) { i.checked = false; });
  // A dropdown gombok szoveget is vissza kell allitani "Válassz…"-re, mert a
  // filter.js csak checkbox-valtozasra frissiti oket.
  document.querySelectorAll(".dropdown .dropbtn[data-placeholder]").forEach(function (btn) {
    btn.textContent = btn.dataset.placeholder;
  });
  var kep = document.querySelector("#upload-form .uploaded-image");
  if (kep) kep.remove();
  var hint = document.querySelector("#upload-form .img_upload__hint");
  if (hint) hint.hidden = false;
}

function feltoltes(){
//ez a json, a kettőspont előtti szöveg jön a backendből, az Art.java (entity) classból, a kettőspont utáni pedig szabadon elnevezhető
const m = meretek();
const formData = {
  title: cim.value,
  artist: muvesz.value,
  price: ar.value,
  description: leiras.value,
  // A szerver csak hivatkozast tarol (img_url varchar(255)), fajlt nem.
  // A blob: URL-t nem lehet elmenteni, mert csak az adott bongeszomenetben el.
  imgUrl: kepUtvonal.value.trim(),
  createdYear: keszitve.value,
  xcm: m.xcm,
  ycm: m.ycm,
  material: kivalasztottak("technika"),
  style: kivalasztottak("tema"),
};

if (!formData.title || !formData.price) {
  statusz("A festmény neve és az ár megadása kötelező.", false);
  return;
}

const gomb = document.getElementById("add-products-button");
gomb.disabled = true;
gomb.textContent = "Feltöltés…";

// Send POST request to Spring Boot backend
fetch("http://localhost:8080/product/add", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": localStorage.getItem("token")
  },
  body: JSON.stringify(formData),
})
  .then((response) => {
    if (!response.ok) throw new Error("A szerver " + response.status + " hibakóddal válaszolt");
    return response.json();
  })
  .then((data) => {
    console.log("Success:", data);
    statusz("A termék feltöltve.", true);
    urlapUrites();
  })
  .catch((error) => {
    console.error("Error:", error);
    statusz("A feltöltés nem sikerült: " + error.message + ". Fut a backend?", false);
  })
  .finally(() => {
    gomb.disabled = false;
    gomb.textContent = "Termék hozzáadása";
  });
}

let hozzaad = document.getElementById("add-products-button");
if (hozzaad) {
    hozzaad.onclick = feltoltes;
}

//KÉP KIVÁLASZTÁS
// Fájlkiválasztás a formon belülre kattintáskor:
document.getElementById('upload-form').addEventListener('click', function() {
  // Amikor a formon belül bármely helyen kattintunk, megnyitjuk a fájlkiválasztó ablakot
  document.getElementById('file-input').click();
});

// Fájl kiválasztása után történő eseménykezelő
document.getElementById('file-input').addEventListener('change', function() {
  // Az 'input' esemény kiváltása után meg tudjuk állapítani, hogy a felhasználó választott-e fájlt
  if (this.files && this.files[0]) {
      // Ha a felhasználó választott egy fájlt, akkor megtehetjük a szükséges műveleteket, pl. fájl feltöltése
      console.log('Kiválasztott fájl:', this.files[0]);
      
      // Előzőleg kiválasztott kép eltávolítása, ha van
      var uploadedImage = document.querySelector('.uploaded-image');
      if (uploadedImage) {
        uploadedImage.parentNode.removeChild(uploadedImage);
      }

      // Ez a blob: URL CSAK az elonezethez jo - nem menthető el, mert a
      // bongeszomenet vegen ervenyet veszti. A mentendo hivatkozast a
      // "Kép útvonala" mezobe irjuk, amit a felhasznalo at is irhat.
      var imagePath = URL.createObjectURL(this.files[0]);

      if (kepUtvonal && !kepUtvonal.value.trim()) {
        kepUtvonal.value = '../Assets/images/' + this.files[0].name;
      }

      // Kép megjelenítése a HTML-ben
      var imageElement = document.createElement('img');
      imageElement.src = imagePath;
      imageElement.classList.add('uploaded-image'); // opcionális: hozzáadhatunk egy CSS osztályt is a képhez
      document.getElementById('upload-form').appendChild(imageElement);

      var hint = document.querySelector('#upload-form .img_upload__hint');
      if (hint) hint.hidden = true;
  }
});