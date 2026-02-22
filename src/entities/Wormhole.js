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
    const r = this.radius;
    const t = this.time;
    const pulse = 0.8 + Math.sin(t * 2.5) * 0.2;

    ctx.save();
    ctx.translate(x, y);

    // Outer pulsing glow
    const outerGrd = ctx.createRadialGradient(0, 0, r * 0.3, 0, 0, r * 2);
    outerGrd.addColorStop(0, `rgba(120, 80, 255, ${0.2 * pulse})`);
    outerGrd.addColorStop(0.5, `rgba(80, 40, 200, ${0.08 * pulse})`);
    outerGrd.addColorStop(1, 'rgba(80, 40, 200, 0)');
    ctx.fillStyle = outerGrd;
    ctx.beginPath();
    ctx.arc(0, 0, r * 2, 0, Math.PI * 2);
    ctx.fill();

    // Accretion ring (rotating ellipse)
    ctx.save();
    ctx.rotate(t * 0.4);
    ctx.scale(1, 0.35);
    ctx.lineWidth = 3;
    ctx.strokeStyle = `rgba(180, 140, 255, ${0.25 * pulse})`;
    ctx.beginPath();
    ctx.arc(0, 0, r * 1.4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = `rgba(220, 200, 255, ${0.15 * pulse})`;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(0, 0, r * 1.5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Main wormhole body
    const grd = ctx.createRadialGradient(0, 0, 1, 0, 0, r);
    grd.addColorStop(0, '#050510');
    grd.addColorStop(0.3, '#0a0820');
    grd.addColorStop(0.7, '#2a1a5a');
    grd.addColorStop(0.9, `rgba(140, 100, 255, ${0.7 * pulse})`);
    grd.addColorStop(1, `rgba(180, 150, 255, ${0.3 * pulse})`);
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();

    // Bright rim
    ctx.strokeStyle = `rgba(200, 180, 255, ${0.5 * pulse})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, r - 1, 0, Math.PI * 2);
    ctx.stroke();

    // Spiral arms (two layers, counter-rotating)
    for (let layer = 0; layer < 2; layer++) {
      const dir = layer === 0 ? 1 : -0.7;
      const arms = layer === 0 ? 4 : 3;
      const alpha = layer === 0 ? 0.35 : 0.2;

      ctx.save();
      ctx.rotate(t * 1.5 * dir);
      for (let arm = 0; arm < arms; arm++) {
        ctx.save();
        ctx.rotate((arm * Math.PI * 2) / arms);
        ctx.beginPath();
        for (let i = 0; i < 50; i++) {
          const s = i / 50;
          const angle = s * Math.PI * 2.5;
          const dist = s * r * 0.85;
          const px = Math.cos(angle) * dist;
          const py = Math.sin(angle) * dist;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.strokeStyle = `rgba(200, 180, 255, ${alpha * (1 - 0.3 * Math.sin(t * 3 + arm))})`;
        ctx.lineWidth = 1.5 + layer;
        ctx.stroke();
        ctx.restore();
      }
      ctx.restore();
    }

    // Center bright spot
    const coreGrd = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 0.2);
    coreGrd.addColorStop(0, `rgba(255, 255, 255, ${0.3 * pulse})`);
    coreGrd.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = coreGrd;
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Orbiting energy particles
    for (let i = 0; i < 6; i++) {
      const angle = t * (1.8 + i * 0.15) + (i * Math.PI * 2) / 6;
      const orbitR = r * (0.6 + 0.3 * Math.sin(t * 2 + i));
      const px = Math.cos(angle) * orbitR;
      const py = Math.sin(angle) * orbitR;
      const size = 1.5 + Math.sin(t * 4 + i) * 0.5;
      ctx.fillStyle = `rgba(220, 200, 255, ${0.5 + 0.3 * Math.sin(t * 3 + i)})`;
      ctx.beginPath();
      ctx.arc(px, py, size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}
