import Matter from 'matter-js';

export default class Alien {
  constructor(x, y, speed) {
    this.body = Matter.Bodies.circle(x, y, 8, {
      isStatic: true,
      isSensor: true,
      label: 'alien',
    });

    this.speed = speed;
    this.time = 0;
    this.angle = 0;
  }

  update(dt, shipBody) {
    this.time += dt;

    const pos = this.body.position;
    const dx = shipBody.position.x - pos.x;
    const dy = shipBody.position.y - pos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 1) return;

    // Direction toward ship
    const nx = dx / dist;
    const ny = dy / dist;
    this.angle = Math.atan2(dy, dx);

    // Sinusoidal lateral wobble for organic movement
    const wobble = Math.sin(this.time * 3) * 0.3;
    const mx = nx + -ny * wobble;
    const my = ny + nx * wobble;

    const step = this.speed * dt * 60;
    Matter.Body.setPosition(this.body, {
      x: pos.x + mx * step,
      y: pos.y + my * step,
    });
  }

  draw(ctx) {
    const { x, y } = this.body.position;
    const t = this.time;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(this.angle);

    // Pulsing glow
    const pulse = 0.6 + Math.sin(t * 5) * 0.3;
    const glow = ctx.createRadialGradient(0, 0, 2, 0, 0, 16);
    glow.addColorStop(0, `rgba(0, 255, 200, ${0.3 * pulse})`);
    glow.addColorStop(1, 'rgba(0, 255, 200, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, Math.PI * 2);
    ctx.fill();

    // Body (oval)
    ctx.fillStyle = `rgba(30, 200, 140, ${0.8 + pulse * 0.2})`;
    ctx.beginPath();
    ctx.ellipse(0, 0, 8, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(3, -2, 2, 0, Math.PI * 2);
    ctx.arc(3, 2, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f44';
    ctx.beginPath();
    ctx.arc(4, -2, 1, 0, Math.PI * 2);
    ctx.arc(4, 2, 1, 0, Math.PI * 2);
    ctx.fill();

    // Tentacles (3 trailing)
    ctx.strokeStyle = `rgba(30, 200, 140, ${0.6 * pulse})`;
    ctx.lineWidth = 1.5;
    for (let i = -1; i <= 1; i++) {
      const offset = i * 3;
      const wave = Math.sin(t * 6 + i * 2) * 3;
      ctx.beginPath();
      ctx.moveTo(-6, offset);
      ctx.quadraticCurveTo(-10, offset + wave, -14, offset + wave * 1.5);
      ctx.stroke();
    }

    ctx.restore();
  }
}
