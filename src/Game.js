import Renderer from './rendering/Renderer.js';
import InputManager from './core/InputManager.js';
import SceneManager from './core/SceneManager.js';
import AssetLoader from './core/AssetLoader.js';
import AudioManager from './core/AudioManager.js';
import Camera from './core/Camera.js';
import MenuScene from './scenes/MenuScene.js';

export default class Game {
  constructor(canvas) {
    this.renderer = new Renderer(canvas);
    this.input = new InputManager();
    this.scenes = new SceneManager();
    this.assets = new AssetLoader();
    this.audio = new AudioManager();
    this.camera = new Camera();

    this.lastTime = 0;
    this.running = false;

    // Init audio on first user interaction (browser policy)
    const initAudio = () => {
      this.audio.init();
      document.removeEventListener('keydown', initAudio);
      document.removeEventListener('click', initAudio);
    };
    document.addEventListener('keydown', initAudio);
    document.addEventListener('click', initAudio);
  }

  async init() {
    await this.assets.loadAll({
      p1: '/assets/planets/p1.png',
      p2: '/assets/planets/p2.png',
      p3: '/assets/planets/p3.png',
      p4: '/assets/planets/p4.png',
      asteroid: '/assets/asteroids/asteroid.png',
    });

    this.scenes.push(new MenuScene());
  }

  start() {
    this.running = true;
    this.lastTime = performance.now();
    requestAnimationFrame((t) => this._loop(t));
  }

  startGame(levelIndex) {
    import('./scenes/GameScene.js').then(({ default: GameScene }) => {
      this.scenes.replace(new GameScene(levelIndex));
    });
  }

  _loop(now) {
    if (!this.running) return;

    const dt = Math.min((now - this.lastTime) / 1000, 0.05);
    this.lastTime = now;

    this.scenes.update(this, dt);

    this.renderer.clear();
    const ctx = this.renderer.ctx;
    this.scenes.render(this, ctx);

    this.input.endFrame();

    requestAnimationFrame((t) => this._loop(t));
  }
}
