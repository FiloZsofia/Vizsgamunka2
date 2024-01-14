document.addEventListener("DOMContentLoaded", function () {

  termekDoboz();
 
  let image = document.getElementById("image");
  let price = document.getElementById("price");
  let size = document.getElementById("size");
  let name = document.getElementById("festmenyNevek");


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

      name.innerText = data[1].name;
      price.innerText = `"${data[1].first_brewed}" Ft`;
      size.innerText = `A termék mérete: "${data[1].ibu}"`;
      image.src = data[1].image_url;
    })
    .catch((error) => {
      // Az esetleges hibák kezelése
      console.error("Hiba történt:", error);
    });
});


function termekDoboz() {

      let section = document.getElementById("section");

      let ourBox = document.createElement("div");
      ourBox.className = "our-box";

      let image = document.createElement("img");
      image.id = "image";

      let ourContent = document.createElement("div");
      ourContent.className = "our-content";

      let festmenyNevek = document.createElement("h3");
      festmenyNevek.id = "festmenyNevek";

      let price = document.createElement("p");
      price.class = "price";
      price.id = "price";

      let size = document.createElement("p");
      size.class = "size";
      size.id = "size";

      let kosar = document.createElement("button");
      kosar.class = "kosar";
      kosar.id = "kosar";

      ourContent.appendChild(festmenyNevek);
      ourContent.appendChild(price);
      ourContent.appendChild(size);
      ourContent.appendChild(kosar);
      ourBox.appendChild(image);
      ourBox.appendChild(ourContent);

      section.appendChild(ourBox);
}
