class ModernSlider {
  constructor() {
    this.index = 0;
    this.totalSlides = 0;
    this.autoSlideInterval = null;
    this.autoSlideDelay = 5000;
    this.isAutoSliding = false; // Disabilita auto-slide
    this.touchStartX = 0;
    this.touchEndX = 0;
    this.isTransitioning = false;
    this.preloadedImages = new Set();

    // Elementi DOM
    this.slider = null;
    this.sliderContainer = null;
    this.images = [];
    this.indicators = [];
    this.progressBar = null;

    // Configurazione animazioni
    this.animationConfig = {
      duration: 600,
      easing: "cubic-bezier(0.4, 0, 0.2, 1)",
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
    this.images = Array.from(document.querySelectorAll(".slider img"));
    this.totalSlides = this.images.length;

    if (this.totalSlides === 0) return;

    // Setup slider - condizionale per numero di slide
    if (this.totalSlides > 1) {
      this.createControls();
      this.createIndicators();
    }

    this.createProgressBar();
    this.createOverlay();
    this.preloadImages();
    this.setupEventListeners();
    this.updateSlider(false);

    // Aggiungi classe loaded
    setTimeout(() => {
      this.sliderContainer.classList.add("loaded");
    }, 100);

    console.log(`Slider inizializzato con ${this.totalSlides} immagine/i`);
  }

  createControls() {
    // Solo se ci sono più di 1 slide
    if (this.totalSlides <= 1) return;

    // Rimuovi controlli esistenti se presenti
    const existingControls =
      this.sliderContainer.querySelectorAll(".prev, .next");
    existingControls.forEach((control) => control.remove());

    // Crea controllo precedente
    const prevBtn = document.createElement("button");
    prevBtn.className = "prev";
    prevBtn.setAttribute("aria-label", "Immagine precedente");
    prevBtn.innerHTML = "‹";
    prevBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.moveSlide(-1);
    });

