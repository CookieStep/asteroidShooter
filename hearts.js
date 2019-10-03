class Heart {
    display(x, y, s) {
        this.x = x;
        this.y = y;
        this.s = s;
        this.r = s / 2;
        this.draw();
    }
    draw() {
        ctx.lineWidth = this.r / 10;
        ctx.strokeStyle = 'white';
        var heart =
        [
            0, this.r,
            -this.r, -this.r/2.5,
            -this.r/2, -this.r,
            0, -this.r/2,
            this.r/2, -this.r,
            this.r, -this.r/2.5,
        ]
        drawShape(heart, true, this.x, this.y, 1, 0);
        // ctx.fillStyle = "white";
        // ctx.fill();
    }
}