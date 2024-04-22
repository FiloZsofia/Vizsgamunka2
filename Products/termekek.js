$("#navi").load("../Navigation/navigation.html");
$("#footer").load("../Footer/footer.html");

createPager(100, 5);
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

  ourContent.appendChild(festmenyNevek);
  ourContent.appendChild(price);
  ourContent.appendChild(size);
  ourContent.appendChild(kosar);
  imgdiv.appendChild(image);
  ourBox.appendChild(imgdiv);
  ourBox.appendChild(ourContent);

  section.appendChild(ourBox);

} 

/*function termek() {
    let section = document.getElementById("termek");

    // AJAX kérés létrehozása
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:8080/product/get-all", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // Az adatok feldolgozása
            let termekAdatok = JSON.parse(xhr.responseText);

            // A feldolgozott adatok használata a termek függvényben
            termekAdatok.forEach(function(termekAdat) {
                let box = document.createElement("div");
                box.className = "box";
        
                let imageDiv = document.createElement("div");
                imageDiv.className = "image-div";
        
                let image = document.createElement("img");
                image.src = termekAdat.imgUrl;
        
                let content = document.createElement("div");
                content.className = "content";
              
                let festmenyNevek = document.createElement("h3");
                festmenyNevek.innerText = termekAdat.title;
        
                let artist = document.createElement("p");
                artist.innerText = termekAdat.artist;
        
                let createdYear = document.createElement("p");
                createdYear.innerText = termekAdat.createdYear;
        
                let material = document.createElement("p");
                material.innerText = termekAdat.material;
        
                let style = document.createElement("p");
                style.innerText = termekAdat.style;
        
                let description = document.createElement("p");
                description.innerText = termekAdat.description;
        
                let price = document.createElement("p");
                price.className = "price";
                price.innerText = `${termekAdat.price} Ft`;
        
                let size = document.createElement("p");
                size.className = "size";
                size.innerText = `A termék mérete: "${termekAdat.xcm}"`;
        
                let kosar = document.createElement("button");
                kosar.className = "kosar";
                kosar.innerText = "Kosárba";
        
                imageDiv.appendChild(image);
                box.appendChild(content);
                box.appendChild(imageDiv);
                content.appendChild(festmenyNevek);
                content.appendChild(artist);
                content.appendChild(createdYear);
                content.appendChild(material);
                content.appendChild(style);
                content.appendChild(description);
                content.appendChild(price);
                content.appendChild(size);
                content.appendChild(kosar);
                section.appendChild(box);
            });
        }
    };
    xhr.send();
}

termek(); */

function getProducts(page) {
  let url = "http://localhost:8080/product/get-all";
  let resultsPerPage = 12;
  let startIndex = (page - 1) * resultsPerPage;

  url += `?per_page=${resultsPerPage}&page=${page}`;

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

          // Az aktuális oldal színének beállítása
          document.querySelectorAll("#paginator button").forEach(btn => {
              btn.classList.remove("active");
          });
          document.querySelector(`#paginator button:nth-child(${page + 1})`).classList.add("active");
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

let proba = document.createElement("div");
proba.innerText = window.localStorage.getItem('token');
console.log(window.localStorage.getItem('token'));  

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
      input.type = "checkbox";
      label.insertBefore(input, label.firstChild); // A checkboxot az input elem elé szúrjuk be a labelben
      technika.appendChild(label); // Hozzáadjuk a labelt a technikához

    });
    console.log(data);
  }
  
  
materials();

