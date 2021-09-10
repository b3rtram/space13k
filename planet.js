

function planet(x, y, r, m, t) {

    this.x = x;
    this.y = y;
    this.z = 1;
    this.r = r;
    this.m = m;
    this.t = t;

    this.type = "planet";
    this.img = new Image();
    this.img.src = 'assets/p'+this.t+'.png';
}

planet.prototype.draw = function(ctx) {
    ctx.translate(this.x, this.y)
    ctx.scale(this.r/13, this.r/13)
    ctx.drawImage(this.img, -this.img.width/2, -this.img.height/2);
    // ctx.beginPath();
    // var grd = ctx.createRadialGradient(20, 20, this.r/2-10, 0, 0, 80);
    // grd.addColorStop(0, "white");
    // grd.addColorStop(1, "#2c2c2c");
    // ctx.fillStyle = grd;
    // ctx.arc(0,0, this.r, 0, 2*3.14);
    // ctx.closePath();
    // ctx.fill();
}

planet.prototype.update = function() {
    return null;
}
