setTimeout(function() {
    var dropdowns = document.querySelectorAll('.dropdown');
  
    dropdowns.forEach(function(dropdown) {
        var dropdownContent = dropdown.querySelector('.dropdown-content');
  
        dropdown.addEventListener('click', function(event) {
            event.preventDefault(); // Megakadályozza az alapértelmezett működést
            dropdownContent.classList.toggle('show');
        });
    });
  
    // Close the dropdown if the user clicks outside of it
    window.addEventListener('click', function(event) {
        dropdowns.forEach(function(dropdown) {
            var dropdownContent = dropdown.querySelector('.dropdown-content');
            if (!dropdown.contains(event.target)) {
                dropdownContent.classList.remove('show');
            }
        });
    });
  
    // Handle checkbox clicks
    var checkboxes = document.querySelectorAll('.checkbox');
    checkboxes.forEach(function(checkbox) {
        checkbox.addEventListener('click', function(event) {
            event.stopPropagation(); // Prevent dropdown from closing when clicking on checkbox
        });
    });

    //A SZŰRÉS:

    var technikaCheckboxes = document.querySelectorAll('#technika input.checkbox');
    var temaCheckboxes = document.querySelectorAll('#tema input.checkbox');

    technikaCheckboxes.forEach(function(checkbox) {
        checkbox.addEventListener('change', filterProducts);
    });

    temaCheckboxes.forEach(function(checkbox) {
        checkbox.addEventListener('change', filterProducts);
    });

    // Szűrés függvény
    function filterProducts() {
        // Kiválasztott technikák lekérése
        var selectedTechnikak = [];
        technikaCheckboxes.forEach(function(checkbox) {
            if (checkbox.checked) {
                selectedTechnikak.push(checkbox.parentNode.innerText.trim());
            }
        });

        // Kiválasztott témák lekérése
        var selectedTemak = [];
        temaCheckboxes.forEach(function(checkbox) {
            if (checkbox.checked) {
                selectedTemak.push(checkbox.parentNode.innerText.trim());
            }
        });

        // Szűrési logika az adatok alapján
        var filteredProducts = products.filter(function(product) {
            // Ellenőrizze, hogy a termék megfelel-e a kiválasztott technikáknak és témáknak
            var matchTechnika = selectedTechnikak.length === 0 || selectedTechnikak.includes(product.technika);
            var matchTema = selectedTemak.length === 0 || selectedTemak.includes(product.tema);
            return matchTechnika && matchTema;
        });

        // Frissítse a megjelenített termékeket a szűrési eredmények alapján
        updateDisplayedProducts(filteredProducts);
    }
}, 1000);
  
    