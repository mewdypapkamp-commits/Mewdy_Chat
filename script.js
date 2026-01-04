// =====================
// FIREBASE CONFIG
// =====================
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
const auth = firebase.auth();

// =====================
// ELEMENTS
// =====================
const chat = document.getElementById("chat");
const nameInput = document.getElementById("username");
const msgInput = document.getElementById("message");
const sendBtn = document.getElementById("send");

// =====================
// AUTH
// =====================
let isAdmin = false;
const ADMIN_UID = "Ngr2rPIextdZfGJm8dD3dTyVVg92";

auth.signInAnonymously().then(user => {
    isAdmin = user.user.uid === ADMIN_UID;
    console.log("UID:", user.user.uid, isAdmin ? "(ADMIN)" : "");
});

// =====================
// SEND MESSAGE
// =====================
function sendMessage() {
    const name = nameInput.value.trim();
    const text = msgInput.value.trim();

    if (!name || !text) return;

    // 🚫 block dangerous schemes
    if (/javascript:|data:/i.test(text)) {
        alert("Запрещённый контент");
        return;
    }

    // 🧹 admin clear
    if (text === "/clear") {
        if (isAdmin) {
            chatRef.remove();
        } else {
            alert("Только админ может очистить чат");
        }
        msgInput.value = "";
        return;
    }

    chatRef.push({
        name: name,
        text: text,
        time: Date.now()
    });

    msgInput.value = "";
}

sendBtn.onclick = sendMessage;
msgInput.addEventListener("keydown", e => {
    if (e.key === "Enter") sendMessage();
});

// =====================
// RECEIVE MESSAGES
// =====================
chatRef.on("value", snap => {
    chat.innerHTML = "";

    if (!snap.exists()) return;

    snap.forEach(child => {
        const data = child.val();
        const div = document.createElement("div");
        div.className = "message";

        // 🖼 img: support
        if (data.text.startsWith("img:")) {
            const url = data.text.slice(4).trim();

            // allow ONLY https images
            if (!/^https:\/\/.+\.(png|jpg|jpeg|gif|webp)$/i.test(url)) {
                div.innerHTML = `<b>${data.name}:</b> [invalid image link]`;
            } else {
                div.innerHTML = `
                    <b>${data.name}:</b><br>
                    <img src="${url}"
                         width="150"
                         height="150"
                         loading="lazy"
                         referrerpolicy="no-referrer"
                         style="object-fit:cover;border-radius:10px;">
                `;
            }
        } else {
            div.innerHTML = `<b>${data.name}:</b> ${data.text}`;
        }

        chat.appendChild(div);
    });

    chat.scrollTop = chat.scrollHeight;
});
