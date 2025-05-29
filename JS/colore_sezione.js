document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(".section");
  const footer = document.querySelector("#footer");
  const navLinks = document.querySelectorAll(".nav-link");

  // Aspetta che tutto sia caricato, incluso il footer
  setTimeout(() => {
    initializeScrollDetection();
  }, 300);

  function initializeScrollDetection() {
    function getScrollPosition() {
      return window.scrollY + 150; // Offset per determinare quale sezione è attiva
    }

    function getActiveSection() {
      const scrollPos = getScrollPosition();
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Controllo specifico per il footer - se siamo negli ultimi 150px della pagina
      if (footer && (window.scrollY + windowHeight >= documentHeight - 150)) {
        return { element: footer, id: 'footer' };
      }

      // Controlla se siamo effettivamente dentro al footer
      if (footer) {
        const footerTop = footer.offsetTop;
        const footerHeight = footer.offsetHeight;
        const footerBottom = footerTop + footerHeight;

        if (scrollPos >= footerTop && scrollPos <= footerBottom) {
          return { element: footer, id: 'footer' };
        }
      }

      // Controlla le sezioni normali dall'ultima alla prima (per priorità)
      const sectionsArray = Array.from(sections).reverse();

      for (let section of sectionsArray) {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionBottom = sectionTop + sectionHeight;

        if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
          return { element: section, id: section.getAttribute("id") };
        }
      }

      // Se non troviamo nessuna sezione specifica, usa l'ultima sezione raggiunta
      for (let section of sectionsArray) {
        const sectionTop = section.offsetTop;
        if (scrollPos >= sectionTop) {
          return { element: section, id: section.getAttribute("id") };
        }
      }

      // Default alla prima sezione
      if (sections.length > 0) {
        return { element: sections[0], id: sections[0].getAttribute("id") };
      }

      return null;
    }

    function updateActiveLink() {
      const activeSection = getActiveSection();

      // Rimuovi la classe active da tutti i link
      navLinks.forEach((link) => {
        link.classList.remove("active");
      });

      // Aggiungi la classe active al link corretto
      if (activeSection) {
        navLinks.forEach((link) => {
          const linkHref = link.getAttribute("href");
          if (linkHref === `#${activeSection.id}`) {
            link.classList.add("active");
          }
        });
      }
    }

    function updateSectionHighlight() {
      const activeSection = getActiveSection();

      // Rimuovi evidenziazione da tutte le sezioni
      sections.forEach((section) => {
        section.classList.remove("section-highlighted");
      });

      // Rimuovi evidenziazione dal footer
      if (footer) {
        footer.classList.remove("section-highlighted");
      }

      // Aggiungi evidenziazione alla sezione/footer attivo
      if (activeSection && activeSection.element) {
        activeSection.element.classList.add("section-highlighted");
      }
    }

    function handleScroll() {
      updateActiveLink();
      updateSectionHighlight();
    }

    // Event listener per lo scroll
    window.addEventListener("scroll", handleScroll);

    // Esegui immediatamente per impostare lo stato iniziale
    handleScroll();

    // Controlla anche dopo resize della finestra
    window.addEventListener("resize", () => {
      setTimeout(handleScroll, 100);
    });

    // Gestisci anche i click sui link di navigazione
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        setTimeout(handleScroll, 500); // Delay per permettere lo scroll
      });
    });
  }
});