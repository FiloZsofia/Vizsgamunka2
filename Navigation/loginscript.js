/*Első verzió: disabled helyett másik módszer (mert az nem használható "a" tageknél):*/

document.addEventListener("DOMContentLoaded", function() {
  // A kód, amely a DOM betöltése után fut le
  function delayedFunction() {
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
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
          // Handle success, e.g., show a success message or redirect
          window.localStorage.setItem('token', data.code);
          checkToken();

             // Ellenőrizzük, hogy a "Termék feltöltése" linkre kattintás esetén van-e token
          const uploadProductLink = document.querySelector(".logged-in-only a");
          uploadProductLink.addEventListener("click", function(event) {
            event.preventDefault(); // Megakadályozzuk az alapértelmezett működést (a href követését)
            
            // Ellenőrizzük, hogy van-e token
            const token = window.localStorage.getItem('token');
            console.log(token)
            
            if (!token) {
              // Ha nincs token, megjelenítjük az alertet
              alert("Csak bejelentkezett felhasználók tölthetnek fel terméket! Bejelentkezéshez/regisztrációhoz kattints ide.");
            } else {
              // Ha van token, a művelet végrehajtható
              // Ide jöhet az a logika, amit a bejelentkezett felhasználók számára szeretnél futtatni
              console.log("User is logged in! Upload product allowed.");

              // A menüpont megnyitása
              const productUploadPageLink = "ProductsUpload/termek-feltoltese.html"; // A menüpont URL-je
              window.location.href = productUploadPageLink; // Átirányítás a menüpont URL-jére
            }
          });

        })
        .catch((error) => {
          console.error("Error:", error);
          // Handle error, e.g., show an error message to the user
        });
    }
  }
  
  setTimeout(delayedFunction, 500);
});
 
 /*Második verzió: A Termék feltöltése menüpontra kattintásnál kiíródik a konzolra, hogy "User is logged in! Upload product allowed",
  de nem nyílik meg a menüpont a bejelentkezett felhasználó számára: */

 /* document.addEventListener("DOMContentLoaded", function() {
  // A kód, amely a DOM betöltése után fut le
  function delayedFunction() {
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
  }
  
  setTimeout(delayedFunction, 500);

  // Ellenőrizzük, hogy a "Termék feltöltése" linkre kattintás esetén van-e token
   const uploadProductLink = document.querySelector(".logged-in-only a");
    
   uploadProductLink.addEventListener("click", function(event) {
     event.preventDefault(); // Megakadályozzuk az alapértelmezett működést (a href követését)
     
     // Ellenőrizzük, hogy van-e token
     const token = window.localStorage.getItem('token');
     console.log(token)
     
     if (!token) {
       // Ha nincs token, megjelenítjük az alertet
       alert("Csak bejelentkezett felhasználók tölthetnek fel terméket! Bejelentkezéshez/regisztrációhoz kattints ide.");
     } else {
       // Ha van token, a művelet végrehajtható
       console.log("User is logged in! Upload product allowed.");
       // Ide jöhet az a logika, amit a bejelentkezett felhasználók számára szeretnél futtatni

       // Távolítsuk el a disabled attribútumot a menüpontról
    uploadProductLink.removeAttribute("disabled");
     }
   });
}); */



/*Harmadik verzió: Itt megnyílik a Termék feltöltése menüpont, amikor rákattintunk, de nem történik meg a kiírás
(User is logged in! Upload product allowed) a konzolra: */

/* document.addEventListener("DOMContentLoaded", function() {
  // A kód, amely a DOM betöltése után fut le
  function delayedFunction() {
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

          // Ellenőrizzük, hogy a "Termék feltöltése" linkre kattintás esetén van-e token
          const uploadProductLink = document.querySelector(".logged-in-only a");
          uploadProductLink.addEventListener("click", function(event) {
            event.preventDefault(); // Megakadályozzuk az alapértelmezett működést (a href követését)
            
            // Ellenőrizzük, hogy van-e token
            const token = window.localStorage.getItem('token');
            console.log(token)
            
            if (!token) {
              // Ha nincs token, megjelenítjük az alertet
              alert("Csak bejelentkezett felhasználók tölthetnek fel terméket! Bejelentkezéshez/regisztrációhoz kattints ide.");
            } else {
              // Ha van token, a művelet végrehajtható
              console.log("User is logged in! Upload product allowed.");
              // Ide jöhet az a logika, amit a bejelentkezett felhasználók számára szeretnél futtatni

              // Távolítsuk el a disabled attribútumot a menüpontról
              uploadProductLink.removeAttribute("disabled");
              
              // Megnyitjuk a menüpontot
              // Például, ha a menüpont egy div elem, akkor azt jeleníthetjük meg:
              const menuPont = document.getElementById('logged-in-only');
              menuPont.style.display = 'block';
            }
          });

          // Kiírjuk a konzolra a "User is logged in! Upload product allowed." üzenetet
          console.log("User is logged in! Upload product allowed.");

        })
        .catch((error) => {
          console.error("Error:", error);
          // Handle error, e.g., show an error message to the user
        });
      }
  }
  
  setTimeout(delayedFunction, 500);
});*/