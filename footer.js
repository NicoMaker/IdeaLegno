document.getElementById("footer").innerHTML = `
  <footer>
    <div class="footer-container">
      <div class="contact-info">
        <h3>Contatti</h3>
        <ul>
          <li>
            <a href="tel:+393356508231">
              <img src="Contact/Img/telefono.png" alt="Telefono" />
              +39 335 650 8231
            </a>
          </li>
          <li>
            <a href="mailto:paolobomben81@gmail.com">
              <img src="Contact/Img/Gmail.png" alt="Email" />
              paolobomben81@gmail.com
            </a>
          </li>
          <li>
            <a href="https://wa.me/393356508231" target="_blank">
              <img src="Contact/Img/Whatsapp.png" alt="WhatsApp" />
              WhatsApp
            </a>
          </li>
          <li>
            <a href="https://www.instagram.com/idealegno81?igsh=MTE2NHllcm85M2xiNA==" target="_blank">
              <img src="Contact/Img/Instagram.png" alt="Instagram" />
              Instagram
            </a>
          </li>
          <li>
            <a href="https://www.facebook.com/search/top?q=ideal%20legno" target="_blank">
              <img src="Contact/Img/Facebook.png" alt="Facebook" />
              Facebook
            </a>
          </li>
        </ul>
      </div>

      <div class="location-info">
        <h3>Dove ci troviamo</h3>
        <p>
          Via Castellana 8, 33080 Castions di Zoppola (PN), Italia
        </p>
        <a href="https://www.google.com/maps?q=Via+Castellana+8,+33080+Castions+di+Zoppola+(PN),+Italia" target="_blank" class="map-link">
          Visualizza sulla mappa
        </a>
      </div>
    </div>
    <p class="copyright">&copy; ${new Date().getFullYear()} IdeaLegno. Tutti i diritti riservati.</p>
  </footer>
`;
