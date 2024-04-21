
$("#navi").load("../Navigation/navigation.html")
$("#footer").load("../Footer/footer.html")


//Technikák betöltése: 

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


//Kategória betöltése:


let style = []
const kategoria = document.getElementById("kategoria");


async function kategoriak() {
    const response = await fetch("http://localhost:8080/style/get-all");
    const data = await response.json();
    console.log(data);

    data.forEach((kategoriak) => {
      style = data;
      const option = document.createElement("option");
      option.value = kategoriak.id;
      option.text = kategoriak.name;
      kategoria.appendChild(option);
    });
    console.log(data);
  }
  
kategoriak();


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
  id: id,
  title: cim,
  artist: muvesz,
  price: ar,
  description: leiras,
  imgUrl: kep,
  createdYear: keszitve,
  xCm: x,
  yCm: y,
  material: technika,
  //user: user
};

// Send POST request to Spring Boot backend
fetch("http://localhost:8080/product/add", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
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
