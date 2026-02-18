import { BG_PANEL, CYAN } from './UITheme.js';

export function roundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

export function drawPanel(ctx, x, y, w, h, borderColor = CYAN) {
  ctx.save();
  roundedRect(ctx, x, y, w, h, 8);
  ctx.fillStyle = BG_PANEL;
  ctx.fill();
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 1.5;
  ctx.globalAlpha = 0.6;
  ctx.stroke();
  ctx.restore();
}

export function drawGlowText(ctx, text, x, y, color, blur = 12) {
  ctx.save();
  ctx.shadowColor = color;
  ctx.shadowBlur = blur;
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
  // Double render for stronger glow
  ctx.fillText(text, x, y);
  ctx.restore();
}

export function drawVignette(ctx, w, h) {
  const gradient = ctx.createRadialGradient(w / 2, h / 2, h * 0.3, w / 2, h / 2, h * 0.85);
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0.7)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);
}

export function drawStar(ctx, cx, cy, r) {
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
    const outerX = cx + r * Math.cos(angle);
    const outerY = cy + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(outerX, outerY);
    else ctx.lineTo(outerX, outerY);

    const innerAngle = angle + Math.PI / 5;
    const innerR = r * 0.4;
    ctx.lineTo(cx + innerR * Math.cos(innerAngle), cy + innerR * Math.sin(innerAngle));
  }
  ctx.closePath();
}
