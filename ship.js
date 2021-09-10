function ship(x, y, f) {

    this.x = x;
    this.y = y;
    this.z = 1;

    this.rotation = 0.0;
    this.rotSpeed = 0.0;

    this.radius = 100;

    this.forces = [];
    this.speed = {
        x: 0.0,
        y: 0.0
    }

    this.gravi = [];
    this.fuel = f;
    this.burst = false;
    this.rotateBurst = false;

    this.type ="ship";
}

ship.prototype.draw = function(ctx) {
    ctx.translate(this.x, this.y)
    ctx.scale(this.z, this.z)
    ctx.rotate(this.rotation)
    ctx.beginPath();
    let sy = -7; 
    let sx = -10;

    ctx.moveTo(0+sx,0+sy);
    ctx.lineTo(7+sx,0+sy);
    ctx.lineTo(7+sx,1+sy);
    ctx.lineTo(8+sx,1+sy);
    ctx.lineTo(8+sx,2+sy);
    ctx.lineTo(9+sx,2+sy);
    ctx.lineTo(9+sx,3+sy);
    ctx.lineTo(22+sx,3+sy);
    ctx.lineTo(22+sx,4+sy);
    ctx.lineTo(27+sx,4+sy);
    ctx.lineTo(27+sx,5+sy);
    ctx.lineTo(28+sx,5+sy);
    ctx.lineTo(28+sx,6+sy);
    ctx.lineTo(29+sx,6+sy);
    ctx.lineTo(29+sx,7+sy);
    ctx.lineTo(30+sx,7+sy);
    ctx.lineTo(30+sx,8+sy);
    ctx.lineTo(29+sx,8+sy);
    ctx.lineTo(29+sx,9+sy);
    ctx.lineTo(28+sx,9+sy);
    ctx.lineTo(28+sx,10+sy);
    ctx.lineTo(27+sx,10+sy);
    ctx.lineTo(27+sx,11+sy);
    ctx.lineTo(22+sx,11+sy);
    ctx.lineTo(22+sx,12+sy);
    ctx.lineTo(9+sx,12+sy);
    ctx.lineTo(9+sx,13+sy);
    ctx.lineTo(8+sx,13+sy);
    ctx.lineTo(8+sx,14+sy);
    ctx.lineTo(7+sx,14+sy);
    ctx.lineTo(7+sx,15+sy);
    ctx.lineTo(0+sx,15+sy);
    ctx.lineTo(0+sx,14+sy);
    ctx.lineTo(1+sx,14+sy);
    ctx.lineTo(1+sx,13+sy);
    ctx.lineTo(2+sx,13+sy);
    ctx.lineTo(2+sx,12+sy);
    ctx.lineTo(3+sx,12+sy);
    ctx.lineTo(3+sx,11+sy);
    ctx.lineTo(1+sx,11+sy);
    ctx.lineTo(1+sx,10+sy);
    ctx.lineTo(0+sx,10+sy);
    ctx.lineTo(0+sx,9+sy);
    ctx.lineTo(-2+sx,9+sy);
    ctx.lineTo(-2+sx,8+sy);
    ctx.lineTo(-3+sx,8+sy);
    ctx.lineTo(-3+sx,7+sy);
    ctx.lineTo(-2+sx,7+sy);
    ctx.lineTo(-2+sx,6+sy);
    ctx.lineTo(0+sx,6+sy);
    ctx.lineTo(0+sx,5+sy);
    ctx.lineTo(1+sx,5+sy);
    ctx.lineTo(1+sx,4+sy);
    ctx.lineTo(3+sx,4+sy);
    ctx.lineTo(3+sx,3+sy);
    ctx.lineTo(2+sx,3+sy);
    ctx.lineTo(2+sx,2+sy);
    ctx.lineTo(1+sx,2+sy);
    ctx.lineTo(1+sx,1+sy);
    ctx.lineTo(0+sx,1+sy);
    ctx.lineTo(0+sx,0+sy);

    if(this.burst) {
      ctx.moveTo(-5+sx, 7+sy);
      ctx.lineTo(-9+sx, 7+sy);
      ctx.lineTo(-9+sx, 8+sy);
      ctx.lineTo(-5+sx, 8+sy);  
    }

    if(this.rotateBurst == 1) {
        ctx.moveTo(22+sx, 0+sy);
        ctx.lineTo(22+sx, -5+sy);
        ctx.lineTo(21+sx, -5+sy);
        ctx.lineTo(21+sx, 0+sy);
    }

    if(this.rotateBurst == -1) {
        ctx.moveTo(22+sx, 15+sy);
        ctx.lineTo(22+sx, 20+sy);
        ctx.lineTo(21+sx, 20+sy);
        ctx.lineTo(21+sx, 15+sy);
    }

    ctx.closePath();
    ctx.fillStyle="#c2c2c2";
    ctx.fill();
}

ship.prototype.addGravi = function(g) {
    this.gravi.push(g);
}

ship.prototype.speedEnd = function() {
    this.burst = false;
}

ship.prototype.rotateEnd = function() {
    this.rotateBurst = 0;
}

ship.prototype.speedUp = function() {

    if(this.fuel <= 0.0) {
        this.burst = false;
        return;
    }

    this.burst = true;
    this.speed.x += 0.02 * Math.cos(this.rotation);
    this.speed.y += 0.02 * Math.sin(this.rotation);
    this.fuel -= 0.04;

}

ship.prototype.rotate = function(factor) {
    if(this.fuel <= 0.0)
        return;

    this.rotSpeed += 0.001 * factor;
    this.fuel -= 0.03;
    this.rotateBurst = factor;
}

ship.prototype.update = function() {

    x = 0.0;
    y = 0.0;

    x = this.speed.x;
    y = this.speed.y;

    this.rotation += this.rotSpeed;

    for(g of this.gravi) {
        bufX = g.x - this.x;
        bufY = g.y - this.y;
        dist = Math.atan2(bufY,bufX);

        r = Math.sqrt(bufX * bufX + bufY * bufY);
        if(r - g.r< 5.0) {
            return g;
        }
        f = g.m / (r*r) * 150.0;

        x += Math.cos(dist)*f;
        y += Math.sin(dist)*f;
    }

    this.x += x;
    this.y += y;
    this.speed.y=y;
    this.speed.x=x;
    
    return null;
}
