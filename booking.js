// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

document.getElementById("bookingForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;
  const message = document.getElementById("message").value.trim();

  // Dummy confirmation message
  const confirmText = `Thank you, ${name}! Your appointment on ${date} at ${time} has been received. We'll contact you at ${email}.`;
  document.getElementById("confirmation").textContent = confirmText;

  // Optionally clear form
  this.reset();
});
