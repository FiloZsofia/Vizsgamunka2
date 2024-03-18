document.addEventListener("DOMContentLoaded", function() {
    const openCartBtn = document.getElementById('fentikosar');
    const cartItems = document.getElementById('cartItems');
  
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
    openCartBtn.addEventListener('click', async function() {
      if (cartItems.style.display === 'none') {
        const products = await fetchProducts();
        renderProducts(products);
        cartItems.style.display = 'block';
      } else {
        cartItems.style.display = 'none';
      }
    });
  
    // Termékek megjelenítése a kosárban
    function renderProducts(products) {
      if (products.length === 0) {
        cartItems.innerHTML = '<p>A kosár üres.</p>';
      } else {
        const ul = document.createElement('ul');
        products.forEach(product => {
          const li = document.createElement('li');
          li.textContent = product;
          ul.appendChild(li);
        });
        cartItems.innerHTML = '';
        cartItems.appendChild(ul);
      }
    }
  });
  