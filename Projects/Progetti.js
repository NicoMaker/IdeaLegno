document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector("#Progetti-container");

  fetch("Projects/Progetti.json")
    .then((response) => response.json())
    .then((data) => {
      if (!data.Progetti) throw new Error("Formato JSON non valido");

      data.Progetti.forEach((progetti) => {
        const progettiCard = document.createElement("div");
        progettiCard.classList.add("Progetti-card");

        progettiCard.innerHTML = `
            <img src="${progetti.immagine}" alt="${progetti.nome}">
            <h3>${progetti.nome}</h3>
            <p>${progetti.descrizione}</p>
            <a href="mailto:info@azienda.com?subject=Richiesta%20info%20su%20${encodeURIComponent(
              progetti.nome
            )}" class="contact-button">
              Contattaci
            </a>
          `;

        container.appendChild(progettiCard);
      });
    })
    .catch((error) => {
      console.error("Errore nel caricamento dei Progetti:", error);
      container.innerHTML = "<p>Impossibile caricare i Progetti.</p>";
    });
});
