
export function redirectToLogin() {
  console.log(localStorage.getItem("token"));
  const url = "http://127.0.0.1:8080/auth/validate";

  fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    },
  })  
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
      if (data == false) {
        alert("Bejelentkezés szükséges");
        window.location.href = "/Main/index.html";
      } else {
        console.log("Be vagy jelentkezve");
      }
    })
    .catch((error) => {
      console.log(error);
      window.location.href = "/Main/index.html";
    });
}

setTimeout(function() {
function checkOrder() {
  console.log(localStorage.getItem("token"));
  const url = "http://127.0.0.1:8080/auth/validate";

  fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    },
  })  
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
      if (data == false) {
        alert("Bejelentkezés szükséges");
      } else {
        window.location.href = "/Order/egyedi-rendeles.html";
      }
    })
    .catch((error) => {
      console.log(error);
      window.location.href = "/Main/index.html";
    });
}

function checkUpload() {
  console.log(localStorage.getItem("token"));
  const url = "http://127.0.0.1:8080/auth/validate";

  fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    },
  })  
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
      if (data == false) {
        alert("Bejelentkezés szükséges");
      } else {
        window.location.href = "/ProductsUpload/termek-feltoltese.html";
      }
    })
    .catch((error) => {
      console.log(error);
      window.location.href = "/Main/index.html";
    });
}

let feltoltes = document.getElementById("feltoltes")
let rendeles = document.getElementById("rendeles")
feltoltes.onclick = checkUpload;
rendeles.onclick = checkOrder;
}, 1000);






