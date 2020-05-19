const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Set static folder
app.use(express.static(path.join(__dirname, "public")));

const botName = "Discord Bot";

//Run cuando el cliente se conecta
//objeto io escucha la conexion
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);

    //emite el mensaje de bienvenida
    //Avisa sólo al usuario que se esta conectand
    socket.emit(
      "message",
      formatMessage(botName, "¡Bienvenido a Discord Chat!")
    );

    /*DIFERENCIA: broadcast.emit avisa a todos menos al usuario que se esta conectando */
    //Se emite cuando un usuario se conecte
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.username} ha entrado al chat!`)
      );

    //Envía usuarios y sala info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  //Escucha el chatMesage
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  //Cuando el cliente se desconecta
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username} ha abandonado el chat`)
      );

      //Envía usuarios y sala info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

//enviroment variable llamada PORT o usar el puerto 3000
const HOST = process.env.HOST || "0.0.0.0";
const PORT = process.env.PORT || 3000;

server.listen(PORT, HOST, () => console.log(`Server running on port ${PORT}`));
