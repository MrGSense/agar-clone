const io = require("../server").io;

const Orb = require("./classes/Orb");
let orbs = [];
let settings = {
  defaultOrbs: 500,
  defaultSpeed: 6,
  defaultSize: 6,
  defaultZoom: 1.5,
  worldWidth: 500,
  worldHeight: 500
};

initGame();

io.sockets.on("connect", socket => {
  // let playerConfig = new playerConfig()
  // let playerData = new playerData()
  // let Player = new Player=(socket.id, playerConfig, playerData)

  socket.emit("init", {
    orbs
  });
});

// Run at beginning of a new game
function initGame() {
  for (let i = 0; i < settings.defaultOrbs; i++) {
    orbs.push(new Orb(settings));
  }
}

module.exports = io;
