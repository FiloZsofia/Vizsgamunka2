

document.addEventListener("DOMContentLoaded", function() {
  let kosarMegnyitas = document.getElementById("fentikosar");
  let kosarBezaras = document.getElementById("btnClose2");
  let kosar = document.getElementById("popup-basket");
  let cartItems = document.getElementById("cartItems"); // Megváltoztatva, korábban nem volt definiálva
  
  kosarBezaras.onclick = closePopup;
  
  function closePopup() {
    kosar.style.display = 'none';
  }
  
  async function fetchProducts() {
    try {
      const response = await fetch("http://localhost:8080/basket/get", {headers: {"Authorization": localStorage.getItem("token")}});
      const data = await response.json();
      const productList = [];
      console.log("Basket id "+ data)
      for (const item of data) {
        const product = {};
        for (const key in item) {
            product[key] = item[key];
        }
        productList.push(product);
      }
      return productList;
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  }
  
  kosarMegnyitas.addEventListener('click', async function() {
    if (kosar.style.display === 'none' && localStorage.getItem("token") !== null) {
      const products = await fetchProducts();
      renderProducts(products);
      kosar.style.display = 'block';
      document.addEventListener('click', closeCartOnClickOutside);
    } else {
      kosar.style.display = 'none';
      alert("Be kell jelentkezned!")
      //document.removeEventListener('click', closeCartOnClickOutside);
    }
  });
  
  function closeCartOnClickOutside(event) {
    if (!kosar.contains(event.target) && event.target !== kosarMegnyitas) {
      kosar.style.display = 'none';
      document.removeEventListener('click', closeCartOnClickOutside);
    }
  }
  
  function renderProducts(products) {
    if (products.length === 0) {
      cartItems.innerHTML = '<p>A kosár üres.</p>';
    } else {
      const btn = document.createElement('button');
      btn.textContent = "Tovább a fizetéshez";
      btn.className = "buy";
      const ul = document.createElement('ul');
      products.forEach(product => {
        const li = document.createElement('li');
        const img = document.createElement('img');
        const x = document.createElement('span');
        const xIcon = document.createElement('ion-icon');
        x.className = 'close';
        x.id = product.id;
        //x.onclick = torles(product.id);
        xIcon.name="close";
        img.src = product.imgUrl; // Termék képe
        img.alt = product.title; // Alternatív szöveg a képhez
        li.appendChild(img);
        
        const title = document.createElement('span');
        title.className = 'title';
        title.textContent = product.title; // Termék címe
        li.appendChild(title);
        
        const price = document.createElement('span');
        price.className = 'price';
        price.textContent = product.price.toLocaleString() + " Ft"; // Termék ára
        li.appendChild(price);
        x.appendChild(xIcon);
        li.appendChild(x);
        ul.appendChild(li);
      });
      cartItems.innerHTML = '';
      cartItems.appendChild(ul);
      cartItems.appendChild(btn);
    }
  }


//Adott termék törlése
  function torles(artId){
    const formData = {      
        "id":artId,
        "basket":{
            "id":2
        }
    };
    fetch("http://localhost:8080/basket/remove-art-from-basket", {
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
});
  