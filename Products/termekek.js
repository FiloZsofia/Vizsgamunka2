setTimeout(function() {
    $("#navi").load("../Navigation/navigation.html");
    $("#footer").load("../Footer/footer.html");
}, 500);


getProducts(); 



function termekDoboz(number, termekek) {
  let section = document.getElementById("termekek");

  let ourBox = document.createElement("div");
  ourBox.className = "our-box";

  let imgdiv = document.createElement("div");
  imgdiv.className = "img-div";

  let image = document.createElement("img");
  image.id = number;
  image.src = termekek.imgUrl;

  let ourContent = document.createElement("div");
  ourContent.className = "our-content";

  let festmenyNevek = document.createElement("h3");
  festmenyNevek.innerText = termekek.title;

  let price = document.createElement("p");
  price.className = "price";
  price.innerText = `${termekek.price.toLocaleString()} Ft`;

  let size = document.createElement("p");
  size.className = "size";
  size.innerText = `A termék mérete: "${termekek.xcm} x ${termekek.ycm} cm"`;

  let kosar = document.createElement("button");
  kosar.className = "kosar";
  kosar.innerText = "Bővebben";
  kosar.id = termekek.id;

  kosar.onclick = function() {      //gombnyomásra hívjuk meg a függvényt
    oldalTovabbitas(kosar.id); 

};


  ourContent.appendChild(festmenyNevek);
  ourContent.appendChild(price);
  ourContent.appendChild(size);
  ourContent.appendChild(kosar);
  imgdiv.appendChild(image);
  ourBox.appendChild(imgdiv);
  ourBox.appendChild(ourContent);

  section.appendChild(ourBox);

} 
 
function oldalTovabbitas(id){
    window.location.href = "../ProductDetails/product-details.html?id=" + id;
}



//REST API termékek lekérése és listába mentése
/*let prodList = [];

function getProducts() {
  let url = "http://localhost:8080/product/get-all";

  fetch(url)
      .then((response) => {
          if (!response.ok) {
              throw new Error(`Hiba a kérés során: ${response.status}`);
          }
          return response.json();
      })
      .then((data) => {
          // Törölje a korábbi termékeket az oldalról
          document.getElementById("termekek").innerHTML = "";

          // Mentse el a termékek listáját a prodList tömbbe
          prodList = data;
        console.log(prodList)
          // A termékek betöltése után egyéb műveletek
          //termekListaFrissitese();             
      })
      .catch((error) => {
          console.error("Hiba történt:", error);
      });
}

// Ez a függvény a termék listát frissíti az új adatokkal
function termekListaFrissitese() {
    // Törölje a korábbi termékeket az oldalról
    document.getElementById("termekek").innerHTML = "";

    // Iteráljon az új termékeken és hozzon létre dobozokat
    prodList.forEach((termek, index) => {
        termekDoboz(index + 1, termek);
    }); 
}*/

let prodList = []; // Ebben a tömbben tároljuk az összes terméket

function getProducts() {
  let url = "http://localhost:8080/product/get-all";

  fetch(url)
      .then((response) => {
          if (!response.ok) {
              throw new Error(`Hiba a kérés során: ${response.status}`);
          }
          return response.json();
      })
      .then((data) => {
          console.log("API válasz:", data);
          prodList = data; // Az összes termék tárolása a prodList tömbben
          renderProducts(); // Termékek megjelenítése
      })
      .catch((error) => {
          console.error("Hiba történt:", error);
      });
}


async function renderProducts() {
    const selectedStyles = getSelectedStyles(); // Kiválasztott stílusok lekérése
    const selectedMaterials = getSelectedMaterials(); // Kiválasztott anyagok lekérése

    let filteredProducts = [];

    // Ellenőrizzük, hogy van-e kiválasztott szűrő
    if (selectedStyles.length === 0 && selectedMaterials.length === 0) {
        // Ha nincs kiválasztott szűrő, akkor az összes termék megjelenjen
        filteredProducts = prodList;
    } else {
        // Ha csak az egyik szűrő van kiválasztva, akkor az összes többi opció automatikusan kiválasztódik
        if (selectedStyles.length === 0 && selectedMaterials.length > 0) {
            console.log("csak material")
            filteredProducts = prodList.filter((termek) => {
                return selectedMaterials.some((material) => termek.material.find((m) => m.name === material))})
        } else if (selectedMaterials.length === 0 && selectedStyles.length > 0) {
            console.log("csak style")
            filteredProducts = prodList.filter((termek) => {
                return selectedStyles.some((style) => termek.style.find((s) => s.name === style))})
        } else if (selectedMaterials.length > 0 && selectedStyles.length > 0) {
            console.log("mind kettő")
            filteredProducts = prodList.filter((termek) => {
                return selectedStyles.some((style) => termek.style.find((s) => s.name === style)) &&
                       selectedMaterials.some((material) => termek.material.find((m) => m.name === material))})
        }
    }

    // Törölje a korábbi termékeket az oldalról
    document.getElementById("termekek").innerHTML = "";

    // Iteráljon az új szűrt termékeken és hozzon létre dobozokat
    filteredProducts.forEach((termek, index) => {
        termekDoboz(index + 1, termek);
    });
}




