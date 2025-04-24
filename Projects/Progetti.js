// Enhanced Progetti.js with search functionality and clickable cards
document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector("#Progetti-container"),
    filterButtons = document.querySelectorAll(".filter-button");

  let progettiData = [],
    filteredProjects = [],
    currentCategory = "all",
    searchTerm = "";

  // Create and add search input
  function createSearchInput() {
    const searchContainer = document.createElement("div");
    searchContainer.className = "search-container";

    searchContainer.innerHTML = `
      <div class="search-input-wrapper">
        <input type="text" id="search-progetti" placeholder="Cerca progetti..." class="search-input">
        <span class="search-icon material-icons">search</span>
      </div>
    `;

    // Insert before filter container
    const filterContainer = document.querySelector(".filter-container");
    filterContainer.parentNode.insertBefore(searchContainer, filterContainer);

    // Add event listener for search input
    const searchInput = document.getElementById("search-progetti");
    searchInput.addEventListener("input", (e) => {
      searchTerm = e.target.value.toLowerCase().trim();
      filterProjects();
    });
  }

  function updateLayout() {
    const width = window.innerWidth;
    if (width <= 600) container.className = "progetti-container mobile-view";
    else if (width <= 900)
      container.className = "progetti-container tablet-view";
    else container.className = "progetti-container pc-view";
    updateDisplay();
  }

  function fetchData() {
    fetch("Projects/Progetti.json")
      .then((response) => response.json())
      .then((data) => {
        progettiData = data.Progetti;
        createSearchInput(); // Create search input after data is loaded
        updateFilter("all");
      })
      .catch((error) => {
        console.error("Errore nel caricamento:", error);
        container.innerHTML = "<p>Errore nel caricamento dei progetti.</p>";
      });
  }

  function updateFilter(category) {
    currentCategory = category;
    filterProjects();
    updateFilterStyle();
  }

  function filterProjects() {
    // First filter by category
    let tempFiltered =
      currentCategory === "all"
        ? progettiData
        : progettiData.filter((progetto) =>
            progetto.categorie.includes(currentCategory)
          );

    // Then filter by search term if it exists
    if (searchTerm) {
      tempFiltered = tempFiltered.filter((progetto) => {
        return (
          progetto.nome.toLowerCase().includes(searchTerm) ||
          progetto.categorie.some((cat) =>
            cat.toLowerCase().includes(searchTerm)
          )
        );
      });
    }

    filteredProjects = tempFiltered;
    updateDisplay();
  }

  function updateFilterStyle() {
    filterButtons.forEach((button) => {
      button.classList.toggle(
        "active",
        button.dataset.category === currentCategory
      );
    });
  }

  function updateDisplay() {
    container.innerHTML = "";

    if (filteredProjects.length === 0) {
      container.innerHTML =
        "<p class='no-results'>Nessun progetto trovato. Prova a modificare i criteri di ricerca.</p>";
    } else {
      filteredProjects.forEach((project) => {
        container.appendChild(createCard(project));
      });
    }
  }

  function createCard(progetto) {
    const card = document.createElement("div");
    card.className = "Progetti-card";

    // Make the entire card clickable
    card.addEventListener("click", () => {
      window.location.href = progetto.link;
    });

    // Add cursor style to indicate clickability
    card.style.cursor = "pointer";

    card.innerHTML = `  
      <div class="container-immagine">
        <img class="immagine" src="${progetto.immagine}" alt="${progetto.nome}">
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

  function addEventListeners() {
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        updateFilter(button.dataset.category);
      });
    });

    // Add responsive layout updates on window resize
    window.addEventListener("resize", updateLayout);
  }

  function init() {
    fetchData();
    addEventListeners();
    updateLayout();
  }

  init();
});
