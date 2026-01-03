// ================= FIREBASE =================
const firebaseConfig = {
  apiKey: "AIzaSyAez-DASdgHDoHlfU1lPu6QlgOUCHv7tGE",
  authDomain: "mewdychats.firebaseapp.com",
  databaseURL: "https://mewdychats-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "mewdychats",
  storageBucket: "mewdychats.firebasestorage.app",
  messagingSenderId: "297493755800",
  appId: "1:297493755800:web:bc814f25e9b4f3588a1ded"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const chatRef = db.ref("messages");
firebase.auth().signInAnonymously();

// ================= ELEMENTS =================
const chat = document.getElementById("chat");
const nameInput = document.getElementById("username");
const msgInput = document.getElementById("message");
const sendBtn = document.getElementById("send");
const imgBtn = document.getElementById("imgBtn");

// ================= SEND =================
function sendMessage() {
    const name = nameInput.value.trim();
    const text = msgInput.value.trim();
    if (!name || !text) return;

    chatRef.push({
        name: name,
        text: text,
        time: Date.now()
    });

    msgInput.value = "";
}

sendBtn.addEventListener("click", sendMessage);
msgInput.addEventListener("keydown", e => { if (e.key === "Enter") sendMessage(); });

// ================= IMAGE URL =================
imgBtn.addEventListener("click", () => {
    const url = prompt("Вставь прямую ссылку на фото (jpg/png/webp):");
    const name = nameInput.value.trim();
    if (!url || !name) return;

    chatRef.push({
        name: name,
        text: "img:" + url,
        time: Date.now()
    });
});

// ================= RECEIVE =================
chatRef.limitToLast(100).on("child_added", snapshot => {
    const data = snapshot.val();
    const div = document.createElement("div");
    div.className = "message";

    if (data.text && data.text.startsWith("img:")) {
        const url = data.text.slice(4).trim();
        div.innerHTML = `
            <b>${data.name}:</b><br>
            <img src="${url}" width="150" height="150"
                 style="object-fit:cover;border-radius:10px;">
        `;
    } else {
        div.innerHTML = `<b>${data.name}:</b> ${data.text}`;
    }

    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
});
