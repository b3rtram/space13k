import PhysicsWorld from '../physics/PhysicsWorld.js';
import LevelLoader from '../levels/LevelLoader.js';
import { levels, LEVEL_COUNT } from '../levels/levels.js';
import { KEYS } from '../config.js';
import { randInt } from '../utils/math.js';
import ParticleSystem from '../rendering/ParticleSystem.js';
import GravityFieldRenderer from '../rendering/GravityFieldRenderer.js';
import HUD from '../rendering/HUD.js';
import { saveCompletion } from './LevelSelectScene.js';

export default class GameScene {
  constructor(levelIndex) {
    this.levelIndex = levelIndex;
    this.physics = null;
    this.ship = null;
    this.planets = [];
    this.asteroids = [];
    this.wormhole = null;
    this.fuelPickups = [];
    this.stars = [];
    this.collisionResult = null;

    this.particles = new ParticleSystem();
    this.gravityField = new GravityFieldRenderer();
    this.hud = new HUD();

    this.screenShake = 0;
    this.fadeAlpha = 1;
    this.wasThrusting = false;
    this.levelTime = 0;
  }

  enter(game) {
    this._loadLevel(game);
  }

  _loadLevel(game) {
    // Stop audio from previous level
    game.audio.stopThrust();

    if (this.physics) {
      this.physics.destroy();
    }

    this.physics = new PhysicsWorld();
    this.collisionResult = null;
    this.particles = new ParticleSystem();
    this.fadeAlpha = 1;
    this.wasThrusting = false;
    this.levelTime = 0;

    const { width, height } = game.renderer;
    const data = levels[this.levelIndex];
    const entities = LevelLoader.load(data, width, height);

    this.ship = entities.ship;
    this.planets = entities.planets;
    this.wormhole = entities.wormhole;
    this.asteroids = entities.asteroids;
    this.fuelPickups = entities.fuelPickups;
    this.stars = entities.stars;

    // Add bodies to physics world
    // IMPORTANT: Ship must be added LAST — matter-attractors iterates
    // j = i+1, so attractors only affect bodies at higher indices.
    for (const p of this.planets) this.physics.addBody(p.body);
    this.physics.addBody(this.wormhole.body);
    for (const a of this.asteroids) this.physics.addBody(a.body);
    for (const fp of this.fuelPickups) this.physics.addBody(fp.body);
    this.physics.addBody(this.ship.body);

    // Collision detection
    this.physics.onCollisionStart((event) => {
      for (const pair of event.pairs) {
        const labels = [pair.bodyA.label, pair.bodyB.label];
        if (!labels.includes('ship')) continue;

        const other = pair.bodyA.label === 'ship' ? pair.bodyB.label : pair.bodyA.label;

        if (other === 'planet' || other === 'asteroid') {
          this.collisionResult = 'death';
          const { x, y } = this.ship.body.position;
          this.particles.emitExplosion(x, y);
          this.screenShake = 0.3;
          game.audio.playCollision();
          game.audio.stopThrust();
        } else if (other === 'wormhole') {
          this.collisionResult = 'wormhole';
          game.audio.playWormholeEntry();
          game.audio.stopThrust();
        } else if (other === 'fuelPickup') {
          const otherBody = pair.bodyA.label === 'ship' ? pair.bodyB : pair.bodyA;
          const pickup = this.fuelPickups.find((fp) => fp.body === otherBody);
          if (pickup && !pickup.collected) {
            pickup.collected = true;
            this.ship.fuel += pickup.amount;
            this.physics.removeBody(pickup.body);
            game.audio.playPickup();
          }
        }
      }
    });
  }

  exit(game) {
    game.audio.stopThrust();
    if (this.physics) {
      this.physics.destroy();
      this.physics = null;
    }
  }

