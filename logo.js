// logo.js

// Set whether user is on crisis page
const isCrisisPage = window.location.pathname.endsWith("crisis.html");

// Utility: Check if form is dirty (has input)
function formIsDirty() {
  const form = document.querySelector("form");
  if (!form) return false;
  return Array.from(form.elements).some(el =>
    (el.type === "text" || el.tagName === "TEXTAREA") && el.value.trim() !== ""
  );
}

// Wrap or disable the logo based on conditions
function configureLogoLink() {
  const container = document.getElementById("logo-container");
  if (!container) return;

  // Allowed if not crisis page and not dirty form
  const allowed = !isCrisisPage && !formIsDirty();

  if (allowed) {
    // Create anchor around logo
    const link = document.createElement("a");
    link.href = "index.html";
    link.title = "Go to homepage";
    const logo = container.querySelector(".logo");
    container.replaceChild(link, logo);
    link.appendChild(logo);
  } else {
    // Disable click if any existing anchor
    const anchor = container.querySelector("a");
    if (anchor) {
      const logo = anchor.querySelector(".logo");
      anchor.replaceWith(logo);
    }
  }
}

// Run on page load and on form input changes (to update state dynamically)
window.addEventListener("load", configureLogoLink);
document.addEventListener("input", configureLogoLink);
