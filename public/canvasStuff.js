function init() {
  draw();
}

// Drawing
let randomX = Math.floor(500 * Math.random() + 10);
let randomY = Math.floor(500 * Math.random() + 10);
function draw() {
  context.beginPath();
  context.fillStyle = "rgb(255, 0, 0)";
  context.arc(randomX, randomY, 10, 0, 2 * Math.PI);
  context.fill();
  context.lineWidth = 3;
  context.strokeStyle = "rgb(0, 255, 0)";
  context.stroke();
  requestAnimationFrame(draw);
}

canvas.addEventListener("mousemove", event => {
  const mousePosition = {
    x: event.clientX,
    y: event.clientY
  };

  const angleDeg =
    (Math.atan2(
      mousePosition.y - canvas.height / 2,
      mousePosition.x - canvas.width / 2
    ) *
      180) /
    Math.PI;

  if (angleDeg >= 0 && angleDeg < 90) {
    // Mouse in lower right quadrant
    xVector = 1 - angleDeg / 90;
    yVector = -(angleDeg / 90);
  } else if (angleDeg >= 90 && angleDeg <= 180) {
    // Mouse in lower left quadrant
    xVector = -(angleDeg - 90) / 90;
    yVector = -(1 - (angleDeg - 90) / 90);
  } else if (angleDeg >= -180 && angleDeg < -90) {
    // Mouse in upper left quadrant
    xVector = (angleDeg + 90) / 90;
    yVector = 1 + (angleDeg + 90) / 90;
  } else if (angleDeg < 0 && angleDeg >= -90) {
    // Mouse in upper right quadrant
    xVector = (angleDeg + 90) / 90;
    yVector = 1 - (angleDeg + 90) / 90;
  }

  player.xVector = xVector;
  player.yVector = yVector;
});
