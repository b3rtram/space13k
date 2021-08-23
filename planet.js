

function planet(x, y, r, m) {

    this.x = x;
    this.y = y;
    this.z = 1;
    this.r = r;
    this.m = m;
}

planet.prototype.draw = function(ctx) {
    ctx.translate(this.x, this.y)
    ctx.scale(this.z, this.z)
    ctx.beginPath();
    ctx.strokeStyle = "white";
    ctx.arc(0,0, this.r, 0, 2*3.14);
    ctx.closePath();
    ctx.stroke();
}

planet.prototype.update = function() {
    return true;
}