// Enhanced Progetti.js with clickable cards
document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector("#Progetti-container"),
    filterButtons = document.querySelectorAll(".filter-button")

  let progettiData = [],
    filteredProjects = [],
    currentCategory = "all"

  function updateLayout() {
    const width = window.innerWidth
    if (width <= 600) container.className = "progetti-container mobile-view"
    else if (width <= 900) container.className = "progetti-container tablet-view"
    else container.className = "progetti-container pc-view"
    updateDate()
  }

  function fetchData() {
    fetch("Projects/Progetti.json")
      .then((response) => response.json())
      .then((data) => {
        progettiData = data.Progetti
        updateFilter("all")
      })
      .catch((error) => {
        console.error("Errore nel caricamento:", error)
        container.innerHTML = "<p>Errore nel caricamento dei progetti.</p>"
      })
  }

  function updateFilter(category) {
    currentCategory = category

    filteredProjects =
      category === "all" ? progettiData : progettiData.filter((progetto) => progetto.categorie.includes(category))

    updateDate()
    updateFilterStyle()
  }

  function updateFilterStyle() {
    filterButtons.forEach((button) => {
      button.classList.toggle("active", button.dataset.category === currentCategory)
    })
  }

  function updateDate() {
    container.innerHTML = ""

    if (filteredProjects.length === 0) container.innerHTML = "<p class='no-results'>Nessun progetto trovato.</p>"
    else {
      filteredProjects.forEach((project) => {
        container.appendChild(createCard(project))
      })
    }
  }

  function createCard(progetto) {
    const card = document.createElement("div")
    card.className = "Progetti-card"

    // Make the entire card clickable
    card.addEventListener("click", () => {
      window.location.href = progetto.link
    })

    // Add cursor style to indicate clickability
    card.style.cursor = "pointer"

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
    `
    return card
  }

  function addEventListeners() {
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        updateFilter(button.dataset.category)
      })
    })

    // Add responsive layout updates on window resize
    window.addEventListener("resize", updateLayout)
  }

  function init() {
    fetchData()
    addEventListeners()
    updateLayout()
  }

  init()
})

