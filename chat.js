// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

const chatBox = document.getElementById("chat-box");
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");

chatForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const userMessage = userInput.value.trim();
  if (userMessage === "") return;

  // Add user message
  addMessage(userMessage, "user");

  // Dummy bot reply
  setTimeout(() => {
    addMessage(dummyBotReply(userMessage), "bot");
  }, 600);

  userInput.value = "";
});

// Add message to chat box
function addMessage(message, sender) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("chat-message", sender);
  msgDiv.textContent = message;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Very simple dummy bot logic
function dummyBotReply(userMessage) {
  const lower = userMessage.toLowerCase();
  if (lower.includes("hello") || lower.includes("hi")) {
    return "Hello! How can I support you today?";
  } else if (lower.includes("stress")) {
    return "I'm here for you. Would you like some coping tips?";
  } else if (lower.includes("thank")) {
    return "You're welcome. Remember, you are not alone.";
  } else {
    return "Thank you for sharing. Tell me more...";
  }
}
