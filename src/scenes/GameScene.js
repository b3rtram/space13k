import PhysicsWorld from '../physics/PhysicsWorld.js';
import LevelLoader from '../levels/LevelLoader.js';
import { levels, LEVEL_COUNT } from '../levels/levels.js';
import { KEYS } from '../config.js';
import { randInt } from '../utils/math.js';
import ParticleSystem from '../rendering/ParticleSystem.js';
import GravityFieldRenderer from '../rendering/GravityFieldRenderer.js';
import HUD from '../rendering/HUD.js';
import PlanningToolbar from '../rendering/PlanningToolbar.js';
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
    this.deathTimer = 0;

    this.phase = 'flying';
    this.planningToolbar = new PlanningToolbar();
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
    this.deathTimer = 0;

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

    // Determine phase based on abilities
    const abilities = data.abilities || { gravityFlip: 0 };
    const hasAbilities = Object.values(abilities).some((v) => v > 0);
    if (hasAbilities) {
      this.phase = 'planning';
      this.planningToolbar.init(abilities);
    } else {
      this.phase = 'flying';
    }

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
          this.screenShake = 0.5;
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

    // Death timer — explosion playing, wait before restarting
    if (this.deathTimer > 0) {
      this.deathTimer -= dt;
      this.particles.update(dt);
      if (this.deathTimer <= 0) {
        this.deathTimer = 0;
        this._loadLevel(game);
      }
      return;
    }

    // Planning phase
    if (this.phase === 'planning') {
      this._updatePlanning(game, dt);
      return;
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
      if (this.collisionResult !== 'death') {
        this.collisionResult = 'death';
        this.particles.emitExplosion(
          Math.max(0, Math.min(width, x)),
          Math.max(0, Math.min(height, y)),
        );
        this.screenShake = 0.5;
        game.audio.playCollision();
        game.audio.stopThrust();
      }
    }

    // Handle collisions
    if (this.collisionResult === 'death') {
      if (this.deathTimer === 0) {
        this.deathTimer = 1.0;
        this.ship.visible = false;
      }
      return; // Skip wormhole check during death
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

  _updatePlanning(game, dt) {
    const { width, height } = game.renderer;

    // Keep visual systems alive
    for (const s of this.stars) {
      s.update(dt);
      if (s.x > width) {
        s.x = -2;
        s.y = randInt(0, height);
      }
    }
    const wh = this.wormhole;
    this.particles.emitWormholeSwirl(
      wh.body.position.x,
      wh.body.position.y,
      wh.radius,
      dt,
    );
    this.particles.update(dt);
    this.gravityField.update(dt);
    this.planningToolbar.update(dt);

    // Enter/Escape starts flying
    if (game.input.wasPressed(KEYS.START)) {
      this._startFlying();
      return;
    }

    // Handle mouse clicks
    if (game.input.wasClicked()) {
      const mx = game.input.mouseX;
      const my = game.input.mouseY;

      // Check toolbar first
      const toolbarResult = this.planningToolbar.handleClick(mx, my, width, height);
      if (toolbarResult) {
        if (toolbarResult.action === 'start') {
          this._startFlying();
          return;
        }
        // 'select' is handled inside handleClick
        return;
      }

      // Check planet clicks (only when ability is selected)
      if (this.planningToolbar.selectedAbility === 'gravityFlip') {
        for (const planet of this.planets) {
          if (planet.containsPoint(mx, my)) {
            if (planet.flipped) {
              // Undo flip
              planet.unflipGravity();
              this.planningToolbar.refundCharge('gravityFlip');
            } else if (this.planningToolbar.hasCharges('gravityFlip')) {
              // Apply flip
              planet.flipGravity();
              this.planningToolbar.useCharge('gravityFlip');
            }
            break;
          }
        }
      }
    }
  }

  _startFlying() {
    this.phase = 'flying';
    this.levelTime = 0;
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
    if (this.ship.visible !== false) this.ship.draw(ctx);

    ctx.restore(); // End screen shake

    // HUD (not affected by screen shake)
    this.hud.draw(ctx, width, height, this.ship.fuel, this.levelIndex);

    // Planning phase overlay
    if (this.phase === 'planning') {
      const selectedAbility = this.planningToolbar.selectedAbility;

      // Highlight rings around planets when ability is selected
      if (selectedAbility === 'gravityFlip') {
        for (const planet of this.planets) {
          const { x, y } = planet.body.position;
          const r = planet.radius + 15;
          const pulse = 0.5 + Math.sin(this.planningToolbar.time * 4) * 0.3;

          ctx.save();
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.lineWidth = 2;
          ctx.setLineDash([6, 4]);
          ctx.lineDashOffset = -this.planningToolbar.time * 30;

          if (planet.flipped) {
            // Green = already flipped, click to undo
            ctx.strokeStyle = `rgba(100, 255, 100, ${pulse})`;
          } else {
            // Orange = clickable
            ctx.strokeStyle = `rgba(255, 170, 0, ${pulse})`;
          }
          ctx.stroke();
          ctx.restore();
        }
      }

      // Toolbar
      this.planningToolbar.draw(ctx, width, height);

      // Crosshair cursor at mouse position
      if (selectedAbility) {
        const mx = game.input.mouseX;
        const my = game.input.mouseY;
        const cSize = 8;
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 170, 0, 0.7)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(mx - cSize, my);
        ctx.lineTo(mx + cSize, my);
        ctx.moveTo(mx, my - cSize);
        ctx.lineTo(mx, my + cSize);
        ctx.stroke();
        ctx.restore();
      }
    }

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
