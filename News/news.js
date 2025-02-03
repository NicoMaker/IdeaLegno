document.addEventListener("DOMContentLoaded", () => {
  const newsContainer = document.querySelector("#news-container");
  const prevButton = document.createElement("button");
  const nextButton = document.createElement("button");
  const pageInfo = document.createElement("span");
  pageInfo.id = "page-info"; // Aggiunto id per riferimento in CSS e JS
  let newsData = [];
  let currentPage = 1;
  let itemsPerPage = 3;

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
  newsContainer.parentElement.appendChild(pageInfoContainer);

  // Carica i dati dal JSON
  fetch("News/news.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Errore HTTP: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (!data.news) throw new Error("Formato JSON non valido");
      newsData = data.news;
      updatePage();
    })
    .catch((error) => {
      console.error("Errore nel caricamento delle news:", error);
      newsContainer.innerHTML = "<p>Impossibile caricare le news.</p>";
    });

  // Funzione per aggiornare la pagina
  function updatePage() {
    newsContainer.innerHTML = ""; // Svuota il contenitore delle notizie

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedItems = newsData.slice(start, end);

    paginatedItems.forEach((newsItem) => {
      const newsCard = document.createElement("div");
      newsCard.classList.add("news-card");
      newsCard.innerHTML = `
        <img src="${newsItem.immagine}" alt="${newsItem.titolo}">
        <h3>${newsItem.titolo}</h3>
        <p>${newsItem.descrizione}</p>
        <span class="news-date">${newsItem.data}</span>
      `;
      newsContainer.appendChild(newsCard);
    });

    updateButtons();
    updatePageInfo();
  }

  // Funzione per aggiornare la visibilità dei pulsanti
  function updateButtons() {
    console.log(`Current Page: ${currentPage}`);
    console.log(`Total Items: ${newsData.length}`);
    prevButton.style.visibility = currentPage > 1 ? "visible" : "hidden";
    nextButton.style.visibility =
      currentPage * itemsPerPage < newsData.length ? "visible" : "hidden";
  }

  // Funzione per aggiornare la pagina corrente
  function updatePageInfo() {
    const totalPages = Math.ceil(newsData.length / itemsPerPage);
    pageInfo.textContent = `Pagina ${currentPage} di ${totalPages}`;
  }

  // Eventi click per la navigazione
  prevButton.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      console.log(`Navigating to prev page: ${currentPage}`);
      updatePage();
    }
  });

  nextButton.addEventListener("click", () => {
    if (currentPage * itemsPerPage < newsData.length) {
      currentPage++;
      console.log(`Navigating to next page: ${currentPage}`);
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
