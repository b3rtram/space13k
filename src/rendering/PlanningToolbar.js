import { CYAN, ORANGE, BG_PANEL, DIM, bodyFont, titleFont } from './UITheme.js';
import { drawPanel, drawGlowText, roundedRect } from './UIUtils.js';

const TOOLBAR_HEIGHT = 60;
const BUTTON_W = 120;
const BUTTON_H = 40;
const START_W = 100;

export default class PlanningToolbar {
  constructor() {
    this.abilities = {};
    this.selectedAbility = null;
    this.time = 0;
  }

  init(abilitiesConfig) {
    this.abilities = {};
    this.selectedAbility = null;
    this.time = 0;

    for (const [key, total] of Object.entries(abilitiesConfig)) {
      if (total > 0) {
        this.abilities[key] = { total, used: 0 };
      }
    }

    // Auto-select first available ability
    const keys = Object.keys(this.abilities);
    if (keys.length > 0) this.selectedAbility = keys[0];
  }

  update(dt) {
    this.time += dt;
  }

  handleClick(mx, my, canvasWidth, canvasHeight) {
    const toolbarY = canvasHeight - TOOLBAR_HEIGHT;
    if (my < toolbarY) return null;

    // Ability buttons (centered)
    const abilityKeys = Object.keys(this.abilities);
    const totalAbilityW = abilityKeys.length * (BUTTON_W + 10) - 10;
    let bx = (canvasWidth - totalAbilityW) / 2;

    for (const key of abilityKeys) {
      const by = toolbarY + (TOOLBAR_HEIGHT - BUTTON_H) / 2;
      if (mx >= bx && mx <= bx + BUTTON_W && my >= by && my <= by + BUTTON_H) {
        if (this.hasCharges(key)) {
          this.selectedAbility = this.selectedAbility === key ? null : key;
          return { action: 'select', ability: key };
        }
        return null;
      }
      bx += BUTTON_W + 10;
    }

    // START button (right side)
    const startX = canvasWidth - START_W - 20;
    const startY = toolbarY + (TOOLBAR_HEIGHT - BUTTON_H) / 2;
    if (mx >= startX && mx <= startX + START_W && my >= startY && my <= startY + BUTTON_H) {
      return { action: 'start' };
    }

    return null;
  }

  useCharge(key) {
    if (this.abilities[key] && this.abilities[key].used < this.abilities[key].total) {
      this.abilities[key].used++;
      return true;
    }
    return false;
  }

  refundCharge(key) {
    if (this.abilities[key] && this.abilities[key].used > 0) {
      this.abilities[key].used--;
    }
  }

  hasCharges(key) {
    const a = this.abilities[key];
    return a && a.used < a.total;
  }

  draw(ctx, width, height) {
    const toolbarY = height - TOOLBAR_HEIGHT;

    // Background panel
    drawPanel(ctx, 0, toolbarY, width, TOOLBAR_HEIGHT, CYAN);

    // "PLANNING" label (left side)
    ctx.save();
    ctx.font = titleFont(14);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    drawGlowText(ctx, 'PLANNING', 20, toolbarY + TOOLBAR_HEIGHT / 2, CYAN, 8);
    ctx.restore();

    // Ability buttons (centered)
    const abilityKeys = Object.keys(this.abilities);
    const totalAbilityW = abilityKeys.length * (BUTTON_W + 10) - 10;
    let bx = (width - totalAbilityW) / 2;

    for (const key of abilityKeys) {
      const by = toolbarY + (TOOLBAR_HEIGHT - BUTTON_H) / 2;
      const ability = this.abilities[key];
      const remaining = ability.total - ability.used;
      const isSelected = this.selectedAbility === key;
      const isEmpty = remaining === 0;

      ctx.save();
      roundedRect(ctx, bx, by, BUTTON_W, BUTTON_H, 6);

      if (isEmpty) {
        ctx.fillStyle = 'rgba(8, 16, 32, 0.6)';
        ctx.fill();
        ctx.strokeStyle = DIM;
        ctx.lineWidth = 1;
        ctx.stroke();
      } else if (isSelected) {
        ctx.fillStyle = 'rgba(255, 170, 0, 0.15)';
        ctx.fill();
        ctx.strokeStyle = ORANGE;
        ctx.lineWidth = 2;
        ctx.shadowColor = ORANGE;
        ctx.shadowBlur = 8 + Math.sin(this.time * 4) * 4;
        ctx.stroke();
        ctx.shadowBlur = 0;
      } else {
        ctx.fillStyle = 'rgba(8, 16, 32, 0.6)';
        ctx.fill();
        ctx.strokeStyle = CYAN;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Button label
      ctx.font = bodyFont(12);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const label = this._abilityLabel(key);
      ctx.fillStyle = isEmpty ? DIM : (isSelected ? ORANGE : '#c8d8e8');
      ctx.fillText(`${label}  ${remaining}x`, bx + BUTTON_W / 2, by + BUTTON_H / 2);
      ctx.restore();

      bx += BUTTON_W + 10;
    }

    // START button (right side)
    const startX = width - START_W - 20;
    const startY = toolbarY + (TOOLBAR_HEIGHT - BUTTON_H) / 2;
    const startPulse = 0.8 + Math.sin(this.time * 3) * 0.2;

    ctx.save();
    roundedRect(ctx, startX, startY, START_W, BUTTON_H, 6);
    ctx.fillStyle = `rgba(255, 170, 0, ${0.15 * startPulse})`;
    ctx.fill();
    ctx.strokeStyle = ORANGE;
    ctx.lineWidth = 2;
    ctx.shadowColor = ORANGE;
    ctx.shadowBlur = 6 * startPulse;
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.font = titleFont(14);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    drawGlowText(ctx, 'START', startX + START_W / 2, startY + BUTTON_H / 2, ORANGE, 6);
    ctx.restore();
  }

  _abilityLabel(key) {
    if (key === 'gravityFlip') return 'FLIP';
    if (key === 'gravityWell') return 'WELL';
    return key.toUpperCase();
  }
}
