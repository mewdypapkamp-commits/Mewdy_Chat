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
let isAdmin = false;
const ADMIN_UID = "Ngr2rPIextdZfGJm8dD3dTyVVg92"; // <-- твой UID

auth.signInAnonymously().then(user => {
    currentUID = user.user.uid;
    isAdmin = currentUID === ADMIN_UID;
    console.log("Ваш UID:", currentUID);
    if(isAdmin) console.log("Вы админ ✅");
});

// ==================
// ОТПРАВКА
// ==================
function sendMessage() {
    const name = nameInput.value.trim();
    const text = msgInput.value.trim();
    if (!name || !text) return;

    const cleanText = text.trim();

    // 🔹 Очистка только для админа
    if (cleanText === "/clear") {
        if(isAdmin){
            chatRef.remove()
            .then(() => console.log("Чат очищен админом"))
            .catch(err => console.error("Ошибка очистки:", err));
        } else {
            alert("Только админ может очистить чат!");
        }
        msgInput.value = "";
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

    // img: обработка
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
chatRef.on("value", snap => {
    if (!snap.exists()) chat.innerHTML = "";
});
