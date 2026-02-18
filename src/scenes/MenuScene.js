import { KEYS, STAR_COUNT, STAR_MIN_Z, STAR_MAX_Z } from '../config.js';
import { randFloat, randInt } from '../utils/math.js';
import Star from '../entities/Star.js';

export default class MenuScene {
  constructor() {
    this.stars = [];
    this.selectedOption = 0;
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

    // Menu overlay
    ctx.fillStyle = 'rgba(50, 50, 50, 0.8)';
    ctx.fillRect(50, 50, width - 100, height - 100);

    ctx.save();
    ctx.font = '32px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText('SpaceY', width / 2, 120);

    ctx.font = '18px Arial';
    ctx.textAlign = 'left';
    const x = 100;
    let y = 170;
    const lines = [
      'You are lost in space with little fuel left.',
      'To come home you need to fly through different wormholes.',
      'The only chance is to use the gravity of planets.',
      '',
      'W  -  Thrust (costs fuel)',
      'A  -  Rotate counterclockwise (costs fuel)',
      'D  -  Rotate clockwise',
      'X  -  Reset level',
      '',
      'Good luck getting home!',
    ];

    for (const line of lines) {
      ctx.fillText(line, x, y);
      y += 26;
    }

    // Menu options
    y += 20;
    ctx.textAlign = 'center';
    const options = ['Start Game', 'Level Select'];
    for (let i = 0; i < options.length; i++) {
      ctx.font = i === this.selectedOption ? 'bold 22px Arial' : '20px Arial';
      ctx.fillStyle = i === this.selectedOption ? '#ffaa00' : 'white';
      const prefix = i === this.selectedOption ? '> ' : '  ';
      ctx.fillText(prefix + options[i], width / 2, y);
      y += 35;
    }

    ctx.font = '14px Arial';
    ctx.fillStyle = '#888';
    ctx.fillText('A/D to navigate, W or ESC to select', width / 2, y + 10);

    ctx.restore();
  }
}
