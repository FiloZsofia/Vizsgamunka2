$("#navi").load("../Navigation/navigation.html")
$("#footer").load("../Footer/footer.html")

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

//Termék feltöltése:
let cim = document.getElementById("productName");
let muvesz = document.getElementById("artist");
let ar = document.getElementById("ar");
let leiras = document.getElementById("leiras");
let kep = document.getElementById("myFile");
let keszitve = document.getElementById("keszitesEve");
let x = 40;
let y = 20;


function feltoltes(){
//ez a json, a kettőspont előtti szöveg jön a backendből, az Art.java (entity) classból, a kettőspont utáni pedig szabadon elnevezhető
const formData = {   
  title: cim.value,
  artist: muvesz.value,
  price: ar.value,
  description: leiras.value,
  imgUrl: imgUrl,
  createdYear: keszitve.value,
  xCm: x,
  yCm: y,
  //material: technika,
};

// Send POST request to Spring Boot backend
fetch("http://localhost:8080/product/add", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": localStorage.getItem("token")
  },
  body: JSON.stringify(formData),
})
  .then((response) => response.json())
  .then((data) => {
    console.log("Success:", data);
    // Handle success, e.g., show a success message or redirect
  })
  .catch((error) => {
    console.error("Error:", error);
    // Handle error, e.g., show an error message to the user
  });
}

let hozzaad = document.getElementById("hozzaadasGomb");
hozzaad.onclick = feltoltes;


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
  }
});