  update(game, dt) {
    const { width, height } = game.renderer;

    // Fade in
    if (this.fadeAlpha > 0) {
      this.fadeAlpha = Math.max(0, this.fadeAlpha - dt * 3);
    }

    // Screen shake decay
    if (this.screenShake > 0) {
      this.screenShake = Math.max(0, this.screenShake - dt);
    }

    // Reset level
    if (game.input.wasPressed(KEYS.RESET)) {
      this._loadLevel(game);
      return;
    }

    // Ship input
    this.ship.update(game.input, dt);

    // Thrust audio
    if (this.ship.thrusting && !this.wasThrusting) {
      game.audio.startThrust();
    } else if (!this.ship.thrusting && this.wasThrusting) {
      game.audio.stopThrust();
    }
    this.wasThrusting = this.ship.thrusting;

    // Fuel warning audio
    game.audio.updateFuelWarning(this.ship.fuel);

    // Thrust particles
    if (this.ship.thrusting) {
      const { x, y } = this.ship.body.position;
      const angle = this.ship.body.angle;
      const ex = x - Math.cos(angle) * 15;
      const ey = y - Math.sin(angle) * 15;
      this.particles.emitThrust(ex, ey, angle);
    }

    // Ship trail
    if (Math.random() < 0.3) {
      const { x, y } = this.ship.body.position;
      this.particles.emitTrail(x, y);
    }

    // Update entities
    for (const a of this.asteroids) a.update(dt);
    this.wormhole.update(dt);
    for (const fp of this.fuelPickups) fp.update(dt);

    // Stars
    for (const s of this.stars) {
      s.update(dt);
      if (s.x > width) {
        s.x = -2;
        s.y = randInt(0, height);
      }
    }

    // Wormhole particles
    const wh = this.wormhole;
    this.particles.emitWormholeSwirl(
      wh.body.position.x,
      wh.body.position.y,
      wh.radius,
      dt,
    );

    // Update visual systems
    this.particles.update(dt);
    this.gravityField.update(dt);
    this.hud.update(dt, this.ship.fuel);

    // Track level time
    this.levelTime += dt;

    // Step physics (fixed timestep)
    this.physics.update();

    // Boundary collision
    const { x, y } = this.ship.body.position;
    if (x < 0 || x > width || y < 0 || y > height) {
      this.collisionResult = 'death';
    }

    // Handle collisions
    if (this.collisionResult === 'death') {
      this._loadLevel(game);
    } else if (this.collisionResult === 'wormhole') {
      saveCompletion(this.levelIndex, this.ship.fuel, this.levelTime);
      this.levelIndex++;
      if (this.levelIndex >= LEVEL_COUNT) {
        import('./EndScene.js').then(({ default: EndScene }) => {
          game.scenes.replace(new EndScene());
        });
      } else {
        this._loadLevel(game);
      }
    }
  }

  render(game, ctx) {
    const { width, height } = game.renderer;

    // Apply screen shake
    ctx.save();
    if (this.screenShake > 0) {
      const intensity = this.screenShake * 10;
      ctx.translate(
        (Math.random() - 0.5) * intensity,
        (Math.random() - 0.5) * intensity,
      );
    }

    // Nebula background
    const nebula = game.assets.get('nebula');
    if (nebula) {
      ctx.save();
      ctx.globalAlpha = 0.35;
      // Tile nebula across canvas with slow parallax scroll
      const scrollX = (performance.now() * 0.003) % nebula.width;
      for (let x = -scrollX; x < width; x += nebula.width) {
        for (let y = 0; y < height; y += nebula.height) {
          ctx.drawImage(nebula, x, y);
        }
      }
      ctx.restore();
    }

    // Stars (background)
    for (const s of this.stars) s.draw(ctx);

    // Gravity field rings
    this.gravityField.draw(ctx, this.planets);

    // Planets
    for (const p of this.planets) p.draw(ctx, game.assets);

    // Asteroids
    for (const a of this.asteroids) a.draw(ctx, game.assets);

    // Fuel pickups
    for (const fp of this.fuelPickups) {
      if (!fp.collected) fp.draw(ctx);
    }

    // Wormhole
    this.wormhole.draw(ctx);

    // Particles
    this.particles.draw(ctx);

    // Ship
    this.ship.draw(ctx);

    ctx.restore(); // End screen shake

    // HUD (not affected by screen shake)
    this.hud.draw(ctx, width, height, this.ship.fuel, this.levelIndex);

    // Fade overlay
    if (this.fadeAlpha > 0) {
      ctx.save();
      ctx.globalAlpha = this.fadeAlpha;
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    }
  }
}
