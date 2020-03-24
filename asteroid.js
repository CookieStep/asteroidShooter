// Creates a new class Called Asteroid
class Asteroid {
    // Defines all the functions and is called by using new Ship(x, y, size, id, split(bool), cid (Check ID))
    constructor(x, y, s, id, split = false, cid) {
        // Random rotation from 0 to 360
        this.rotation = Math.random() * 360;
        this.rotation2 = this.rotation
        this.rotate = Math.random() * 5 - 2.5
        // If split is true
        if (split) {
            this.rotate *= 2
            // Define variable i with the value of 0
            var i = 0
            // Do this code
            do {
                // get's a random rotation from 0 to 360
                this.rotation = Math.random() * 360;
                this.rotation2 = this.rotation
                // Gets the position according to the location (also adds to the distance so there's no chance for them to collide)
                this.position = {
                    x: x + (s + i) * Math.cos((this.rotation - 90) * (Math.PI / 180)),
                    y: y + (s + i) * Math.sin((this.rotation - 90) * (Math.PI / 180))
                }
                // i + 1
                i += 1
                // While they're coliding 
            } while (distBetweenPoints(this.position.x, this.position.y, asteroids[cid].position.x, asteroids[cid].position.y) < s + s);
        } else { // Else if split is false
            // Transfer the given x and y to the position of the asteroid
            this.position = {
                x: x,
                y: y
            }
        }
        // Defines this.velocity
        this.velocity;
        // Sets the given id to this objects id
        this.id = id;
        // Sets the given size to this objects size
        this.size = s
        // Gets the radius which is just hallf of the objects size also called a diameter
        this.r = this.size / 2;
        // The distortion of the asteroids (How much does it move from it's original spot to make it look like an asteroid)
        this.distortion = 0.4;
        // Gets a random amount of points from 5 to 17
        this.points = (Math.random() * 14) + 5
        // Sets the speed of the asteroid
        this.speed = 2 + resets;
        // Calls the drawAsteroid() function and sets asteroid as the values returned form the function
        this.asteroid = new Shapes(this.size, this.points, this.distortion).asteroid;
    }
    // Checks the velocity
    checkVelocity() {
        // Gets the new x and y for where the asteroid is going to move next
        this.velocity = {
            x: this.speed * 0.2 * Math.cos((this.rotation2 - 90) * (Math.PI / 180)),
            y: this.speed * 0.2 * Math.sin((this.rotation2 - 90) * (Math.PI / 180))
        }
        // Applies the velocity to the position
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
    revert() {
        // Gets the new x and y for where the asteroid is going to move next
        this.velocity = {
            x: this.speed * 0.2 * Math.cos((this.rotation2 - 90) * (Math.PI / 180)),
            y: this.speed * 0.2 * Math.sin((this.rotation2 - 90) * (Math.PI / 180))
        }
        // Applies the velocity to the position
        this.position.x -= this.velocity.x
        this.position.y -= this.velocity.y
    }
    // Checks if the ship is colliding with 
    shipCollision() {
        // If the asteroid and the ship are coliding
        if (distBetweenPoints(this.position.x, this.position.y, ship.position.x, ship.position.y) < this.size + ship.r) {
            // return true
            if (ship.protected()) return false;
            return true;
        }
        // Else just return false
        return false;
    }

    // Checks if the asteroid is colliding with lasers
    laserCollision() {
        // Defines the variables x, y, las and r
        let x, y, las, r;
        // For each laser do this
        for (var i in lasers) {

            // grab the lasers properties
            las = lasers[i];
            x = las.position.x;
            y = las.position.y;
            r = las.r;
            // If the laser and the asteroid are colliding
            if (distBetweenPoints(this.position.x, this.position.y, x, y) < this.size + r) {
                // Destroy the laser and the asteroid
                game.superman ? 0 : las.age += this.r;
                this.destroy();
                return true;
            }
        }
        // If there's no collision return false
        //return false;
    }
    // Check collision
    checkCollision() {
        // Checks if the asteroid is colliding with the laser
        if (this.laserCollision()) score += Math.round(this.size * 0.5);
        // If the asteroid is colliding with the ship restart the game
        if (this.shipCollision() && !game.superman) {
            ship.die()
            this.destroy();
        };
    }
    // Destroy particles
    destroyParticles() {
        var i, j;
        for (j = 0; j < this.r / 2; j++) {
            for (i = 0; i < 360; i++) {
                if (i % 15 == 0) {
                    createParticle(this.position.x, this.position.y, 5, i, 20 % j, 5 + j)
                }
            }
        }
    }
    // Destroys the asteroid
    destroy() {
        // Push the id of this asteroid to asteroidIDs (To the last spot)
        asteroidIDs.push(this.id);
        explode.play()
        // Gets the index of this asteroid using it's id
        var id = asteroids.findIndex(e => (e.id == this.id))
        asteroidsToDestroy.push(id);
        this.destroyParticles();
        // If the asteroids size devided by 2 is bigger than 10 hense why I'm using radius
        if (this.r > 10) {
            // Create two asteroids and tell them they're splitting
            createAsteroid(this.position.x, this.position.y, this.r, true);
            createAsteroid(this.position.x, this.position.y, this.r, true);
        };
    }
    // Draw
    draw() {
        // Sets the line width
        ctx.lineWidth = this.size / 10;
        // Sets the stroke color
        ctx.strokeStyle = 'white';
        // Draws the asteroid
        ctx.fillStyle = "grey"
        drawShape(this.asteroid, true, this.position.x, this.position.y, 1, (Math.PI / 180) * this.rotation + 0.35);
    }
    // Main update of the asteroid
    async update() {
        this.rotation += this.rotate * 0.2 * this.speed
        this.rotate += Math.random() * 0.2 - 0.1
        if(this.rotate < -5)
            this.rotate = -5
        if(this.rotate > 5)
            this.rotate = 5
        // Ckechs the velocity
        this.checkVelocity();
        // If the asteroid is off screen then warp it
        if (offScreen(this)) warp(this);
        // Check the collision
        this.checkCollision();
        // Draws the asteroid
        this.draw();
    }
}