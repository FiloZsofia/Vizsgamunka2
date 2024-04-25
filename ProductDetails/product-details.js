$("#navi").load("../Navigation/navigation.html");
$("#footer").load("../Footer/footer.html");

let termek = document.getElementById("termek");

const urlParams = new URLSearchParams(window.location.search);
const termekAzonosito = urlParams.get('id');
const url = "http://localhost:8080/product/get/" + termekAzonosito;

fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                
                function getMaterial(jsonObj) {
                    if (!jsonObj.material) {
                        return "Nincs elegendő adat a JSON objektumban.";
                    }
                    const materialNames = jsonObj.material.map(mat => mat.name).join(', ');
                    return materialNames;
                }

                function getStyle(jsonObj) {
                    if (!jsonObj.style) {
                        return "Nincs elegendő adat a JSON objektumban.";
                    }
                    const styleNames = jsonObj.style.map(st => st.name).join(', ');
                    return styleNames;
                }

                document.getElementById("title").textContent = data.title;
                document.getElementById("artist").innerHTML = "<b>Művész: </b>" + data.artist;
                document.getElementById("created-year").innerHTML = "<b>Készítés éve: </b>" + data.createdYear;
                document.getElementById("material").innerHTML = "<b>Technika: </b>" + getMaterial(data);
                document.getElementById("style").innerHTML = "<b>Téma: </b>" + getStyle(data);
                document.getElementById("size").innerHTML = "<b>Méret: </b>" + data.xcm + " x " + data.ycm + " cm";
                document.getElementById("description").innerHTML = "<b>Leírás: </b>" + data.description;
                document.getElementById("price").innerHTML = data.price.toLocaleString() + " Ft";
                document.getElementById("kep").querySelector("img").src = data.imgUrl;

            })
            .catch(error => {
                // Ha hiba történik, kiírjuk a konzolra
                console.error('Hiba történt a termék adatok lekérdezésekor:', error);
            });

