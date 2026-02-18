import Matter from 'matter-js';
import { gravityAttractor } from '../physics/PhysicsWorld.js';

export default class Planet {
  constructor(x, y, radius, mass, textureKey) {
    this.body = Matter.Bodies.circle(x, y, radius, {
      isStatic: true,
      label: 'planet',
      plugin: {
        attractors: [gravityAttractor],
        gravityMass: mass,
      },
    });

    this.radius = radius;
    this.textureKey = textureKey;
  }

  draw(ctx, assets) {
    const { x, y } = this.body.position;
    const img = assets.get(this.textureKey);
    if (!img) return;

    ctx.save();
    ctx.translate(x, y);
    const scale = this.radius / 13;
    ctx.scale(scale, scale);
    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    ctx.restore();
  }
}
