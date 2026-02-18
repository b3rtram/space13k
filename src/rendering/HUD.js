import { LEVEL_COUNT } from '../levels/levels.js';

export default class HUD {
  constructor() {
    this.fuelWarningFlash = 0;
  }

  update(dt, fuel) {
    if (fuel < 1) {
      this.fuelWarningFlash += dt * 5;
    } else {
      this.fuelWarningFlash = 0;
    }
  }

  draw(ctx, width, height, fuel, levelIndex) {
    // Fuel bar
    ctx.save();
    ctx.translate(50, 50);
    ctx.font = '20px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText('Tank', 0, 0);

    const barWidth = fuel * 10;
    const maxBarWidth = 50; // 5 fuel * 10

    // Background bar
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(70, -15, maxBarWidth, 20);

    // Fuel bar
    if (fuel < 1) {
      const flash = Math.sin(this.fuelWarningFlash) > 0;
      ctx.fillStyle = flash ? '#ff3333' : '#aa0000';
    } else if (fuel < 2) {
      ctx.fillStyle = '#ffaa00';
    } else {
      ctx.fillStyle = '#3366ff';
    }
    ctx.fillRect(70, -15, barWidth, 20);
    ctx.restore();

    // Level progress
    ctx.save();
    const progressY = height - 30;
    for (let i = 0; i < LEVEL_COUNT; i++) {
      ctx.save();
      ctx.translate(50 + 150 * i, progressY);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(100, 0);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.translate(50 + 150 * (i + 1), progressY);
      ctx.beginPath();
      ctx.arc(-25, 0, 8, 0, Math.PI * 2);
      if (i > levelIndex) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.stroke();
      } else if (i === levelIndex) {
        ctx.fillStyle = '#ffaa00';
        ctx.fill();
      } else {
        ctx.fillStyle = 'white';
        ctx.fill();
      }
      ctx.restore();
    }
    ctx.save();
    ctx.translate(50 + 150 * LEVEL_COUNT, progressY);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(100, 0);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.stroke();
    ctx.restore();
    ctx.restore();

    // Key hints
    ctx.save();
    ctx.globalAlpha = 0.5;
    const kx = width - 100;
    const ky = height - 100;
    ctx.font = '25px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText('w', kx, ky);
    ctx.font = '12px Arial';
    ctx.fillText('Burst', kx - 7, ky + 25);
    ctx.font = '25px Arial';
    ctx.fillText('a', kx + 30, ky + 60);
    ctx.font = '12px Arial';
    ctx.fillText('Rotate', kx + 23, ky + 85);
    ctx.font = '25px Arial';
    ctx.fillText('d', kx - 30, ky + 60);
    ctx.font = '12px Arial';
    ctx.fillText('Rotate', kx - 37, ky + 85);
    ctx.restore();
  }
}
