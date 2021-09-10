function key(x, y) {
    this.x = x;
    this.y = y;
    this.type="keylayout";
}

key.prototype.draw = function(ctx) {

    ctx.translate(this.x, this.y);
    ctx.font = "25px Arial";
    ctx.fillStyle="white";
    ctx.fillText("w", 0, 0);
    ctx.font = "12px Arial";
    ctx.fillStyle="white";
    ctx.fillText("Burst", -7, 25);

    ctx.translate(30, 60);
    ctx.font = "25px Arial";
    ctx.fillStyle="white";
    ctx.fillText("a", 0, 0);
    ctx.font = "12px Arial";
    ctx.fillStyle="white";
    ctx.fillText("Rotate", -7, 25);

    ctx.translate(-60, 0);
    ctx.font = "25px Arial";
    ctx.fillStyle="white";
    ctx.fillText("d", 0, 0);
    ctx.font = "12px Arial";
    ctx.fillStyle="white";
    ctx.fillText("Rotate", -7, 25);

}

key.prototype.update = function() {
    return null;
}