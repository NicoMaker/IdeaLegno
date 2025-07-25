document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector("#Progetti-container"),
    filterButtons = document.querySelectorAll(".filter-button");

  let progettiData = [],
    filteredProjects = [],
    currentCategory = "all",
    searchTerm = "",
    allowScrollOnLoad = false;

  // ✅ Blocco hash automatico (#Progetti)
  if (window.location.hash === "#Progetti") {
    history.replaceState(null, "", window.location.pathname);
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  function createSearchInput() {
    const searchContainer = document.createElement("div");
    searchContainer.className = "search-container";

    searchContainer.innerHTML = `
      <div class="search-input-wrapper">
        <input type="text" id="search-progetti" placeholder="Cerca progetti..." class="search-input">
        <span class="search-icon material-icons">search</span>
      </div>
    `;

    const filterContainer = document.querySelector(".filter-container");
    filterContainer.parentNode.insertBefore(searchContainer, filterContainer);

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

  function updateFilter(category, shouldScroll = true) {
    currentCategory = category;
    try {
      localStorage.setItem('selectedCategory', category);
    } catch (e) {}

    filterProjects();
    updateFilterStyle();

    // Scroll solo se è richiesto e permesso
    if (shouldScroll && category !== 'all' && allowScrollOnLoad) {
      const progettiSection = document.getElementById('Progetti');
      if (progettiSection) {
        progettiSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  function filterProjects() {
    let tempFiltered =
      currentCategory === "all"
        ? progettiData
        : progettiData.filter((progetto) =>
            progetto.categorie.includes(currentCategory)
          );

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
    card.style.cursor = "pointer";
    card.addEventListener("click", () => {
      window.location.href = progetto.link;
    });

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
        updateFilter(button.dataset.category, true);
      });
    });

    window.addEventListener("resize", updateLayout);
  }

  function init() {
    let savedCategory = 'all';
    try {
      const stored = localStorage.getItem('selectedCategory');
      if (stored && ['Casa', 'Commerciale', 'Nautico', 'all'].includes(stored)) {
        savedCategory = stored;
      }
    } catch (e) {}

    allowScrollOnLoad = document.referrer.includes("/Projects/");

    fetch("Projects/Progetti.json")
      .then((response) => response.json())
      .then((data) => {
        progettiData = data.Progetti;
        createSearchInput();
        updateFilter(savedCategory, allowScrollOnLoad);
      })
      .catch((error) => {
        console.error("Errore nel caricamento:", error);
        container.innerHTML = "<p>Errore nel caricamento dei progetti.</p>";
      });

    addEventListeners();
    updateLayout();
  }

  init();
});
