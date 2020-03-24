// Get canvas (element)
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

// Define canvas height and width
c.width = window.innerWidth;
c.height = window.innerHeight;

// Create ship
ship = new Ship(c.width / 2, c.height / 2, -10, 10);

// Inizialize lasers and asteroids
var lasers = [];
var asteroids = [];
var hearts = [];
// Laser and asteroid id array (adds when an asteroid gets destroyed removes when a new one is created)
// Used to keep track of where the asteroid or laser is in the array above
var laserIDs = []
var asteroidIDs = []

// An array of asteroids needed to be destroyed (Otherwise there will be flickering issues)
var asteroidsToDestroy = [];
var lasersidsToDestroy = [];
// Animation frame handler
var request;

// Sets the score to 0
var score = 0;
// The text size for score
var scoreSize = 30;
// A win state for the game +1 reset every time you destroy all the asteroids
var maxResets = 20
var resets = 0;
// lives
var maxLives = 5;
var lives = maxLives;

// Config
var distMultiplier = 5; // Asteroid spawn distance away from ship
var minAsteroids = 4 // Min asteroids that will be created
var maxAsteroids = 10 + resets // Max asteroids that will be created

// Lines at the collision points
var esp = false;

// Writes text
function writeText(text, x, y, textSize, font = 'Arial', color = 'white') {
    ctx.save()
    ctx.font = textSize + "px " + font;
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.fillText(text, x, y);
    ctx.restore()
}

// Draw a shape using an array
function drawShape(shape, close, x, y, scale, rot) {
    // shape = [x, y,
    //          x, y,
    //          x, y]
    // Saves the canvas config
    ctx.save();
    for(let a = -1; a <= 1; a++) {
        for(let b = -1; b <= 1; b++) {
            // Defines a variable i
            var i = 0;
            // Horizontal scale - Bigger/Smaller
            // Vertical/horizontal skewing - Tilting left,right,up,down
            // Vertical scale - Bigger/Smaller
            // Move the canvas coordinates - makes new coordinates the 0 of the canvas
            ctx.setTransform(scale, 0, 0, scale, x + c.width * a, y + c.height * b);
            // Rotate canvas by x degrees
            ctx.rotate(rot);
            // Begin drawing
            ctx.beginPath();
            // Move to the pen to the position x of the 0th index 
            // Since ++ is after I (i++) it first does the operation then it adds it
            // Something like this
            // var i = 0;
            // console.log(i) - returns 0
            // i = i + 1
            // console.log(i) - returns 1
            // in short 
            // console.log(i++) - returns 0
            // console.log(i) - returns 1
            // But if I did ++i
            // console.log(++i) - returns 1
            ctx.moveTo(shape[i++], shape[i++]);
            // While i smaller than the length of shape aka how many points there are
            while (i < shape.length) {
                // List through all the lines and draw them at the according spot
                ctx.lineTo(shape[i++], shape[i++]);
            }
            // If close is true then close the path from the last point
            if (close) { ctx.closePath() }
            // Draw the lines on the screen
            ctx.strokeStyle = game.color ? ctx.fillStyle : ctx.strokeStyle
            ctx.fillStyle = game.color ? ctx.fillStyle : "black"
            if(game.fill) ctx.fill()
            ctx.stroke()
        }
    }
    // Restore the configuration from the last save
    ctx.restore();
}

// If the object is off screen return true
function offScreen(object) {
    // If the objects x coordinate is bigger then the canvas width or lower return true
    if (object.position.x > c.width || object.position.x < 0) {
        return true;
    }
    // If the objects y coordinate is bigger then the canvas height or lower return true
    if (object.position.y > c.height || object.position.y < 0) {
        return true;
    }
    // If it's on the canvas return true
    return false;
}


// Gets the distance between two points
function distBetweenPoints(x1, y1, x2, y2) {
    let dx = x2 - x1
    let dy = y2 - y1
    if(dx > c.width / 2)
        dx -= c.width
    if(dy > c.height / 2)
        dy -= c.height
    return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
}
function distance(obj, obj2) {
    return distBetweenPoints(obj.position.x, obj.position.y, obj2.position.x, obj2.position.y)
}

// Create asteroids
function createAsteroids() {
    var randAsteroids = Math.ceil(Math.random()*(maxAsteroids-minAsteroids)+minAsteroids);
    while (asteroids.length < randAsteroids) { // While there are less asteroids than maxAsteroids
        var s = (Math.random() * 40) + 30; // Random size (full size which means the radius is half of that)
        do {
            // Get a random x and y location anywhere on the canvas
            var x = Math.random() * c.width;
            var y = Math.random() * c.height;
            // If the location is too close to the ship get new x and y
        } while (distBetweenPoints(ship.position.x, ship.position.y, x, y) < s/2 * distMultiplier + ship.r);
        // Calls the create asteroid function giving it the x, y coordinate and size
        createAsteroid(x, y, s)
    }
}

