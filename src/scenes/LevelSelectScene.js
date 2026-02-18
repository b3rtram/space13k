import { KEYS, STAR_COUNT, STAR_MIN_Z, STAR_MAX_Z } from '../config.js';
import { randFloat, randInt } from '../utils/math.js';
import { LEVEL_COUNT } from '../levels/levels.js';
import Star from '../entities/Star.js';

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

  // Star rating: 3 stars = fast + fuel left, 2 = medium, 1 = completed
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
  }

  enter(game) {
    const { width, height } = game.renderer;
    this.stars = Star.createField(width, height);
    this.progress = loadProgress();
    this.selected = 0;
  }

  exit() {}

  _isUnlocked(index) {
    if (index === 0) return true;
    return this.progress.levels[index - 1] != null;
  }

  update(game, dt) {
    const { width, height } = game.renderer;

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
    if (game.input.wasPressed(KEYS.START) || game.input.wasPressed(KEYS.THRUST)) {
      if (this._isUnlocked(this.selected)) {
        game.startGame(this.selected);
      }
    }
  }

  render(game, ctx) {
    const { width, height } = game.renderer;

    for (const s of this.stars) s.draw(ctx);

    ctx.fillStyle = 'rgba(50, 50, 50, 0.8)';
    ctx.fillRect(50, 50, width - 100, height - 100);

    ctx.save();
    ctx.font = '32px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText('Select Level', width / 2, 120);

    // Level grid
    const cols = 4;
    const cellW = 120;
    const cellH = 100;
    const startX = width / 2 - (cols * cellW) / 2;
    const startY = 170;

    for (let i = 0; i < LEVEL_COUNT; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const cx = startX + col * cellW + cellW / 2;
      const cy = startY + row * cellH + cellH / 2;

      const unlocked = this._isUnlocked(i);
      const isSelected = i === this.selected;
      const completion = this.progress.levels[i];

      // Cell background
      ctx.fillStyle = isSelected
        ? 'rgba(255, 170, 0, 0.3)'
        : 'rgba(255, 255, 255, 0.05)';
      ctx.fillRect(cx - 45, cy - 35, 90, 70);

      if (isSelected) {
        ctx.strokeStyle = '#ffaa00';
        ctx.lineWidth = 2;
        ctx.strokeRect(cx - 45, cy - 35, 90, 70);
      }

      // Level number
      ctx.font = '24px Arial';
      ctx.fillStyle = unlocked ? 'white' : '#555';
      ctx.textAlign = 'center';
      ctx.fillText(`Level ${i + 1}`, cx, cy - 5);

      // Star rating or lock
      if (!unlocked) {
        ctx.font = '20px Arial';
        ctx.fillStyle = '#555';
        ctx.fillText('Locked', cx, cy + 22);
      } else if (completion) {
        let starStr = '';
        for (let s = 0; s < 3; s++) {
          starStr += s < completion.stars ? '\u2605' : '\u2606';
        }
        ctx.font = '18px Arial';
        ctx.fillStyle = '#ffaa00';
        ctx.fillText(starStr, cx, cy + 22);
      }
    }

    ctx.font = '16px Arial';
    ctx.fillStyle = '#aaa';
    ctx.textAlign = 'center';
    ctx.fillText('A/D to navigate, W or ESC to select', width / 2, height - 80);

    ctx.restore();
  }
}
