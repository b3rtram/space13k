import Ship from '../entities/Ship.js';
import Planet from '../entities/Planet.js';
import Wormhole from '../entities/Wormhole.js';
import Asteroid from '../entities/Asteroid.js';
import FuelPickup from '../entities/FuelPickup.js';
import Alien from '../entities/Alien.js';
import Star from '../entities/Star.js';

export default class LevelLoader {
  static load(levelData, canvasWidth, canvasHeight) {
    const w = canvasWidth;
    const h = canvasHeight;

    const ship = new Ship(
      levelData.ship.x * w,
      levelData.ship.y * h,
      levelData.ship.fuel,
    );

    const planets = levelData.planets.map(
      (p) => new Planet(p.x * w, p.y * h, p.radius, p.mass, p.texture),
    );

    const wormhole = new Wormhole(
      levelData.wormhole.x * w,
      levelData.wormhole.y * h,
      levelData.wormhole.radius,
      levelData.wormhole.mass,
    );

    const asteroids = levelData.asteroids.map(
      (a) =>
        new Asteroid(
          a.x * w,
          a.y * h,
          a.rotationSpeed,
          a.mass,
          a.scale,
          a.speedX,
          a.speedY,
        ),
    );

    const fuelPickups = (levelData.fuelPickups || []).map(
      (fp) => new FuelPickup(fp.x * w, fp.y * h, fp.amount),
    );

    const aliens = (levelData.aliens || []).map(
      (a) => new Alien(a.x * w, a.y * h, a.speed),
    );

    const stars = Star.createField(w, h);

    return { ship, planets, wormhole, asteroids, fuelPickups, aliens, stars };
  }
}
