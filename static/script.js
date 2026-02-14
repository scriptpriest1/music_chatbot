document.getElementById("user-input").addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
});

async function sendMessage() {
  const inputField = document.getElementById("user-input");
  const chatBox = document.getElementById("chat-box");

  const message = inputField.value.trim();
  if (!message) return;

  // Display user message
  chatBox.innerHTML += `
    <div class="message user">
      <div class="inner">${message}</div>
    </div>
  `;

  inputField.value = "";
  chatBox.scrollTop = chatBox.scrollHeight;

  // Show typing indicator
  const typingDiv = document.createElement("div");
  typingDiv.classList.add("message", "bot");
  typingDiv.id = "typing-indicator";
  typingDiv.innerHTML = `
    <div class="inner" style="opacity: 0.5;">Melo is typing</div>
  `;
  chatBox.appendChild(typingDiv);

  let dots = 0;
  const typingInterval = setInterval(() => {
    dots = (dots + 1) % 4;
    typingDiv.querySelector(".inner").innerText =
      "Melo is typing" + ".".repeat(dots);
  }, 500);

  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    // Send to backend
    const response = await fetch("/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();

    // Stop typing animation
    clearInterval(typingInterval);
    typingDiv.remove();

    // Create bot message container
    const botMessage = document.createElement("div");

    if (data.type === "warning") {
      botMessage.classList.add("message", "bot", "warning");
    } else if (data.type === "error") {
      botMessage.classList.add("message", "bot", "error");
    } else {
      botMessage.classList.add("message", "bot");
    }

    const innerDiv = document.createElement("div");
    innerDiv.classList.add("inner");
    innerDiv.textContent = ""; // Start empty for typing animation

    botMessage.appendChild(innerDiv);
    chatBox.appendChild(botMessage);

    chatBox.scrollTop = chatBox.scrollHeight;

    // Animate Melo's response (plain text only)
    typeText(innerDiv, data.reply, chatBox);
  } catch (error) {
    clearInterval(typingInterval);
    typingDiv.remove();
    console.error("Error:", error);
  }
}

// Typing animation function
function typeText(element, text, chatBox, speed = 18) {
  let index = 0;

  function type() {
    if (index < text.length) {
      element.textContent += text.charAt(index);
      index++;
      chatBox.scrollTop = chatBox.scrollHeight;
      setTimeout(type, speed);
    }
  }

  type();
}
