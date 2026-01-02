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
const storage = firebase.storage();

// элементы
const chat = document.getElementById("chat");
const nameInput = document.getElementById("username");
const msgInput = document.getElementById("message");
const sendBtn = document.getElementById("send");
const imgBtn = document.getElementById("imgBtn");
const imageInput = document.getElementById("imageInput");


// отправка
function sendMessage() {
    const name = nameInput.value.trim();
    const text = msgInput.value.trim();

    if (!name || !text) return;

    // очистка
    if (name === "ClearChats" && text === "1746284859274758clear") {
        chatRef.remove();
        chat.innerHTML = "";
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

sendBtn.addEventListener("click", sendMessage);

msgInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
});


// картинка
imgBtn.addEventListener("click", () => {
    imageInput.click();
});

imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    const name = nameInput.value.trim();

    if (!file || !name) return;

    if (!file.type.startsWith("image/")) return;

    const imgRef = storage.ref("images/" + Date.now() + "_" + file.name);

    imgRef.put(file).then(() => {
        imgRef.getDownloadURL().then((url) => {
            chatRef.push({
                name: name,
                type: "image",
                url: url
            });
        });
    });

    imageInput.value = "";
});


// получение
chatRef.limitToLast(100).on("child_added", (snapshot) => {
    const data = snapshot.val();

    const div = document.createElement("div");
    div.className = "message";

    if (data.type === "image") {
        div.innerHTML = `
            <b>${data.name}:</b><br>
            <img src="${data.url}"
                 width="150" height="150"
                 style="object-fit:cover;border-radius:8px;">
        `;
    } else {
        div.innerHTML = `<b>${data.name}:</b> ${data.text}`;
    }

    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
});

// чат очищен
chatRef.on("value", (snapshot) => {
    if (!snapshot.exists()) {
        chat.innerHTML = "";
    }
});
