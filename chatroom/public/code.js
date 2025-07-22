const socket = io();

let username = "";
const joinScreen = document.querySelector(".join-screen");
const chatScreen = document.querySelector(".chat-screen");
const joinBtn = document.getElementById("join-user");
const exitBtn = document.getElementById("exit-chat");
const sendBtn = document.getElementById("send-message");
const msgInput = document.getElementById("message-input");
const msgContainer = document.getElementById("messages");

// Join
joinBtn.addEventListener("click", () => {
    const input = document.getElementById("username");
    const name = input.value.trim();
    if (name !== "") {
        username = name;
        joinScreen.classList.remove("active");
        chatScreen.classList.add("active");
        socket.emit("newuser", username);
    }
});

// Send
sendBtn.addEventListener("click", () => {
    const msg = msgInput.value.trim();
    if (msg !== "") {
        renderMessage("my", { username: "You", text: msg });
        socket.emit("chat", { username: username, text: msg });
        msgInput.value = "";
    }
});

// Exit
exitBtn.addEventListener("click", () => {
    socket.emit("exituser", username);
    window.location.reload();
});

// Show messages
function renderMessage(type, message) {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message", type === "my" ? "my-message" : "other-message");
    msgDiv.innerHTML = `
        <div>
            <div class="name">${message.username}</div>
            <div class="text">${message.text}</div>
        </div>
    `;
    msgContainer.appendChild(msgDiv);
    msgContainer.scrollTop = msgContainer.scrollHeight;
}

function renderUpdate(message) {
    const update = document.createElement("div");
    update.classList.add("update");
    update.textContent = message;
    msgContainer.appendChild(update);
    msgContainer.scrollTop = msgContainer.scrollHeight;
}

// Receive from server
socket.on("update", renderUpdate);
socket.on("chat", (msg) => renderMessage("other", msg));
