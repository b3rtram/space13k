// Ship path data extracted from original ship.js
// Coordinates relative to center offset (sx=-10, sy=-7)
const SX = -10;
const SY = -7;

// Main hull outline
export const HULL_PATH = [
  [0, 0], [7, 0], [7, 1], [8, 1], [8, 2], [9, 2], [9, 3], [22, 3],
  [22, 4], [27, 4], [27, 5], [28, 5], [28, 6], [29, 6], [29, 7], [30, 7],
  [30, 8], [29, 8], [29, 9], [28, 9], [28, 10], [27, 10], [27, 11], [22, 11],
  [22, 12], [9, 12], [9, 13], [8, 13], [8, 14], [7, 14], [7, 15], [0, 15],
  [0, 14], [1, 14], [1, 13], [2, 13], [2, 12], [3, 12], [3, 11], [1, 11],
  [1, 10], [0, 10], [0, 9], [-2, 9], [-2, 8], [-3, 8], [-3, 7], [-2, 7],
  [-2, 6], [0, 6], [0, 5], [1, 5], [1, 4], [3, 4], [3, 3], [2, 3],
  [2, 2], [1, 2], [1, 1], [0, 1],
];

// Thrust exhaust (drawn when thrusting)
export const THRUST_PATH = [
  [-5, 7], [-9, 7], [-9, 8], [-5, 8],
];

// Rotation burst top (rotating clockwise, factor=1)
export const ROTATE_CW_PATH = [
  [22, 0], [22, -5], [21, -5], [21, 0],
];

// Rotation burst bottom (rotating counter-clockwise, factor=-1)
export const ROTATE_CCW_PATH = [
  [22, 15], [22, 20], [21, 20], [21, 15],
];

export function drawShip(ctx, thrusting, rotateBurst) {
  ctx.beginPath();

  // Hull
  ctx.moveTo(HULL_PATH[0][0] + SX, HULL_PATH[0][1] + SY);
  for (let i = 1; i < HULL_PATH.length; i++) {
    ctx.lineTo(HULL_PATH[i][0] + SX, HULL_PATH[i][1] + SY);
  }
  ctx.closePath();

  // Thrust exhaust
  if (thrusting) {
    ctx.moveTo(THRUST_PATH[0][0] + SX, THRUST_PATH[0][1] + SY);
    for (let i = 1; i < THRUST_PATH.length; i++) {
      ctx.lineTo(THRUST_PATH[i][0] + SX, THRUST_PATH[i][1] + SY);
    }
  }

  // Rotation bursts
  if (rotateBurst === 1) {
    ctx.moveTo(ROTATE_CW_PATH[0][0] + SX, ROTATE_CW_PATH[0][1] + SY);
    for (let i = 1; i < ROTATE_CW_PATH.length; i++) {
      ctx.lineTo(ROTATE_CW_PATH[i][0] + SX, ROTATE_CW_PATH[i][1] + SY);
    }
  }

  if (rotateBurst === -1) {
    ctx.moveTo(ROTATE_CCW_PATH[0][0] + SX, ROTATE_CCW_PATH[0][1] + SY);
    for (let i = 1; i < ROTATE_CCW_PATH.length; i++) {
      ctx.lineTo(ROTATE_CCW_PATH[i][0] + SX, ROTATE_CCW_PATH[i][1] + SY);
    }
  }

  ctx.fillStyle = '#ffaa00';
  ctx.fill();
}
