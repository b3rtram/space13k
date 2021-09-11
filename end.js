function end(x, y) {
    this.x = x;
    this.y = y;
    this.type="end";
}

end.prototype.draw = function(ctx) {

    ctx.fillStyle = ctx.fillStyle = "rgba(50, 50, 50, 0.8)";
    ctx.fillRect(50, 50, ctx.canvas.width-100, ctx.canvas.height-100);
    ctx.save();
    ctx.restore();
    ctx.translate(ctx.canvas.width/window.devicePixelRatio, 100);
    ctx.font = "25px Arial";
    ctx.fillStyle="white";
    ctx.fillText("SpaceY", -50,0);
    ctx.restore();
    ctx.save();
    ctx.translate(200, 150);
    ctx.font = "20px Arial";
    ctx.fillStyle="white";
    ctx.fillText("You haved arrived your home ", 0, 0);
    ctx.translate(0, 70);

    ctx.font = "50px Arial";
    ctx.fillStyle="white";
    ctx.fillText("GAME OVER", 0, 0);

    ctx.translate(0, 50);
    ctx.font = "20px Arial";
    ctx.fillStyle="white";
    ctx.fillText("Asteroid pixel graphics https://opengameart.org/users/funwithpixels", 0, 0);
    ctx.translate(0, 30);
    ctx.font = "20px Arial";
    ctx.fillStyle="white";
    ctx.fillText("Planet pixel graphics https://opengameart.org/users/master484", 0, 0);

}

end.prototype.update = function() {
    return null;
}