// Create a laser
function createLaser(x, y, s, rot, or){
    var id; // Defining the variable id
    if (!laserIDs.length) { // If laserIDs is empty
        id = lasers.length + 1 // id is equal to total lasers +1
    } else { // Else if it's not empty
        id = laserIDs.shift(); // Shift the first index from laserIDs to id
    }
    lasers.push(new Laser(x, y, s, rot, id, or)) // Create a new laser with the given information
}

// Function that creates the asteroid
function createAsteroid(x, y, s, split = false, points) {
    // Defining the variable id
    var id;
    // cid (Check ID) - Id of the asteroid created before this one
    var cid = asteroids.length-1
    // If asteroidIDs is empty
    if (!asteroidIDs.length) {
        // Make the id of how many asteroids exist + 1 (Without +1 it's 0,1,2,3,4 with +1 it's 1,2,3,4 so just to make it a bit easier to track)
        id = asteroids.length + 1
        // Else if it's not empty
    } else {
        // Remove the first index of asteroidIDs and make id equal to that value
        id = asteroidIDs.shift();
    }
    // Add the asteroid to the array
    asteroids.push(new Asteroid(x, y, s, id, split, cid, points))
}

// Keymap of pressed keys
var pressedKeys = {
    left: false,
    right: false,
    up: false,
    down: false,
    space: false,
    escape: false
}

// The movement keymap A, S, D, W, SPACE(shoot)
let keyMap = {
    65: "left",
    68: "right",
    87: "up",
    83: "down",
    32: "space",
    27: "escape"
}
// Triggered when a key is pressed down
function keydown(event) {
    // Get the strying out of the keymap using the even.keyCode as the index (If there is one) and put it in key
    let key = keyMap[event.keyCode];
    // If key is undefined return (Used so we don't get undefined keys)
    if (!key) return;
    // Set pressed key to true
    pressedKeys[key] = true;
}

// Triggered when a key is released
function keyup(event) {
    // Get the strying out of the keymap using the even.keyCode as the index (If there is one) and put it in key
    let key = keyMap[event.keyCode];
    // If key is undefined return (Used so we don't get undefined keys)
    if (!key) return;
    // Set pressed key to true
    pressedKeys[key] = false;
}
// If the focus on the screen is lost
function lostFocus() {
    // For each key in keymap
    for (key in keyMap) {
        // Set the pressedKeys to false
        pressedKeys[keyMap[key]] = false
    }
}

function resizeCanvas(){
    c.width = window.innerWidth;
    c.height = window.innerHeight;
}

function audio() {
    started = true
    game.pause()
    game.resume()
    window.removeEventListener("mousemove", audio)
}

// Call keydown() while a key is pressed
window.addEventListener("keydown", keydown, false);
// Call keyup() when a key is released
window.addEventListener("keyup", keyup, false);
// Call lostFocus() on focus loss
window.addEventListener("blur", lostFocus);
// Calls resizeCanva() on window resize
window.addEventListener("resize", resizeCanvas);

window.addEventListener("mousemove", audio)

// Main game handler
var game = {
    // Is the game paused
    paused: false,
    running: false,
    // Infinite mode of the game
    infinite: false,
    // Superman mode (no shoot delay, no collision, no hearts)
    superman: false,
    // Warp the bullet
    warp: true,
    // Color the game
    color : true,
    fill : false,
    // Start the game
    start: function (r) {
        // If the game is already running don't do anything
        if (this.running) return;
        // Set running to true
        this.running = true;
        this.paused = false;
        // Create asteroids
        createAsteroids();
        // Set the ship in the middle
        ship = new Ship(c.width / 2, c.height / 2, -10, 10);
        // If r is true go back before requesting a new frame (r = restart)
        // Basically used so it doesn't create a new frame if there already is one
        if(r) return;
        // Request a new animation frame and set it as request
        request = window.requestAnimationFrame(gameLoop);
        return;
    },
    stop: function () {
        if (!this.running) return;
        this.running = false;
        // Create a clear rectangle from 0 with the same height and width as the screen
        ctx.clearRect(0, 0, c.width, c.height)
        // Clear lasers
        lasers = [];
        // Clear asteroids
        asteroids = [];
        // Resets the score
        score = 0;
        // Resets the lives
        lives = maxLives;
        // Reset resets
        resets = 0;
        // Cancel the next animation frame 
        window.cancelAnimationFrame(request)
        return;
    },
    // Pause the game
    pause: function () {
        // If the game is paused return
        if (this.paused == true) return;
        this.paused = true;
        // Cancel the next animation frame 
        window.cancelAnimationFrame(request)
        return;
    },
    // Resume the game
    resume: function () {
        // If the game isn't paused return
        if (this.paused == false) return;
        this.paused = false;
        // Request a new animation frame and set it as request
        request = window.requestAnimationFrame(gameLoop);
        return;
    },
    // Restart the game
    restart: function (r = false) {
        // Stops the game
        game.stop();
        // Starts back the game
        game.start(r);
        return;
    },
    win: function(){
        game.pause();
        end(true);
    },
    lose: function(){
        game.pause();
        end(false);
    }
}