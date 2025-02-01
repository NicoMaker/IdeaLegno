document.addEventListener("DOMContentLoaded", () => {
  const newsContainer = document.querySelector("#news-container");

  // Svuotiamo il contenitore delle notizie prima di aggiungere nuovi elementi
  newsContainer.innerHTML = "";

  fetch("News/news.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Errore HTTP: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (!data.news) throw new Error("Formato JSON non valido");

      // Aggiungi un controllo per evitare duplicati
      if (newsContainer.children.length > 0) {
        newsContainer.innerHTML = ""; // Svuota solo se già esistono notizie
      }

      // Carica i nuovi articoli
      data.news.forEach((newsItem) => {
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
    })
    .catch((error) => {
      console.error("Errore nel caricamento delle news:", error);
      newsContainer.innerHTML = "<p>Impossibile caricare le news.</p>";
    });
});
