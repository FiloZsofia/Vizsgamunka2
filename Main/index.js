document.addEventListener("DOMContentLoaded", function () { 

let slideIndex = 0;
showSlides();

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function prevtSlide(n) {
  showSlides(slideIndex = n - 1);
}

function showSlides() {
  let i;
  let slides = document.getElementsByClassName("our-box");
  let dots = document.getElementsByClassName("dot");
  if (slideIndex >= slides.length) {slideIndex = 0}
  if (slideIndex < 0) {slideIndex = slides.length - 1}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  for (i = slideIndex; i < slideIndex + 3; i++) {
    slides[i].style.display = "block";
    dots[i].className += " active";
  }
}

  $("#navi").load("../Navigation/navigation.html")

  $("footer").load("../Footer/footer.html")

})

