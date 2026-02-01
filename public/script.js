const socket = io("https://chat-backend-yeie.onrender.com");

const username = localStorage.getItem("username");

socket.emit("join", username);

let selectedUser = null;

// Show users
socket.on("users", (userList) => {

  const usersDiv = document.getElementById("users");
  usersDiv.innerHTML = "";

  userList.forEach((user) => {

    if (user === username) return;

    const btn = document.createElement("button");
    btn.innerText = user;

    btn.onclick = () => {
      selectedUser = user;
      alert("Chatting with " + user);
    };

    usersDiv.appendChild(btn);

  });

});

// Receive message
socket.on("private-message", (data) => {

  if (data.from === username) {
    addMessage(data.message, "me");
  } else {
    addMessage(data.from + ": " + data.message, "other");
  }

});


// Send message
function send() {

  const msg = document.getElementById("msg").value;

  if (!msg) {
    alert("Type message");
    return;
  }

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


  document.getElementById("msg").value = "";

}

// Add to UI
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

