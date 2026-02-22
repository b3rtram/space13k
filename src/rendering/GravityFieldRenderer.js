export default class GravityFieldRenderer {
  constructor() {
    this.time = 0;
  }

  update(dt) {
    this.time += dt;
  }

  draw(ctx, planets, gravityWells = []) {
    for (const planet of planets) {
      const { x, y } = planet.body.position;
      const r = planet.radius;
      const flipped = planet.flipped;

      // Draw 3 concentric rings with pulsing opacity
      for (let i = 1; i <= 3; i++) {
        const ringRadius = r + i * 25;
        const pulse = 0.15 + Math.sin(this.time * 1.5 + i * 0.8) * 0.08;

        ctx.save();
        ctx.strokeStyle = flipped
          ? `rgba(255, 80, 80, ${pulse})`
          : `rgba(100, 150, 255, ${pulse})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 8]);
        // Flipped: outward dash animation; Normal: inward
        const direction = flipped ? 1 : -1;
        ctx.lineDashOffset = direction * this.time * 20 * (i % 2 === 0 ? 1 : -1);
        ctx.beginPath();
        ctx.arc(x, y, ringRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    }

    // Orange rings around gravity wells
    for (const well of gravityWells) {
      const { x, y } = well.body.position;
      for (let i = 1; i <= 2; i++) {
        const ringRadius = 10 + i * 18;
        const pulse = 0.2 + Math.sin(this.time * 2 + i * 0.6) * 0.1;

        ctx.save();
        ctx.strokeStyle = `rgba(255, 170, 0, ${pulse})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 6]);
        ctx.lineDashOffset = -this.time * 25 * (i % 2 === 0 ? 1 : -1);
        ctx.beginPath();
        ctx.arc(x, y, ringRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    }
  }
}
