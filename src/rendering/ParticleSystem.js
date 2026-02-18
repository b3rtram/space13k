import { randFloat } from '../utils/math.js';

class Particle {
  constructor(x, y, vx, vy, life, color, size) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.life = life;
    this.maxLife = life;
    this.color = color;
    this.size = size;
  }

  update(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.life -= dt;
  }

  get alpha() {
    return Math.max(0, this.life / this.maxLife);
  }

  get dead() {
    return this.life <= 0;
  }
}

export default class ParticleSystem {
  constructor() {
    this.particles = [];
  }

  emitThrust(x, y, angle) {
    const spread = 0.4;
    for (let i = 0; i < 3; i++) {
      const a = angle + Math.PI + randFloat(-spread, spread);
      const speed = randFloat(40, 100);
      this.particles.push(
        new Particle(
          x, y,
          Math.cos(a) * speed,
          Math.sin(a) * speed,
          randFloat(0.15, 0.35),
          `hsl(${randFloat(20, 50)}, 100%, ${randFloat(50, 80)}%)`,
          randFloat(1.5, 3),
        ),
      );
    }
  }

  emitExplosion(x, y) {
    for (let i = 0; i < 40; i++) {
      const a = randFloat(0, Math.PI * 2);
      const speed = randFloat(30, 200);
      this.particles.push(
        new Particle(
          x, y,
          Math.cos(a) * speed,
          Math.sin(a) * speed,
          randFloat(0.3, 1.0),
          `hsl(${randFloat(0, 60)}, 100%, ${randFloat(40, 90)}%)`,
          randFloat(2, 5),
        ),
      );
    }
  }

  emitWormholeSwirl(x, y, radius, dt) {
    const a = randFloat(0, Math.PI * 2);
    const r = radius * 0.8;
    const px = x + Math.cos(a) * r;
    const py = y + Math.sin(a) * r;
    // Spiral inward
    const inwardAngle = a + Math.PI * 0.7;
    const speed = randFloat(20, 50);
    this.particles.push(
      new Particle(
        px, py,
        Math.cos(inwardAngle) * speed,
        Math.sin(inwardAngle) * speed,
        randFloat(0.3, 0.8),
        `hsl(${randFloat(200, 280)}, 70%, ${randFloat(60, 90)}%)`,
        randFloat(1, 2.5),
      ),
    );
  }

  emitTrail(x, y) {
    this.particles.push(
      new Particle(
        x, y,
        randFloat(-5, 5),
        randFloat(-5, 5),
        randFloat(0.3, 0.8),
        'rgba(255, 170, 0, 0.3)',
        1,
      ),
    );
  }

  update(dt) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].update(dt);
      if (this.particles[i].dead) {
        this.particles.splice(i, 1);
      }
    }
  }

  draw(ctx) {
    for (const p of this.particles) {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
}
