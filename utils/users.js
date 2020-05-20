const users = [];

//Join usuario al chat
function userJoin(id, username, room) {
  const user = { id, username, room };

  users.push(user);
  return user;
}

//Obtener el usuario actual
function getCurrentUser(id) {
  return users.find((user) => user.id === id);
}

//Usuarop abandona el chat
function userLeave(id) {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

//Obtener usuarios de la sala
function getRoomUsers(room) {
  return users.filter((user) => user.room === room);
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
};