    // Crea controllo successivo
    const nextBtn = document.createElement("button");
    nextBtn.className = "next";
    nextBtn.setAttribute("aria-label", "Immagine successiva");
    nextBtn.innerHTML = "›";
    nextBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.moveSlide(1);
    });

    this.sliderContainer.appendChild(prevBtn);
    this.sliderContainer.appendChild(nextBtn);

    console.log("Controlli creati per slider multi-immagine");
  }

  createIndicators() {
    // Solo se ci sono più di 1 slide
    if (this.totalSlides <= 1) return;

    // Rimuovi indicatori esistenti
    const existingIndicators =
      this.sliderContainer.querySelector(".slider-indicators");
    if (existingIndicators) existingIndicators.remove();

    const indicatorsContainer = document.createElement("div");
    indicatorsContainer.className = "slider-indicators";
    indicatorsContainer.setAttribute("role", "tablist");

    for (let i = 0; i < this.totalSlides; i++) {
      const indicator = document.createElement("button");
      indicator.className = "slider-indicator";
      indicator.setAttribute("role", "tab");
      indicator.setAttribute("aria-label", `Vai all'immagine ${i + 1}`);
      indicator.dataset.index = i;

      indicator.addEventListener("click", (e) => {
        const newIndex = parseInt(e.target.dataset.index);
        this.goToSlide(newIndex);
      });

      this.indicators.push(indicator);
      indicatorsContainer.appendChild(indicator);
    }

    this.sliderContainer.appendChild(indicatorsContainer);
    console.log("Indicatori creati per slider multi-immagine");
  }

  createProgressBar() {
    const progressBar = document.createElement("div");
    progressBar.className = "slider-progress";
    // Nascosta per slider manuale o singola immagine
    progressBar.style.display = "none";
    this.sliderContainer.appendChild(progressBar);
    this.progressBar = progressBar;
  }

  createOverlay() {
    const existingOverlay =
      this.sliderContainer.querySelector(".slider-overlay");
    if (existingOverlay) return;

    const overlay = document.createElement("div");
    overlay.className = "slider-overlay";
    this.sliderContainer.appendChild(overlay);
  }

  preloadImages() {
    this.images.forEach((img, index) => {
      if (img.complete) {
        this.handleImageLoad(img, index);
      } else {
        img.addEventListener("load", () => this.handleImageLoad(img, index));
        img.addEventListener("error", () => this.handleImageError(img, index));
      }
    });
  }

  handleImageLoad(img, index) {
    img.classList.add("loaded");
    this.preloadedImages.add(index);

    // Preload prossima immagine solo se ci sono più immagini
    if (this.totalSlides > 1) {
      const nextIndex = (index + 1) % this.totalSlides;
      const nextImg = this.images[nextIndex];
      if (nextImg && !nextImg.classList.contains("loaded")) {
        const preloadImg = new Image();
        preloadImg.src = nextImg.src;
      }
    }
  }

  handleImageError(img, index) {
    console.warn(`Errore nel caricamento dell'immagine ${index + 1}`);
    img.style.backgroundColor = "#f0f0f0";
    img.alt = "Immagine non disponibile";
  }

  setupEventListeners() {
    // Eventi touch/mouse solo per slider multi-immagine
    if (this.totalSlides > 1) {
      // Touch events per swipe
      this.sliderContainer.addEventListener(
        "touchstart",
        (e) => {
          this.touchStartX = e.changedTouches[0].screenX;
        },
        { passive: true },
      );

      this.sliderContainer.addEventListener(
        "touchend",
        (e) => {
          this.touchEndX = e.changedTouches[0].screenX;
          this.handleSwipe();
        },
        { passive: true },
      );

      // Mouse events per desktop
      let isMouseDown = false;
      let mouseStartX = 0;

      this.sliderContainer.addEventListener("mousedown", (e) => {
        isMouseDown = true;
        mouseStartX = e.clientX;
        this.sliderContainer.style.cursor = "grabbing";
      });

      document.addEventListener("mousemove", (e) => {
        if (!isMouseDown) return;
        e.preventDefault();
      });

      document.addEventListener("mouseup", (e) => {
        if (!isMouseDown) return;
        isMouseDown = false;
        this.sliderContainer.style.cursor = "";

        const mouseEndX = e.clientX;
        const diffX = mouseStartX - mouseEndX;
        const minSwipeDistance = 50;

        if (Math.abs(diffX) > minSwipeDistance) {
          if (diffX > 0) {
            this.moveSlide(1);
          } else {
            this.moveSlide(-1);
          }
        }
      });

      // Keyboard navigation
      document.addEventListener("keydown", (e) => {
        if (
          !this.sliderContainer.matches(":hover") &&
          document.activeElement !== this.sliderContainer
        )
          return;

        switch (e.key) {
          case "ArrowLeft":
            e.preventDefault();
            this.moveSlide(-1);
            break;
          case "ArrowRight":
            e.preventDefault();
            this.moveSlide(1);
            break;
          case "Home":
            e.preventDefault();
            this.goToSlide(0);
            break;
          case "End":
            e.preventDefault();
            this.goToSlide(this.totalSlides - 1);
            break;
        }
      });
    } else {
      // Per singola immagine, rimuovi il cursor grab
      this.sliderContainer.style.cursor = "default";
    }
  }

  handleSwipe() {
    // Solo per slider multi-immagine
    if (this.totalSlides <= 1) return;

    const minSwipeDistance = 50;
    const diffX = this.touchStartX - this.touchEndX;

    if (Math.abs(diffX) > minSwipeDistance) {
      if (diffX > 0) {
        this.moveSlide(1); // Swipe sinistra
      } else {
        this.moveSlide(-1); // Swipe destra
      }
    }
  }

  moveSlide(step) {
    // Solo per slider multi-immagine
    if (this.totalSlides <= 1) return;

    if (this.isTransitioning) {
      console.log("Transizione in corso, ignoro il comando");
      return;
    }

    console.log(
      `moveSlide chiamato con step: ${step}, index corrente: ${this.index}`,
    );

    const newIndex = (this.index + step + this.totalSlides) % this.totalSlides;
    console.log(`Nuovo index calcolato: ${newIndex}`);

    this.goToSlide(newIndex);
  }

  goToSlide(newIndex) {
    // Solo per slider multi-immagine
    if (this.totalSlides <= 1) return;

    if (this.isTransitioning || newIndex === this.index) {
      console.log(
        `goToSlide bloccato: isTransitioning=${this.isTransitioning}, newIndex=${newIndex}, currentIndex=${this.index}`,
      );
      return;
    }

    console.log(`Andando alla slide ${newIndex} da ${this.index}`);

    this.isTransitioning = true;
    this.index = newIndex;
    this.updateSlider();

    // Reset del flag di transizione
    setTimeout(() => {
      this.isTransitioning = false;
      console.log("Transizione completata");
    }, this.animationConfig.duration);
  }

  updateSlider(animated = true) {
    if (!this.slider) {
      console.log("Slider element non trovato!");
      return;
    }

    // Aggiorna transform solo se ci sono più immagini
    if (this.totalSlides > 1) {
      const translateX = -this.index * 100;
      console.log(`Aggiornando slider: translateX(${translateX}%)`);
      this.slider.style.transform = `translateX(${translateX}%)`;
    } else {
      // Per singola immagine, assicurati che non ci sia transform
      this.slider.style.transform = "translateX(0%)";
    }

    // Aggiorna indicatori
    this.updateIndicators();

    // Aggiorna attributi ARIA
    this.updateAriaAttributes();

    // Trigger custom event
    const event = new CustomEvent("slideChanged", {
      detail: {
        currentIndex: this.index,
        totalSlides: this.totalSlides,
        isSingleImage: this.totalSlides === 1,
      },
    });
    this.sliderContainer.dispatchEvent(event);
  }

  updateIndicators() {
    // Solo per slider multi-immagine
    if (this.totalSlides <= 1) return;

    this.indicators.forEach((indicator, i) => {
      if (i === this.index) {
        indicator.classList.add("active");
        indicator.setAttribute("aria-selected", "true");
      } else {
        indicator.classList.remove("active");
        indicator.setAttribute("aria-selected", "false");
      }
    });
  }

  updateAriaAttributes() {
    this.images.forEach((img, i) => {
      if (this.totalSlides === 1 || i === this.index) {
        img.setAttribute("aria-hidden", "false");
      } else {
        img.setAttribute("aria-hidden", "true");
      }
    });
  }

  // Metodi mantenuti ma non utilizzati (per compatibilità)
  startAutoSlide() {
    // Non fa nulla - slider manuale
  }

  stopAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
      this.autoSlideInterval = null;
    }
    this.resetProgressBar();
  }

  pauseAutoSlide() {
    // Non fa nulla - slider manuale
  }

  resumeAutoSlide() {
    // Non fa nulla - slider manuale
  }

  restartAutoSlide() {
    // Non fa nulla - slider manuale
  }

  toggleAutoSlide() {
    // Non fa nulla - slider sempre manuale
  }

  updateProgressBar() {
    // Nasconde la progress bar per slider manuale
    if (!this.progressBar) return;
    this.progressBar.style.display = "none";
  }

  resetProgressBar() {
    if (!this.progressBar) return;
    this.progressBar.style.display = "none";
  }

  // Metodi pubblici per controllo esterno
  next() {
    if (this.totalSlides > 1) {
      this.moveSlide(1);
    }
  }

  prev() {
    if (this.totalSlides > 1) {
      this.moveSlide(-1);
    }
  }

  goto(index) {
    if (this.totalSlides > 1 && index >= 0 && index < this.totalSlides) {
      this.goToSlide(index);
    }
  }

  getCurrentIndex() {
    return this.index;
  }

  getTotalSlides() {
    return this.totalSlides;
  }

  isSingleImage() {
    return this.totalSlides === 1;
  }

  destroy() {
    this.stopAutoSlide();

    // Reset stili
    if (this.slider) {
      this.slider.style.transform = "";
    }
    if (this.sliderContainer) {
      this.sliderContainer.classList.remove("loaded");
    }

    // Rimuovi elementi creati dinamicamente
    if (this.sliderContainer) {
      const dynamicElements = this.sliderContainer.querySelectorAll(
        ".slider-indicators, .slider-overlay, .slider-progress, .prev, .next",
      );
      dynamicElements.forEach((el) => el.remove());
    }
  }
}

