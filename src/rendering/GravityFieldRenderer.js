export default class GravityFieldRenderer {
  constructor() {
    this.time = 0;
  }

  update(dt) {
    this.time += dt;
  }

  draw(ctx, planets) {
    for (const planet of planets) {
      const { x, y } = planet.body.position;
      const r = planet.radius;

      // Draw 3 concentric rings with pulsing opacity
      for (let i = 1; i <= 3; i++) {
        const ringRadius = r + i * 25;
        const pulse = 0.15 + Math.sin(this.time * 1.5 + i * 0.8) * 0.08;

        ctx.save();
        ctx.strokeStyle = `rgba(100, 150, 255, ${pulse})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 8]);
        ctx.lineDashOffset = -this.time * 20 * (i % 2 === 0 ? 1 : -1);
        ctx.beginPath();
        ctx.arc(x, y, ringRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    }
  }
}
