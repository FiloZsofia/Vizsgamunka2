document.addEventListener("DOMContentLoaded", function () {

$("#navi").html(NAVIGATION_HTML)
$("#footer").html(FOOTER_HTML)

fetch("http://localhost:8080/content/get/about-us")
  .then(function (r) { return r.ok ? r.json() : null; })
  .then(function (data) {
    if (data && data.body) {
      document.getElementById("rolunk-tartalom").innerHTML = data.body;
    }
  })
  .catch(function (err) {
    console.error("Rólunk szöveg betöltése sikertelen, a beépített marad:", err);
  });

})