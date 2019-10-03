// Creates a new class Called Asteroid
class Asteroid {
    // Defines all the functions and is called by using new Ship(x, y, size, id, split(bool), cid (Check ID))
    constructor(x, y, s, id, split = false, cid) {
        // Random rotation from 0 to 360
        this.rotation = Math.random() * 360;
        // If split is true
        if (split) {
            // Define variable i with the value of 0
            var i = 0
            // Do this code
            do {
                // get's a random rotation from 0 to 360
                this.rotation = Math.random() * 360;
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
        this.speed = 2;
        // Calls the drawAsteroid() function and sets asteroid as the values returned form the function
        this.asteroid = this.drawAsteroid();
    }
    // Draws the asteroid with random points
    drawAsteroid() {
        // New asteroid array that we'll temporarely save the array of the asteroid to
        var asteroid = [];

        // For every point get the x and y coordinates and save them in the temporary array
        for (var i = 1; i <= this.points; i += 1) {
            // Random offset for the points which moves them closer or further away from the center
            var offset = Math.random() * this.distortion * 2 + 1 - this.distortion;
            // Push the x and y to the temporary array
            asteroid.push((this.size * offset) * Math.cos(i * 2 * Math.PI / this.points)); //x
            asteroid.push((this.size * offset) * Math.sin(i * 2 * Math.PI / this.points)); //y
        }
        // Return the temporary array to the caller
        return asteroid;
    }
    // Checks the velocity
    checkVelocity() {
        // Gets the new x and y for where the asteroid is going to move next
        this.velocity = {
            x: this.speed * 0.2 * Math.cos((this.rotation - 90) * (Math.PI / 180)),
            y: this.speed * 0.2 * Math.sin((this.rotation - 90) * (Math.PI / 180))
        }
        // Applies the velocity to the position
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
    // Checks if the ship is colliding with 
    shipCollision() {
        // If the asteroid and the ship are coliding
        if (distBetweenPoints(this.position.x, this.position.y, ship.position.x, ship.position.y) < this.size + ship.r) {
            // return true
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
                las.destroy();
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
        if (this.laserCollision()) score++;
        // If the asteroid is colliding with the ship restart the game
        if (this.shipCollision()) game.restart(true);
    }
    // Destroys the asteroid
    destroy() {
        // Push the id of this asteroid to asteroidIDs (To the last spot)
        asteroidIDs.push(this.id);
        // Gets the index of this asteroid using it's id
        var id = asteroids.findIndex(e => (e.id == this.id))
        asteroidsToDestroy.push(id);
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
        drawShape(this.asteroid, true, this.position.x, this.position.y, 1, (Math.PI / 180) * this.rotation + 0.35);
    }
    // Main update of the asteroid
    async update() {
        // Ckechs the velocity
        this.checkVelocity();
        // If the asteroid is off screen then warp it
        if (offScreen(this)) warp(this);
        // Check the collision
        this.checkCollision();
        // Draws the asteroid
        this.draw();
    }
};