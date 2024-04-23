$("#navi").load("../Navigation/navigation.html")
$("#footer").load("../Footer/footer.html")

// import { redirectToLogin } from "../Navigation/permission-checker.js";

redirectToLogin();

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

// Fájl kiválasztása után történő eseménykezelő
document.getElementById('file-input').addEventListener('change', function() {
  // Az 'input' esemény kiváltása után meg tudjuk állapítani, hogy a felhasználó választott-e fájlt
  if (this.files && this.files[0]) {
      // Ha a felhasználó választott egy fájlt, akkor megtehetjük a szükséges műveleteket, pl. fájl feltöltése
      console.log('Kiválasztott fájl:', this.files[0]);
  }
});




