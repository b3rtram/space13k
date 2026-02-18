import { STAR_COUNT, STAR_MIN_Z, STAR_MAX_Z, STAR_SCROLL_SPEED } from '../config.js';
import { randFloat, randInt } from '../utils/math.js';

export default class Star {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.twinkleOffset = randFloat(0, Math.PI * 2);
    this.twinkleSpeed = randFloat(1.5, 4);
    this.time = 0;
  }

  update(dt) {
    this.x += STAR_SCROLL_SPEED * this.z * dt * 60;
    this.time += dt;
  }

  draw(ctx) {
    const twinkle = 0.5 + 0.5 * Math.sin(this.time * this.twinkleSpeed + this.twinkleOffset);

    ctx.save();
    ctx.globalAlpha = 0.3 + twinkle * 0.7;
    ctx.translate(this.x, this.y);
    ctx.scale(this.z, this.z);
    ctx.beginPath();
    const g = ctx.createRadialGradient(0.5, 0.5, 0.5, 1, 1, 1);
    g.addColorStop(0, 'black');
    g.addColorStop(1, 'white');
    ctx.fillStyle = g;
    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  static createField(width, height) {
    const stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push(new Star(
        randInt(0, width),
        randInt(0, height),
        randFloat(STAR_MIN_Z, STAR_MAX_Z),
      ));
    }
    return stars;
  }
}
