import Matter from 'matter-js';

export default class FuelPickup {
  constructor(x, y, amount) {
    this.body = Matter.Bodies.circle(x, y, 12, {
      isStatic: true,
      isSensor: true,
      label: 'fuelPickup',
    });

    this.amount = amount;
    this.collected = false;
    this.time = 0;
  }

  update(dt) {
    this.time += dt;
  }

  draw(ctx) {
    if (this.collected) return;

    const { x, y } = this.body.position;
    const pulse = 1 + Math.sin(this.time * 3) * 0.15;

    ctx.save();
    ctx.translate(x, y);
    ctx.scale(pulse, pulse);

    // Fuel canister shape
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 150, 255, 0.6)';
    ctx.fill();
    ctx.strokeStyle = '#00aaff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // F letter
    ctx.fillStyle = 'white';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('F', 0, 0);

    ctx.restore();
  }
}
