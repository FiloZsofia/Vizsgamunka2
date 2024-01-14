document.addEventListener("DOMContentLoaded", function () {

let image = document.getElementById("image");
let price = document.getElementById("price");
let size = document.getElementById("size");
let name = document.getElementById("festmenyNevek")


// A fetch függvény használata a GET kérés elküldéséhez
fetch('https://api.punkapi.com/v2/beers')
  .then(response => {
    // Ellenőrizze, hogy a válasz sikeres-e (HTTP státuszkód 200-299)
    if (!response.ok) {
      throw new Error(`Hiba a kérés során: ${response.status}`);
    }
    
    // A válasz JSON formátumra való átalakítása
    return response.json();
  })
  .then(data => {
    // Az API válaszban lévő adatok kezelése
    console.log('API válasz:', data);

    name.innerText = data[1].name;
    price.innerText =`"${data[1].first_brewed}" Ft`


  })
  .catch(error => {
    // Az esetleges hibák kezelése
    console.error('Hiba történt:', error);
  });


})

