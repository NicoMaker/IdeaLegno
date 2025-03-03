document.addEventListener("DOMContentLoaded", () => {
    const cookieBanner = document.getElementById("cookie-banner"),
      acceptCookies = document.getElementById("accept-cookies"),
      declineCookies = document.getElementById("decline-cookies");
  
    if (!cookieBanner || !acceptCookies || !declineCookies) {
      console.error("Elementi cookie non trovati!");
      return;
    }
  
    // Controlla lo stato dei cookie
    const cookiesAccepted = localStorage.getItem("cookiesAccepted");
  
    if (cookiesAccepted === "true") {
      acceptCookies.style.display = "none"; // Nasconde il tasto "Accetta"
      cookieBanner.style.display = "flex";
    } else if (cookiesAccepted === "false") 
      window.location.href = "index.html"; // Reindirizza alla pagina di avviso
    else 
      cookieBanner.style.display = "flex";
  
    // Accetta i cookie
    acceptCookies.addEventListener("click", () => {
      localStorage.setItem("cookiesAccepted", "true");
      acceptCookies.style.display = "none"; // Nasconde il tasto "Accetta"
      cookieBanner.style.display = "flex";
    });
  
    // Rifiuta i cookie
    declineCookies.addEventListener("click", () => {
      localStorage.setItem("cookiesAccepted", "false");
      window.location.href = "cookie-avviso.html";
    });
  });
  