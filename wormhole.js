

function planet(x, y, z) {

    this.x = x,
    this.y = y,
    this.z = z,

    this.radius = 100;
}

planet.prototype.draw = function(ctx) {
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.scale(this.z, this.z)
    ctx.beginPath();
    ctx.strokeStyle = "white";
    ctx.arc(0,0, this.radius, 0, 2*3.14);
    ctx.stroke();
    ctx.restore();
}

planet.prototype.update = function() {
    return true;
}