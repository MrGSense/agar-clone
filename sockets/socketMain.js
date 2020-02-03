const io = require("../server").io;
const checkForOrbCollisions = require("./checkCollision").checkForOrbCollisions;
const checkForPlayerCollisions = require("./checkCollision")
  .checkForPlayerCollisions;

// Classes
const Orb = require("./classes/Orb");
const Player = require("./classes/Player");
const PlayerData = require("./classes/PlayerData");
const PlayerConfig = require("./classes/PlayerConfig");

let orbs = [];
let players = [];
let settings = {
  defaultOrbs: 5000,
  defaultSpeed: 6,
  defaultSize: 6,
  defaultZoom: 1.5,
  worldWidth: 5000,
  worldHeight: 5000
};

initGame();

setInterval(() => {
  if (players.length > 0) {
    io.to("game").emit("tock", {
      players
    });
  }
}, 33); // Refresh every 1/30th of a second for 30 FPS

io.sockets.on("connect", socket => {
  let player = {};

  socket.on("init", data => {
    socket.join("game");

    let playerConfig = new PlayerConfig(settings);
    let playerData = new PlayerData(data.playerName, settings);
    player = new Player(socket.id, playerConfig, playerData);

    setInterval(() => {
      socket.emit("tickTock", {
        playerX: player.playerData.locX,
        playerY: player.playerData.locY
      });
    }, 33); // 30 FPS

    socket.emit("initReturn", {
      orbs
    });
    players.push(playerData);
  });

  socket.on("tick", data => {
    // Movement
    speed = player.playerConfig.speed;
    xV = player.playerConfig.xVector = data.xVector;
    yV = player.playerConfig.yVector = data.yVector;

    if (
      (player.playerData.locX < 5 && player.playerData.xVector < 0) ||
      (player.playerData.locX > settings.worldWidth && xV > 0)
    ) {
      player.playerData.locY -= speed * yV;
    } else if (
      (player.playerData.locY < 5 && yV > 0) ||
      (player.playerData.locY > settings.worldHeight && yV < 0)
    ) {
      player.playerData.locX += speed * xV;
    } else {
      player.playerData.locX += speed * xV;
      player.playerData.locY -= speed * yV;
    }

    // Orb Collision
    let capturedOrb = checkForOrbCollisions(
      player.playerData,
      player.playerConfig,
      orbs,
      settings
    );

    capturedOrb
      .then(data => {
        // console.log(`Orb collision at ${data}`);

        const orbData = {
          orbIndex: data,
          newOrb: orbs[data]
        };

        io.sockets.emit("updateLeaderBoard", getLeaderBoard());

        io.sockets.emit("orbSwitch", orbData);
      })
      .catch(() => {
        // console.log("No orb collision");
      });

    // Player Collision
    let playerDeath = checkForPlayerCollisions(
      player.playerData,
      player.playerConfig,
      players,
      player.socketId
    );

    playerDeath
      .then(data => {
        // console.log("Player collision");

        io.sockets.emit("updateLeaderBoard", getLeaderBoard());
      })
      .catch(() => {
        // console.log("No player collision");
      });
  });
  socket.on("disconnect", data => {
    // console.log(data);

    players.forEach((curPlayer, i) => {
      if (curPlayer.uid == player.playerData.uid) {
        player.splice(i, 1);

        io.sockets.emit("updateLeaderBoard", getLeaderBoard());
      }
    });
  });
});

function getLeaderBoard() {
  players.sort((a, b) => {
    return b.score - a.score;
  });
  let leaderBoard = players.map(curPlayer => {
    return {
      name: curPlayer.name,
      score: curPlayer.score
    };
  });
  return leaderBoard;
}

// Run at beginning of a new game
function initGame() {
  for (let i = 0; i < settings.defaultOrbs; i++) {
    orbs.push(new Orb(settings));
  }
}

module.exports = io;
