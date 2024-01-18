document.addEventListener("DOMContentLoaded", function () { 
  
  // JavaScript kód a pop-up kezeléséhez
  let gomb = document.getElementById("btnLogin");
  let bezar = document.getElementById("btnClose");
  gomb.onclick = openPopup;
  bezar.onclick = closePopup;
  
  function openPopup() {
    document.getElementById('popup').style.display = 'block';
  }
  
  function closePopup() {
    document.getElementById('popup').style.display = 'none';
  }
});