$("#navi").load("../Navigation/navigation.html");
$("#footer").load("../Footer/footer.html");

function termek() {
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
                price.innerText = `${termekAdat.price.toLocaleString()} Ft`;
        
                let size = document.createElement("p");
                size.className = "size";
                size.innerText = `A termék mérete: ${termekAdat.xcm} x ${termekAdat.ycm} cm`;
        
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

termek();