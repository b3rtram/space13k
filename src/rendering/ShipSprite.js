// Matter.js body.angle 0 = east, +π/2 = south (canvas y is down).
// Frames are pre-rotated in screen coords, indexed clockwise from east.
const DIRECTIONS = [
  'east', 'south-east', 'south', 'south-west',
  'west', 'north-west', 'north', 'north-east',
];

const shipImgs = {};
for (const dir of DIRECTIONS) {
  const img = new Image();
  img.src = `/assets/ship/${dir}.png`;
  shipImgs[dir] = img;
}

const SIZE = 48;
const HALF = SIZE / 2;
const TWO_PI = Math.PI * 2;

function pickFrame(angle) {
  let a = angle % TWO_PI;
  if (a < 0) a += TWO_PI;
  const idx = Math.round(a / (Math.PI / 4)) % 8;
  return shipImgs[DIRECTIONS[idx]];
}

export function drawShip(ctx, angle, thrusting, rotateBurst) {
  const frame = pickFrame(angle);
  if (frame.complete && frame.naturalWidth > 0) {
    // Undo parent rotation: frames are already pre-rotated in screen coords.
    ctx.save();
    ctx.rotate(-angle);
    ctx.drawImage(frame, -HALF, -HALF, SIZE, SIZE);
    ctx.restore();
  } else {
    ctx.beginPath();
    ctx.moveTo(12, 0);
    ctx.lineTo(-8, -7);
    ctx.lineTo(-8, 7);
    ctx.closePath();
    ctx.fillStyle = '#ffaa00';
    ctx.fill();
  }

  // Thrust exhaust glow (drawn in parent's rotated frame: ship faces east)
  if (thrusting) {
    ctx.save();
    ctx.shadowColor = '#ff6600';
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#ffaa00';
    ctx.beginPath();
    ctx.moveTo(-HALF + 2, -3);
    ctx.lineTo(-HALF - 10, 0);
    ctx.lineTo(-HALF + 2, 3);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#ffdd44';
    ctx.beginPath();
    ctx.moveTo(-HALF + 2, -1.5);
    ctx.lineTo(-HALF - 5, 0);
    ctx.lineTo(-HALF + 2, 1.5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  if (rotateBurst === 1) {
    ctx.save();
    ctx.shadowColor = '#00aaff';
    ctx.shadowBlur = 6;
    ctx.fillStyle = '#00d4ff';
    ctx.fillRect(6, -HALF - 4, 4, 5);
    ctx.restore();
  }
  if (rotateBurst === -1) {
    ctx.save();
    ctx.shadowColor = '#00aaff';
    ctx.shadowBlur = 6;
    ctx.fillStyle = '#00d4ff';
    ctx.fillRect(6, HALF - 1, 4, 5);
    ctx.restore();
  }
}
