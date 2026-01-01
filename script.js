// 🔥 Firebase config
const firebaseConfig = {
  apiKey: "ТВОЙ_API_KEY",
  authDomain: "ТВОЙ_AUTH_DOMAIN",
  databaseURL: "ТВОЙ_DATABASE_URL",
  projectId: "ТВОЙ_PROJECT_ID",
  storageBucket: "ТВОЙ_STORAGE",
  messagingSenderId: "ТВОЙ_SENDER_ID",
  appId: "ТВОЙ_APP_ID"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.database();
const chatRef = db.ref("messages");

// элементы
const chat = document.getElementById("chat");
const nameInput = document.getElementById("username");
const msgInput = document.getElementById("message");
const sendBtn = document.getElementById("send");

// отправка
function sendMessage() {
    const name = nameInput.value.trim();
    const text = msgInput.value.trim();
    if (!name || !text) return;

    chatRef.push({
        name: name,
        text: text
    });

    msgInput.value = "";
}

sendBtn.onclick = sendMessage;

// получение сообщений
chatRef.limitToLast(100).on("child_added", (snapshot) => {
    const data = snapshot.val();

    const div = document.createElement("div");
    div.className = "message";
    div.innerHTML = `<b>${data.name}:</b> ${data.text}`;

    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
});
