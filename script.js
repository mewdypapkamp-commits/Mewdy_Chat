const chat = document.getElementById("chat");
const nameInput = document.getElementById("username");
const msgInput = document.getElementById("message");
const sendBtn = document.getElementById("send");

function sendMessage() {
    const name = nameInput.value.trim();
    const msg = msgInput.value.trim();

    if (!name || !msg) return;

    const div = document.createElement("div");
    div.className = "message";
    div.innerHTML = `<b>${name}:</b> ${msg}`;

    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;

    msgInput.value = "";
}

sendBtn.addEventListener("click", sendMessage);

msgInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
});
