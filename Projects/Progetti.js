document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector("#Progetti-container"),
    prevButton = document.createElement("button"),
    nextButton = document.createElement("button"),
    pageInfo = document.createElement("span"); // Modifica per creare la variabile come un elemento <span>
  pageInfo.id = "page-info"; // Aggiunto id per riferimento in CSS e JS
  let progettiData = [],
    currentPage = 1,
    itemsPerPage = 3;

  // Creazione dei bottoni di navigazione
  prevButton.innerHTML = "<span class='material-icons'>arrow_back</span>";
  nextButton.innerHTML = "<span class='material-icons'>arrow_forward</span>";
  prevButton.classList.add("nav-button", "prev");
  nextButton.classList.add("nav-button", "next");

  const pageInfoContainer = document.createElement("div"); // Contenitore per la pagina e la freccia
  pageInfoContainer.classList.add("page-info-container");
  pageInfoContainer.appendChild(prevButton);
  pageInfoContainer.appendChild(pageInfo);
  pageInfoContainer.appendChild(nextButton);
  container.parentElement.appendChild(pageInfoContainer);

  // Carica i dati dal JSON
  fetch("Projects/Progetti.json")
    .then((response) => response.json())
    .then((data) => {
      if (!data.Progetti) throw new Error("Formato JSON non valido");
      progettiData = data.Progetti;
      updatePage();
    })
    .catch((error) => {
      console.error("Errore nel caricamento dei Progetti:", error);
      container.innerHTML = "<p>Impossibile caricare i Progetti.</p>";
    });

  // Funzione per aggiornare la pagina
  function updatePage() {
    container.innerHTML = "";

    const start = (currentPage - 1) * itemsPerPage,
      end = start + itemsPerPage,
      paginatedItems = progettiData.slice(start, end);

    paginatedItems.forEach((progetti) => {
      const progettiCard = document.createElement("div");
      progettiCard.classList.add("Progetti-card");
      progettiCard.innerHTML = ` 
        <img src="${progetti.immagine}" alt="${progetti.nome}">
        <h3>${progetti.nome}</h3>
        <p>${progetti.descrizione}</p>
        <a href="mailto:info@azienda.com?subject=Richiesta%20info%20su%20${encodeURIComponent(
          progetti.nome
        )}" class="contact-button">Contattaci</a>
      `;
      container.appendChild(progettiCard);
    });

    updateButtons();
    updatePageInfo(); // Aggiorna il numero della pagina e il totale delle pagine
  }

  // Funzione per aggiornare la visibilità dei pulsanti
  function updateButtons() {
    prevButton.style.visibility = currentPage > 1 ? "visible" : "hidden";
    nextButton.style.visibility =
      currentPage * itemsPerPage < progettiData.length ? "visible" : "hidden";
  }

  // Funzione per aggiornare la pagina corrente
  function updatePageInfo() {
    const totalPages = Math.ceil(progettiData.length / itemsPerPage);
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
    if (currentPage * itemsPerPage < progettiData.length) {
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
