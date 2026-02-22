import Matter from 'matter-js';
import { gravityAttractor } from '../physics/PhysicsWorld.js';

export default class GravityWell {
  constructor(x, y) {
    this.body = Matter.Bodies.circle(x, y, 10, {
      isStatic: true,
      isSensor: true,
      label: 'gravityWell',
      plugin: {
        attractors: [gravityAttractor],
        gravityMass: 1.5,
      },
    });

    this.pulseTime = 0;
  }

  containsPoint(mx, my) {
    const { x, y } = this.body.position;
    const dx = mx - x;
    const dy = my - y;
    return dx * dx + dy * dy <= 30 * 30;
  }

  update(dt) {
    this.pulseTime += dt;
  }

  draw(ctx) {
    const { x, y } = this.body.position;
    const pulse = 0.6 + Math.sin(this.pulseTime * 3) * 0.3;

    // Outer glow
    const grad = ctx.createRadialGradient(x, y, 2, x, y, 20);
    grad.addColorStop(0, `rgba(255, 170, 0, ${0.8 * pulse})`);
    grad.addColorStop(0.5, `rgba(255, 120, 0, ${0.3 * pulse})`);
    grad.addColorStop(1, 'rgba(255, 100, 0, 0)');

    ctx.save();
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();

    // Inner bright core
    ctx.fillStyle = `rgba(255, 220, 150, ${pulse})`;
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}
