const createContactItem = (href, imgSrc, altText, text) =>
    `<li>
    <a href="${href}" target="_blank">
      <img src="${imgSrc}" alt="${altText}" />
      ${text}
    </a>
  </li>`,
  getContactSection = () =>
    `<div class="contact-info">
    <h3 class="contact-title">Contatti</h3>
    <ul>
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
      ${createContactItem(
        "https://wa.me/393356508231",
        "Contact/Img/Whatsapp.png",
        "WhatsApp",
        "WhatsApp"
      )}
      ${createContactItem(
        "https://www.instagram.com/idealegno81?igsh=MTE2NHllcm85M2xiNA==",
        "Contact/Img/Instagram.png",
        "Instagram",
        "Instagram"
      )}
      ${createContactItem(
        "https://www.facebook.com/search/top?q=ideal%20legno",
        "Contact/Img/Facebook.png",
        "Facebook",
        "Facebook"
      )}
    </ul>
  </div>`,
  getLocationSection = () =>
    `<div class="location-info">
    <h3>Dove ci troviamo</h3>
    <p>Via Castellana 8, 33080 Castions di Zoppola (PN), Italia</p>
    <a href="https://www.google.com/maps?q=Via+Castellana+8,+33080+Castions+di+Zoppola+(PN),+Italia" target="_blank" class="map-link">
      Visualizza sulla mappa
    </a>
  </div>`,
  generateFooter = () =>
    (document.getElementById("footer").innerHTML = `
    <footer>
      <div class="footer-container">
        ${getContactSection()}
        ${getLocationSection()}
      </div>
      <p class="copyright">&copy; ${new Date().getFullYear()} IdeaLegno. Tutti i diritti riservati.</p>
    </footer>`);

generateFooter();
