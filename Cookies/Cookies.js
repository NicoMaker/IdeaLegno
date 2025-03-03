document.addEventListener("DOMContentLoaded", () => {
  const cookieBanner = document.getElementById("cookie-banner"),
    acceptCookies = document.getElementById("accept-cookies"),
    declineCookies = document.getElementById("decline-cookies"),
    revokeCookies = document.getElementById("revoke-cookies");

  // Controlla lo stato dei cookie
  const cookiesAccepted = localStorage.getItem("cookiesAccepted");

  if (cookiesAccepted === null) {
    cookieBanner.style.display = "flex"; // Mostra la barra cookie
    revokeCookies.style.display = "none"; // Nasconde il pulsante di modifica
  } else {
    cookieBanner.style.display = "none"; // Nasconde il banner se l'utente ha già scelto
    revokeCookies.style.display = "block"; // Mostra il pulsante di modifica
  }

  // Accetta i cookie
  acceptCookies.addEventListener("click", () => {
    localStorage.setItem("cookiesAccepted", "true");
    cookieBanner.style.display = "none";
    revokeCookies.style.display = "block"; // Mostra il pulsante di modifica
  });

  // Rifiuta i cookie
  declineCookies.addEventListener("click", () => {
    localStorage.setItem("cookiesAccepted", "false");
    cookieBanner.style.display = "none";
    revokeCookies.style.display = "block"; // Mostra il pulsante di modifica
  });

  // Revoca la scelta e mostra il banner di nuovo
  revokeCookies.addEventListener("click", () => {
    localStorage.removeItem("cookiesAccepted"); // Rimuove la scelta salvata
    cookieBanner.style.display = "flex"; // Mostra di nuovo il banner
    revokeCookies.style.display = "none"; // Nasconde il pulsante di modifica
  });
});
