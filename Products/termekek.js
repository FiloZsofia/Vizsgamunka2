setTimeout(function() {
    $("#navi").load("../Navigation/navigation.html");
    $("#footer").load("../Footer/footer.html");
}, 500);


//createPager(100, 5);
getProducts(); // Hozzáadtam az oldalszámozás kezdeti állapotához szükséges hívást



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
          // Törölje a korábbi termékeket az oldalról
          document.getElementById("termekek").innerHTML = "";

          // Iteráljon az új termékeken és hozzon létre dobozokat
          data.forEach((termek, index) => {
              termekDoboz(index + 1, termek);
          });             
      })
      .catch((error) => {
          console.error("Hiba történt:", error);
      });
} 

function createPager(dataCount, resultsPerPage) {
  let paginator = document.getElementById("paginator");
  let pages = Math.ceil(dataCount / resultsPerPage);

  // Ellenőrizzük, hogy a feliratok még nem léteznek-e
  if (!document.querySelector("#section p.p1")) {
      // Új elemek létrehozása
      let p1 = document.createElement("p");
      p1.className = "p1";
      p1.innerText = "TERMÉKEINK";

      let h2 = document.createElement("h2");
      h2.className = "heading-1";
      h2.innerText = "Termékeink";

      // Az új elemek hozzáadása a section-hoz
      document.getElementById("section").appendChild(p1);
      document.getElementById("section").appendChild(h2);
  }

  let prevBtn = document.createElement("button");
  prevBtn.innerText = "Előző";
  prevBtn.addEventListener("click", () => {
      let currentPage = parseInt(document.querySelector(".active").innerText);
      if (currentPage > 1) {
          getProducts(currentPage - 1);
      }
  });
  paginator.appendChild(prevBtn);

  // Page buttons
  for (let i = 1; i <= pages; i++) {
      let btn = document.createElement("button");
      btn.innerText = i;
      btn.addEventListener("click", () => {
          getProducts(i);
      });
      paginator.appendChild(btn);
  }

  let nextBtn = document.createElement("button");
  nextBtn.innerText = "Következő";
  nextBtn.addEventListener("click", () => {
      let currentPage = parseInt(document.querySelector(".active").innerText);
      if (currentPage < pages) {
          getProducts(currentPage + 1);
      }
  });
  paginator.appendChild(nextBtn);

  // Az első oldal kiemelése kezdeti állapotként
  document.querySelector("#paginator button:first-child").classList.add("active");
}


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
      label.insertBefore(input, label.firstChild); // A checkboxot az input elem elé szúrjuk be a labelben
      tema.appendChild(label); // Hozzáadjuk a labelt a technikához

    });
    console.log(data);
  }
  
  
styles();

//A SZŰRÉS:

var products = [];

    function updateDisplayedProducts(products) {
        var section = document.getElementById("termekek");
        section.innerHTML = ""; // Törölje a korábbi termékeket

        products.forEach(function(product, index) {
            termekDoboz(index + 1, product);
        });
    }

    fetch('http://localhost:8080/product/get-all')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            products = data; // a products változó feltöltése a szerverről érkező adatokkal
            updateDisplayedProducts(products); // a megjelenített termékek frissítése
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
