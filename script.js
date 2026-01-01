function sendMessage() {
    const name = document.getElementById("username").value.trim();
    const message = document.getElementById("message").value.trim();
    const chat = document.getElementById("chat");

    if (name === "" || message === "") return;

    const msgDiv = document.createElement("div");
    msgDiv.className = "message";
    msgDiv.innerHTML = `<span>${name}:</span> ${message}`;

    chat.appendChild(msgDiv);

    chat.scrollTop = chat.scrollHeight;
    document.getElementById("message").value = "";
}
