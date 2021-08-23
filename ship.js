function ship(x, y, f) {

    this.x = x;
    this.y = y;
    this.z = 1;

    this.rotation = 0.0;

    this.radius = 100;

    this.forces = [];
    this.speed = {
        x: 0.0,
        y: 0.0
    }

    this.gravi = [];

    this.fuel = f;
}

ship.prototype.draw = function(ctx) {
    ctx.translate(this.x, this.y)
    ctx.scale(this.z, this.z)
    ctx.rotate(this.rotation)
    ctx.beginPath();    
    ctx.moveTo(0,0);
    ctx.lineTo(7,0);
    ctx.lineTo(7,1);
    ctx.lineTo(8,1);
    ctx.lineTo(8,2);
    ctx.lineTo(9,2);
    ctx.lineTo(9,3);
    ctx.lineTo(22,3);
    ctx.lineTo(22,4);
    ctx.lineTo(27,4);
    ctx.lineTo(27,5);
    ctx.lineTo(28,5);
    ctx.lineTo(28,6);
    ctx.lineTo(29,6);
    ctx.lineTo(29,7);
    ctx.lineTo(30,7);
    ctx.lineTo(30,8);
    ctx.lineTo(29,8);
    ctx.lineTo(29,9);
    ctx.lineTo(28,9);
    ctx.lineTo(28,10);
    ctx.lineTo(27,10);
    ctx.lineTo(27,11);
    ctx.lineTo(22,11);
    ctx.lineTo(22,12);
    ctx.lineTo(9,12);
    ctx.lineTo(9,13);
    ctx.lineTo(8,13);
    ctx.lineTo(8,14);
    ctx.lineTo(7,14);
    ctx.lineTo(7,15);
    ctx.lineTo(0,15);
    ctx.lineTo(0,14);
    ctx.lineTo(1,14);
    ctx.lineTo(1,13);
    ctx.lineTo(2,13);
    ctx.lineTo(2,12);
    ctx.lineTo(3,12);
    ctx.lineTo(3,11);
    ctx.lineTo(1,11);
    ctx.lineTo(1,10);
    ctx.lineTo(0,10);
    ctx.lineTo(0,9);
    ctx.lineTo(-2,9);
    ctx.lineTo(-2,8);
    ctx.lineTo(-3,8);
    ctx.lineTo(-3,7);
    ctx.lineTo(-2,7);
    ctx.lineTo(-2,6);
    ctx.lineTo(0,6);
    ctx.lineTo(0,5);
    ctx.lineTo(1,5);
    ctx.lineTo(1,4);
    ctx.lineTo(3,4);
    ctx.lineTo(3,3);
    ctx.lineTo(2,3);
    ctx.lineTo(2,2);
    ctx.lineTo(1,2);
    ctx.lineTo(1,1);
    ctx.lineTo(0,1);
    ctx.lineTo(0,0);
    ctx.closePath();
    ctx.fillStyle="#c2c2c2";
    ctx.fill();
}

ship.prototype.addGravi = function(g) {
    this.gravi.push(g);
}

ship.prototype.speedUp = function() {

    if(this.fuel <= 0.0)
        return;

    x = 0.1;
    y = 0.1;
    this.speed.x += x * Math.cos(this.rotation);
    this.speed.y += y * Math.sin(this.rotation);

    this.fuel -= 0.1;

}

ship.prototype.rotate = function(factor) {
    this.rotation += 0.1 * factor;
    this.fuel -= 0.1;
}

ship.prototype.update = function() {

    x = 0.0;
    y = 0.0;

    x = this.speed.x;
    y = this.speed.y;

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

    return null;
}