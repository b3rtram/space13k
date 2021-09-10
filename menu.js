function menu(x, y) {
    this.x = x;
    this.y = y;
    this.type="menu";
}

menu.prototype.draw = function(ctx) {


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
    ctx.fillText("Your are lost in space with little fuel left. To come home you need fly trough different wormholes.", 0, 0);
    ctx.translate(0, 30);
    ctx.fillText("The only chance is to use the gravity of planets.", 0, 0);
    ctx.translate(0, 60);
    ctx.fillText("Use key w for getting speed, but be carefully, you don't have many fuel", 0, 0);
    ctx.translate(0, 30);
    ctx.fillText("Use key a for rotating counterclockwise, rotating also costs fuel", 0, 0);
    ctx.translate(0, 30);
    ctx.fillText("Use key d for rotating clockwise", 0, 0);
    ctx.translate(0, 30);
    ctx.fillText("Use key x for reset level", 0, 0);
    ctx.translate(0, 60);
    ctx.fillText("Good luck getting home", 0, 0);
    ctx.translate(0, 30);
    ctx.fillText("Press esc for starting", 0, 0);


}

menu.prototype.update = function() {
    return null;
}
