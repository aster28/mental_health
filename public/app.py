async function send() {
let inputBox = document.getElementById("input");
let chat = document.getElementById("chatbox");

let userText = inputBox.value;

chat.innerHTML += `<div class="msg user">${userText}</div>`;

let res = await fetch("http://localhost:3000/chat", {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({ message: userText })
});

let data = await res.json();

chat.innerHTML += `<div class="msg bot">${data.reply}</div>`;

inputBox.value = "";
}

