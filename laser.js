// Creates a new class Called Asteroid
class Laser {
    // Defines all the functions and is called by using new Ship(x, y, size, rotation, id)
    constructor(x, y, s, rot, id, or) {
        this.id = id;
        this.rotation = rot
        this.size = s;
        this.r = this.size / 2;
        // Sets the poition of the bullet outside of the radius of the object calling it
        this.position = {
            x: x + Math.cos((this.rotation - 90) * (Math.PI / 180)) * or,
            y: y + Math.sin((this.rotation - 90) * (Math.PI / 180)) * or
        }
        this.age = 0;
        this.maxAge = 80//Math.random() * 60 + 40
        this.speed = 50;
    }
    checkVelocity() {
        this.velocity = {
            x: this.speed * 0.2 * Math.cos((this.rotation - 90) * (Math.PI / 180)),
            y: this.speed * 0.2 * Math.sin((this.rotation - 90) * (Math.PI / 180))
        }
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
    draw() {
        ctx.lineWidth = this.r / 10;
        ctx.strokeStyle = 'white';
        drawShape(new Shapes(this.size).laser, true, this.position.x, this.position.y, 1, (Math.PI / 180) * this.rotation);
    }
    destroy() {
        laserIDs.push(this.id);
        var id = lasers.findIndex(e => (e.id == this.id))
        lasersidsToDestroy.push(id);
    }
    async update() {
        this.checkVelocity();
        this.draw();
        //if (offScreen(this)) warp(this);
        if (offScreen(this)) game.warp ? warp(this) : this.destroy();
        if(++this.age == this.maxAge && !game.superman) this.destroy();
    }
};