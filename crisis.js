// Auto-update footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Optional: show alert guidance if user navigates via your nav
window.addEventListener("load", () => {
  const params = new URLSearchParams(location.search);
  if (params.has("fromBooking") && params.get("fromBooking") === "crisis") {
    alert("Redirected to Crisis Help: If this is urgent, please call one of the numbers listed above.");
  }
});
