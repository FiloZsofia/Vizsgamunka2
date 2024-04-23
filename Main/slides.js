let slideIndex = 1;
showSlides(slideIndex);


function plusSlides(n) {
  showSlides(slideIndex += n * 3);   //most hármasával lépked a prev/next button. 
}

function currentSlide(n) {
  showSlides(slideIndex = n * 3);    //így a dotok is hármasával lépkednek
}

function showSlides(n) {

  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  
  if (n > slides.length) {slideIndex = 1}    
  if (n < 1) {slideIndex = slides.length}
  
  // Ha az utolsó diához érünk és előre haladunk, tovább már nem megy
  if (n > slides.length - 2 && n < slides.length + 1) { 
    slideIndex = 3;
    //document.querySelector('.next').style.pointerEvents = 'none'; // Letiltja a next gombot
  }

  // Ha az első diánál vagyunk és hátra haladunk, tovább már nem megy
  if (n < 1 && n > -2) {
    slideIndex = 1;
  }
  
  // A képeket mozgatja a slideren
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }
  
  // A pontok stílusának beállítása
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  
  // Megjeleníti a három képet
  for (i = slideIndex-1; i < slideIndex+2; i++) {
    slides[i % slides.length].style.display = "block";  
  }
  
  dots[slideIndex-1].className += " active";

}