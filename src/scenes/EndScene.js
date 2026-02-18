import { STAR_COUNT, STAR_MIN_Z, STAR_MAX_Z } from '../config.js';
import { randFloat, randInt } from '../utils/math.js';
import Star from '../entities/Star.js';

export default class EndScene {
  constructor() {
    this.stars = [];
  }

  enter(game) {
    const { width, height } = game.renderer;
    this.stars = Star.createField(width, height);
  }

  exit() {}

  update(game, dt) {
    const { width, height } = game.renderer;
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

    // Stars
    for (const s of this.stars) s.draw(ctx);

    // Overlay
    ctx.fillStyle = 'rgba(50, 50, 50, 0.8)';
    ctx.fillRect(50, 50, width - 100, height - 100);

    ctx.save();
    ctx.font = '32px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText('SpaceY', width / 2, 120);

    ctx.font = '20px Arial';
    ctx.fillText('You have arrived home!', width / 2, 200);

    ctx.font = '50px Arial';
    ctx.fillText('GAME OVER', width / 2, 280);

    ctx.font = '16px Arial';
    ctx.fillStyle = '#aaa';
    ctx.fillText(
      'Asteroid pixel graphics: opengameart.org/users/funwithpixels',
      width / 2,
      360,
    );
    ctx.fillText(
      'Planet pixel graphics: opengameart.org/users/master484',
      width / 2,
      390,
    );
    ctx.restore();
  }
}
