function ship(x, y, z) {

    this.x = x,
    this.y = y,
    this.z = z,

    this.rotation = 0.0;

    this.radius = 100;

    this.forces = [];
    this.speed = {
        x = 0.0,
        y = 0.0
    }
}

ship.prototype.draw = function(ctx) {
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.scale(this.z, this.z)
    ctx.rotate(this.rotation)
    ctx.beginPath();
    ctx.lineTo(-12,5, 12.5);
    ctx.lineTo(12.5, 25);
    ctx.lineTo(25, -12.5);
    ctx.closePath();
    ctx.strokeStyle = "white";
    ctx.stroke();
    ctx.restore();
}

ship.prototype.addForce = function(vec) {

}

ship.prototype.speedUp = function() {

    this.speed.x = this.speed.x * this.rotation;
    this.speed.y = this.speed.y * this.rotation;

}

ship.prototype.update = function() {

    this.x += this.speed.x;
    this.y += this.speed.y;

}