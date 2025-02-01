document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector("#contatti-container");

  fetch("Contact/contatti.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Errore HTTP: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (!data.contatti) throw new Error("Formato JSON non valido");

      data.contatti.forEach((contatto) => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
          <img src="${contatto.immagine}" alt="${contatto.nome}">
          <h3>${contatto.nome}</h3>
          <p>${contatto.descrizione}</p>
          <div class="contact-icons">
            <a class="icon" href="https://wa.me/${contatto.whatsapp}" target="_blank">
              <img src="Contact/Img/Whatsapp.png" alt="WhatsApp" width="24">
            </a>
            <a class="icon" href="mailto:${contatto.email}">
              <img src="Contact/Img/Gmail.png" alt="Email" width="24">
            </a>
            <a class="icon" href="tel:${contatto.telefono}">
              <img src="Contact/Img/telefono.png" alt="Telefono" width="24">
            </a>
            <!-- Aggiunta Instagram e Facebook -->
            <a class="icon" href="https://www.instagram.com/${contatto.instagram}" target="_blank">
              <img src="Contact/Img/Instagram.png" alt="Instagram" width="24">
            </a>
            <a class="icon" href="https://www.facebook.com/${contatto.facebook}" target="_blank">
              <img src="Contact/Img/Facebook.png" alt="Facebook" width="24">
            </a>
          </div>
        `;

        container.appendChild(card);
      });
    })
    .catch((error) => {
      console.error("Errore nel caricamento dei contatti:", error);
      container.innerHTML = "<p>Impossibile caricare i contatti.</p>";
    });
});
