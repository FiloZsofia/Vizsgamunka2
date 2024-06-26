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
                console.log("Bezárás ha kivülre kattint")
            }
        });
    });
  
    // Handle checkbox clicks
    var checkboxes = document.querySelectorAll('.checkbox');
    checkboxes.forEach(function(checkbox) {
        checkbox.addEventListener('click', function(event) {
            event.stopPropagation(); // Prevent dropdown from closing when clicking on checkbox
            console.log("Kiválasztás")
        });
    });
}, 1000);
  
  /*document.addEventListener("DOMContentLoaded", function() {
    // Handle checkbox clicks
    var checkboxes = document.querySelectorAll('.checkbox');
    checkboxes.forEach(function(checkbox) {
        checkbox.addEventListener('click', function(event) {
            event.stopPropagation(); // Prevent dropdown from closing when clicking on checkbox
        });
    });
  
    // Handle label clicks
    var labels = document.querySelectorAll('.dropdown-content label');
    labels.forEach(function(label) {
        label.addEventListener('click', function(event) {
            var checkbox = this.querySelector('.checkbox');
            checkbox.checked = !checkbox.checked; // Toggle checkbox state
            event.stopPropagation(); // Prevent dropdown from closing when clicking on label
        });
    });
  });*/
  
  
    