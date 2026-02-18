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
    this.flipped = false;
    this.originalMass = mass;
  }

  flipGravity() {
    this.flipped = true;
    this.body.plugin.gravityMass = -this.originalMass;
  }

  unflipGravity() {
    this.flipped = false;
    this.body.plugin.gravityMass = this.originalMass;
  }

  containsPoint(mx, my) {
    const { x, y } = this.body.position;
    const dx = mx - x;
    const dy = my - y;
    return dx * dx + dy * dy <= (this.radius + 10) * (this.radius + 10);
  }

  draw(ctx, assets) {
    const { x, y } = this.body.position;
    const img = assets.get(this.textureKey);
    if (!img) return;

    ctx.save();
    ctx.translate(x, y);
    const scale = (this.radius * 2) / img.width;
    ctx.scale(scale, scale);
    ctx.drawImage(img, -img.width / 2, -img.height / 2);

    // Red tint overlay for flipped gravity
    if (this.flipped) {
      ctx.globalCompositeOperation = 'source-atop';
      ctx.fillStyle = 'rgba(255, 50, 50, 0.35)';
      ctx.fillRect(-img.width / 2, -img.height / 2, img.width, img.height);
    }

    ctx.restore();
  }
}
