$("#navi").load("../Navigation/navigation.html")    
$("#footer").load("../Footer/footer.html")

/*
function redirectToLogin() {
    const url = "http://127.0.0.1:8080/auth/validate";
  
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        //let jwtObject = parseJwt(localStorage.getItem("token"));
  
        // a data a response amit a backended kuld. ha az false akkor eliranyit
        if (data == false) {
          alert("be kell jelentkezni");
        }

      })
      .catch((error) => {
        console.log(error);
      });
  }

  redirectToLogin();*/