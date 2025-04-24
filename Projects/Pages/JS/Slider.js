let index = 0;
let totalSlides = 0;

// Inizializza lo slider
function initSlider() {
  const slider = document.getElementById("slider");
  const images = document.querySelectorAll(".slider img");
  totalSlides = images.length;

  // Crea gli indicatori
  createIndicators(totalSlides);

  // Aggiungi overlay
  const sliderContainer = document.querySelector(".slider-container");
  const overlay = document.createElement("div");
  overlay.className = "slider-overlay";
  sliderContainer.appendChild(overlay);

  // Imposta l'indicatore attivo
  updateIndicators();

  // Aggiungi swipe per dispositivi touch
  addSwipeSupport();
}

// Crea gli indicatori di posizione
function createIndicators(count) {
  const container = document.querySelector(".slider-container");
  const indicators = document.createElement("div");
  indicators.className = "slider-indicators";

  for (let i = 0; i < count; i++) {
    const indicator = document.createElement("div");
    indicator.className = "slider-indicator";
    indicator.dataset.index = i;
    indicator.addEventListener("click", () => {
      index = i;
      updateSlider();
    });
    indicators.appendChild(indicator);
  }

  container.appendChild(indicators);
}

// Aggiorna gli indicatori
function updateIndicators() {
  const indicators = document.querySelectorAll(".slider-indicator");
  indicators.forEach((indicator, i) => {
    if (i === index) {
      indicator.classList.add("active");
    } else {
      indicator.classList.remove("active");
    }
  });
}

// Aggiorna lo slider
function updateSlider() {
  const slider = document.getElementById("slider");
  slider.style.transform = `translateX(${-index * 100}%)`;
  updateIndicators();
}

// Funzione per muovere lo slider
function moveSlide(step) {
  const slider = document.getElementById("slider");
  const images = document.querySelectorAll(".slider img");
  index = (index + step + images.length) % images.length;
  updateSlider();
}

// Aggiunge supporto per swipe su dispositivi touch
function addSwipeSupport() {
  const sliderContainer = document.querySelector(".slider-container");
  let touchStartX = 0;
  let touchEndX = 0;

  sliderContainer.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
    },
    false
  );

  sliderContainer.addEventListener(
    "touchend",
    (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    },
    false
  );

  function handleSwipe() {
    const minSwipeDistance = 50;
    if (touchEndX < touchStartX - minSwipeDistance) {
      // Swipe a sinistra
      moveSlide(1);
    }
    if (touchEndX > touchStartX + minSwipeDistance) {
      // Swipe a destra
      moveSlide(-1);
    }
  }
}

// Aggiungi navigazione con tastiera
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") {
    moveSlide(-1);
  } else if (e.key === "ArrowRight") {
    moveSlide(1);
  }
});

// Inizializza lo slider quando il documento è pronto
document.addEventListener("DOMContentLoaded", initSlider);

// Aggiungi rotazione automatica delle slide
let autoSlideInterval;

function startAutoSlide() {
  autoSlideInterval = setInterval(() => {
    moveSlide(1);
  }, 60000); // Cambia slide ogni minuto
}

function stopAutoSlide() {
  clearInterval(autoSlideInterval);
}

// Avvia la rotazione automatica e fermala quando l'utente interagisce
document.addEventListener("DOMContentLoaded", () => {
  initSlider();
  startAutoSlide();

  // Ferma la rotazione quando l'utente interagisce
  const sliderContainer = document.querySelector(".slider-container");
  sliderContainer.addEventListener("mouseenter", stopAutoSlide);
  sliderContainer.addEventListener("mouseleave", startAutoSlide);
  sliderContainer.addEventListener("touchstart", stopAutoSlide);
  sliderContainer.addEventListener("touchend", () => {
    setTimeout(startAutoSlide, 3000);
  });
});
