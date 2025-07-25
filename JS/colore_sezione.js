document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(".section");
  const footer = document.querySelector("#footer");
  const navLinks = document.querySelectorAll(".nav-link");

  // Crea dinamicamente il box per il nome della sezione in alto
  const sezioneAttivaBox = document.createElement("div");
  sezioneAttivaBox.id = "sezione-attiva";
  sezioneAttivaBox.style.position = "fixed";
  sezioneAttivaBox.style.top = "0";
  sezioneAttivaBox.style.left = "0";
  sezioneAttivaBox.style.padding = "6px 12px";
  sezioneAttivaBox.style.fontWeight = "bold";
  sezioneAttivaBox.style.fontSize = "14px";
  sezioneAttivaBox.style.backgroundColor = "rgba(255, 255, 255, 0.95)";
  sezioneAttivaBox.style.zIndex = "10000";
  sezioneAttivaBox.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
  sezioneAttivaBox.style.borderRadius = "0 0 8px 0";
  sezioneAttivaBox.textContent = "lik/Home";
  document.body.appendChild(sezioneAttivaBox);

  setTimeout(() => {
    initializeScrollDetection();
  }, 300);

  const getScrollPosition = () => window.scrollY + 150;

  function getActiveSection() {
    const scrollPos = getScrollPosition();
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (footer && (window.scrollY + windowHeight >= documentHeight - 150)) {
      return { element: footer, id: 'footer' };
    }

    if (footer) {
      const footerTop = footer.offsetTop;
      const footerHeight = footer.offsetHeight;
      const footerBottom = footerTop + footerHeight;
      if (scrollPos >= footerTop && scrollPos <= footerBottom) {
        return { element: footer, id: 'footer' };
      }
    }

    const sectionsArray = Array.from(sections).reverse();

    for (let section of sectionsArray) {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionBottom = sectionTop + sectionHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
        return { element: section, id: section.getAttribute("id") };
      }
    }

    for (let section of sectionsArray) {
      const sectionTop = section.offsetTop;
      if (scrollPos >= sectionTop) {
        return { element: section, id: section.getAttribute("id") };
      }
    }

    if (sections.length > 0) {
      return { element: sections[0], id: sections[0].getAttribute("id") };
    }

    return null;
  }

  function updateActiveLink() {
    const activeSection = getActiveSection();
    navLinks.forEach((link) => {
      link.classList.remove("active");
    });

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
    sections.forEach((section) => {
      section.classList.remove("section-highlighted");
    });
    if (footer) footer.classList.remove("section-highlighted");

    if (activeSection && activeSection.element) {
      activeSection.element.classList.add("section-highlighted");
    }
  }

  let lastSectionId = null;

  function displaySectionName(id) {
    const formatted = id.charAt(0).toUpperCase() + id.slice(1);
    sezioneAttivaBox.textContent = `lik/${formatted}`;

    // Aggiorna URL solo se è cambiata la sezione
    if (lastSectionId !== id) {
      history.replaceState(null, "", `#${id}`);
      lastSectionId = id;
    }
  }

  function handleScroll() {
    const active = getActiveSection();
    if (active) {
      updateActiveLink();
      updateSectionHighlight();
      displaySectionName(active.id);
    }
  }

  window.addEventListener("scroll", handleScroll);
  window.addEventListener("resize", () => setTimeout(handleScroll, 100));
  navLinks.forEach((link) => {
    link.addEventListener("click", () => setTimeout(handleScroll, 500));
  });

  handleScroll(); // Iniziale
});

document.addEventListener("DOMContentLoaded", () => {
  const referrer = document.referrer;
  const isFromProjects = referrer.includes("/Projects/");

  if (isFromProjects) {
    // Scroll a #Progetti solo se arriva da Projects/*
    setTimeout(() => {
      const target = document.querySelector("#Progetti");
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }, 800);
  } else {
    // Altrimenti: rimuove eventuali hash e scrolla in cima
    if (window.location.hash) {
      history.replaceState(null, "", window.location.pathname);
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }
});
