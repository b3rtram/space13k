import { randInt } from '../utils/math.js';
import Star from '../entities/Star.js';
import { CYAN, ORANGE, TEXT, DIM, titleFont, bodyFont } from '../rendering/UITheme.js';
import { drawVignette, drawGlowText } from '../rendering/UIUtils.js';

export default class EndScene {
  constructor() {
    this.stars = [];
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
  }

  render(game, ctx) {
    const { width, height } = game.renderer;

    for (const s of this.stars) s.draw(ctx);

    drawVignette(ctx, width, height);

    ctx.save();
    ctx.textAlign = 'center';

    // Title with orange glow
    ctx.font = titleFont(42);
    const pulseBlur = 14 + 6 * Math.sin(this.time * 2);
    drawGlowText(ctx, 'MISSION COMPLETE', width / 2, height * 0.3, ORANGE, pulseBlur);

    // Subtitle
    ctx.font = bodyFont(20);
    ctx.fillStyle = TEXT;
    ctx.fillText('You have arrived home!', width / 2, height * 0.42);

    // Credits
    ctx.font = bodyFont(14);
    ctx.fillStyle = DIM;
    ctx.fillText('Asteroid graphics: opengameart.org/users/funwithpixels', width / 2, height * 0.58);
    ctx.fillText('Planet graphics: opengameart.org/users/master484', width / 2, height * 0.63);

    // Hint
    ctx.font = bodyFont(14);
    ctx.fillStyle = DIM;
    ctx.fillText('Press ESC to return', width / 2, height * 0.78);

    ctx.restore();
  }
}