// Utility functions per migliorare l'esperienza utente
class SliderUtils {
  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  static throttle(func, limit) {
    let inThrottle;
    return function () {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  static preloadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  static getViewportSize() {
    return {
      width: Math.max(
        document.documentElement.clientWidth || 0,
        window.innerWidth || 0,
      ),
      height: Math.max(
        document.documentElement.clientHeight || 0,
        window.innerHeight || 0,
      ),
    };
  }

  static isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );
  }

  static supportsTouch() {
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
  }

  static prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
}

// Performance monitoring per ottimizzazioni
class SliderPerformance {
  constructor() {
    this.metrics = {
      initTime: 0,
      transitionTimes: [],
      memoryUsage: 0,
    };
  }

  startTiming(name) {
    this[`${name}Start`] = performance.now();
  }

  endTiming(name) {
    const duration = performance.now() - this[`${name}Start`];
    if (name === "transition") {
      this.metrics.transitionTimes.push(duration);
      if (this.metrics.transitionTimes.length > 10) {
        this.metrics.transitionTimes.shift();
      }
    } else {
      this.metrics[`${name}Time`] = duration;
    }
    return duration;
  }

  getAverageTransitionTime() {
    if (this.metrics.transitionTimes.length === 0) return 0;
    return (
      this.metrics.transitionTimes.reduce((a, b) => a + b, 0) /
      this.metrics.transitionTimes.length
    );
  }

