// ================= MOBILE MENU =================

document.addEventListener("DOMContentLoaded", () => {

  const menuBtn = document.getElementById("menuBtn");
  const usersPanel = document.getElementById("users");
  const msgInput = document.getElementById("msg");

  // Toggle users panel
  if (menuBtn && usersPanel) {
    menuBtn.addEventListener("click", () => {
      usersPanel.classList.toggle("show");
    });
  }

  // Send on Enter key
  if (msgInput) {
    msgInput.addEventListener("keydown", (e) => {

      if (e.key === "Enter") {
        e.preventDefault();
        send();
      }

    });
  }

});

// ================= SOCKET =================

const socket = io("https://chat-backend-yeie.onrender.com");

const username = localStorage.getItem("username");

socket.emit("join", username);

let selectedUser = null;

// ================= USERS LIST =================

socket.on("users", (userList) => {

  const usersDiv = document.getElementById("users");
  const usersPanel = document.getElementById("users");

  usersDiv.innerHTML = "";

  userList.forEach((user) => {

    if (user === username) return;

    const btn = document.createElement("button");
    btn.innerText = user;

    btn.onclick = () => {

      selectedUser = user;

      // Remove previous highlight
      document.querySelectorAll(".users button").forEach(b => {
        b.classList.remove("active");
      });

      // Highlight selected
      btn.classList.add("active");

      // Close panel on mobile
      usersPanel.classList.remove("show");
    };

    usersDiv.appendChild(btn);

  });

});

// ================= RECEIVE MESSAGE =================

socket.on("private-message", (data) => {

  if (data.from === username) {
    addMessage(data.message, "me");
  } else {
    addMessage(data.from + ": " + data.message, "other");
  }

});

// ================= SEND MESSAGE =================

function send() {

  const input = document.getElementById("msg");
  const msg = input.value.trim();

  if (!msg) return;

  if (!selectedUser) {
    alert("Select user first");
    return;
  }

  socket.emit("private-message", {
    toUser: selectedUser,
    message: msg,
    from: username,
  });

  addMessage(msg, "me");

  input.value = "";
}

// ================= ADD MESSAGE =================

function addMessage(text, type = "other") {

  const div = document.createElement("div");

  div.classList.add("message");

  if (type === "me") {
    div.classList.add("me");
  } else {
    div.classList.add("other");
  }

  div.innerText = text;

  const messages = document.getElementById("messages");

  messages.appendChild(div);

  // Auto scroll
  messages.scrollTop = messages.scrollHeight;
}
