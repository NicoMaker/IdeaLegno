let index = 0;
function moveSlide(step) {
  const slider = document.getElementById("slider"),
    images = document.querySelectorAll(".slider img");
  index = (index + step + images.length) % images.length;
  slider.style.transform = `translateX(${-index * 100}%)`;
}
