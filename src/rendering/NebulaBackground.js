export default class NebulaBackground {
  constructor() {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Additive blending for overlapping nebula clouds
    ctx.globalCompositeOperation = 'lighter';

    const colors = [
      [20, 30, 80],   // deep blue
      [60, 20, 80],   // violet
      [20, 60, 80],   // teal
      [40, 15, 60],   // dark purple
      [30, 25, 90],   // indigo
      [50, 10, 70],   // magenta-purple
    ];

    // Draw 7 random radial gradient blobs
    for (let i = 0; i < 7; i++) {
      const cx = Math.random() * size;
      const cy = Math.random() * size;
      const r = 40 + Math.random() * 60;
      const [cr, cg, cb] = colors[i % colors.length];

      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grad.addColorStop(0, `rgba(${cr}, ${cg}, ${cb}, 0.6)`);
      grad.addColorStop(0.5, `rgba(${cr}, ${cg}, ${cb}, 0.2)`);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = grad;
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
    }

    this.texture = canvas;
    this.size = size;
  }

  draw(ctx, width, height) {
    ctx.save();
    ctx.globalAlpha = 0.3;
    const scrollX = (performance.now() * 0.003) % this.size;
    for (let x = -scrollX; x < width; x += this.size) {
      for (let y = 0; y < height; y += this.size) {
        ctx.drawImage(this.texture, x, y);
      }
    }
    ctx.restore();
  }
}
