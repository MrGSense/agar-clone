const express = require("express");
const app = express();
app.use(express.static(__dirname + "/public"));
const socketio = require("socket.io");
const PORT = process.env.PORT || 8080;
const expressServer = app.listen(PORT, () =>
  console.log(`Server started on port: ${PORT}`)
);
const io = socketio(expressServer);
const helmet = require("helmet");
app.use(helmet());

module.exports = {
  app,
  io
};
