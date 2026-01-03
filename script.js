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

// 🔐 АНОНИМНЫЙ ВХОД
let currentUID = null;
auth.signInAnonymously().then((user) => {
    currentUID = user.user.uid;
    console.log("Ваш UID:", currentUID);
});

// Задаём UID администратора
const ADMIN_UID = "ВАШ_ADMIN_UID_ЗДЕСЬ"; // <-- замените на свой UID

// ==================
// ОТПРАВКА
// ==================
function sendMessage() {
    const name = nameInput.value.trim();
    const text = msgInput.value.trim();
    if (!name || !text) return;

    // 🔹 Команда очистки (только для админа)
    if (text === "/clear") {
        if (currentUID === ADMIN_UID) {
            chatRef.remove();
            msgInput.value = "";
        } else {
            alert("Только админ может очистить чат!");
        }
        return;
    }

    // обычное сообщение
    chatRef.push({
        name: name,
        text: text,
        time: Date.now()
    });

    msgInput.value = "";
}

sendBtn.onclick = sendMessage;
msgInput.addEventListener("keydown", e => { if(e.key === "Enter") sendMessage(); });

// ==================
// ПОЛУЧЕНИЕ СООБЩЕНИЙ
// ==================
chatRef.limitToLast(100).on("child_added", snap => {
    const data = snap.val();
    const div = document.createElement("div");
    div.className = "message";

    if (data.text.startsWith("img:")) {
        const url = data.text.slice(4).trim();
        div.innerHTML = `<b>${data.name}:</b><br>
                         <img src="${url}" width="150" height="150" style="object-fit:cover;border-radius:10px;">`;
    } else {
        div.innerHTML = `<b>${data.name}:</b> ${data.text}`;
    }

    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
});

// ==================
// ЕСЛИ ЧАТ ОЧИЩЕН
// ==================
chatRef.on("value", snap => { if (!snap.exists()) chat.innerHTML = ""; });
