document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector("#Progetti-container"),
    filterButtons = document.querySelectorAll(".filter-button"),
    prevButton = document.createElement("button"),
    nextButton = document.createElement("button"),
    pageInfo = document.createElement("span");

  pageInfo.id = "page-info";
  let progettiData = [],
    filteredProjects = [],
    currentPage = 1,
    itemsPerPage = 3,
    currentCategory = "all";

  // Creazione dei bottoni di navigazione
  function createNavigationButtons() {
    prevButton.innerHTML =
      "<span class='material-icons arrow_back'>arrow_back</span>";
    nextButton.innerHTML =
      "<span class='material-icons arrow_forward'>arrow_forward</span>";

    prevButton.classList.add("nav-button", "prev");
    nextButton.classList.add("nav-button", "next");

    const pageInfoContainer = document.createElement("div");
    pageInfoContainer.classList.add("page-info-container");
    pageInfoContainer.appendChild(prevButton);
    pageInfoContainer.appendChild(pageInfo);
    pageInfoContainer.appendChild(nextButton);
    container.parentElement.appendChild(pageInfoContainer);
  }

  // Caricamento dati JSON
  function fetchData() {
    fetch("Projects/Progetti.json")
      .then((response) => response.json())
      .then((data) => {
        progettiData = data.Progetti;
        updateFilter("all"); // Mostra tutto all'inizio
      })
      .catch((error) => {
        console.error("Errore nel caricamento:", error);
        container.innerHTML = "<p>Errore nel caricamento dei progetti.</p>";
      });
  }

  // Funzione per filtrare i progetti per categoria
  function updateFilter(category) {
    currentCategory = category;
    currentPage = 1; // Reset alla prima pagina

    if (category === "all") filteredProjects = progettiData;
    else {
      filteredProjects = progettiData.filter((progetto) =>
        progetto.categorie.includes(category)
      );
    }

    updatePage();
  }

  // Funzione per aggiornare la pagina
  function updatePage() {
    container.innerHTML = "";

    const start = (currentPage - 1) * itemsPerPage,
      end = start + itemsPerPage,
      paginatedItems = filteredProjects.slice(start, end);

    if (paginatedItems.length === 0)
      container.innerHTML = "<p>Nessun progetto trovato.</p>";
    else paginatedItems.forEach(createCard);

    updateButtons();
    updatePageInfo();
  }

  // Creazione della card progetto
  function createCard(progetto) {
    const card = document.createElement("div");
    card.classList.add("Progetti-card");
    card.innerHTML = `
      <div class="container-immagine">
        <a href="${progetto.link}">
          <img class="immagine" src="${progetto.immagine}" alt="${
      progetto.nome
    }">
        </a>
      </div>
      <br>
      <h3>${progetto.nome}</h3>
      ${
        currentCategory === "all"
          ? `<p class="categoria">Categorie: ${progetto.categorie.join(
              ", "
            )}</p>`
          : ""
      }
    `;
    container.appendChild(card);
  }

  // Funzione per aggiornare la visibilità dei pulsanti
  function updateButtons() {
    prevButton.style.visibility = currentPage > 1 ? "visible" : "hidden";
    nextButton.style.visibility =
      currentPage * itemsPerPage < filteredProjects.length
        ? "visible"
        : "hidden";
  }

  // Funzione per aggiornare l'informazione della pagina
  function updatePageInfo() {
    const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
    pageInfo.textContent = `  Pagina ${currentPage} di ${totalPages}  `;
  }

  // Navigazione tra le pagine
  function prevPage() {
    if (currentPage > 1) {
      currentPage--;
      updatePage();
    }
  }

  function nextPage() {
    if (currentPage * itemsPerPage < filteredProjects.length) {
      currentPage++;
      updatePage();
    }
  }

  // Aggiunta eventi ai pulsanti
  function addEventListeners() {
    prevButton.addEventListener("click", prevPage);
    nextButton.addEventListener("click", nextPage);

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        document
          .querySelector(".filter-button.active")
          ?.classList.remove("active");
        button.classList.add("active");
        updateFilter(button.dataset.category);
      });
    });
  }

  // Inizializzazione
  function init() {
    createNavigationButtons();
    fetchData();
    addEventListeners();
  }

  init();
});
