// Check authentication - redirect to login if not authenticated
if (!localStorage.getItem('authToken')) {
  window.location.href = 'login.html?returnUrl=quiz.html';
}

// Set footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Helper: check if user is authenticated
function isLoggedIn() {
  return !!localStorage.getItem('authToken');
}

// Store the latest computed answers globally
let currentAnswers = null;

// Handle form submission (compute stress result)
document.getElementById("quizForm").addEventListener("submit", function(e) {
  e.preventDefault();

  // Check if all questions are answered
  const q1Element = document.querySelector('input[name="q1"]:checked');
  const q2Element = document.querySelector('input[name="q2"]:checked');
  const q3Element = document.querySelector('input[name="q3"]:checked');

  if (!q1Element || !q2Element || !q3Element) {
    alert("Please answer all questions before submitting.");
    return;
  }

  const q1 = parseInt(q1Element.value);
  const q2 = parseInt(q2Element.value);
  const q3 = parseInt(q3Element.value);
  const total = q1 + q2 + q3;

  let resultText = "";
  let resultLevel = "";
  
  if (total >= 7) {
    resultText = "You may be experiencing high stress. Consider talking to a counselor.";
    resultLevel = "high";
  } else if (total >= 5) {
    resultText = "You have moderate stress. Try coping techniques and self‑care.";
    resultLevel = "moderate";
  } else {
    resultText = "Your stress levels appear low. Keep practicing good habits!";
    resultLevel = "low";
  }

  currentAnswers = { q1, q2, q3, total, resultLevel };
  document.getElementById("result").textContent = resultText;
  
  // Show the save button after results are computed
  document.getElementById("saveResults").style.display = "block";
});

// Handle "Save My Results" button click
document.getElementById("saveResults").addEventListener("click", async function() {
  if (!currentAnswers) {
    alert("Please complete the quiz and view your result before saving.");
    return;
  }

  // Double-check authentication (in case token expired)
  if (!isLoggedIn()) {
    localStorage.removeItem('authToken');
    window.location.href = 'login.html?returnUrl=quiz.html';
    return;
  }

  // Disable button and show loading state
  const saveBtn = this;
  const originalText = saveBtn.textContent;
  saveBtn.textContent = "Saving...";
  saveBtn.disabled = true;

  try {
    // Send to backend API
    const response = await fetch('http://localhost:5000/api/quiz/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('authToken')
      },
      body: JSON.stringify(currentAnswers)
    });

    const data = await response.json();

    if (response.ok && data.success) {
      alert("Your quiz results have been saved successfully!");
      // Optionally hide the save button after successful save
      saveBtn.style.display = "none";
    } else {
      // Handle different error cases
      if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('authToken');
        alert("Your session has expired. Please log in again.");
        window.location.href = 'login.html?returnUrl=quiz.html';
      } else {
        alert(data.message || "Failed to save results. Please try again.");
      }
    }
  } catch (error) {
    console.error('Error saving quiz results:', error);
    alert("Error connecting to the server. Please check your internet connection and try again.");
  } finally {
    // Restore button state
    saveBtn.textContent = originalText;
    saveBtn.disabled = false;
  }
});

// Hide save button initially
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById("saveResults").style.display = "none";
});
