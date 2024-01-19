document.addEventListener("DOMContentLoaded", function () {
  // A fetch függvény használata a GET kérés elküldéséhez
  fetch("https://api.punkapi.com/v2/beers")
    .then((response) => {
      // Ellenőrizze, hogy a válasz sikeres-e (HTTP státuszkód 200-299)
      if (!response.ok) {
        throw new Error(`Hiba a kérés során: ${response.status}`);
      }

      // A válasz JSON formátumra való átalakítása
      return response.json();
    })
    .then((data) => {
      // Az API válaszban lévő adatok kezelése
      console.log("API válasz:", data);

      // Iteráljunk az adatokon és hozzunk létre egy-egy termék dobozt
      data.forEach((beer, index) => {
        termekDoboz(index + 1, beer);
      });
    })
    .catch((error) => {
      // Az esetleges hibák kezelése
      console.error("Hiba történt:", error);
    });
});

function termekDoboz(number, beerData) {
  let section = document.getElementById("section");

  let ourBox = document.createElement("div");
  ourBox.className = "our-box";

  let image = document.createElement("img");
  image.id = `image${number}`;
  image.src = beerData.image_url;

  let ourContent = document.createElement("div");
  ourContent.className = "our-content";

  let festmenyNevek = document.createElement("h3");
  festmenyNevek.innerText = beerData.name;

  let price = document.createElement("p");
  price.className = "price";
  price.innerText = `"${beerData.first_brewed}" Ft`;

  let size = document.createElement("p");
  size.className = "size";
  size.innerText = `A termék mérete: "${beerData.ibu}"`;

  let kosar = document.createElement("button");
  kosar.className = "kosar";
  kosar.innerText = "Kosárba";

  ourContent.appendChild(festmenyNevek);
  ourContent.appendChild(price);
  ourContent.appendChild(size);
  ourContent.appendChild(kosar);
  ourBox.appendChild(image);
  ourBox.appendChild(ourContent);

  section.appendChild(ourBox);
}

