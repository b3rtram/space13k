

function wormhole(x, y, r) {

    this.x = x,
    this.y = y,
    this.z = 1,

    this.r = r;
}

wormhole.prototype.draw = function(ctx) {
    ctx.translate(this.x, this.y)
    ctx.scale(this.z, this.z)
    ctx.beginPath();
    var grd = ctx.createRadialGradient(20, 20, this.r/2-10, 0, 0, 80);
    grd.addColorStop(0, "#101010");
    grd.addColorStop(1, "white");
    ctx.fillStyle = grd;
    ctx.arc(0,0, this.r, 0, 2*3.14);
    ctx.fill();
}

wormhole.prototype.update = function() {
    return true;
}