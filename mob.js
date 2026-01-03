// Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAez-DASdgHDoHlfU1lPu6QlgOUCHv7tGE",
  authDomain: "mewdychats.firebaseapp.com",
  databaseURL: "https://mewdychats-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "mewdychats",
  messagingSenderId: "297493755800",
  appId: "1:297493755800:web:bc814f25e9b4f3588a1ded"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.database();
const chatRef = db.ref("messages");

firebase.auth().signInAnonymously();

// Elements
const chat = document.getElementById("chat");
const nameInput = document.getElementById("username");
const msgInput = document.getElementById("message");
const sendBtn = document.getElementById("send");

// SEND MESSAGE
function sendMessage() {
  const name = nameInput.value.trim();
  const text = msgInput.value.trim();
  if (!name || !text) return;

  chatRef.push({
    name,
    text
  });

  msgInput.value = "";
}

sendBtn.onclick = sendMessage;
msgInput.addEventListener("keydown", e => {
  if (e.key === "Enter") sendMessage();
});

// RECEIVE
chatRef.limitToLast(100).on("child_added", snap => {
  const data = snap.val();
  const div = document.createElement("div");
  div.className = "message";
  div.innerHTML = `<b>${data.name}:</b> ${data.text}`;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
});
