class Particle {
    constructor(x, y, s, rot, speed, lifeSpan, shape, redraw, id) {
        this.id = id;
        this.shape = shape;
        this.redraw = redraw;
        this.x = x;
        this.y = y;
        this.size = s;
        this.r = s / 2;
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
        particleIDs.push(this.id);
        // Gets the index of this asteroid using it's id
        var id = particles.findIndex(e => (e.id == this.id))
        destroyParticles.push(id);
    };

    draw() {
        ctx.lineWidth = this.r / 10;
        ctx.strokeStyle = 'white';
        if(this.shape){
            if(this.redraw){
                drawShape(new Shapes(this.r).asteroid, true, this.x, this.y, 1, (Math.PI / 180) * this.rot);
            }else{
                drawShape(this.shape, true, this.x, this.y, 1, (Math.PI / 180) * this.rot);
            }
        }else{
            ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        }
    };
    update() {
        this.applyVelocity();
        this.draw();
        if (this.lifeTime < this.lifeSpan) this.lifeTime++; 
        else this.destroy();
    };
}

particles = [];
particleIDs = [];
destroyParticles = [];

function createParticle(x, y, s, rot, speed, lifeSpan, shape, redraw) {
    var id;
    if (!particleIDs.length) {
        id = particles.length + 1
    } else {
        id = particleIDs.shift();
    }
    particles.push(new Particle(x, y, s, rot, speed, lifeSpan, shape, redraw, id))
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