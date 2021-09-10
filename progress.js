function progress(x, y, lvls) {
    this.x = x;
    this.y = y;
    this.lvls = lvls;
    this.type="progress";
}

progress.prototype.draw = function(ctx) {
    
    ctx.translate(this.x, this.y);

    for(let i = 0; i<this.lvls.length; i++) {
        ctx.translate(40, 0);
        ctx.fillStyle = "white";
        ctx.moveTo(0,0);
        ctx.lineTo(50,50);
        ctx.fillRect();
    }

    // ctx.save();
    // ctx.restore();
    // ctx.translate(ctx.canvas.width/window.devicePixelRatio, 100);
    // ctx.font = "25px Arial";
    // ctx.fillStyle="white";
    // ctx.fillText("SpaceY", -50,0);
    // ctx.restore();
    // ctx.save();
    // ctx.translate(200, 150);
    // ctx.font = "20px Arial";
    // ctx.fillStyle="white";
    // ctx.fillText("Yeah you are ", 0, 0);
    
}

progress.prototype.update = function() {
    return null;
}
