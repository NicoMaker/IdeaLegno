document.addEventListener("DOMContentLoaded", () => {
  const cookieBanner = document.getElementById("cookie-banner");
  const acceptButton = document.getElementById("accept-cookies");
  const declineButton = document.getElementById("decline-cookies");
  const revokeButton = document.getElementById("revoke-cookies");

  // Check if cookies are already accepted
  const cookiesAccepted = localStorage.getItem("cookiesAccepted");

  // Show the appropriate elements based on cookie status
  if (cookiesAccepted === "true") {
    cookieBanner.classList.remove("show");
    revokeButton.style.display = "block";
  } else if (cookiesAccepted === "false") {
    cookieBanner.classList.remove("show");
    revokeButton.style.display = "block";
  } else {
    // First visit, show the banner with animation
    setTimeout(() => {
      cookieBanner.classList.add("show");
    }, 1000);
  }

  // Accept cookies
  acceptButton.addEventListener("click", () => {
    localStorage.setItem("cookiesAccepted", "true");
    cookieBanner.classList.remove("show");
    revokeButton.style.display = "block";

    // Here you would typically initialize iubenda or other cookie scripts
    initializeIubenda();
  });

  // Decline cookies
  declineButton.addEventListener("click", () => {
    localStorage.setItem("cookiesAccepted", "false");
    cookieBanner.classList.remove("show");
    revokeButton.style.display = "block";
  });

  // Revoke cookies
  revokeButton.addEventListener("click", () => {
    localStorage.removeItem("cookiesAccepted");
    cookieBanner.classList.add("show");
    revokeButton.style.display = "none";
  });

  // Initialize iubenda
  function initializeIubenda() {
    // This is where you would add the iubenda initialization code
    // Example:
    // var _iub = _iub || [];
    // _iub.csConfiguration = {
    //   cookiePolicyId: 12345678,
    //   siteId: 87654321,
    //   lang: 'it'
    // };
    console.log("Iubenda initialized");
  }
});
