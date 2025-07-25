// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Format date as YYYY-MM-DD
function formatDateISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth()+1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

const dateInput = document.getElementById("date");
const messageInput = document.getElementById("message");

// Set initial min
dateInput.min = formatDateISO(new Date());
dateInput.value = formatDateISO(new Date());

// Helper: detect crisis keywords in message
function isCrisis(text) {
  if (!text) return false;
  const lower = text.toLowerCase();
  return ['emergency','crisis','suicide'].some(w => lower.includes(w));
}

// Disable weekends on input unless crisis allowed
dateInput.addEventListener("input", function(e) {
  const selected = new Date(this.value);
  const day = selected.getDay(); // 0=Sunday,6=Saturday
  const allowWeekend = isCrisis(messageInput.value);

  if ([0,6].includes(day) && !allowWeekend) {
    this.value = '';
    this.setCustomValidity("Weekends not allowed unless marked as crisis.");
    this.reportValidity();
  } else {
    this.setCustomValidity("");
  }
});

// Re-validate whenever note changes
messageInput.addEventListener("input", function() {
  if (dateInput.value) {
    const selected = new Date(dateInput.value);
    const day = selected.getDay();
    const allow = isCrisis(this.value);
    if ([0,6].includes(day) && !allow) {
      dateInput.setCustomValidity("Weekends not allowed unless marked as crisis.");
    } else {
      dateInput.setCustomValidity("");
    }
  }
});

// Submit handler
document.getElementById("bookingForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const date = dateInput.value;
  const time = document.getElementById("time").value;
  const msg = messageInput.value.trim();

  // Final weekend check
  const day = new Date(date).getDay();
  if ([0,6].includes(day) && !isCrisis(msg)) {
    alert("Weekend booking only allowed if note contains emergency, crisis, or suicide.");
    return;
  }

  document.getElementById("confirmation").textContent =
    `Thank you, ${name}! Your appointment on ${date} at ${time} has been received. We'll contact you at ${email}.`;

  this.reset();
  dateInput.min = formatDateISO(new Date());
  dateInput.value = formatDateISO(new Date());
});
