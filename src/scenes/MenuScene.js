import { KEYS } from '../config.js';
import { randInt } from '../utils/math.js';
import Star from '../entities/Star.js';
import { CYAN, ORANGE, TEXT, titleFont, bodyFont } from '../rendering/UITheme.js';
import { drawVignette, drawGlowText } from '../rendering/UIUtils.js';

export default class MenuScene {
  constructor() {
    this.stars = [];
    this.selectedOption = 0;
    this.time = 0;
  }

  enter(game) {
    const { width, height } = game.renderer;
    this.stars = Star.createField(width, height);
    this.time = 0;
  }

  exit() {}

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

    // Menu navigation
    if (game.input.wasPressed(KEYS.ROTATE_RIGHT) || game.input.wasPressed('ArrowDown')) {
      this.selectedOption = (this.selectedOption + 1) % 2;
    }
    if (game.input.wasPressed(KEYS.ROTATE_LEFT) || game.input.wasPressed('ArrowUp')) {
      this.selectedOption = (this.selectedOption + 1) % 2;
    }

    if (game.input.wasPressed(KEYS.START) || game.input.wasPressed(KEYS.THRUST)) {
      if (this.selectedOption === 0) {
        game.startGame(0);
      } else {
        import('./LevelSelectScene.js').then(({ default: LevelSelectScene }) => {
          game.scenes.replace(new LevelSelectScene());
        });
      }
    }
  }

  render(game, ctx) {
    const { width, height } = game.renderer;

    // Stars
    for (const s of this.stars) s.draw(ctx);

    // Vignette instead of gray box
    drawVignette(ctx, width, height);

    ctx.save();
    ctx.textAlign = 'center';

    // Title with pulsing cyan glow
    ctx.font = titleFont(48);
    const pulseBlur = 12 + 6 * Math.sin(this.time * 2);
    drawGlowText(ctx, 'SPACEY', width / 2, height * 0.22, CYAN, pulseBlur);

    // Story text
    ctx.font = bodyFont(16);
    ctx.fillStyle = TEXT;
    const lines = [
      'Lost in space with little fuel. Use planetary gravity',
      'to slingshot through wormholes and find your way home.',
      'W: thrust  |  A/D: rotate  |  X: reset level',
    ];
    let y = height * 0.38;
    for (const line of lines) {
      ctx.fillText(line, width / 2, y);
      y += 28;
    }

    // Menu options
    y = height * 0.62;
    const options = ['Start Game', 'Level Select'];
    for (let i = 0; i < options.length; i++) {
      const selected = i === this.selectedOption;
      ctx.font = titleFont(selected ? 24 : 20);
      if (selected) {
        drawGlowText(ctx, '> ' + options[i], width / 2, y, ORANGE, 16);
      } else {
        ctx.fillStyle = TEXT;
        ctx.fillText('  ' + options[i], width / 2, y);
      }
      y += 45;
    }

    // Hint text
    ctx.font = bodyFont(14);
    ctx.fillStyle = '#556677';
    ctx.fillText('A/D to navigate, W or ESC to select', width / 2, height * 0.88);

    ctx.restore();
  }
}
