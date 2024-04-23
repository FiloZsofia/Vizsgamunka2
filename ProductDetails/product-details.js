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

                document.getElementById("title").textContent = data.title;
                document.getElementById("artist").textContent = data.artist;
                document.getElementById("created-year").textContent = data.createdYear;
                document.getElementById("material").textContent = data.material;
                document.getElementById("style").textContent = data.style;
                document.getElementById("description").textContent = data.description;
                document.getElementById("price").textContent = data.price.toLocaleString() + " Ft";
                document.getElementById("size").textContent = data.xcm + " x " + data.ycm + " cm";
                document.getElementById("kep").querySelector("img").src = data.imgUrl;
        

                /*let box = document.createElement("div");
                box.className = "box";
        
                let imageDiv = document.createElement("div");
                imageDiv.className = "image-div";
        
                let image = document.createElement("img");
                image.src = data.imgUrl;
        
                let content = document.createElement("div");
                content.className = "content";
              
                let festmenyNevek = document.createElement("h3");
                festmenyNevek.innerText = data.title;
        
                let artist = document.createElement("p");
                artist.innerText = data.artist;
        
                let createdYear = document.createElement("p");
                createdYear.innerText = data.createdYear;
        
                let material = document.createElement("p");
                material.innerText = data.material;
        
                let style = document.createElement("p");
                style.innerText = data.style;
        
                let description = document.createElement("p");
                description.innerText = data.description;
        
                let price = document.createElement("p");
                price.className = "price";
                price.innerText = `${data.price.toLocaleString()} Ft`;
        
                let size = document.createElement("p");
                size.className = "size";
                size.innerText = `A termék mérete: ${data.xcm} x ${data.ycm} cm`;
        
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
                termek.appendChild(box);*/

            })
            .catch(error => {
                // Ha hiba történik, kiírjuk a konzolra
                console.error('Hiba történt a termék adatok lekérdezésekor:', error);
            });

