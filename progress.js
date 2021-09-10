function progress(x, y, lvls, l) {
    this.x = x;
    this.y = y;
    this.lvls = lvls;
    this.l = l;
    this.type="progress";
}

progress.prototype.draw = function(ctx) {

    let k = 0;
    for(let i = 0; i<this.lvls.length; i++) {
        ctx.save();
        ctx.translate(this.x + 150 * i, this.y);
        ctx.beginPath();
        ctx.moveTo(0,0);
        ctx.lineTo(100, 0);
        ctx.strokeStyle = "white";
        ctx.stroke();
        ctx.restore();

        ctx.save();
        ctx.translate(this.x + 150 * (i+1), this.y); 
        ctx.beginPath();
        ctx.arc(-25, 0, 8.0, 0, 2 * Math.PI, false);
        
        if(i > this.l) {
            ctx.strokeStyle = "white";
            ctx.stroke();
        } else {
            ctx.fillStyle = "white";
            ctx.fill();
        }

        ctx.restore();
        k = i;
    }

    ctx.save();
    ctx.translate(this.x + 150 * (k+1), this.y);
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(100, 0);
    ctx.strokeStyle = "white";
    ctx.stroke();
    ctx.restore();


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
