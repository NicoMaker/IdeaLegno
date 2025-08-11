class ModernSlider {
  constructor() {
    this.index = 0;
    this.totalSlides = 0;
    this.touchStartX = 0;
    this.touchEndX = 0;
    this.touchStartY = 0;
    this.touchEndY = 0;
    this.isTransitioning = false;
    this.preloadedImages = new Set();
    this.swipeThreshold = 50; // Soglia minima per swipe
    this.isSwipeVertical = false;

    // Elementi DOM
    this.slider = null;
    this.sliderContainer = null;
    this.images = [];
    this.indicators = [];

    // Configurazione animazioni ottimizzata
    this.animationConfig = {
      duration: 400,
      easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      fastDuration: 150,
    };

    this.init();
  }

  init() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.initSlider());
    } else {
      this.initSlider();
    }
  }

  initSlider() {
    this.slider = document.getElementById("slider");
    this.sliderContainer = document.querySelector(".slider-container");

    if (!this.slider || !this.sliderContainer) {
      console.error("Elementi slider non trovati");
      return;
    }

    this.images = Array.from(this.slider.querySelectorAll("img"));
    this.totalSlides = this.images.length;

    console.log(`Slider inizializzato con ${this.totalSlides} immagini`);

    if (this.totalSlides === 0) {
      console.warn("Nessuna immagine trovata nello slider");
      return;
    }

    // Setup iniziale
    this.setupSlider();
    this.createIndicators();
    this.setupEventListeners();
    this.preloadImages();
    this.updateSlider();

    this.preventDefaultBehaviors();
  }

  setupSlider() {
    // Imposta la larghezza totale del slider
    this.slider.style.width = `${this.totalSlides * 100}%`;

    // Imposta ogni immagine
    this.images.forEach((img, index) => {
      img.style.width = `${100 / this.totalSlides}%`;
      img.style.flex = "0 0 auto";

      img.style.willChange = "transform";
      img.draggable = false;

      // Preload delle immagini
      if (img.complete) {
        img.classList.add("loaded");
      } else {
        img.addEventListener("load", () => {
          img.classList.add("loaded");
          this.preloadedImages.add(index);
        });
      }
    });
  }

  createIndicators() {
    if (this.totalSlides <= 1) return;

    const indicatorsContainer = document.createElement("div");
    indicatorsContainer.className = "slider-indicators";

    for (let i = 0; i < this.totalSlides; i++) {
      const indicator = document.createElement("div");
      indicator.className = "slider-indicator";
      if (i === 0) indicator.classList.add("active");

      indicator.addEventListener("click", (e) => {
        e.preventDefault();
        this.goToSlide(i);
      });

      indicator.addEventListener("touchend", (e) => {
        e.preventDefault();
        this.goToSlide(i);
      });

      this.indicators.push(indicator);
      indicatorsContainer.appendChild(indicator);
    }

    this.sliderContainer.appendChild(indicatorsContainer);
  }

  setupEventListeners() {
    if (this.totalSlides <= 1) return;

    this.sliderContainer.addEventListener(
      "touchstart",
      (e) => {
        this.handleTouchStart(e);
      },
      { passive: false }
    );

    this.sliderContainer.addEventListener(
      "touchmove",
      (e) => {
        this.handleTouchMove(e);
      },
      { passive: false }
    );

    this.sliderContainer.addEventListener(
      "touchend",
      (e) => {
        this.handleTouchEnd(e);
      },
      { passive: false }
    );

    let isMouseDown = false;
    let mouseStartX = 0;
    let mouseMoved = false;

    this.sliderContainer.addEventListener("mousedown", (e) => {
      e.preventDefault();
      isMouseDown = true;
      mouseStartX = e.clientX;
      mouseMoved = false;
      this.sliderContainer.style.cursor = "grabbing";
    });

    document.addEventListener("mousemove", (e) => {
      if (!isMouseDown) return;
      e.preventDefault();
      mouseMoved = true;
    });

    document.addEventListener("mouseup", (e) => {
      if (!isMouseDown) return;
      isMouseDown = false;
      this.sliderContainer.style.cursor = "";

      if (mouseMoved) {
        const mouseEndX = e.clientX;
        const diffX = mouseStartX - mouseEndX;

        if (Math.abs(diffX) > this.swipeThreshold) {
          if (diffX > 0) {
            this.moveSlide(1);
          } else {
            this.moveSlide(-1);
          }
        }
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        this.moveSlide(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        this.moveSlide(1);
      }
    });

    this.sliderContainer.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });
  }

  handleTouchStart(e) {
    if (this.isTransitioning) {
      e.preventDefault();
      return;
    }

    const touch = e.touches[0];
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;
    this.isSwipeVertical = false;
  }

  handleTouchMove(e) {
    if (this.isTransitioning) {
      e.preventDefault();
      return;
    }

    const touch = e.touches[0];
    const diffX = Math.abs(touch.clientX - this.touchStartX);
    const diffY = Math.abs(touch.clientY - this.touchStartY);

    if (diffY > diffX && diffY > 10) {
      this.isSwipeVertical = true;
      return; // Permette scroll verticale se necessario
    }

    if (diffX > 10) {
      e.preventDefault(); // Previene scroll orizzontale del browser
    }
  }

  handleTouchEnd(e) {
    if (this.isTransitioning || this.isSwipeVertical) return;

    const touch = e.changedTouches[0];
    this.touchEndX = touch.clientX;
    this.touchEndY = touch.clientY;

    const diffX = this.touchStartX - this.touchEndX;
    const diffY = Math.abs(this.touchStartY - this.touchEndY);

    if (diffY > Math.abs(diffX)) return;

    if (Math.abs(diffX) > this.swipeThreshold) {
      if (diffX > 0) {
        this.moveSlide(1); // Swipe sinistra
      } else {
        this.moveSlide(-1); // Swipe destra
      }
    }
  }

  preventDefaultBehaviors() {
    // Previene zoom su doppio tap
    let lastTouchEnd = 0;
    this.sliderContainer.addEventListener(
      "touchend",
      (e) => {
        const now = new Date().getTime();
        if (now - lastTouchEnd <= 300) {
          e.preventDefault();
        }
        lastTouchEnd = now;
      },
      false
    );

    // Previene selezione del testo
    this.sliderContainer.addEventListener("selectstart", (e) => {
      e.preventDefault();
    });

    // Previene drag delle immagini
    this.images.forEach((img) => {
      img.addEventListener("dragstart", (e) => {
        e.preventDefault();
      });
    });
  }

  moveSlide(step) {
    if (this.totalSlides <= 1 || this.isTransitioning) return;

    const newIndex = (this.index + step + this.totalSlides) % this.totalSlides;
    this.goToSlide(newIndex);
  }

  goToSlide(newIndex) {
    if (
      this.totalSlides <= 1 ||
      this.isTransitioning ||
      newIndex === this.index
    )
      return;

    this.isTransitioning = true;
    this.index = newIndex;
    this.updateSlider();

    setTimeout(() => {
      this.isTransitioning = false;
    }, this.animationConfig.duration);
  }

  updateSlider() {
    if (this.totalSlides <= 1) return;

    const translateX = -this.index * (100 / this.totalSlides);
    this.slider.style.transform = `translate3d(${translateX}%, 0, 0)`;

    // Aggiorna indicatori
    this.indicators.forEach((indicator, index) => {
      indicator.classList.toggle("active", index === this.index);
    });

    console.log(`Slide aggiornata: ${this.index + 1}/${this.totalSlides}`);
  }

  preloadImages() {
    const preloadIndexes = [
      (this.index - 1 + this.totalSlides) % this.totalSlides,
      this.index,
      (this.index + 1) % this.totalSlides,
    ];

    preloadIndexes.forEach((index) => {
      if (!this.preloadedImages.has(index)) {
        const img = this.images[index];
        if (img && !img.complete) {
          const preloadImg = new Image();
          preloadImg.onload = () => {
            this.preloadedImages.add(index);
            img.classList.add("loaded");
          };
          preloadImg.src = img.src;
        }
      }
    });
  }
}

let sliderInstance = null;

function moveSlide(step) {
  if (sliderInstance) {
    sliderInstance.moveSlide(step);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  sliderInstance = new ModernSlider();
});

if (document.readyState !== "loading") {
  sliderInstance = new ModernSlider();
}
