// Enhanced Projects search with infinite scroll
document.addEventListener("DOMContentLoaded", () => {
  // DOM elements
  const container = document.querySelector("#Progetti-container"),
    filterButtons = document.querySelectorAll(".filter-button");

  // Create search input
  const searchContainer = document.createElement("div");
  searchContainer.className = "search-container";
  searchContainer.innerHTML = `
    <div class="search-input-wrapper">
      <input type="text" id="project-search" placeholder="Cerca progetti..." class="search-input">
    </div>
  `;

  // Insert search before filter buttons
  const filterContainer = document.querySelector(".filter-container");
  filterContainer.parentNode.insertBefore(searchContainer, filterContainer);

  const searchInput = document.getElementById("project-search");

  // State variables
  let progettiData = [],
    filteredProjects = [],
    currentCategory = "all",
    searchTerm = "",
    currentPage = 1,
    projectsPerPage = 6,
    isLoading = false,
    hasMoreProjects = true;

  // Create intersection observer for infinite scroll
  const observerOptions = {
    root: null,
    rootMargin: "0px 0px 200px 0px", // Load more when 200px from bottom
    threshold: 0.1,
  };

  // Create loader element
  const loader = document.createElement("div");
  loader.className = "loader";
  loader.innerHTML = `<div class="loading-spinner"></div>`;

  // Initialize intersection observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && hasMoreProjects && !isLoading) {
        loadMoreProjects();
      }
    });
  }, observerOptions);

  // Add CSS for new elements
  const style = document.createElement("style");
  style.textContent = `
    .search-container {
      margin-bottom: 20px;
      max-width: 500px;
      margin-left: auto;
      margin-right: auto;
    }
    
    .search-input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }
    
    .search-input {
      width: 100%;
      padding: 12px 20px 12px 45px;
      border: 2px solid #8b5a2b;
      border-radius: 30px;
      font-size: 16px;
      transition: all 0.3s ease;
      background-color: white;
    }
    
    .search-input:focus {
      outline: none;
      border-color: #5a3a1a;
      box-shadow: 0 0 8px rgba(139, 90, 43, 0.4);
    }
    
    .search-icon {
      position: absolute;
      left: 15px;
      color: #8b5a2b;
      font-size: 20px;
    }
    
    .loader {
      text-align: center;
      padding: 20px;
      width: 100%;
      grid-column: 1 / -1;
    }
    
    .loading-spinner {
      display: inline-block;
      width: 40px;
      height: 40px;
      border: 4px solid rgba(139, 90, 43, 0.3);
      border-radius: 50%;
      border-top-color: #8b5a2b;
      animation: spin 1s ease-in-out infinite;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    .no-results {
      text-align: center;
      grid-column: 1 / -1;
      padding: 30px;
      font-size: 18px;
      color: #666;
    }
  `;
  document.head.appendChild(style);

  // Update layout based on screen size
  function updateLayout() {
    const width = window.innerWidth;
    if (width <= 600) {
      container.className = "progetti-container mobile-view";
      projectsPerPage = 3;
    } else if (width <= 900) {
      container.className = "progetti-container tablet-view";
      projectsPerPage = 4;
    } else {
      container.className = "progetti-container pc-view";
      projectsPerPage = 6;
    }

    // Reset pagination when layout changes
    resetPagination();
  }

  // Fetch project data
  function fetchData() {
    fetch("Projects/Progetti.json")
      .then((response) => response.json())
      .then((data) => {
        progettiData = data.Progetti;
        applyFilters();
      })
      .catch((error) => {
        console.error("Errore nel caricamento:", error);
        container.innerHTML =
          "<p class='no-results'>Errore nel caricamento dei progetti.</p>";
      });
  }

  // Apply both category and search filters
  function applyFilters() {
    // Reset pagination
    resetPagination();

    // Apply category filter
    let results =
      currentCategory === "all"
        ? [...progettiData]
        : progettiData.filter((progetto) =>
            progetto.categorie.includes(currentCategory)
          );

    // Apply search filter if there's a search term
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      results = results.filter((progetto) =>
        progetto.nome.toLowerCase().includes(term)
      );
    }

    // Update filtered projects
    filteredProjects = results;

    // Display first page
    displayProjects();
  }

  // Reset pagination state
  function resetPagination() {
    currentPage = 1;
    hasMoreProjects = true;
    container.innerHTML = "";

    // Remove existing loader if any
    const existingLoader = document.querySelector(".loader");
    if (existingLoader) {
      existingLoader.remove();
    }
  }

  // Display projects for current page
  function displayProjects() {
    // Clear "No results" message if it exists
    const noResults = container.querySelector(".no-results");
    if (noResults) {
      noResults.remove();
    }

    // Show no results message if no projects match filters
    if (filteredProjects.length === 0) {
      const noResultsMsg = document.createElement("div");
      noResultsMsg.className = "no-results";
      noResultsMsg.innerHTML = `
        <p>Nessun progetto trovato.</p>
        <p style="font-size: 14px; margin-top: 10px;">Prova a modificare i criteri di ricerca.</p>
      `;
      container.appendChild(noResultsMsg);
      return;
    }

    // Calculate start and end indices for current page
    const startIndex = 0;
    const endIndex = currentPage * projectsPerPage;

    // Get projects for current page
    const projectsToShow = filteredProjects.slice(startIndex, endIndex);

    // Clear container and add projects
    container.innerHTML = "";
    projectsToShow.forEach((project) => {
      container.appendChild(createCard(project));
    });

    // Check if there are more projects to load
    hasMoreProjects = endIndex < filteredProjects.length;

    // Add loader if there are more projects
    if (hasMoreProjects) {
      container.appendChild(loader);
      observer.observe(loader);
    }
  }

  // Load more projects when scrolling
  function loadMoreProjects() {
    if (!hasMoreProjects || isLoading) return;

    isLoading = true;

    // Simulate loading delay for better UX
    setTimeout(() => {
      currentPage++;
      displayProjects();
      isLoading = false;
    }, 500);
  }

  // Create project card
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

  // Update filter button styles
  function updateFilterStyle() {
    filterButtons.forEach((button) => {
      button.classList.toggle(
        "active",
        button.dataset.category === currentCategory
      );
    });
  }

  // Add event listeners
  function addEventListeners() {
    // Category filter buttons
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        currentCategory = button.dataset.category;
        updateFilterStyle();
        applyFilters();
      });
    });

    // Search input
    searchInput.addEventListener("input", (e) => {
      searchTerm = e.target.value;
      applyFilters();
    });

    // Responsive layout updates on window resize
    window.addEventListener("resize", updateLayout);
  }

  // Initialize
  function init() {
    fetchData();
    addEventListeners();
    updateLayout();
    updateFilterStyle();
  }

  init();
});
