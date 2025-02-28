document.addEventListener("DOMContentLoaded", () => {
  const newsContainer = document.querySelector("#news-container"),
    prevButton = createNavButton("arrow_back", "prev"),
    nextButton = createNavButton("arrow_forward", "next"),
    pageInfo = document.createElement("span");

  pageInfo.id = "page-info"; // Aggiunto id per riferimento in CSS e JS
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
    newsContainer.innerHTML = "<p>Impossibile caricare le news.</p>";
  }

  function updatePage() {
    clearNewsContainer();
    const paginatedItems = getPaginatedItems();
    paginatedItems.forEach(createNewsCard);
    updateButtonsVisibility();
    updatePageInfo();
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
        <img class="immagine" src="${newsItem.immagine}" alt="${newsItem.titolo}">
      </div>
      <h3>${newsItem.titolo}</h3>
      <p>${newsItem.descrizione}
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

  function updateButtonsVisibility() {
    prevButton.style.visibility = currentPage > 1 ? "visible" : "hidden";
    nextButton.style.visibility =
      currentPage * itemsPerPage < newsData.length ? "visible" : "hidden";
  }

  function updatePageInfo() {
    const totalPages = Math.ceil(newsData.length / itemsPerPage);
    pageInfo.textContent = `  Pagina ${currentPage} di ${totalPages}  `;
  }

  function prevPage() {
    if (currentPage > 1) {
      currentPage--;
      updatePage();
    }
  }

  function nextPage() {
    if (currentPage * itemsPerPage < newsData.length) {
      currentPage++;
      updatePage();
    }
  }

  function adjustItemsPerPage() {
    if (window.innerWidth >= 1024) itemsPerPage = 3;
    else if (window.innerWidth >= 768) itemsPerPage = 2;
    else itemsPerPage = 1;
    updatePage();
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
  }

  init();
});
