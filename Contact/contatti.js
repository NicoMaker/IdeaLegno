document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector("#contatti-container"),
    prevButton = document.createElement("button"),
    nextButton = document.createElement("button"),
    pageInfo = document.createElement("span");

  pageInfo.id = "page-info"; // Aggiunto id per riferimento in CSS e JS
  let contattiData = [],
    currentPage = 1,
    itemsPerPage = 3;

  // Creazione dei bottoni di navigazione
  prevButton.innerHTML = "<span class='material-icons'>arrow_back</span>";
  nextButton.innerHTML = "<span class='material-icons'>arrow_forward</span>";
  prevButton.classList.add("nav-button", "prev");
  nextButton.classList.add("nav-button", "next");

  const pageInfoContainer = document.createElement("div");
  pageInfoContainer.classList.add("page-info-container");
  pageInfoContainer.appendChild(prevButton);
  pageInfoContainer.appendChild(pageInfo);
  pageInfoContainer.appendChild(nextButton);
  container.parentElement.appendChild(pageInfoContainer);

  // Carica i dati dal JSON
  fetch("Contact/contatti.json")
    .then((response) => {
      if (!response.ok) throw new Error(`Errore HTTP: ${response.status}`);
      return response.json();
    })
    .then((data) => {
      if (!data.contatti) throw new Error("Formato JSON non valido");
      contattiData = data.contatti;
      updatePage();
    })
    .catch((error) => {
      console.error("Errore nel caricamento dei contatti:", error);
      container.innerHTML = "<p>Impossibile caricare i contatti.</p>";
    });

  // Funzione per aggiornare la pagina
  function updatePage() {
    container.innerHTML = ""; // Svuota il contenitore dei contatti

    const start = (currentPage - 1) * itemsPerPage,
      end = start + itemsPerPage,
      paginatedItems = contattiData.slice(start, end);

    paginatedItems.forEach((contatto) => {
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

    updateButtons();
    updatePageInfo();
  }

  // Funzione per aggiornare la visibilità dei pulsanti
  function updateButtons() {
    prevButton.style.visibility = currentPage > 1 ? "visible" : "hidden";
    nextButton.style.visibility =
      currentPage * itemsPerPage < contattiData.length ? "visible" : "hidden";
  }

  // Funzione per aggiornare la pagina corrente
  function updatePageInfo() {
    const totalPages = Math.ceil(contattiData.length / itemsPerPage);
    pageInfo.textContent = ` Pagina ${currentPage} di ${totalPages} `;
  }

  // Eventi click per la navigazione
  prevButton.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      updatePage();
    }
  });

  nextButton.addEventListener("click", () => {
    if (currentPage * itemsPerPage < contattiData.length) {
      currentPage++;
      updatePage();
    }
  });

  // Adatta il numero di elementi per pagina in base allo schermo
  function adjustItemsPerPage() {
    if (window.innerWidth >= 1024) itemsPerPage = 3;
    else if (window.innerWidth >= 768) itemsPerPage = 2;
    else itemsPerPage = 1;
    updatePage();
  }

  window.addEventListener("resize", adjustItemsPerPage);
});
