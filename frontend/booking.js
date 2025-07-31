if (!localStorage.getItem('authToken')) {
  window.location.href = `login.html?returnUrl=booking.html`;
}

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

// Real-time lowercase conversion for email input
document.getElementById("email").addEventListener("input", function() {
  this.value = this.value.toLowerCase();
});

// Submit handler
document.getElementById("bookingForm").addEventListener("submit", async function(e) {
  e.preventDefault();
  if (!this.checkValidity()) {
    this.reportValidity();
    return;
  }

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim().toLowerCase();
  const date = dateInput.value;
  const time = timeInput.value;
  const message = messageInput.value.trim();

  // Get auth token
  const token = localStorage.getItem('authToken');
  if (!token) {
    alert('Please log in to book an appointment.');
    window.location.href = 'login.html?returnUrl=booking.html';
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/booking/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name,
        email,
        date,
        time,
        message
      })
    });

    const data = await response.json();

    if (data.success) {
      document.getElementById("confirmation").innerHTML = `
        <div style="color: green; padding: 1rem; background: #e8f5e8; border-radius: 8px; margin-top: 1rem;">
          <h3>✅ Booking Confirmed!</h3>
          <p>Thank you, ${name}! Your appointment on ${date} at ${time} has been booked successfully.</p>
          <p>We'll contact you at ${email} to confirm details.</p>
          ${data.booking.isCrisis ? '<p><strong>⚠️ Crisis booking detected - we will prioritize your appointment.</strong></p>' : ''}
        </div>
      `;
      
      this.reset();
      dateInput.min = formatDateISO(new Date());
      dateInput.value = formatDateISO(new Date());
    } else {
      document.getElementById("confirmation").innerHTML = `
        <div style="color: red; padding: 1rem; background: #ffe8e8; border-radius: 8px; margin-top: 1rem;">
          <h3>❌ Booking Failed</h3>
          <p>${data.message || 'Failed to create booking. Please try again.'}</p>
        </div>
      `;
    }
  } catch (error) {
    console.error('Booking error:', error);
    document.getElementById("confirmation").innerHTML = `
      <div style="color: red; padding: 1rem; background: #ffe8e8; border-radius: 8px; margin-top: 1rem;">
        <h3>❌ Connection Error</h3>
        <p>Failed to connect to server. Please check your connection and try again.</p>
      </div>
    `;
  }
});
