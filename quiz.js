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

  const q1 = parseInt(document.querySelector('input[name="q1"]:checked').value);
  const q2 = parseInt(document.querySelector('input[name="q2"]:checked').value);
  const q3 = parseInt(document.querySelector('input[name="q3"]:checked').value);
  const total = q1 + q2 + q3;

  let resultText = "";
  if (total >= 7) {
    resultText = "You may be experiencing high stress. Consider talking to a counselor.";
  } else if (total >= 5) {
    resultText = "You have moderate stress. Try coping techniques and self‑care.";
  } else {
    resultText = "Your stress levels appear low. Keep practicing good habits!";
  }

  currentAnswers = { q1, q2, q3, total };
  document.getElementById("result").textContent = resultText;
});

// Handle "Save My Results" button click
document.getElementById("saveResults").addEventListener("click", function() {
  if (!currentAnswers) {
    alert("Please complete the quiz and view your result before saving.");
    return;
  }

  if (!isLoggedIn()) {
    // redirect to login, with return URL to this page
    window.location.href = `login.html?returnUrl=quiz.html`;
    return;
  }

  // Send to backend API
  fetch('/api/quiz/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('authToken')
    },
    body: JSON.stringify(currentAnswers)
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      alert("Your quiz results have been saved successfully.");
    } else {
      alert(data.message || "Failed to save results.");
    }
  })
  .catch(err => {
    console.error(err);
    alert("Error connecting to the server; unable to save results.");
  });
});
