

function planet(x, y, r) {

    this.x = x;
    this.y = y;
    this.z = 1;
    this.r = r;
}

planet.prototype.draw = function(ctx) {
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.scale(this.z, this.z)
    ctx.beginPath();
    ctx.strokeStyle = "white";
    ctx.arc(0,0, this.r, 0, 2*3.14);
    ctx.stroke();
    ctx.restore();
}

planet.prototype.update = function() {
    return true;
}