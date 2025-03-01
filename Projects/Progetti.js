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

  function updateItemsPerPage() {
    const width = window.innerWidth;
    if (width <= 600) itemsPerPage = 1;
    else if (width <= 900) itemsPerPage = 2;
    else itemsPerPage = 3;

    currentPage = 1;
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
  }

  function updatePage() {
    container.innerHTML = "";

    const start = (currentPage - 1) * itemsPerPage,
      end = start + itemsPerPage,
      paginatedItems = filteredProjects.slice(start, end);

    container.innerHTML =
      paginatedItems.length === 0
        ? "<p>Nessun progetto trovato.</p>"
        : paginatedItems.map(createCard).join("");

    updateButtons();
    updatePageInfo();
  }

  function createCard(progetto) {
    return `
      <div class="Progetti-card">
        <div class="container-immagine">
          <a href="${progetto.link}">
            <img class="immagine" src="${progetto.immagine}" alt="${
      progetto.nome
    }">
          </a>
        </div>
        <h3>${progetto.nome}</h3>
        ${
          progetto.categorie.length > 0
            ? `<p class="categoria">${
                progetto.categorie.length > 1 ? "Categorie" : "Categoria"
              }: ${progetto.categorie.join(" , ")}</p>`
            : ""
        }
      </div>`;
  }

  function updateButtons() {
    prevButton.style.visibility = currentPage > 1 ? "visible" : "hidden";
    nextButton.style.visibility =
      currentPage < Math.ceil(filteredProjects.length / itemsPerPage)
        ? "visible"
        : "hidden";
  }

  function updatePageInfo() {
    const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
    pageInfo.textContent = `  Pagina ${currentPage} di ${totalPages}  `;
  }

  function prevPage() {
    if (currentPage > 1) {
      currentPage--;
      updatePage();
    }
  }

  function nextPage() {
    if (currentPage < Math.ceil(filteredProjects.length / itemsPerPage)) {
      currentPage++;
      updatePage();
    }
  }

  function addEventListeners() {
    prevButton.addEventListener("click", prevPage);
    nextButton.addEventListener("click", nextPage);

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const activeButton = document.querySelector(".filter-button.active");
        if (activeButton) activeButton.classList.remove("active");

        button.classList.add("active");
        updateFilter(button.dataset.category);
      });
    });
  }

  function init() {
    createNavigationButtons();
    fetchData();
    addEventListeners();
    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
  }

  init();
});
