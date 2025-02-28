document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(".section"),
    navLinks = document.querySelectorAll(".nav-link"),
    getScrollPosition = () => window.scrollY + 150; // Aggiunge margine per evitare cambiamenti errati

  function getActiveSection() {
    return Array.from(sections).find((section) => {
      const sectionTop = section.offsetTop,
        sectionHeight = section.offsetHeight;
      return (
        getScrollPosition() >= sectionTop &&
        getScrollPosition() < sectionTop + sectionHeight
      );
    });
  }

  function updateActiveLink() {
    const activeSection = getActiveSection();

    if (activeSection) {
      const activeId = activeSection.getAttribute("id");

      navLinks.forEach((link) => {
        link.classList.toggle(
          "active",
          link.getAttribute("href") === `#${activeId}`
        );
      });
    }
  }

  window.addEventListener("scroll", updateActiveLink);
  updateActiveLink(); // Imposta il colore corretto al caricamento
});
