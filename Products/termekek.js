setTimeout(function() {
    $("#navi").html(NAVIGATION_HTML);
    $("#footer").html(FOOTER_HTML);
}, 500);

let prodList = []; // Ebben a tömbben tároljuk az összes terméket
let filteredProducts = []; // Ebben a tömbben tároljuk a szűrt termékeket

// Termék dobozok létrehozása
function termekDoboz(number, termek) {
    let section = document.getElementById("termekek");

    let ourBox = document.createElement("div");
    ourBox.className = "our-box";

    let imgdiv = document.createElement("div");
    imgdiv.className = "img-div";

    let image = document.createElement("img");
    image.id = number;
    image.src = termek.imgUrl;

    let ourContent = document.createElement("div");
    ourContent.className = "our-content";

    let festmenyNevek = document.createElement("h3");
    festmenyNevek.innerText = termek.title;

    let price = document.createElement("p");
    price.className = "price";
    price.innerText = `${termek.price.toLocaleString()} Ft`;

    let size = document.createElement("p");
    size.className = "size";
    size.innerText = `${termek.xcm} × ${termek.ycm} cm`;

    let kosar = document.createElement("button");
    kosar.className = "kosar";
    kosar.innerText = "Bővebben";
    kosar.id = termek.id;

    kosar.onclick = function() {
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

// Oldalra továbbítás termék részleteihez
function oldalTovabbitas(id) {
    window.location.href = "../ProductDetails/product-details.html?id=" + id;
}

// Kiválasztott stílusok lekérése a szűrőből
function getSelectedStyles() {
    const selectedStyles = [];
    const styleCheckboxes = document.querySelectorAll('#tema input.checkbox:checked');
    styleCheckboxes.forEach((checkbox) => {
        selectedStyles.push(checkbox.value);
    });
    return selectedStyles;
}

// Kiválasztott anyagok lekérése a szűrőből
function getSelectedMaterials() {
    const selectedMaterials = [];
    const materialCheckboxes = document.querySelectorAll('#technika input.checkbox:checked');
    materialCheckboxes.forEach((checkbox) => {
        selectedMaterials.push(checkbox.value);
    });
    return selectedMaterials;
}

// Kiválasztott méretek lekérése a szűrőből
function getSelectedSizes() {
    const selectedSizes = [];
    const sizeCheckboxes = document.querySelectorAll('#meret input.checkbox:checked');
    sizeCheckboxes.forEach((checkbox) => {
        selectedSizes.push(checkbox.value);
    });
    return selectedSizes;
}

// meretkategoriak, de ez igy nem fed le mindent, szoval meg tweakelni kell rajta, mert van olyan, hogy egy termek merete egyik kategoriaba sem tartozik...
function getTermekMeretKategoria(termek) {
    const x = termek.xcm;
    const y = termek.ycm;

    if (x < 30 && y < 30) {
        return "Kicsi";
    } else if (x >= 30 && x < 50 && y >= 30 && y < 50) {
        return "Közepes";
    } else if (x >= 50 && y >= 50) {
        return "Nagy";
    }
    return null;
}

// Szűrés funkció
function filterProducts() {
    const selectedStyles = getSelectedStyles(); // Kiválasztott stílusok lekérése
    const selectedMaterials = getSelectedMaterials(); // Kiválasztott anyagok lekérése
    const selectedSizes = getSelectedSizes();       // Kiválasztott méretek lekérésére

    // Button szövegek frissítése (Technika)
    const technikaBtn = document.querySelector('#technika')?.closest('.dropdown')?.querySelector('.dropbtn');
    if (technikaBtn) {
        if (selectedMaterials.length === 1) {
            technikaBtn.innerText = selectedMaterials[0];
        } else if (selectedMaterials.length > 1) {
            technikaBtn.innerText = `Technika (${selectedMaterials.length})`;
        } else {
            technikaBtn.innerText = "Technika";
        }
    }

    // Button szövegek frissítése (Téma)
    const temaBtn = document.querySelector('#tema')?.closest('.dropdown')?.querySelector('.dropbtn');
    if (temaBtn) {
        if (selectedStyles.length === 1) {
            temaBtn.innerText = selectedStyles[0];
        } else if (selectedStyles.length > 1) {
            temaBtn.innerText = `Téma (${selectedStyles.length})`;
        } else {
            temaBtn.innerText = "Téma";
        }
    }

    // Button szövegek frissítése (Méret)
    const meretBtn = document.querySelector('#meret')?.closest('.dropdown')?.querySelector('.dropbtn');
    if (meretBtn) {
        if (selectedSizes.length === 1) {
            meretBtn.innerText = selectedSizes[0];
        } else if (selectedSizes.length > 1) {
            meretBtn.innerText = `Méret (${selectedSizes.length})`;
        } else {
            meretBtn.innerText = "Méret";
        }
    }

// Ellenőrizzük, hogy van-e kiválasztott szűrő
if (selectedStyles.length === 0 && selectedMaterials.length === 0 && selectedSizes.length === 0) {
    // Ha nincs kiválasztott szűrő, akkor az összes termék megjelenjen
    filteredProducts = prodList;
} else {
    // Ha csak az egyik szűrő van kiválasztva, akkor az összes többi opció automatikusan kiválasztódik
    if (selectedStyles.length === 0 && selectedMaterials.length > 0 && selectedSizes.length === 0) {
        console.log("csak material")
        filteredProducts = prodList.filter((termek) => {
            return selectedMaterials.some((material) => termek.material.find((m) => m.name === material))})
    } else if (selectedMaterials.length === 0 && selectedStyles.length > 0) {
        console.log("csak style")
        filteredProducts = prodList.filter((termek) => {
            return selectedStyles.some((style) => termek.style.find((s) => s.name === style))})
        } else if (selectedStyles.length === 0 && selectedMaterials.length === 0 && selectedSizes.length > 0) {
        console.log("csak size");
        filteredProducts = prodList.filter((termek) => {
            return selectedSizes.includes(getTermekMeretKategoria(termek))})
    }
    // 2 KIVÁLASZTOTT SZŰRŐKATEGÓRIA ESETÉN:
    else if (selectedMaterials.length > 0 && selectedStyles.length > 0) {
        console.log("style és material")
        filteredProducts = prodList.filter((termek) => {
            return selectedStyles.some((style) => termek.style.find((s) => s.name === style)) &&
                   selectedMaterials.some((material) => termek.material.find((m) => m.name === material))})
    } else if (selectedStyles.length > 0 && selectedSizes.length > 0 && selectedMaterials.length === 0) {
        console.log("style és size");
        filteredProducts = prodList.filter((termek) => {
            return selectedStyles.some((style) => termek.style.find((s) => s.name === style)) &&
                   selectedSizes.includes(getTermekMeretKategoria(termek));
        });
    } else if (selectedMaterials.length > 0 && selectedSizes.length > 0 && selectedStyles.length === 0) {
        console.log("material és size");
        filteredProducts = prodList.filter((termek) => {
            return selectedMaterials.some((material) => termek.material.find((m) => m.name === material)) &&
                   selectedSizes.includes(getTermekMeretKategoria(termek));
        });
    }
    // MINDHÁROM KIVÁLASZTOTT SZŰRŐKATEGÓRIA ESETÉN:
    else if (selectedMaterials.length > 0 && selectedStyles.length > 0 && selectedSizes.length > 0) {
        console.log("mindhárom");
        filteredProducts = prodList.filter((termek) => {
            return selectedStyles.some((style) => termek.style.find((s) => s.name === style)) &&
                   selectedMaterials.some((material) => termek.material.find((m) => m.name === material)) &&
                   selectedSizes.includes(getTermekMeretKategoria(termek));
        });
    }
}
    renderProducts(); // Termékek újraszűrése
}

// Szűrés funkció meghívása a szűrők változásakor
document.querySelectorAll('.checkbox').forEach((checkbox) => {
    checkbox.addEventListener('change', filterProducts);
});

// Rendezés funkció
function orderProducts(order) {

    const orderSelect = document.getElementById("order");
    const defaultOption = orderSelect ? orderSelect.options[0] : null;

    switch (order) {
        case "priceAsc":
            filteredProducts.sort((a, b) => a.price - b.price);
            if (defaultOption) defaultOption.text = "Ár szerint növekvő";
            break;
        case "priceDesc":
            filteredProducts.sort((a, b) => b.price - a.price);
            if (defaultOption) defaultOption.text = "Ár szerint csökkenő";
            break;
        case "themeAsc":
            filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
            if (defaultOption) defaultOption.text = "Téma szerint ABC sorrend";
            break;
        case "materialAsc":
            filteredProducts.sort((a, b) => {
                const firstMaterial = a.material[0].name.toLowerCase();
                const secondMaterial = b.material[0].name.toLowerCase();
                return firstMaterial.localeCompare(secondMaterial);
            });
            if (defaultOption) defaultOption.text = "Anyag szerint ABC sorrend";
            break;
        case "newestFirst":
            filteredProducts.sort((a, b) => new Date(b.createdYear) - new Date(a.createdYear));
            if (defaultOption) defaultOption.text = "Legújabbak elöl";
            break;
        default:
            // Ha nincs rendezés kiválasztva, ne módosítsunk semmit
            if (defaultOption) defaultOption.text = "Rendezés";
            return;
    }
    renderProducts(); // Termékek rendezése
}

// Rendezés funkció meghívása a rendezési szűrő változásakor
document.getElementById("order").addEventListener("change", function() {
    const selectedOrder = this.value;
    orderProducts(selectedOrder);
    this.value = "";
});

// Keresés funkció
function searchProducts(keyword) {
    const searchProducts = filteredProducts.filter(termek => termek.title.toLowerCase().includes(keyword.toLowerCase()));

    document.getElementById("termekek").innerHTML = "";
    searchProducts.forEach((termek, index) => {
        termekDoboz(index + 1, termek);
    });
}

document.getElementById("search").addEventListener("input", function() {
    const keyword = this.value.trim();
    searchProducts(keyword);
});

// REST API technikák betöltése:
let material = [];
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
        input.addEventListener('change', filterProducts);
    });
}

