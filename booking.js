// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

function formatDateISO(d) {
  const y = d.getFullYear(), m = String(d.getMonth()+1).padStart(2, '0'), dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

const dateInput = document.getElementById("date");
const timeInput = document.getElementById("time");
const messageInput = document.getElementById("message");

// Set date min to today
const today = new Date();
dateInput.min = formatDateISO(today);
dateInput.value = formatDateISO(today);

// Set default time window to 09:00–17:00
timeInput.min = "09:00";
timeInput.max = "17:00";

// Check for crisis in notes
function isCrisis(txt) {
  return txt && ['emergency','crisis','suicide'].some(w => txt.toLowerCase().includes(w));
}

// Validate date selection: weekend not allowed unless crisis
dateInput.addEventListener("input", () => {
  const sel = new Date(dateInput.value);
  const isWeekend = [0,6].includes(sel.getDay());
  if (isWeekend && !isCrisis(messageInput.value)) {
    dateInput.setCustomValidity("Weekends not allowed unless marked as crisis.");
  } else {
    dateInput.setCustomValidity("");
  }
});

// Validate time: outside hours only if crisis
timeInput.addEventListener("input", () => {
  const t = timeInput.value;
  if (t && (t < timeInput.min || t > timeInput.max) && !isCrisis(messageInput.value)) {
    timeInput.setCustomValidity("Time must be within 09:00–17:00 unless marked as crisis.");
  } else {
    timeInput.setCustomValidity("");
  }
});

// Re-validate on message change
messageInput.addEventListener("input", () => {
  dateInput.dispatchEvent(new Event("input"));
  timeInput.dispatchEvent(new Event("input"));
});

// Submit handler
document.getElementById("bookingForm").addEventListener("submit", function(e) {
  e.preventDefault();
  if (!this.checkValidity()) {
    this.reportValidity();
    return;
  }
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const date = dateInput.value;
  const time = timeInput.value;

  document.getElementById("confirmation").textContent =
    `Thank you, ${name}! Your appointment on ${date} at ${time} has been received. We'll contact you at ${email}.`;

  this.reset();
  dateInput.min = formatDateISO(new Date());
});
