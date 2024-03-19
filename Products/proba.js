document.addEventListener("DOMContentLoaded", function() {
    var dropdown = document.querySelector('.dropdown');
    var dropdownContent = document.querySelector('.dropdown-content');
  
    dropdown.addEventListener('click', function() {
      dropdownContent.classList.toggle('show');
    });
  
    // Close the dropdown if the user clicks outside of it
    window.addEventListener('click', function(event) {
      if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        for (var i = 0; i < dropdowns.length; i++) {
          var openDropdown = dropdowns[i];
          if (openDropdown.classList.contains('show')) {
            openDropdown.classList.remove('show');
          }
        }
      }
    });
  
    // Handle checkbox clicks
    var checkboxes = document.querySelectorAll('.checkbox');
    checkboxes.forEach(function(checkbox) {
      checkbox.addEventListener('click', function(event) {
        event.stopPropagation(); // Prevent dropdown from closing when clicking on checkbox
      });
    });
  });
  