// REST API témák betöltése:
let style = [];
const tema = document.getElementById("tema");

async function styles() {
    const response = await fetch("http://localhost:8080/style/get-all");
    const data = await response.json();

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

        input.addEventListener('change', filterProducts);
    });
}

// Termékek lekérdezése és betöltése
function getProducts() {
    let url = "http://localhost:8080/product/get-all";

    return fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Hiba a kérés során: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            console.log("API válasz:", data);
            prodList = data; // Az összes termék tárolása a prodList tömbben
            filteredProducts = prodList;
            renderProducts(); // Termékek megjelenítése
        })
        .catch((error) => {
            console.error("Hiba történt:", error);
        });
}

// ha a fooldalrol egy adott temara szurve erkeztunk, auto pipalja az ahhoz tartozo checkboxot
function alkalmazTemaSzurotUrlbol() {
    const temaNev = new URLSearchParams(window.location.search).get("tema");
    if (!temaNev) return;

    const checkbox = Array.from(document.querySelectorAll("#tema input.checkbox"))
        .find((input) => input.value === temaNev);

    if (checkbox) {
        checkbox.checked = true;
        filterProducts();
    }
}

Promise.all([materials(), styles(), getProducts()]).then(alkalmazTemaSzurotUrlbol);

// Termékek megjelenítése a szűrők alapján
function renderProducts() {
    // Törölje a korábbi termékeket az oldalról
    document.getElementById("termekek").innerHTML = "";

    // Iteráljon az új szűrt termékeken és hozzon létre dobozokat
    filteredProducts.forEach((termek, index) => {
        termekDoboz(index + 1, termek);
    });
}

window.onload = function() {
    renderProducts();
};