// Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAez-DASdgHDoHlfU1lPu6QlgOUCHv7tGE",
  authDomain: "mewdychats.firebaseapp.com",
  databaseURL: "https://mewdychats-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "mewdychats",
  storageBucket: "mewdychats.appspot.com",
  messagingSenderId: "297493755800",
  appId: "1:297493755800:web:bc814f25e9b4f3588a1ded"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const chatRef = db.ref("messages");
const auth = firebase.auth();

// элементы
const chat = document.getElementById("chat");
const nameInput = document.getElementById("username");
const msgInput = document.getElementById("message");
const sendBtn = document.getElementById("send");
const imgBtn = document.getElementById("imgBtn");

// 🔐 АНОНИМНЫЙ ВХОД
let currentUID = null;
auth.signInAnonymously().then((user) => {
    currentUID = user.user.uid;
    console.log("UID:", currentUID);
});

// ==================
// ОТПРАВКА СООБЩЕНИЯ
// ==================
function sendMessage() {
    const name = nameInput.value.trim();
    const text = msgInput.value.trim();
    if (!name || !text) return;

    chatRef.push({
        name: name,
        type: "text",
        text: text
    });

    msgInput.value = "";
}

sendBtn.onclick = sendMessage;
msgInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
});

// ==================
// ОТПРАВКА ФОТО ПО URL
// ==================
imgBtn.onclick = () => {
    const url = prompt("Вставь прямую ссылку на фото (jpg/png/webp):");
    const name = nameInput.value.trim();
    if (!url || !name) return;

    chatRef.push({
        name: name,
        type: "image",
        url: url
    });
};

// ==================
// ПОЛУЧЕНИЕ СООБЩЕНИЙ
// ==================
chatRef.limitToLast(100).on("child_added", (snap) => {
    const data = snap.val();
    const div = document.createElement("div");
    div.className = "message";

    if (data.type === "image") {
        div.innerHTML = `<b>${data.name}:</b><br>
                         <img src="${data.url}" width="150" height="150" style="object-fit:cover;border-radius:10px;">`;
    } else {
        div.innerHTML = `<b>${data.name}:</b> ${data.text}`;
    }

    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
});

// ==================
// ЕСЛИ ЧАТ ОЧИЩЕН
// ==================
chatRef.on("value", (snap) => {
    if (!snap.exists()) chat.innerHTML = "";
});
