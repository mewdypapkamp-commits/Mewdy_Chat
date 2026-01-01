// Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAez-DASdgHDoHlfU1lPu6QlgOUCHv7tGE",
  authDomain: "mewdychats.firebaseapp.com",
  databaseURL: "https://mewdychats-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "mewdychats",
  storageBucket: "mewdychats.firebasestorage.app",
  messagingSenderId: "297493755800",
  appId: "1:297493755800:web:bc814f25e9b4f3588a1ded",
  measurementId: "G-W19BCQ8LED"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.database();
const chatRef = db.ref("messages");

const chat = document.getElementById("chat");
const nameInput = document.getElementById("username");
const msgInput = document.getElementById("message");
const sendBtn = document.getElementById("send");

// ОТПРАВКА
function sendMessage() {
    const name = nameInput.value.trim();
    const text = msgInput.value.trim();

    if (!name || !text) return;

    // clear
    if (name === "ClearChats" && text === "1746284859274758clear") {
        chatRef.remove();
        chat.innerHTML = "";
        msgInput.value = "";
        return;
    }

    //сообщение
    chatRef.push({
        name: name,
        text: text
    });

    msgInput.value = "";
}

sendBtn.addEventListener("click", sendMessage);

// Enter
msgInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
});

//  ПОЛУЧЕНИЕ СООБЩЕНИЙ
chatRef.limitToLast(100).on("child_added", (snapshot) => {
    const data = snapshot.val();

    const div = document.createElement("div");
    div.className = "message";
    div.innerHTML = `<b>${data.name}:</b> ${data.text}`;

    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
});

chatRef.on("value", (snapshot) => {
    if (!snapshot.exists()) {
        chat.innerHTML = "";
    }
});
