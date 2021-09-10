function tb(x, y, s) {

    this.x = x;
    this.y = y;
    this.z = 1;
    this.s = s;

    this.type = "toolbar";
}

tb.prototype.draw = function(ctx) { 
    ctx.translate(this.x, this.y)
    ctx.scale(this.z, this.z)
    ctx.font = "20px Arial";
    ctx.fillStyle="white";
    ctx.fillText("Tank", 0, 0);
    ctx.translate(50,0);
    ctx.fillStyle = "blue";
    ctx.fillRect(20, 0, this.s.fuel*10, -20);


}

tb.prototype.update = function() {
    return null;
}

tb.prototype.type = function() {
    return "toolbar";
}