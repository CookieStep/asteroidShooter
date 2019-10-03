// Creates a new class called Ship
class Ship {
    // Defines all the functions and is called by using new Ship(x, y, min velocity, max velocity)
    constructor(x, y, minv, maxv) {
        // Sets the x and y position to the given position
        this.position = {
            x: x,
            y: y
        }
        // Defines acceleration as 0
        this.acceleration = {
            x: 0,
            y: 0
        }
        // Defines velocity as 0
        this.velocity = {
            x: 0,
            y: 0
        }
        this.canShoot = true;
        this.shootDelay = 0;
        this.maxShootDelay = 6;
        this.thrusting = false
        this.size = 20
        this.r = this.size / 2;
        this.drag = 0.95
        this.rotation = 0;
        this.minVel = minv
        this.maxVel = maxv;
        this.speed = 2;
        this.multiplier = 3;
    }
    checkVelocity() {
        // Gets the rotation of the ship in pixels and multiplies them by 0.2 and speed (If 0.2 wasn't there it would make the ship too fast)
        // Lets say speed is 2, it would multiply by 2 but if you multiply 2 by 0.2 you get 0.4 which means it multiplies everything by 0.4
        this.acceleration = {
            x: this.speed * 0.2 * Math.cos((this.rotation - 90) * (Math.PI / 180)),
            y: this.speed * 0.2 * Math.sin((this.rotation - 90) * (Math.PI / 180))
        }
        // If the ship isn't trusting apply drag
        if (!this.thrusting) {
            // drag is 0.95 so if the velocity is 5 and you multiply it with 0.95 you get 4.75
            this.velocity.x *= this.drag;
            this.velocity.y *= this.drag;
        }
        // if the velocity is higher than the max velocity just set it to max and vise versa
        if (this.velocity.x > this.maxVel) this.velocity.x = this.maxVel
        if (this.velocity.x < this.minVel) this.velocity.x = this.minVel
        if (this.velocity.y > this.maxVel) this.velocity.y = this.maxVel
        if (this.velocity.y < this.minVel) this.velocity.y = this.minVel

        // If the rotation is bigger than 360 set it to 0
        if (this.rotation > 360) this.rotation = 0;
        // If the rotation is lower than 0 set it to 360
        else if (this.rotation < 0) this.rotation = 360

        // Apply velocity to the position
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
    shoot() {
        // Create the laser on the ships position 
        // Give it the ships rotation
        // Make it half of the ships size aka give it the ships radius
        createLaser(this.position.x, this.position.y, this.r, this.rotation)
        // Disable the ship from shooting
        this.canShoot = false;
    }
    // Check keys if you need to execute a function
    checkKeys() {
        // If W is pressed
        if (pressedKeys.up) {
            // Increase velocity by acceleration
            this.velocity.x += this.acceleration.x;
            this.velocity.y += this.acceleration.y;
            // Set thrusting to true
            this.thrusting = true;
        } else if (pressedKeys.down) { // Else id S is pressed
            // decrease velocity by acceleration
            this.velocity.x -= this.acceleration.x;
            this.velocity.y -= this.acceleration.y;
            // Set thrusting to false
            this.thrusting = false;
        } else { // Else if none of those match
            // Set thrusting to false
            this.thrusting = false;
        }
        // If A is pressed
        if (pressedKeys.left) {
            // Decrease the rotation by speed times the multiplier
            this.rotation -= this.speed * this.multiplier;
        } else if (pressedKeys.right) { // Else if D is pressed
            // Increase the rotation by speed times the multiplier
            this.rotation += this.speed * this.multiplier;
        }
        // If space is pressed and the ship can shoot
        if (pressedKeys.space && this.canShoot) {
            // Shoot
            this.shoot();
        }
    }
    // Draw event
    draw() {
        // Sets the canvas line width devided by 5 so the lines wouldn't be too thick or too thin
        ctx.lineWidth = this.r / 5;
        // Sets the color of the stroke to white
        ctx.strokeStyle = 'white';
        // Ships drawing coordinates based from 0
        var ship =
            [
                0, 0,
                -this.r / 2, this.r,
                -this.r, this.r,
                0, -this.r,
                this.r, this.r,
                this.r / 2, this.r
            ]
        // Draw the ship on the ships coordinates and rotated 
        drawShape(ship, true, this.position.x, this.position.y, 1, (Math.PI / 180) * this.rotation);
    }
    // Check if the ship can shoot
    shootCheck() {
        // If the ship can shoot then return true
        if (this.canShoot) return true;
        // If the shootDelaay is smaller than maxShootDelay
        if (this.shootDelay < this.maxShootDelay) {
            // Icrease shootDelay by 1
            this.shootDelay++
        } else { // Else if it's bigger than maxShootDelay
            // Set the shootDelay to 0
            this.shootDelay = 0;
            // Allow the ship to shoot
            this.canShoot = true;
        }
    }
    // Main update function for the ship
    update() {
        // Draw the ship
        this.draw()
        // Check if the ship can shoot
        this.shootCheck();
        // Check the keys
        this.checkKeys();
        // Check the velocity
        this.checkVelocity();
        // If it's off screen then warp to the other side
        if (offScreen(this)) warp(this);
    }
};