//document.addEventListener("DOMContentLoaded", function () { 
  
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
  
  
  
    //Bejelentkezés-regisztráció:
  
    const contReg = document.querySelector(".popup-content");
    const loginLink = document.querySelector(".login-link");
    const registerLink = document.querySelector(".register-link");
    const btnPopup = document.querySelector(".btnLogin-popup");
    const iconClose = document.querySelector(".icon-close");
  
    registerLink.addEventListener("click", () => {
      contReg.classList.add("active");
    });
  
    loginLink.addEventListener("click", () => {
      contReg.classList.remove("active");
    });
  
    //registration form
  
    let regButton = document.getElementById("regButton");
    let loginButton = document.getElementById("login-btn");
    regButton.onclick = registration;
    loginButton.onclick = login;
  
    function registration() {
      const regUsername = document.getElementById("user-reg").value;
      const regPassword = document.getElementById("pass-reg").value;
      const email = document.getElementById("email").value;
     
      const formData = {
        userName: regUsername,
        password: regPassword,
        email: email,
      };
  
      // Send POST request to Spring Boot backend
      fetch("http://localhost:8080/auth/registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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

    
    function login(){
      
      const loginUsername = document.getElementById("user-login").value;
      const loginPassword = document.getElementById("pass-login").value;
  
    fetch("http://localhost:8080/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName: loginUsername,
        password: loginPassword
      }
      ),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        // Handle success, e.g., show a success message or redirect
        // Elmenti a böngésző memóriájába a tokent, amit bejelentkezéskor kapunk: (   https://jwt.io/  )
        window.localStorage.setItem('token', data.code);
        checkToken();
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle error, e.g., show an error message to the user
      });
    }
//
    
/* // Token ellenőrzése
function checkToken() {
  // Token lekérése a böngésző helyi tárolójából
  const token = window.localStorage.getItem('token');
  if (token) {
    // Ha van token, akkor valószínűleg bejelentkezett felhasználó van
    // Ide jöhet az a logika, amit a bejelentkezett felhasználók számára szeretnél futtatni
    console.log("User is logged in!");
  } else {
    // Ha nincs token, akkor valószínűleg nincs bejelentkezett felhasználó
    // Ide jöhet az a logika, amit a nem bejelentkezett felhasználók számára szeretnél futtatni
    console.log("User is not logged in!");
  }
} */

 // Ellenőrizzük, hogy a "Termék feltöltése" linkre kattintás esetén van-e token
 const uploadProductLink = document.querySelector(".logged-in-only a");
  
 uploadProductLink.addEventListener("click", function(event) {
   event.preventDefault(); // Megakadályozzuk az alapértelmezett működést (a href követését)
   
   // Ellenőrizzük, hogy van-e token
   const token = window.localStorage.getItem('token');
   
   if (!token) {
     // Ha nincs token, megjelenítjük az alertet
     alert("Csak bejelentkezett felhasználók tölthetnek fel terméket! Bejelentkezéshez/regisztrációhoz kattints ide.");
   } else {
     // Ha van token, a művelet végrehajtható
     console.log("User is logged in! Upload product allowed.");
     // Ide jöhet az a logika, amit a bejelentkezett felhasználók számára szeretnél futtatni
   }
 });

 
});

  