class Particle{
    constructor(x, y, s, rot){
        this.x = x;
        this.y = y;
        this.size = s;
        this.r = s/s
        this.rot = rot;
    }

    destroy();
    update();

}