  logMetrics() {
    console.log("Slider Performance Metrics:", this.metrics);
  }
}

// Enhanced Modern Slider con performance monitoring (versione manuale e adattiva)
class EnhancedModernSlider extends ModernSlider {
  constructor() {
    super();
    this.performance = new SliderPerformance();
    this.performance.startTiming("init");
  }

  initSlider() {
    super.initSlider();
    this.performance.endTiming("init");

    // Ottimizzazioni specifiche
    this.optimizeForDevice();
    this.setupLazyLoading();

    // Log dello stato finale
    console.log(
      `Slider configurato: ${this.totalSlides} immagine/i, modalità: ${this.isSingleImage() ? "visualizzazione singola" : "slider interattivo"}`,
    );
  }

  optimizeForDevice() {
    const isMobile = SliderUtils.isMobile();
    const supportsTouch = SliderUtils.supportsTouch();
    const prefersReducedMotion = SliderUtils.prefersReducedMotion();

    if (prefersReducedMotion) {
      this.animationConfig.duration = 150;
    }

    // Cursor appropriato basato sul numero di immagini
    if (this.totalSlides > 1) {
      if (isMobile) {
        this.sliderContainer.style.cursor = "grab";
      }
    } else {
      this.sliderContainer.style.cursor = "default";
    }

    // Adatta la sensibilità del touch per dispositivi diversi
    this.touchSensitivity = isMobile ? 30 : 50;
  }

  setupLazyLoading() {
    // Implementa lazy loading per immagini non visibili (solo per slider multi-immagine)
    if (this.totalSlides <= 1) return;

    if ("IntersectionObserver" in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute("data-src");
              imageObserver.unobserve(img);
            }
          }
        });
      });

      // Osserva immagini con data-src
      this.images.forEach((img) => {
        if (img.dataset.src) {
          imageObserver.observe(img);
        }
      });
    }
  }

  updateSlider(animated = true) {
    if (this.totalSlides > 1) {
      this.performance.startTiming("transition");
    }

    super.updateSlider(animated);

    if (this.totalSlides > 1) {
      requestAnimationFrame(() => {
        this.performance.endTiming("transition");
      });
    }
  }

  handleSwipe() {
    // Solo per slider multi-immagine
    if (this.totalSlides <= 1) return;

    const minSwipeDistance = this.touchSensitivity || 50;
    const diffX = this.touchStartX - this.touchEndX;

    if (Math.abs(diffX) > minSwipeDistance) {
      if (diffX > 0) {
        this.moveSlide(1);
      } else {
        this.moveSlide(-1);
      }
    }
  }
}

// Inizializzazione automatica
let sliderInstance = null;

