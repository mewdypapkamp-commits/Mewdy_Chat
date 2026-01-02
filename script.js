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
const storage = firebase.storage();
const auth = firebase.auth();

// элементы
const chat = document.getElementById("chat");
const nameInput = document.getElementById("username");
const msgInput = document.getElementById("message");
const sendBtn = document.getElementById("send");
const imgBtn = document.getElementById("imgBtn");
const imageInput = document.getElementById("imageInput");

// 🔐 АНОНИМНЫЙ ВХОД
let currentUID = null;

auth.signInAnonymously().then((user) => {
    currentUID = user.user.uid;
    console.log("UID:", currentUID);
});

// ==================
// ОТПРАВКА
// ==================
function sendMessage() {
    const name = nameInput.value.trim();
    const text = msgInput.value.trim();

    if (!name || !text) return;

    // 🧹 КОМАНДА ОЧИСТКИ (ТОЛЬКО АДМИН)
    if (text === "/clear") {
        chatRef.remove(); // Firebase сам проверит — админ или нет
        msgInput.value = "";
        return;
    }

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
// КАРТИНКИ
// ==================
imgBtn.onclick = () => imageInput.click();

imageInput.onchange = () => {
    const file = imageInput.files[0];
    const name = nameInput.value.trim();
    if (!file || !name) return;

    const ref = storage.ref("images/" + Date.now() + "_" + file.name);

    ref.put(file).then(() => {
        ref.getDownloadURL().then((url) => {
            chatRef.push({
                name: name,
                type: "image",
                url: url
            });
        });
    });

    imageInput.value = "";
};

// ==================
// ПОЛУЧЕНИЕ
// ==================
chatRef.limitToLast(100).on("child_added", (snap) => {
    const data = snap.val();
    const div = document.createElement("div");
    div.className = "message";

    if (data.type === "image") {
        div.innerHTML = `<b>${data.name}:</b><br>
        <img src="${data.url}" width="150" height="150">`;
    } else {
        div.innerHTML = `<b>${data.name}:</b> ${data.text}`;
    }

    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
});

chatRef.on("value", (snap) => {
    if (!snap.exists()) chat.innerHTML = "";
});
