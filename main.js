function warp(object) {
    if (object.position.x < 0 - object.size) {
        object.position.x = c.width + object.size
    } else if (object.position.x > c.width + object.size) {
        object.position.x = 0 - object.size;
    }
    if (object.position.y < 0 - object.size) {
        object.position.y = c.height + object.size
    } else if (object.position.y > c.height + object.size) {
        object.position.y = 0 - object.size;
    }
}

function collisionBox(x, y, r) {
    ctx.strokeStyle = 'lime';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false)
    ctx.stroke();
}

function lazerLoop() {
    for (laser in lasers) {
        if (lasers.hasOwnProperty(laser)) {
            const las = lasers[laser];
            las.update()
            if (esp) {
                collisionBox(las.position.x, las.position.y, las.r)
            }
        }
    }
}

function asteroidLoop() {
    for (asteroid in asteroids) {
        if (asteroids.hasOwnProperty(asteroid)) {
            var ast = asteroids[asteroid];
            ast.update();
            if (esp) {
                collisionBox(ast.position.x, ast.position.y, ast.size)
            }
        }
    }
    while (asteroidsToDestroy.length != 0) {
        //Removes all the asteroids
        var id = asteroidsToDestroy.pop()
        // Remove this asteroid from the array
        asteroids.splice(id, 1);
    }
}

function writeScore() {
    var x = c.width / 2
    writeText("Score: " + score, x, scoreSize, scoreSize)
}

function drawShip() {
    ship.update();
    if (esp) {
        collisionBox(ship.position.x, ship.position.y, ship.r)
    }
}

function noAsteroids() {
    if (!asteroids.length) {
        createAsteroids();
        resets++
    }
}

// Create hearts
function drawHearts() {
    var heart = new Heart();
    // Size of the hearts
    var size = 20;
    // Offset between hearts
    var offset = 1.5
    // Create hearts
    for (i = 0; i < lives; i++) {
        heart.display(size + ((size * i) * offset), size, size)
    }
}

function end(won) {
    var x = c.width / 2
    var y = c.height / 2
    var s = 100;
    if (won) {
        writeText("You Won!", x, y, s)
        writeText("Score: " + score, x, y + s / 2, s / 2)
        writeText("Press Escape To Restart", x, y + s / 1.3, s / 5)
    } else {
        writeText("You Lost!", x, y, s)
        writeText("Score: " + score, x, y + s / 2, s / 2)
        writeText("Press Escape To Restart", x, y + s / 1.3, s / 5)
    }
    if(pressedKeys.escape){
        game.restart()
        return;
    }
    request = window.requestAnimationFrame(function() {end(won)});
}

function draw(){
    drawShip();
    drawHearts();
    writeScore();
}

function gameLoop() {
    ctx.clearRect(0, 0, c.width, c.height)
    lazerLoop();
    asteroidLoop();
    noAsteroids();
    if(resets >= 10) game.win();
    draw();
    if(game.paused) return;
    request = window.requestAnimationFrame(gameLoop);
}
game.start();