function asteroid(x, y, rf, m, z, sx, sy) {

    this.x = x;
    this.y = y;
    this.z = z;
    this.rf = rf;
    this.r = 0;
    this.m = m;
    this.sx = sx;
    this.sy = sy;

    this.type = "meteroit";

    this.img = new Image();
    this.img.src = 'assets/asteroid.png';
}

asteroid.prototype.draw = function(ctx) {
    
    ctx.translate(this.x, this.y)
    ctx.scale(this.z, this.z)
    ctx.rotate(this.r);
    ctx.drawImage(this.img, -this.img.width/2, -this.img.height/2);
}

asteroid.prototype.update = function() {
    this.r += this.rf;
    this.x += this.sx;
    this.y += this.sy;
    return null;
}
