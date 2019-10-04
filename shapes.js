// Ships drawing coordinates based from 0
class Shapes {
    constructor(s, points = (Math.random() * 14) + 5, distortion = 1.5) {
        this.size = s;
        this.r = s/2;
        this.points = points;
        this.distortion = distortion;
        this.ship =
            [
                0, 0,
                -this.r / 2, this.r,
                -this.r, this.r,
                0, -this.r,
                this.r, this.r,
                this.r / 2, this.r
            ]
        this.laser =
            [
                0, this.r,
                -this.r / 2, this.r,
                -this.r / 2, -this.r,
                this.r / 2, -this.r,
                this.r / 2, this.r
            ]
        this.asteroid = this.drawAsteroid();
    }

    drawAsteroid() {
        // New asteroid array that we'll temporarely save the array of the asteroid to
        var asteroid = [];

        // For every point get the x and y coordinates and save them in the temporary array
        for (var i = 1; i <= this.points; i += 1) {
            // Random offset for the points which moves them closer or further away from the center
            var offset = Math.random() *this.distortion * 2 + 1 -this.distortion;
            // Push the x and y to the temporary array
            asteroid.push((this.size * offset) * Math.cos(i * 2 * Math.PI / this.points)); //x
            asteroid.push((this.size * offset) * Math.sin(i * 2 * Math.PI / this.points)); //y
        }
        // Return the temporary array to the caller
        return asteroid;
    }
}