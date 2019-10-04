class Particle {
    constructor(x, y, s, rot, speed, lifeSpan, shape, id) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.size = s;
        this.r = s / s;
        this.lifeTime = 0;
        this.lifeSpan = lifeSpan;
        this.speed = speed
        this.rot = rot;
    }
    applyVelocity() {
        this.velocity = {
            x: this.speed * 0.2 * Math.cos((this.rot - 90) * (Math.PI / 180)),
            y: this.speed * 0.2 * Math.sin((this.rot - 90) * (Math.PI / 180))
        }
        this.x += this.velocity.x
        this.y += this.velocity.y
    }
    destroy() {
        particles.push(this.id);
        // Gets the index of this asteroid using it's id
        var id = particles.findIndex(e => (e.id == this.id))
        destroyParticles.push(id);
    };
    draw() {
        ctx.lineWidth = this.r / 10;
        ctx.strokeStyle = 'white';
        var laser =
            [
                0, this.r,
                -this.r / 2, this.r,
                -this.r / 2, -this.r,
                this.r / 2, -this.r,
                this.r / 2, this.r
            ]
        drawShape(laser, true, this.x, this.y, 1, (Math.PI / 180) * this.rot);
    };
    update() {
        this.applyVelocity();
        this.draw();
        if (this.lifeTime < this.lifeSpan) this.lifeTime++; 
        else this.destroy();
    };
}

particles = [];
destroyParticles = [];

function createParticle(x, y, s, rot, speed, lifeSpan, shape) {
    var id;
    if (!destroyParticles.length) {
        id = particles.length + 1
    } else {
        id = destroyParticles.shift();
    }
    particles.push(new Particle(x, y, s, rot, speed, lifeSpan, shape, id))
}

function drawParticles() {
    for (p in particles) {
        if (particles.hasOwnProperty(p)) {
            particles[p].update();
        }
    }
    while (destroyParticles.length) {
        //Removes all the asteroids
        var id = destroyParticles.pop()
        // Remove this asteroid from the array
        particles.splice(id, 1);
    }
}