// Kiválasztott stílusok lekérése a szűrőből
function getSelectedStyles() {
    const selectedStyles = [];
    const styleCheckboxes = document.querySelectorAll('#tema input.checkbox:checked');
    styleCheckboxes.forEach((checkbox) => {
        selectedStyles.push(checkbox.value);
    });
    console.log(selectedStyles)
    return selectedStyles;
}

function getSelectedMaterials() {
    const selectedMaterials = [];
    const materialCheckboxes = document.querySelectorAll('#technika input.checkbox:checked');
    materialCheckboxes.forEach((checkbox) => {
        selectedMaterials.push(checkbox.value);
    });
    console.log(selectedMaterials)
    return selectedMaterials;
}


// A szűrő változásakor újra meg kell jeleníteni a termékeket
document.querySelectorAll('input[name="tema"]').forEach((checkbox) => {
    checkbox.addEventListener('change', renderProducts);
});
document.querySelectorAll('input[name="technika"]').forEach((checkbox) => {
    checkbox.addEventListener('change', renderProducts);
});


//REST API technikák betöltése:

let material = []
const technika = document.getElementById("technika");


async function materials() {
    const response = await fetch("http://localhost:8080/material/get-all");
    const data = await response.json();

    data.forEach((materials) => {
      material = data;
      const input = document.createElement("input");
      const label = document.createElement("label");

      label.innerText = materials.name;
      input.value = materials.name;
      input.className = "checkbox";
      input.type = "checkbox";
      label.insertBefore(input, label.firstChild);
      technika.appendChild(label);

      // Eseményfigyelő hozzáadása minden létrehozott checkboxhoz
      input.addEventListener('change', renderProducts);
    });
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
      input.value = styles.name;
      input.className = "checkbox";
      input.type = "checkbox";
      label.insertBefore(input, label.firstChild); // A checkboxot az input elem elé szúrjuk be a labelben
      tema.appendChild(label); // Hozzáadjuk a labelt a technikához

      input.addEventListener('change', renderProducts);
    });
    console.log(data);
  }
  
  
styles();


//
function orderProducts(order) {
    let orderedProducts = [...prodList]; // Másoljuk a termékek listáját, hogy ne módosítsuk az eredetit

    switch (order) {
        case "priceAsc":
            orderedProducts.sort((a, b) => a.price - b.price);
            break;
        case "priceDesc":
            orderedProducts.sort((a, b) => b.price - a.price);
            break;
        case "themeAsc":
            orderedProducts.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case "materialAsc":
            orderedProducts.sort((a, b) => {
                const firstMaterial = a.material[0].name.toLowerCase();
                const secondMaterial = b.material[0].name.toLowerCase();
                return firstMaterial.localeCompare(secondMaterial);
            });
            break;
        case "newestFirst":
            orderedProducts.sort((a, b) => new Date(b.createdYear) - new Date(a.createdYear));
            break;
        default:
            // Ha nincs rendezés kiválasztva, ne módosítsunk semmit
            return;
    }

    // Törölje a korábbi termékeket az oldalról
    document.getElementById("termekek").innerHTML = "";

    // Iteráljon az új rendezett termékeken és hozzon létre dobozokat
    orderedProducts.forEach((termek, index) => {
        termekDoboz(index + 1, termek);
    });
}

// Rendezési funkció meghívása a rendezési szűrő változásakor
document.getElementById("order").addEventListener("change", function() {
    const selectedOrder = this.value;
    orderProducts(selectedOrder);
});

