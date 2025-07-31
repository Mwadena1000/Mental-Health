// Auth button functionality
document.addEventListener('DOMContentLoaded', function() {
  const authButton = document.getElementById('authButton');
  
  if (authButton) {
    updateAuthButton();
    
    authButton.addEventListener('click', function(e) {
      e.preventDefault();
      
      if (isLoggedIn()) {
        // Logout
        if (confirm('Are you sure you want to logout?')) {
          localStorage.removeItem('authToken');
          updateAuthButton();
          // Redirect to homepage after logout
          window.location.href = 'Homepage.html';
        }
      } else {
        // Login
        window.location.href = 'login.html?returnUrl=' + encodeURIComponent(window.location.pathname);
      }
    });
  }
});

function isLoggedIn() {
  return !!localStorage.getItem('authToken');
}

function updateAuthButton() {
  const authButton = document.getElementById('authButton');
  if (authButton) {
    if (isLoggedIn()) {
      authButton.textContent = 'Logout';
      authButton.classList.add('logout');
      authButton.classList.remove('login');
    } else {
      authButton.textContent = 'Login';
      authButton.classList.add('login');
      authButton.classList.remove('logout');
    }
  }
}

// Update auth button when token changes (e.g., after login)
window.addEventListener('storage', function(e) {
  if (e.key === 'authToken') {
    updateAuthButton();
  }
}); 