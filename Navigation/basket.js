function delayedFunction() {

  let kosarMegnyitas = document.getElementById("fentikosar");
  let kosarBezaras = document.getElementById("btnClose2");
  let kosar = document.getElementById("popup-basket");
  
  kosarBezaras.onclick = closePopup;
  function closePopup() {
    kosar.style.display = 'none';
  }

  /*kosarMegnyitas.onclick = openPopup;
  kosarBezaras.onclick = closePopup;
  
  function openPopup() {
    document.getElementById('popup-basket').style.display = 'block';
  }
  
  function closePopup() {
    document.getElementById('popup-bakset').style.display = 'none';
  }*/

  
    // Az API-ról való adatlekérés szimulálása
    function fetchProducts() {
      // A fetch helyett itt lehetne valós REST API hívás is
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const products = ['Termék 1', 'Termék 2', 'Termék 3']; // Példa termékek
          resolve(products);
        },); // Példa késleltetés
      });
    }
 
     // Kosár megnyitása gomb eseménykezelése
     kosarMegnyitas.addEventListener('click', async function() {
      if (kosar.style.display === 'none') {
        const products = await fetchProducts();
        renderProducts(products);
        kosar.style.display = 'block';
        // Az eseményfigyelő hozzáadása a dokumentumhoz a kosár menü megnyitásakor
        document.addEventListener('click', closeCartOnClickOutside);
      } else {
        kosar.style.display = 'none';
        // Az eseményfigyelő eltávolítása a dokumentumból a kosár menü bezárásakor
        document.removeEventListener('click', closeCartOnClickOutside);
      }
    });

  // Kosár bezárása, ha a felhasználó a kosár területén kívül kattint
  function closeCartOnClickOutside(event) {
    if (!kosar.contains(event.target) && event.target !== kosarMegnyitas) {
      kosar.style.display = 'none';
      document.removeEventListener('click', closeCartOnClickOutside);
    }
  }
  
    // Termékek megjelenítése a kosárban
    function renderProducts(products) {
      if (products.length === 0) {
        cartItems.innerHTML = '<p>A kosár üres.</p>';
      } else {
        const btn = document.createElement('button')
        btn.textContent = "Tovább a fizetéshez"
        btn.className = "buy";
        const ul = document.createElement('ul');
        products.forEach(product => {
          const li = document.createElement('li');
          li.textContent = product;
          ul.appendChild(li);
        });
        cartItems.innerHTML = '';
        cartItems.appendChild(ul);
        cartItems.appendChild(btn);
      }
    }
  }setTimeout(delayedFunction, 500);
  