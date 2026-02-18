import Matter from 'matter-js';
import MatterAttractors from 'matter-attractors';
import { GRAVITY_CONSTANT, PHYSICS_DT } from '../config.js';

Matter.use(MatterAttractors);

export function gravityAttractor(bodyA, bodyB) {
  if (bodyB.isStatic) return null;

  const dx = bodyA.position.x - bodyB.position.x;
  const dy = bodyA.position.y - bodyB.position.y;
  const distSq = dx * dx + dy * dy;
  if (distSq < 1) return null;

  const dist = Math.sqrt(distSq);
  const mass = bodyA.plugin.gravityMass || bodyA.mass;
  const force = (mass / distSq) * GRAVITY_CONSTANT;

  return {
    x: (dx / dist) * force,
    y: (dy / dist) * force,
  };
}

export default class PhysicsWorld {
  constructor() {
    this.engine = Matter.Engine.create({
      gravity: { x: 0, y: 0 },
    });
    this.world = this.engine.world;
  }

  addBody(body) {
    Matter.Composite.add(this.world, body);
  }

  removeBody(body) {
    Matter.Composite.remove(this.world, body);
  }

  update() {
    // Fixed timestep — matches the ship mass/inertia calibration
    Matter.Engine.update(this.engine, PHYSICS_DT);
  }

  onCollisionStart(callback) {
    Matter.Events.on(this.engine, 'collisionStart', callback);
  }

  destroy() {
    Matter.World.clear(this.world);
    Matter.Engine.clear(this.engine);
  }
}
