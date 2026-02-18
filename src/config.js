// Physics timing
export const PHYSICS_DT = 1000 / 60; // Fixed physics timestep in ms

// Physics forces
// Original game directly modified velocity each frame. Matter.js uses
// Verlet integration: velocity_change = (force/mass) * dt². To keep the
// original constants (150, 0.02, 0.001), we set the ship's mass and
// inertia to dt² so that force/mass * dt² = force.
export const GRAVITY_CONSTANT = 150.0;
export const THRUST_FORCE = 0.02;
export const ROTATION_FORCE = 0.001;
export const FUEL_THRUST_COST = 0.04;
export const FUEL_ROTATE_COST = 0.03;

// Ship
export const SHIP_RADIUS = 10;

// Stars
export const STAR_COUNT = 1000;
export const STAR_SCROLL_SPEED = 0.5;
export const STAR_MIN_Z = 0.1;
export const STAR_MAX_Z = 0.2;

// Level design reference resolution
export const DESIGN_WIDTH = 1024;
export const DESIGN_HEIGHT = 768;

// Keys
export const KEYS = {
  THRUST: 'KeyW',
  ROTATE_LEFT: 'KeyA',
  ROTATE_RIGHT: 'KeyD',
  RESET: 'KeyX',
  START: 'Escape',
};
