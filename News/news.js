document.addEventListener("DOMContentLoaded", () => {
  const newsContainer = document.querySelector("#news-container"),
    prevButton = createNavButton("arrow_back", "prev"),
    nextButton = createNavButton("arrow_forward", "next"),
    pageInfo = document.createElement("span");

  pageInfo.id = "page-info";
  let newsData = [],
    currentPage = 1,
    itemsPerPage = 3;

  function createNavButton(icon, className) {
    const button = document.createElement("button");
    button.innerHTML = `<span class='material-icons ${icon}'>${icon}</span>`;
    button.classList.add("nav-button", className);
    return button;
  }

  function createPageInfoContainer() {
    const pageInfoContainer = document.createElement("div");
    pageInfoContainer.classList.add("page-info-container");
    pageInfoContainer.appendChild(prevButton);
    pageInfoContainer.appendChild(pageInfo);
    pageInfoContainer.appendChild(nextButton);
    newsContainer.parentElement.appendChild(pageInfoContainer);
  }

  function loadNewsData() {
    fetch("News/news.json")
      .then(handleResponse)
      .then(handleData)
      .catch(handleError);
  }

  function handleResponse(response) {
    if (!response.ok) throw new Error(`Errore HTTP: ${response.status}`);
    return response.json();
  }

  function handleData(data) {
    if (!data.news) throw new Error("Formato JSON non valido");
    newsData = data.news;
    updatePage();
  }

  function handleError(error) {
    console.error("Errore nel caricamento delle news:", error);
    newsContainer.innerHTML = "<p> Novità in arrivo... stay tuned</p>";
  }

  function updatePage() {
    clearNewsContainer();
    const paginatedItems = getPaginatedItems();
    paginatedItems.forEach(createNewsCard);
    updatePageInfo();
    // Rimuovo updateButtonsVisibility perché ora i pulsanti sono sempre visibili per la navigazione circolare
  }

  const clearNewsContainer = () => (newsContainer.innerHTML = "");

  function getPaginatedItems() {
    const start = (currentPage - 1) * itemsPerPage,
      end = start + itemsPerPage;
    return newsData.slice(start, end);
  }

  function createNewsCard(newsItem) {
    const newsCard = document.createElement("div");
    newsCard.classList.add("news-card");

    // Creazione del contenuto principale della news
    newsCard.innerHTML = `
      <div class="container-immagine">
      <a href="${newsItem.immagine} " target="_blank">
        <img class="immagine" src="${newsItem.immagine}" alt="${newsItem.titolo}">
      </a>
      </div>
      <br>
      <br>
      <h3>${newsItem.titolo}</h3>
      <br>
      <br>
      </p>
    `;

    // Contenitore per la data e l'icona di download
    const newsFooter = document.createElement("div");
    newsFooter.classList.add("news-item");

    const newsDate = document.createElement("span");
    newsDate.classList.add("news-date");
    newsDate.textContent = newsItem.data;
    newsFooter.appendChild(newsDate);

    // Se esiste un file da scaricare, aggiungi l'icona di download
    if (newsItem.download) {
      const downloadLink = document.createElement("a");
      downloadLink.href = newsItem.download;
      downloadLink.download = ""; // Per forzare il download
      downloadLink.classList.add("download-icon");
      downloadLink.innerHTML = `<span class="material-icons">download</span>`;
      newsFooter.appendChild(downloadLink);
    }

    // Aggiunta del footer alla news card
    newsCard.appendChild(newsFooter);
    newsContainer.appendChild(newsCard);
  }

  function updatePageInfo() {
    const totalPages = Math.ceil(newsData.length / itemsPerPage);
    pageInfo.textContent = `  Pagina ${currentPage} di ${totalPages}  `;
  }

  // Modificato per navigazione circolare: dalla prima all'ultima pagina
  function prevPage() {
    const totalPages = Math.ceil(newsData.length / itemsPerPage);
    if (currentPage > 1) {
      currentPage--;
    } else {
      // Se siamo alla prima pagina, vai all'ultima
      currentPage = totalPages;
    }
    updatePage();
  }

  // Modificato per navigazione circolare: dall'ultima alla prima pagina
  function nextPage() {
    const totalPages = Math.ceil(newsData.length / itemsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
    } else {
      // Se siamo all'ultima pagina, torna alla prima
      currentPage = 1;
    }
    updatePage();
  }

  function adjustItemsPerPage() {
    // Manteniamo sempre 3 elementi per pagina come richiesto
    itemsPerPage = 3;

    // Aggiorniamo la pagina per applicare le modifiche
    updatePage();

    // Aggiungiamo classi CSS per il layout responsive
    if (window.innerWidth >= 1024)
      newsContainer.className = "news-container pc-view";
    else if (window.innerWidth >= 768)
      newsContainer.className = "news-container tablet-view";
    else newsContainer.className = "news-container mobile-view";
  }

  function addEventListeners() {
    prevButton.addEventListener("click", prevPage);
    nextButton.addEventListener("click", nextPage);
    window.addEventListener("resize", adjustItemsPerPage);
  }

  function init() {
    createPageInfoContainer();
    loadNewsData();
    addEventListeners();
    // Chiamiamo adjustItemsPerPage all'inizializzazione per impostare il layout corretto
    adjustItemsPerPage();
  }

  init();
});
