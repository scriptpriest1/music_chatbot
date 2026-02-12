async function sendMessage() {
  const inputField = document.getElementById("user-input");
  const chatBox = document.getElementById("chat-box");

  const message = inputField.value.trim();
  if (!message) return;

  // Display user message
  chatBox.innerHTML += `<div class="message user">You: ${message}</div>`;

  inputField.value = "";

  // Send to backend
  const response = await fetch("/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  const data = await response.json();

  // Display bot reply
  chatBox.innerHTML += `<div class="message bot">Bot: ${data.reply}</div>`;

  chatBox.scrollTop = chatBox.scrollHeight;
}
