document.addEventListener("DOMContentLoaded", function () {
  /*window.onscroll = function () {
    myFunction();
  };

  var header = document.getElementById("myHeader");
  var sticky = header.offsetTop;
  function myFunction() {
    if (window.pageYOffset > sticky) {
      header.classList.add("sticky");
    } else {
      header.classList.remove("sticky");
    }
  }

  $(document).ready(function () {
    $(".menu-icon").click(function () {
      $("nav").slideToggle();
    });
  });*/



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

  /*btnPopup.addEventListener("click", () => {
    wrapper.classList.add("active-popup");
  });*/

  /*iconClose.addEventListener("click", () => {
    wrapper.classList.remove("active-popup");
  });*/

  //registration form

  let regButton = document.getElementById("regButton");
  regButton.onclick = submitForm;

  function submitForm() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const email = document.getElementById("email").value;

    const formData = {
      userName: username,
      password: password,
      email: email,
    };

    // Send POST request to Spring Boot backend
    fetch("http://localhost:8080/user/registration", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
      /*body: {
        "userName":"valai",
        "email" : "email@valami.com",
        "password" : "qwe"
    }*/
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
