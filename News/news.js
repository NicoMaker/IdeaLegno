document.addEventListener("DOMContentLoaded", () => {
  const newsContainer = document.querySelector("#news-container"),
    prevButton = createNavButton("arrow_back", "prev"),
    nextButton = createNavButton("arrow_forward", "next"),
    pageInfo = document.createElement("span");

  pageInfo.id = "page-info"; // Aggiunto id per riferimento in CSS e JS
  let newsData = [],
    currentPage = 1,
    itemsPerPage = 3;

  // Funzione per creare i bottoni di navigazione
  function createNavButton(icon, className) {
    const button = document.createElement("button");
    button.innerHTML = `<span class='material-icons'>${icon}</span>`;
    button.classList.add("nav-button", className);
    return button;
  }

  // Funzione per creare il contenitore della pagina
  function createPageInfoContainer() {
    const pageInfoContainer = document.createElement("div");
    pageInfoContainer.classList.add("page-info-container");
    pageInfoContainer.appendChild(prevButton);
    pageInfoContainer.appendChild(pageInfo);
    pageInfoContainer.appendChild(nextButton);
    newsContainer.parentElement.appendChild(pageInfoContainer);
  }

  // Funzione per caricare i dati dal JSON
  function loadNewsData() {
    fetch("News/news.json")
      .then(handleResponse)
      .then(handleData)
      .catch(handleError);
  }

  // Funzione per gestire la risposta JSON
  function handleResponse(response) {
    if (!response.ok) throw new Error(`Errore HTTP: ${response.status}`);
    return response.json();
  }

  // Funzione per gestire i dati ricevuti
  function handleData(data) {
    if (!data.news) throw new Error("Formato JSON non valido");
    newsData = data.news;
    updatePage();
  }

  // Funzione per gestire gli errori
  function handleError(error) {
    console.error("Errore nel caricamento delle news:", error);
    newsContainer.innerHTML = "<p>Impossibile caricare le news.</p>";
  }

  // Funzione per aggiornare la pagina
  function updatePage() {
    clearNewsContainer();
    const paginatedItems = getPaginatedItems();
    paginatedItems.forEach(createNewsCard);
    updateButtonsVisibility();
    updatePageInfo();
  }

  // Funzione per svuotare il contenitore delle notizie
  const clearNewsContainer = () => (newsContainer.innerHTML = "");

  // Funzione per ottenere gli elementi della pagina corrente
  function getPaginatedItems() {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return newsData.slice(start, end);
  }

  // Funzione per creare una card di notizia
  function createNewsCard(newsItem) {
    const newsCard = document.createElement("div");
    newsCard.classList.add("news-card");
    newsCard.innerHTML = `
      <img src="${newsItem.immagine}" alt="${newsItem.titolo}">
      <h3>${newsItem.titolo}</h3>
      <p>${newsItem.descrizione}</p>
      <span class="news-date">${newsItem.data}</span>
    `;
    newsContainer.appendChild(newsCard);
  }

  // Funzione per aggiornare la visibilità dei pulsanti
  function updateButtonsVisibility() {
    prevButton.style.visibility = currentPage > 1 ? "visible" : "hidden";
    nextButton.style.visibility =
      currentPage * itemsPerPage < newsData.length ? "visible" : "hidden";
  }

  // Funzione per aggiornare le informazioni della pagina
  function updatePageInfo() {
    const totalPages = Math.ceil(newsData.length / itemsPerPage);
    pageInfo.textContent = ` Pagina ${currentPage} di ${totalPages} `;
  }

  // Funzione per navigare alla pagina precedente
  function prevPage() {
    if (currentPage > 1) {
      currentPage--;
      updatePage();
    }
  }

  // Funzione per navigare alla pagina successiva
  function nextPage() {
    if (currentPage * itemsPerPage < newsData.length) {
      currentPage++;
      updatePage();
    }
  }

  // Funzione per adattare il numero di elementi per pagina in base alla larghezza dello schermo
  function adjustItemsPerPage() {
    if (window.innerWidth >= 1024) itemsPerPage = 3;
    else if (window.innerWidth >= 768) itemsPerPage = 2;
    else itemsPerPage = 1;
    updatePage();
  }

  // Aggiungere gli event listener
  function addEventListeners() {
    prevButton.addEventListener("click", prevPage);
    nextButton.addEventListener("click", nextPage);
    window.addEventListener("resize", adjustItemsPerPage);
  }

  // Funzione di inizializzazione
  function init() {
    createPageInfoContainer();
    loadNewsData();
    addEventListeners();
  }

  // Avvio dell'app
  init();
});
