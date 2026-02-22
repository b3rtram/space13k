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
import NebulaBackground from '../rendering/NebulaBackground.js';
import GravityWell from '../entities/GravityWell.js';
import { CYAN, ORANGE, titleFont, bodyFont } from '../rendering/UITheme.js';
import { drawGlowText } from '../rendering/UIUtils.js';

export default class GameScene {
  constructor(levelIndex) {
    this.levelIndex = levelIndex;
    this.physics = null;
    this.ship = null;
    this.planets = [];
    this.asteroids = [];
    this.aliens = [];
    this.wormhole = null;
    this.fuelPickups = [];
    this.stars = [];
    this.collisionResult = null;

    this.particles = new ParticleSystem();
    this.gravityField = new GravityFieldRenderer();
    this.hud = new HUD();
    this.nebula = new NebulaBackground();

    this.screenShake = 0;
    this.fadeAlpha = 1;
    this.wasThrusting = false;
    this.levelTime = 0;
    this.deathTimer = 0;

    this.phase = 'flying';
    this.planningToolbar = new PlanningToolbar();
    this.gravityWells = [];

    this.levelName = '';
    this.levelNameTimer = 0;
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
    this.gravityWells = [];

    const { width, height } = game.renderer;
    const data = levels[this.levelIndex];
    this.levelName = data.name || '';
    this.levelNameTimer = 0;
    const entities = LevelLoader.load(data, width, height);

    this.ship = entities.ship;
    this.planets = entities.planets;
    this.wormhole = entities.wormhole;
    this.asteroids = entities.asteroids;
    this.aliens = entities.aliens;
    this.fuelPickups = entities.fuelPickups;
    this.stars = entities.stars;

    // Add bodies to physics world
    // IMPORTANT: Ship must be added LAST — matter-attractors iterates
    // j = i+1, so attractors only affect bodies at higher indices.
    for (const p of this.planets) this.physics.addBody(p.body);
    this.physics.addBody(this.wormhole.body);
    for (const a of this.asteroids) this.physics.addBody(a.body);
    for (const al of this.aliens) this.physics.addBody(al.body);
    for (const fp of this.fuelPickups) this.physics.addBody(fp.body);
    this.physics.addBody(this.ship.body);

    // Always start in planning phase for consistent UX
    const abilities = data.abilities || { gravityWell: 0 };
    this.phase = 'planning';
    this.planningToolbar.init(abilities);

    // Collision detection
    this.physics.onCollisionStart((event) => {
      for (const pair of event.pairs) {
        const labels = [pair.bodyA.label, pair.bodyB.label];
        if (!labels.includes('ship')) continue;

        const other = pair.bodyA.label === 'ship' ? pair.bodyB.label : pair.bodyA.label;

        if (other === 'planet' || other === 'asteroid' || other === 'alien') {
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

    // Level name timer
    if (this.levelNameTimer < 3) {
      this.levelNameTimer += dt;
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
    for (const well of this.gravityWells) well.update(dt);
    for (const a of this.asteroids) a.update(dt, this.gravityWells);
    for (const al of this.aliens) al.update(dt, this.ship.body);
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

      // Gravity well placement/removal
      if (this.planningToolbar.selectedAbility === 'gravityWell') {
        // Check if clicking an existing well to remove it
        for (let i = this.gravityWells.length - 1; i >= 0; i--) {
          if (this.gravityWells[i].containsPoint(mx, my)) {
            this.gravityWells.splice(i, 1);
            this.planningToolbar.refundCharge('gravityWell');
            return;
          }
        }

        // Ignore clicks on planets or wormhole
        for (const planet of this.planets) {
          if (planet.containsPoint(mx, my)) return;
        }
        if (this.wormhole) {
          const whPos = this.wormhole.body.position;
          const wdx = mx - whPos.x;
          const wdy = my - whPos.y;
          if (wdx * wdx + wdy * wdy <= (this.wormhole.radius + 10) * (this.wormhole.radius + 10)) return;
        }

        // Place new well if charges available
        if (this.planningToolbar.hasCharges('gravityWell')) {
          this.gravityWells.push(new GravityWell(mx, my));
          this.planningToolbar.useCharge('gravityWell');
        }
      }
    }
  }

  _startFlying() {
    // matter-attractors needs attractor bodies BEFORE the ship
    // Remove ship, add wells, re-add ship
    this.physics.removeBody(this.ship.body);
    for (const well of this.gravityWells) this.physics.addBody(well.body);
    this.physics.addBody(this.ship.body);

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
    this.nebula.draw(ctx, width, height);

    // Stars (background)
    for (const s of this.stars) s.draw(ctx);

    // Gravity field rings
    this.gravityField.draw(ctx, this.planets, this.gravityWells);

    // Planets
    for (const p of this.planets) p.draw(ctx, game.assets);

    // Asteroids
    for (const a of this.asteroids) a.draw(ctx, game.assets);

    // Aliens
    for (const al of this.aliens) al.draw(ctx);

    // Fuel pickups
    for (const fp of this.fuelPickups) {
      if (!fp.collected) fp.draw(ctx);
    }

    // Gravity wells
    for (const well of this.gravityWells) well.draw(ctx);

    // Wormhole
    this.wormhole.draw(ctx);

    // Particles
    this.particles.draw(ctx);

    // Ship
    if (this.ship.visible !== false) this.ship.draw(ctx);

    ctx.restore(); // End screen shake

    // HUD (not affected by screen shake)
    this.hud.draw(ctx, width, height, this.ship.fuel, this.levelIndex);

    // Level name title card
    if (this.levelNameTimer < 3 && this.levelName) {
      // fade in 0-0.4s, hold 0.4-2s, fade out 2-2.8s
      const t = this.levelNameTimer;
      let alpha;
      if (t < 0.4) alpha = t / 0.4;
      else if (t < 2) alpha = 1;
      else alpha = 1 - (t - 2) / 0.8;
      alpha = Math.max(0, Math.min(1, alpha));

      if (alpha > 0) {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.textAlign = 'center';

        // "Level X" label
        ctx.font = bodyFont(16);
        ctx.fillStyle = CYAN;
        ctx.fillText(`Level ${this.levelIndex + 1}`, width / 2, height * 0.38);

        // Level name
        ctx.font = titleFont(30);
        drawGlowText(ctx, this.levelName, width / 2, height * 0.44, ORANGE, 12);

        ctx.restore();
      }
    }

    // Planning phase overlay
    if (this.phase === 'planning') {
      const selectedAbility = this.planningToolbar.selectedAbility;

      // Toolbar
      this.planningToolbar.draw(ctx, width, height);

      // Preview circle at mouse position when well ability selected
      if (selectedAbility === 'gravityWell' && this.planningToolbar.hasCharges('gravityWell')) {
        const mx = game.input.mouseX;
        const my = game.input.mouseY;
        const pulse = 0.3 + Math.sin(this.planningToolbar.time * 4) * 0.15;

        // Preview glow
        const grad = ctx.createRadialGradient(mx, my, 2, mx, my, 20);
        grad.addColorStop(0, `rgba(255, 170, 0, ${0.4 * pulse})`);
        grad.addColorStop(1, 'rgba(255, 170, 0, 0)');

        ctx.save();
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(mx, my, 20, 0, Math.PI * 2);
        ctx.fill();

        // Crosshair
        const cSize = 8;
        ctx.strokeStyle = `rgba(255, 170, 0, ${pulse + 0.3})`;
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
