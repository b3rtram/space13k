

function star(x, y, z) {

    this.x = x,
    this.y = y,
    this.z = z,

    this.radius = 10;

    this.type = "star";
}

star.prototype.draw = function(ctx) {

    ctx.translate(this.x, this.y)
    ctx.scale(this.z, this.z)
    ctx.beginPath();
    let g = ctx.createRadialGradient(0.5, 0.5, 0.5, 1, 1, 1);
    g.addColorStop(0, "black");
    g.addColorStop(1, "white");
    ctx.fillStyle = g;
    ctx.arc(this.x, this.y, this.radius, 0, 2*3.14);
    ctx.fill();

}

star.prototype.update = function() {
    this.x += 0.5 * this.z;
    return null;
}