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
    itemsPerPage = 3, // Always 3 items per page
    currentCategory = "all";

  function updateLayout() {
    const width = window.innerWidth;
    if (width <= 600) container.className = "progetti-container mobile-view";
    else if (width <= 900)
      container.className = "progetti-container tablet-view";
    else container.className = "progetti-container pc-view";
    updatePage();
  }

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

  function fetchData() {
    fetch("Projects/Progetti.json")
      .then((response) => response.json())
      .then((data) => {
        progettiData = data.Progetti;
        updateFilter("all");
      })
      .catch((error) => {
        console.error("Errore nel caricamento:", error);
        container.innerHTML = "<p>Errore nel caricamento dei progetti.</p>";
      });
  }

  function updateFilter(category) {
    currentCategory = category;
    currentPage = 1;

    filteredProjects =
      category === "all"
        ? progettiData
        : progettiData.filter((progetto) =>
            progetto.categorie.includes(category)
          );

    updatePage();
    updateFilterStyle();
  }

  function updateFilterStyle() {
    filterButtons.forEach((button) => {
      button.classList.toggle(
        "active",
        button.dataset.category === currentCategory
      );
    });
  }

  function updatePage() {
    container.innerHTML = "";

    const start = (currentPage - 1) * itemsPerPage,
      end = start + itemsPerPage,
      paginatedItems = filteredProjects.slice(start, end);

    paginatedItems.forEach((project) => {
      container.appendChild(createCard(project));
    });

    if (paginatedItems.length === 0) {
      container.innerHTML = "<p>Nessun progetto trovato.</p>";
    }

    updateButtons();
    updatePageInfo();
  }

  function createCard(progetto) {
    const card = document.createElement("div");
    card.className = "Progetti-card";
    card.innerHTML = `
      <div class="container-immagine">
        <a href="${progetto.link}">
          <img class="immagine" src="${progetto.immagine}" alt="${
      progetto.nome
    }">
        </a>
      </div>
      <h3>${progetto.nome}</h3>
      ${
        currentCategory === "all" && progetto.categorie.length > 0
          ? `<p class="categoria">${
              progetto.categorie.length > 1 ? "Categorie" : "Categoria"
            }: ${progetto.categorie.join(", ")}</p>`
          : ""
      }
    `;
    return card;
  }

  function updateButtons() {
    const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
    prevButton.style.visibility = totalPages > 1 ? "visible" : "hidden";
    nextButton.style.visibility = totalPages > 1 ? "visible" : "hidden";
  }

  function updatePageInfo() {
    const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
    pageInfo.textContent = `  Pagina ${currentPage} di ${totalPages}  `;
  }

  function prevPage() {
    const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
    currentPage = currentPage > 1 ? currentPage - 1 : totalPages;
    updatePage();
  }

  function nextPage() {
    const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
    currentPage = currentPage < totalPages ? currentPage + 1 : 1;
    updatePage();
  }

  function addEventListeners() {
    prevButton.addEventListener("click", prevPage);
    nextButton.addEventListener("click", nextPage);

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        updateFilter(button.dataset.category);
      });
    });
  }

  function init() {
    createNavigationButtons();
    fetchData();
    addEventListeners();
    updateLayout();
    window.addEventListener("resize", updateLayout);
  }

  init();
});
