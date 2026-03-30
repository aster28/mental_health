async function send() {
let inputBox = document.getElementById("input");
let chat = document.getElementById("chatbox");

let userText = inputBox.value.trim();
if (!userText) return;

// Show user message
chat.innerHTML += `<div class="msg user">${userText}</div>`;

// Send to backend
let res = await fetch("/chat", {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({ message: userText })
});

let data = await res.json();

// Show bot reply
chat.innerHTML += `<div class="msg bot">${data.reply}</div>`;

// Auto scroll
chat.scrollTop = chat.scrollHeight;

inputBox.value = "";
}

