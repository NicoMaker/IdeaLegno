document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector("#Progetti-container"),
    prevButton = document.createElement("button"),
    nextButton = document.createElement("button"),
    pageInfo = document.createElement("span");

  pageInfo.id = "page-info"; // Aggiunto id per riferimento in CSS e JS
  let progettiData = [],
    currentPage = 1,
    itemsPerPage = 3;

  // Funzione per creare i bottoni di navigazione
  function createNavigationButtons() {
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
  }

  // Funzione per caricare i dati dal JSON
  function fetchData() {
    fetch("Projects/Progetti.json")
      .then((response) => {
        if (!response.ok) throw new Error(`Errore HTTP: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        if (!data.Progetti) throw new Error("Formato JSON non valido");
        progettiData = data.Progetti;
        updatePage();
      })
      .catch((error) => {
        console.error("Errore nel caricamento dei Progetti:", error);
        container.innerHTML = "<p>Impossibile caricare i Progetti.</p>";
      });
  }

  // Funzione per aggiornare la pagina con i progetti
  function updatePage() {
    container.innerHTML = ""; // Svuota il contenitore dei progetti

    const start = (currentPage - 1) * itemsPerPage,
      end = start + itemsPerPage,
      paginatedItems = progettiData.slice(start, end);

    paginatedItems.forEach(createCard);

    updateButtons();
    updatePageInfo();
  }

  // Funzione per creare una card di progetto
  function createCard(progetto) {
    const card = document.createElement("div");
    card.classList.add("Progetti-card");
    card.innerHTML = `
      <img src="${progetto.immagine}" alt="${progetto.nome}">
      <h3>${progetto.nome}</h3>
      <p>${progetto.descrizione}</p>
      <a href="mailto:paolobomben81@gmail.com?subject=Richiesta%20info%20su%20${encodeURIComponent(progetto.nome)}" class="contact-button">Contattaci</a>
    `;
    container.appendChild(card);
  }

  // Funzione per aggiornare la visibilità dei pulsanti
  function updateButtons() {
    prevButton.style.visibility = currentPage > 1 ? "visible" : "hidden";
    nextButton.style.visibility =
      currentPage * itemsPerPage < progettiData.length ? "visible" : "hidden";
  }

  // Funzione per aggiornare le informazioni della pagina corrente
  function updatePageInfo() {
    const totalPages = Math.ceil(progettiData.length / itemsPerPage);
    pageInfo.textContent = ` Pagina ${currentPage} di ${totalPages} `;
  }

  // Funzione per navigare alla pagina precedente
  function prevPage() {
    if (currentPage > 1) {
      currentPage--;
      updatePage();
    }
  }

  // Funzione per navigare alla pagina successiva
  function nextPage() {
    if (currentPage * itemsPerPage < progettiData.length) {
      currentPage++;
      updatePage();
    }
  }

  // Funzione per adattare il numero di elementi per pagina in base alla larghezza dello schermo
  function adjustItemsPerPage() {
    if (window.innerWidth >= 1024) itemsPerPage = 3;
    else if (window.innerWidth >= 768) itemsPerPage = 2;
    else itemsPerPage = 1;
    updatePage();
  }

  // Aggiungere gli eventi per la navigazione
  function addEventListeners() {
    prevButton.addEventListener("click", prevPage);
    nextButton.addEventListener("click", nextPage);
    window.addEventListener("resize", adjustItemsPerPage);
  }

  // Inizializzazione
  function init() {
    createNavigationButtons();
    fetchData();
    addEventListeners();
  }

  init();
});