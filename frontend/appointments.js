// Check authentication
if (!localStorage.getItem('authToken')) {
  window.location.href = 'login.html?returnUrl=appointments.html';
}

// Set footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Global variables
let allAppointments = [];
let currentFilter = 'all';

// DOM elements
const appointmentsList = document.getElementById('appointmentsList');
const loadingSpinner = document.getElementById('loadingSpinner');
const noAppointments = document.getElementById('noAppointments');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
  loadAppointments();
  setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const filter = this.dataset.filter;
      setActiveFilter(filter);
      filterAppointments(filter);
    });
  });

  // Navigation buttons
  document.getElementById('newBookingBtn').addEventListener('click', () => {
    window.location.href = 'booking.html';
  });

  document.getElementById('bookFirstBtn').addEventListener('click', () => {
    window.location.href = 'booking.html';
  });

  document.getElementById('retryBtn').addEventListener('click', () => {
    loadAppointments();
  });
}

// Load appointments from API
async function loadAppointments() {
  showLoading();
  hideError();
  hideNoAppointments();

  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch('http://localhost:5000/api/booking/my-bookings', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('authToken');
        window.location.href = 'login.html?returnUrl=appointments.html';
        return;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.success) {
      allAppointments = data.bookings || [];
      displayAppointments(allAppointments);
    } else {
      throw new Error(data.message || 'Failed to load appointments');
    }

  } catch (error) {
    console.error('Error loading appointments:', error);
    showError(error.message);
  } finally {
    hideLoading();
  }
}

// Display appointments
function displayAppointments(appointments) {
  if (appointments.length === 0) {
    showNoAppointments();
    return;
  }

  appointmentsList.innerHTML = appointments.map(appointment => 
    createAppointmentCard(appointment)
  ).join('');

  // Add event listeners to cancel buttons
  document.querySelectorAll('.cancel-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const bookingId = this.dataset.bookingId;
      cancelAppointment(bookingId);
    });
  });
}

// Create appointment card HTML
function createAppointmentCard(appointment) {
  const date = new Date(appointment.date);
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const formattedTime = appointment.time;
  const isPast = date < new Date();
  const isCrisis = appointment.isCrisis;
  
  let statusClass = 'status-pending';
  let statusText = 'Pending';
  
  switch(appointment.status) {
    case 'confirmed':
      statusClass = 'status-confirmed';
      statusText = 'Confirmed';
      break;
    case 'cancelled':
      statusClass = 'status-cancelled';
      statusText = 'Cancelled';
      break;
    case 'completed':
      statusClass = 'status-completed';
      statusText = 'Completed';
      break;
  }

  const cardClasses = ['appointment-card'];
  if (isCrisis) cardClasses.push('crisis');
  if (appointment.status === 'cancelled') cardClasses.push('cancelled');
  if (appointment.status === 'completed') cardClasses.push('completed');

  return `
    <div class="${cardClasses.join(' ')}">
      <div class="appointment-header">
        <div>
          <div class="appointment-title">
            Appointment with ${appointment.name}
            ${isCrisis ? '<span class="crisis-badge">Crisis</span>' : ''}
          </div>
          <span class="appointment-status ${statusClass}">${statusText}</span>
        </div>
        ${appointment.status === 'pending' || appointment.status === 'confirmed' ? 
          `<button class="btn-danger cancel-btn" data-booking-id="${appointment._id}">Cancel</button>` : 
          ''
        }
      </div>
      
      <div class="appointment-details">
        <div class="detail-item">
          <span class="detail-label">Date</span>
          <span class="detail-value">${formattedDate}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Time</span>
          <span class="detail-value">${formattedTime}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Email</span>
          <span class="detail-value">${appointment.email}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Booked On</span>
          <span class="detail-value">${new Date(appointment.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
      
      ${appointment.message ? `
        <div class="appointment-message">
          <div class="detail-label">Additional Notes</div>
          <div class="detail-value">${appointment.message}</div>
        </div>
      ` : ''}
    </div>
  `;
}

// Filter appointments
function filterAppointments(filter) {
  const now = new Date();
  
  let filteredAppointments = allAppointments;
  
  switch(filter) {
    case 'upcoming':
      filteredAppointments = allAppointments.filter(apt => {
        const aptDate = new Date(apt.date);
        return aptDate >= now && apt.status !== 'cancelled';
      });
      break;
    case 'past':
      filteredAppointments = allAppointments.filter(apt => {
        const aptDate = new Date(apt.date);
        return aptDate < now && apt.status !== 'cancelled';
      });
      break;
    case 'cancelled':
      filteredAppointments = allAppointments.filter(apt => apt.status === 'cancelled');
      break;
    case 'all':
    default:
      filteredAppointments = allAppointments;
      break;
  }
  
  displayAppointments(filteredAppointments);
}

// Set active filter button
function setActiveFilter(filter) {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
  currentFilter = filter;
}

// Cancel appointment
async function cancelAppointment(bookingId) {
  if (!confirm('Are you sure you want to cancel this appointment?')) {
    return;
  }

  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`http://localhost:5000/api/booking/${bookingId}/cancel`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.success) {
      // Reload appointments to show updated status
      loadAppointments();
      alert('Appointment cancelled successfully');
    } else {
      throw new Error(data.message || 'Failed to cancel appointment');
    }

  } catch (error) {
    console.error('Error cancelling appointment:', error);
    alert('Failed to cancel appointment: ' + error.message);
  }
}

// UI helper functions
function showLoading() {
  loadingSpinner.style.display = 'flex';
  appointmentsList.style.display = 'none';
}

function hideLoading() {
  loadingSpinner.style.display = 'none';
  appointmentsList.style.display = 'grid';
}

function showNoAppointments() {
  noAppointments.style.display = 'block';
  appointmentsList.style.display = 'none';
}

function hideNoAppointments() {
  noAppointments.style.display = 'none';
  appointmentsList.style.display = 'grid';
}

function showError(message) {
  errorText.textContent = message;
  errorMessage.style.display = 'block';
  appointmentsList.style.display = 'none';
}

function hideError() {
  errorMessage.style.display = 'none';
  appointmentsList.style.display = 'grid';
} 