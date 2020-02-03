const io = require("../server").io;

// Classes
const Orb = require("./classes/Orb");
const Player = require("./classes/Player");
const PlayerData = require("./classes/PlayerData");
const PlayerConfig = require("./classes/PlayerConfig");

let orbs = [];
let players = [];
let settings = {
  defaultOrbs: 500,
  defaultSpeed: 6,
  defaultSize: 6,
  defaultZoom: 1.5,
  worldWidth: 500,
  worldHeight: 500
};

initGame();

setInterval(() => {
  io.to("game").emit("tock", {
    players
  });
}, 33); // Refresh every 1/30th of a second for 30 FPS

io.sockets.on("connect", socket => {
  socket.on("init", data => {
    socket.join("game");

    let playerConfig = new PlayerConfig(settings);
    let playerData = new PlayerData(null, settings);
    let player = new Player(socket.id, playerConfig, playerData);

    socket.emit("initReturn", {
      orbs
    });
    players.push(playerData);
  });
});

// Run at beginning of a new game
function initGame() {
  for (let i = 0; i < settings.defaultOrbs; i++) {
    orbs.push(new Orb(settings));
  }
}

module.exports = io;
