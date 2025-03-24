// script.js
const createListItem = (href, imgSrc, altText, text) => {
    return `
    <li>
      <button>
        <a href="${href}" target="_blank" rel="noopener noreferrer">
          <img src="${imgSrc}" alt="${altText}"> ${text}  &nbsp
        </a>
      </button>
    </li>
  `;
  },
  loadFooterData = async () => {
    try {
      const response = await fetch("JS/Footer.json");

      // Verifica che la risposta sia corretta
      if (!response.ok) throw new Error("Errore nel caricamento del file JSON");

      const data = await response.json();
      console.log(data); // Verifica che i dati siano stati letti correttamente

      const createListSection = (items) =>
          items
            .map((item) =>
              createListItem(item.href, item.imgSrc, item.altText, item.text)
            )
            .join(""),
        contactList = createListSection(data.contacts),
        socialList = createListSection(data.socials),
        locationSection = `
      <div class="location-section">
        <p>${data.location.address}</p>
        <a href="${data.location.mapLink}" target="_blank" rel="noopener noreferrer" class="map-link">
          Visualizza sulla mappa
        </a>
        <br>
        <br>
      </div>
    `;

      // Genera il footer completo
      document.getElementById("footer").innerHTML = `
      <footer>
        <div class="footer-container">
          ${locationSection}
          <div class="footer-columns">
            <div class="contact-section">
              <h3 class="section-title">Contatti</h3>
              <ul class="contact-list">${contactList}</ul>
            </div>
            <div class="social-section">
              <h3 class="section-title">Seguici sui Social</h3>
              <ul class="social-list">${socialList}</ul>
            </div>
          </div>
        </div>
        <br>
        <p class="copyright">&copy; ${new Date().getFullYear()} IdeaLegno. Tutti i diritti riservati.</p>
      </footer>
    `;
    } catch (error) {
      console.error("Errore nel caricare i dati del footer:", error);
    }
  };

// Funzione per gestire l'animazione del footer al caricamento della pagina
const handleFooterAnimation = () => {
  const footer = document.querySelector("footer");

  // Calcola se l'utente è arrivato in fondo alla pagina
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 10) {
    footer.style.opacity = "1"; // Mostra il footer
    footer.style.transform = "translateY(0)"; // Fa salire il footer
  } else {
    footer.style.opacity = "0"; // Nasconde il footer
    footer.style.transform = "translateY(100%)"; // Sposta il footer fuori dallo schermo
  }
};

// Inizializza il footer quando il DOM è pronto
document.addEventListener("DOMContentLoaded", loadFooterData);
window.addEventListener("scroll", handleFooterAnimation);
