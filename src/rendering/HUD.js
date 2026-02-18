import { LEVEL_COUNT } from '../levels/levels.js';
import { CYAN, ORANGE, DIM, bodyFont } from './UITheme.js';
import { roundedRect } from './UIUtils.js';

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
    ctx.save();

    // --- Fuel bar (top-left) ---
    const barX = 20;
    const barY = 20;
    const barW = 140;
    const barH = 16;
    const maxFuel = 5;
    const fuelFrac = Math.max(0, fuel / maxFuel);

    // Label
    ctx.font = bodyFont(13);
    ctx.fillStyle = '#c8d8e8';
    ctx.textAlign = 'left';
    ctx.fillText('FUEL', barX, barY - 5);

    // Background
    roundedRect(ctx, barX, barY, barW, barH, 4);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.fill();

    // Gradient fill
    if (fuelFrac > 0) {
      const fillW = fuelFrac * barW;
      ctx.save();
      roundedRect(ctx, barX, barY, fillW, barH, 4);
      ctx.clip();

      const grad = ctx.createLinearGradient(barX, 0, barX + barW, 0);
      grad.addColorStop(0, '#ff3333');
      grad.addColorStop(0.35, '#ffaa00');
      grad.addColorStop(0.7, '#44cc44');
      grad.addColorStop(1, '#44cc44');

      if (fuel < 1) {
        const flash = Math.sin(this.fuelWarningFlash) > 0;
        ctx.globalAlpha = flash ? 1 : 0.4;
      }

      ctx.fillStyle = grad;
      ctx.fillRect(barX, barY, fillW, barH);
      ctx.restore();
    }

    // Border
    roundedRect(ctx, barX, barY, barW, barH, 4);
    ctx.strokeStyle = 'rgba(200, 216, 232, 0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // --- Level progress (top-right) ---
    const sqSize = 12;
    const sqGap = 6;
    const totalW = LEVEL_COUNT * sqSize + (LEVEL_COUNT - 1) * sqGap;
    const startX = width - 20 - totalW;
    const sqY = 22;

    ctx.font = bodyFont(13);
    ctx.fillStyle = '#c8d8e8';
    ctx.textAlign = 'right';
    ctx.fillText('LEVEL', startX - 10, sqY + 11);

    for (let i = 0; i < LEVEL_COUNT; i++) {
      const x = startX + i * (sqSize + sqGap);
      roundedRect(ctx, x, sqY, sqSize, sqSize, 2);

      if (i < levelIndex) {
        ctx.fillStyle = CYAN;
      } else if (i === levelIndex) {
        ctx.fillStyle = ORANGE;
      } else {
        ctx.fillStyle = DIM;
      }
      ctx.fill();
    }

    ctx.restore();
  }
}
