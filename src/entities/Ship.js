import Matter from 'matter-js';
import { drawShip } from '../rendering/ShipSprite.js';
import {
  THRUST_FORCE,
  ROTATION_FORCE,
  FUEL_THRUST_COST,
  FUEL_ROTATE_COST,
  SHIP_RADIUS,
  PHYSICS_DT,
  KEYS,
} from '../config.js';

// Set mass = inertia = dt² so that (force/mass)*dt² = force,
// making our force constants behave identically to the original
// game's direct velocity manipulation.
const CALIBRATED_MASS = PHYSICS_DT * PHYSICS_DT;

export default class Ship {
  constructor(x, y, fuel) {
    this.body = Matter.Bodies.circle(x, y, SHIP_RADIUS, {
      frictionAir: 0,
      friction: 0,
      restitution: 0,
      label: 'ship',
    });

    Matter.Body.setMass(this.body, CALIBRATED_MASS);
    Matter.Body.setInertia(this.body, CALIBRATED_MASS);

    this.fuel = fuel;
    this.thrusting = false;
    this.rotateBurst = 0;
  }

  update(input, dt) {
    // Thrust
    if (input.isDown(KEYS.THRUST) && this.fuel > 0) {
      const angle = this.body.angle;
      const fx = THRUST_FORCE * Math.cos(angle);
      const fy = THRUST_FORCE * Math.sin(angle);
      Matter.Body.applyForce(this.body, this.body.position, { x: fx, y: fy });
      this.fuel -= FUEL_THRUST_COST;
      this.thrusting = true;
    } else {
      this.thrusting = false;
    }

    // Rotation
    this.rotateBurst = 0;
    if (input.isDown(KEYS.ROTATE_LEFT) && this.fuel > 0) {
      this.body.torque = -ROTATION_FORCE;
      this.fuel -= FUEL_ROTATE_COST;
      this.rotateBurst = -1;
    }
    if (input.isDown(KEYS.ROTATE_RIGHT) && this.fuel > 0) {
      this.body.torque = ROTATION_FORCE;
      this.fuel -= FUEL_ROTATE_COST;
      this.rotateBurst = 1;
    }

    if (this.fuel < 0) this.fuel = 0;
  }

  draw(ctx) {
    const { x, y } = this.body.position;
    const angle = this.body.angle;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    drawShip(ctx, this.thrusting, this.rotateBurst);
    ctx.restore();
  }
}
