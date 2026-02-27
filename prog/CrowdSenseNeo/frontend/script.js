const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

/* =========================
   SESSION + MODE
========================= */
let sessionId = localStorage.getItem("session_id") || "web-session-1";
let currentMode = "normal";

/* =========================
   ADD MESSAGE (Instant)
========================= */
function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.innerText = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

/* =========================
   TYPEWRITER EFFECT
========================= */
function typeWriter(text, speed = 15) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message", "assistant");
  chatBox.appendChild(msgDiv);

  let i = 0;

  function typing() {
    if (i < text.length) {
      msgDiv.textContent += text.charAt(i);
      i++;
      chatBox.scrollTop = chatBox.scrollHeight;
      setTimeout(typing, speed);
    }
  }

  typing();
}

/* =========================
   MODE SWITCHING (Optional)
========================= */
function setMode(mode) {
  currentMode = mode;
  console.log("Mode set to:", mode);
}

/* =========================
   SEND MESSAGE
========================= */
async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, "user");
  input.value = "";

  try {
    const res = await fetch("http://localhost:8000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query: text,
        session_id: sessionId
      })
    });

    const data = await res.json();

    // Save session ID if backend returns one
    if (data.session_id) {
      sessionId = data.session_id;
      localStorage.setItem("session_id", sessionId);
    }

    // Emotion glow (if backend supports it)
    if (data.emotion) {
      document.body.classList.remove("normal", "angry", "emergency");
      document.body.classList.add(data.emotion);
    }

    // Show AI reply
    typeWriter(data.answer || data.reply);

  } catch (err) {
    addMessage("Server not responding ⚠️", "assistant");
    console.error(err);
  }
}

/* =========================
   EVENTS
========================= */
sendBtn.addEventListener("click", sendMessage);

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendMessage();
  }
});
