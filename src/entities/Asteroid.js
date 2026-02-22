import Matter from 'matter-js';
import { gravityAttractor } from '../physics/PhysicsWorld.js';
import { GRAVITY_CONSTANT } from '../config.js';

export default class Asteroid {
  constructor(x, y, rotationSpeed, mass, scale, speedX, speedY) {
    this.body = Matter.Bodies.circle(x, y, 8 * scale, {
      isStatic: true,
      isSensor: true,
      label: 'asteroid',
      plugin: {
        attractors: [gravityAttractor],
        gravityMass: mass,
      },
    });

    this.scale = scale;
    this.rotationSpeed = rotationSpeed;
    this.speedX = speedX;
    this.speedY = speedY;
    this.rotation = 0;
  }

  update(dt, gravityWells = []) {
    this.rotation += this.rotationSpeed * dt * 60;

    // Apply gravity from player-placed wells
    for (const well of gravityWells) {
      const wp = well.body.position;
      const dx = wp.x - this.body.position.x;
      const dy = wp.y - this.body.position.y;
      const distSq = dx * dx + dy * dy;
      if (distSq < 1) continue;
      const dist = Math.sqrt(distSq);
      const force = ((well.body.plugin.gravityMass || 1.5) / distSq) * GRAVITY_CONSTANT;
      this.speedX += (dx / dist) * force * dt * 60;
      this.speedY += (dy / dist) * force * dt * 60;
    }

    const x = this.body.position.x + this.speedX * dt * 60;
    const y = this.body.position.y + this.speedY * dt * 60;
    Matter.Body.setPosition(this.body, { x, y });
  }

  draw(ctx, assets) {
    const { x, y } = this.body.position;
    const img = assets.get('asteroid');
    if (!img) return;

    ctx.save();
    ctx.translate(x, y);
    ctx.scale(this.scale, this.scale);
    ctx.rotate(this.rotation);
    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    ctx.restore();
  }
}
