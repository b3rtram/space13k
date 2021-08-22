function ship(x, y, z) {

    this.x = x,
    this.y = y,
    this.z = z,

    this.rotation = 0.0;

    this.radius = 100;

    this.forces = [];
    this.speed = {
        x: 0.0,
        y: 0.0
    }

    this.gravi = [];
}

ship.prototype.draw = function(ctx) {
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.scale(this.z, this.z)
    ctx.rotate(this.rotation)
    ctx.beginPath();       // Start a new path
    ctx.moveTo(-15,0);    // Move the pen to (30, 50)
    ctx.lineTo(15,0);  // Draw a line to (150, 100)
    ctx.stroke();          // Render the path
    ctx.strokeStyle = "white";
    ctx.stroke();
    ctx.restore();
}

ship.prototype.addGravi = function(g) {
    this.gravi.push(g);
}

ship.prototype.speedUp = function() {

    x = 0.1;
    y = 0.1;
    this.speed.x += x * Math.cos(this.rotation);
    this.speed.y += y * Math.sin(this.rotation);

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
        
        if(r - g.r < 5.0) {
            return g;
        }
        f = g.r / (r*r) * 150.0;
        x += Math.cos(dist)*f;
        y += Math.sin(dist)*f;
    }

    this.x += x;
    this.y += y;

    return null;
}