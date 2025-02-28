const createContactItem = (href, imgSrc, altText, text) => `
  <li>
    <a href="${href}" target="_blank" rel="noopener noreferrer">
      <img src="${imgSrc}" alt="${altText}" />
      <span>${text}</span>
    </a>
  </li>
`,
  createSocialItem = (href, imgSrc, altText, text) => `
  <li>
    <a href="${href}" target="_blank" rel="noopener noreferrer">
      <img src="${imgSrc}" alt="${altText}" />
      <span>${text}</span>
    </a>
  </li>
`,
  getContactSection = () => `
  <div class="contact-section">
    <h3 class="section-title">Contatti</h3>
    <ul class="contact-list">
      ${createContactItem(
        "tel:+393356508231",
        "Contact/Img/telefono.png",
        "Telefono",
        "+39 335 650 8231"
      )}
      ${createContactItem(
        "mailto:paolobomben81@gmail.com",
        "Contact/Img/Gmail.png",
        "Email",
        "paolobomben81@gmail.com"
      )}
    </ul>
  </div>
`,
  getSocialSection = () => `
  <div class="social-section">
    <h3 class="section-title">Social</h3>
    <ul class="social-list">
      ${createSocialItem(
        "https://wa.me/393356508231",
        "Contact/Img/Whatsapp.png",
        "WhatsApp",
        "WhatsApp"
      )}
      ${createSocialItem(
        "https://www.instagram.com/idealegno81?igsh=MTE2NHllcm85M2xiNA==",
        "Contact/Img/Instagram.png",
        "Instagram",
        "Instagram"
      )}
      ${createSocialItem(
        "https://www.facebook.com/search/top?q=ideal%20legno",
        "Contact/Img/Facebook.png",
        "Facebook",
        "Facebook"
      )}
    </ul>
  </div>
`,
  getLocationSection = () => `
  <div class="location-section">
    <p>Via Castellana 8, 33080 Castions di Zoppola (PN), Italia</p>
    <a href="https://www.google.com/maps?q=Via+Castellana+8,+33080+Castions+di+Zoppola+(PN),+Italia" 
       target="_blank" rel="noopener noreferrer" class="map-link">
      Visualizza sulla mappa
    </a>
  </div>
`,
  generateFooter = () => {
    document.getElementById("footer").innerHTML = `
    <footer>
      <div class="footer-container">
        <div class="footer-columns">
          ${getContactSection()}
          ${getSocialSection()}
        </div>
        ${getLocationSection()}
      </div>
      <p class="copyright">&copy; ${new Date().getFullYear()} IdeaLegno. Tutti i diritti riservati.</p>
    </footer>
  `;
  };

// Initialize footer when DOM is loaded
document.addEventListener("DOMContentLoaded", generateFooter);


window.addEventListener("scroll", function () {
  let footer = document.querySelector("footer");
  
  // Calcola se l'utente è arrivato in fondo alla pagina
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 10) {
    footer.style.opacity = "1";  // Mostra il footer
    footer.style.transform = "translateY(0)"; // Fa salire il footer
  } else {
    footer.style.opacity = "0";  // Nasconde il footer
    footer.style.transform = "translateY(100%)"; // Sposta il footer fuori dallo schermo
  }
});
