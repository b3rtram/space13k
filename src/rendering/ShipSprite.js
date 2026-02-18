const shipImg = new Image();
shipImg.src = '/assets/ship.png';

// Ship sprite is 48x48, draw centered at origin
const SIZE = 48;
const HALF = SIZE / 2;

// Sprite points upper-left (~-135°), rotate to face right (0°)
const SPRITE_ROTATION = Math.PI * 1.25;

export function drawShip(ctx, thrusting, rotateBurst) {
  if (shipImg.complete && shipImg.naturalWidth > 0) {
    ctx.save();
    ctx.scale(1, -1);
    ctx.rotate(SPRITE_ROTATION);
    ctx.drawImage(shipImg, -HALF, -HALF, SIZE, SIZE);
    ctx.restore();
  } else {
    // Fallback: simple triangle while image loads
    ctx.beginPath();
    ctx.moveTo(12, 0);
    ctx.lineTo(-8, -7);
    ctx.lineTo(-8, 7);
    ctx.closePath();
    ctx.fillStyle = '#ffaa00';
    ctx.fill();
  }

  // Thrust exhaust glow
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

  // Rotation bursts
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
