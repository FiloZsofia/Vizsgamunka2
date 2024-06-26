

document.addEventListener("DOMContentLoaded", function() {


  // A kód, amely a DOM betöltése után fut le
  function delayedFunction() {
    // JavaScript kód a pop-up kezeléséhez
    let gomb = document.getElementById("btnLogin");
    let bezar = document.getElementById("btnClose");
    gomb.onclick = openPopup;
    bezar.onclick = closePopup;
    
    function openPopup() {
      if(localStorage.getItem("token") !== null){
        console.log("bejentkezve(loginscript.js)");
        localStorage.removeItem("token");
        window.location.href = "/Main/index.html";
        alert("Kijelentkezés")
      }
      else{
        document.getElementById('popup').style.display = 'block';
      }
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
          if (data.status !== 500) {
            alert("Sikeres regisztráció")
            closePopup()
          }
          else{
            console.log("Success:", data);
            closePopup()
            alert(data.message)
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          alert(error);
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
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error("Hibás felhasználónév vagy jelszó");
      }
    })
    .then((data) => {
      console.log("Sikeres bejelentkezés:", data);
      window.localStorage.setItem('token', data.code);
      closePopup();
      alert("Sikeres bejelentkezés!");
    })
    .catch((error) => {
      console.error("Hiba történt:", error.message);
      alert(error.message);
    });
  }
  
  }
  setTimeout(delayedFunction, 700);
});
 
