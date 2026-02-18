import Matter from 'matter-js';
import { gravityAttractor } from '../physics/PhysicsWorld.js';

export default class Wormhole {
  constructor(x, y, radius, mass) {
    this.body = Matter.Bodies.circle(x, y, radius, {
      isStatic: true,
      isSensor: true,
      label: 'wormhole',
      plugin: {
        attractors: [gravityAttractor],
        gravityMass: mass,
      },
    });

    this.radius = radius;
    this.time = 0;
  }

  update(dt) {
    this.time += dt;
  }

  draw(ctx) {
    const { x, y } = this.body.position;

    ctx.save();
    ctx.translate(x, y);

    // Outer glow
    const outerGrd = ctx.createRadialGradient(0, 0, this.radius * 0.5, 0, 0, this.radius * 1.5);
    outerGrd.addColorStop(0, 'rgba(150, 100, 255, 0.15)');
    outerGrd.addColorStop(1, 'rgba(150, 100, 255, 0)');
    ctx.fillStyle = outerGrd;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius * 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Main wormhole
    const grd = ctx.createRadialGradient(0, 0, 2, 0, 0, this.radius);
    grd.addColorStop(0, '#101010');
    grd.addColorStop(0.6, '#2a1a4a');
    grd.addColorStop(1, 'rgba(200, 180, 255, 0.8)');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fill();

    // Animated spiral arms
    ctx.save();
    ctx.rotate(this.time * 1.5);
    for (let arm = 0; arm < 3; arm++) {
      ctx.save();
      ctx.rotate((arm * Math.PI * 2) / 3);
      ctx.beginPath();
      for (let i = 0; i < 40; i++) {
        const t = i / 40;
        const angle = t * Math.PI * 2;
        const r = t * this.radius * 0.9;
        const px = Math.cos(angle) * r;
        const py = Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = `rgba(200, 180, 255, ${0.3})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
    }
    ctx.restore();

    ctx.restore();
  }
}
