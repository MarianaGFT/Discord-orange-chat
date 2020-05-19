//chatForm contiene lo que recibe el elemento con id chat-form
const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

//Obtener usuario y sala del URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

//Entrar a la sala de chat
socket.emit("joinRoom", { username, room });

//Obtener sala y usuarios
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

//Recibe el parametro del message del server
socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);

  //Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

//Mesnsaje submit del form
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  //recibe el mensaje del input
  const msg = e.target.elements.msg.value;

  //Emite el mensaje al servidor
  socket.emit("chatMessage", msg);

  //Limpiar input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

//Output mensaje hacia el DOM
function outputMessage(message) {
  //Manipulaciond el DOM
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username}<span>${message.time}</span></p>
  <p class="text">
  ${message.text}
  </p>`;
  document.querySelector(".chat-messages").appendChild(div);
}

//Ageagr el nombre de la sala al DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

//Agregar usuario al DOM
function outputUsers(users) {
  userList.innerHTML = `
  ${users.map((user) => `<li>${user.username}</li>`).join("")}
  `;
}
