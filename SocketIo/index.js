const io = require("socket.io")(8000, {
  cors: {
    origin: "http://localhost:3000",
  },
});
let users = [];
const addUsers = (data) => {
  !users.some((user) => user.userId === data.userId) && users.push(data);
};
const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};
const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};
io.on("connection", (socket) => {
  socket.on("sendMessage", ({ receiverId, senderId, text }) => {
    const receiver = getUser(receiverId);
    if (!receiver) return;
    io.to(receiver.socketId).emit("getMessage", {
      senderId,
      text,
    });
  });
  socket.on("addUser", (userId) => {
    addUsers({ userId, socketId: socket.id });
    io.emit("getUsers", users);
  });
  socket.on("logout", () => {
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
  // socket.on("frndRequest", (userId) => {});
});
