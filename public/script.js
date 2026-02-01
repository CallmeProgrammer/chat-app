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
    addMessage("Me: " + data.message);
  } else {
    addMessage(data.from + ": " + data.message);
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

  addMessage("Me: " + msg);

  document.getElementById("msg").value = "";

}

// Add to UI
function addMessage(text) {

  const div = document.createElement("div");
  div.innerText = text;

  document.getElementById("messages").appendChild(div);

}
