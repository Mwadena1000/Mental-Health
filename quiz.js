// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

document.getElementById("quizForm").addEventListener("submit", function(e) {
  e.preventDefault();

  let q1 = parseInt(document.querySelector('input[name="q1"]:checked').value);
  let q2 = parseInt(document.querySelector('input[name="q2"]:checked').value);
  let q3 = parseInt(document.querySelector('input[name="q3"]:checked').value);

  let total = q1 + q2 + q3;

  let resultText = "";

  if (total >= 7) {
    resultText = "You may be experiencing high stress. Consider talking to a counselor.";
  } else if (total >= 5) {
    resultText = "You have moderate stress. Try coping techniques and self-care.";
  } else {
    resultText = "Your stress levels appear low. Keep practicing good habits!";
  }

  document.getElementById("result").textContent = resultText;
});
