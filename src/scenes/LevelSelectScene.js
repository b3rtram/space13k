import { KEYS } from '../config.js';
import { randInt } from '../utils/math.js';
import { LEVEL_COUNT } from '../levels/levels.js';
import Star from '../entities/Star.js';
import { CYAN, ORANGE, TEXT, DIM, titleFont, bodyFont } from '../rendering/UITheme.js';
import { drawVignette, drawGlowText, drawPanel, drawStar } from '../rendering/UIUtils.js';

const STORAGE_KEY = 'space13k_progress';

function loadProgress() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (data && Array.isArray(data.levels)) return data;
  } catch { /* ignore */ }
  return { levels: [] };
}

export function saveCompletion(levelIndex, fuel, time) {
  const progress = loadProgress();
  while (progress.levels.length <= levelIndex) {
    progress.levels.push(null);
  }

  let stars = 1;
  if (fuel > 2) stars = 3;
  else if (fuel > 0.5) stars = 2;

  const existing = progress.levels[levelIndex];
  if (!existing || stars > existing.stars) {
    progress.levels[levelIndex] = { stars, fuel, time };
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function getProgress() {
  return loadProgress();
}

export default class LevelSelectScene {
  constructor() {
    this.stars = [];
    this.selected = 0;
    this.progress = null;
    this.time = 0;
  }

  enter(game) {
    const { width, height } = game.renderer;
    this.stars = Star.createField(width, height);
    this.progress = loadProgress();
    this.selected = 0;
    this.time = 0;
  }

  exit() {}

  _isUnlocked(index) {
    if (index === 0) return true;
    return this.progress.levels[index - 1] != null;
  }

  update(game, dt) {
    const { width, height } = game.renderer;
    this.time += dt;

    for (const s of this.stars) {
      s.update(dt);
      if (s.x > width) {
        s.x = -2;
        s.y = randInt(0, height);
      }
    }

    // Navigation
    if (game.input.wasPressed(KEYS.ROTATE_RIGHT)) {
      this.selected = Math.min(this.selected + 1, LEVEL_COUNT - 1);
    }
    if (game.input.wasPressed(KEYS.ROTATE_LEFT)) {
      this.selected = Math.max(this.selected - 1, 0);
    }

    // Select level
    if (game.input.wasPressed(KEYS.START)) {
      if (this._isUnlocked(this.selected)) {
        game.startGame(this.selected);
      }
    }
  }

  render(game, ctx) {
    const { width, height } = game.renderer;

    for (const s of this.stars) s.draw(ctx);

    drawVignette(ctx, width, height);

    ctx.save();
    ctx.textAlign = 'center';

    // Title
    ctx.font = titleFont(32);
    drawGlowText(ctx, 'SELECT LEVEL', width / 2, height * 0.14, CYAN, 14);

    // Level grid
    const cols = 4;
    const cardW = 130;
    const cardH = 100;
    const gap = 16;
    const gridW = cols * cardW + (cols - 1) * gap;
    const startX = (width - gridW) / 2;
    const startY = height * 0.24;

    for (let i = 0; i < LEVEL_COUNT; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = startX + col * (cardW + gap);
      const y = startY + row * (cardH + gap);

      const unlocked = this._isUnlocked(i);
      const isSelected = i === this.selected;
      const completion = this.progress.levels[i];

      // Card panel
      const borderColor = isSelected ? ORANGE : CYAN;
      drawPanel(ctx, x, y, cardW, cardH, borderColor);

      // Selected glow
      if (isSelected) {
        ctx.save();
        ctx.shadowColor = ORANGE;
        ctx.shadowBlur = 14;
        ctx.strokeStyle = ORANGE;
        ctx.lineWidth = 2;
        ctx.strokeRect(x + 2, y + 2, cardW - 4, cardH - 4);
        ctx.restore();
      }

      const cx = x + cardW / 2;

      if (!unlocked) {
        // Padlock icon
        ctx.save();
        ctx.strokeStyle = DIM;
        ctx.lineWidth = 2;
        ctx.fillStyle = DIM;

        // Lock body
        const lockW = 18;
        const lockH = 14;
        const lockX = cx - lockW / 2;
        const lockY = y + cardH / 2 - 4;
        ctx.fillRect(lockX, lockY, lockW, lockH);

        // Lock shackle (arc)
        ctx.beginPath();
        ctx.arc(cx, lockY, 8, Math.PI, 0);
        ctx.stroke();

        ctx.restore();
      } else {
        // Level number
        ctx.font = titleFont(20);
        ctx.fillStyle = isSelected ? ORANGE : TEXT;
        ctx.fillText(`Level ${i + 1}`, cx, y + 40);

        // Star rating
        const starSize = 10;
        const starGap = 24;
        const starY = y + 68;
        const starStartX = cx - starGap;

        for (let s = 0; s < 3; s++) {
          const sx = starStartX + s * starGap;
          const earned = completion && s < completion.stars;
          drawStar(ctx, sx, starY, starSize);
          if (earned) {
            ctx.fillStyle = ORANGE;
            ctx.fill();
          } else {
            ctx.strokeStyle = DIM;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
    }

    // Hint
    ctx.font = bodyFont(14);
    ctx.fillStyle = DIM;
    ctx.fillText('\u2190/\u2192 to navigate, Enter to select', width / 2, height * 0.88);

    ctx.restore();
  }
}