function initializeSlider() {
  if (sliderInstance) {
    sliderInstance.destroy();
  }

  // Verifica che gli elementi esistano
  const slider = document.getElementById("slider");
  const sliderContainer = document.querySelector(".slider-container");

  if (!slider || !sliderContainer) {
    console.error("Elementi slider non trovati, riprovo tra 500ms...");
    setTimeout(initializeSlider, 500);
    return;
  }

  // Usa la versione enhanced se disponibile
  try {
    sliderInstance = new EnhancedModernSlider();
    console.log("Slider adattivo inizializzato con successo");
  } catch (error) {
    console.error("Errore nell'inizializzazione dello slider:", error);
    // Fallback a versione semplice
    sliderInstance = new ModernSlider();
  }

  // Esponi l'istanza globalmente per debug/controllo esterno
  window.slider = sliderInstance;

  // Event listeners per debugging
  if (sliderInstance && sliderInstance.sliderContainer) {
    sliderInstance.sliderContainer.addEventListener("slideChanged", (e) => {
      if (e.detail.isSingleImage) {
        console.log("Visualizzazione singola immagine attiva");
      } else {
        console.log(
          `Slide cambiata: ${e.detail.currentIndex + 1}/${e.detail.totalSlides}`,
        );
      }
    });
  }
}

// Auto-init quando il DOM è pronto
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeSlider);
} else {
  initializeSlider();
}

// Re-init su resize per responsive
let resizeTimeout;
window.addEventListener(
  "resize",
  SliderUtils.debounce(() => {
    if (sliderInstance) {
      sliderInstance.updateSlider(false);
    }
  }, 250),
);

// Cleanup su unload
window.addEventListener("beforeunload", () => {
  if (sliderInstance) {
    sliderInstance.destroy();
  }
});

// Export per moduli ES6 (opzionale)
if (typeof module !== "undefined" && module.exports) {
  module.exports = { ModernSlider, EnhancedModernSlider, SliderUtils };
}

class Slider {
    constructor(totalSlides) {
        this.totalSlides = totalSlides;
        this.index = 0; // Indice corrente dello slider
        this.isTransitioning = false; // Flag per controllare la transizione
        this.animationConfig = {
            duration: 150, // Durata della transizione a 150ms
            easing: "ease-out", // Tipo di easing per la transizione
        };
    }

    // Funzione per spostarsi di un passo avanti o indietro
    moveSlide(step) {
        if (this.totalSlides <= 1) return; // Non fare nulla se c'è solo un'immagine

        // Calcola il nuovo indice in base al passo (step)
        const newIndex = (this.index + step + this.totalSlides) % this.totalSlides;
        this.goToSlide(newIndex);
    }

    // Funzione per andare alla slide specificata
    goToSlide(newIndex) {
        if (this.totalSlides <= 1) return; // Non fare nulla se c'è solo un'immagine

        // Se l'indice è lo stesso, non fare nulla
        if (newIndex === this.index) return;

        // Segna che la transizione è in corso
        this.isTransitioning = true;
        this.index = newIndex; // Imposta il nuovo indice
        this.updateSlider(); // Aggiorna il contenuto dello slider

        // Rimuovi la transizione dopo che è stata completata
        setTimeout(() => {
            this.isTransitioning = false; // Ripristina lo stato di transizione
        }, this.animationConfig.duration); // Usa la durata della transizione
    }

    // Funzione per aggiornare lo slider (questa dipende dal tuo HTML e come vuoi mostrare le immagini)
    updateSlider() {
        // Esegui il codice per aggiornare la visualizzazione dello slider
        console.log(`Vai alla slide numero ${this.index + 1}`); // Qui puoi aggiornare il contenuto visibile, ad esempio cambiando le immagini
    }

    // Aggiungi un listener per i bottoni (se hai dei bottoni per avanzare e indietro)
    addEventListeners() {
        const prevButton = document.querySelector('.prev');
        const nextButton = document.querySelector('.next');

        // Aggiungi il click per il bottone precedente
        prevButton.addEventListener('click', () => {
            if (!this.isTransitioning) {
                this.moveSlide(-1); // Vai alla slide precedente
            }
        });

        // Aggiungi il click per il bottone successivo
        nextButton.addEventListener('click', () => {
            if (!this.isTransitioning) {
                this.moveSlide(1); // Vai alla slide successiva
            }
        });
    }
}

// Inizializza lo slider con 5 immagini (o il numero che preferisci)
const slider = new Slider(5);
slider.addEventListeners(); // Aggiungi i listener per i bottoni
