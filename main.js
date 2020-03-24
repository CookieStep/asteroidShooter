function warp(object) {
    if (object.position.x < 0) {
        object.position.x = c.width
    } else if (object.position.x > c.width) {
        object.position.x = 0;
    }
    if (object.position.y < 0) {
        object.position.y = c.height
    } else if (object.position.y > c.height) {
        object.position.y = 0;
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
    while (lasersidsToDestroy.length) {
        // Removes all the lasers
        var id = lasersidsToDestroy.pop()
        // Remove this laser from the array
        lasers.splice(id, 1);
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
        resets++
        lives++
        createAsteroids();
    }
}

// Create hearts
function drawHearts() {
    if (game.superman) return;
    var heart = new Heart();
    // Size of the hearts
    var size = 20;
    // Offset between hearts
    var offset = 1.5;
    // Defines the row and collum
    var row = 0;
    var col = 0;
    // Create hearts
    for (i = 0; i < lives; i++) {
        if (i % Math.round((c.width/size)/4) == 0) {
            row = 0
            col++
        }else row++;
        heart.display(size + ((size * row) * offset),(size * col) * offset + offset , size)
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
    if (pressedKeys.escape) {
        game.restart()
        return;
    }
    request = window.requestAnimationFrame(function () { end(won) });
}

function draw() {
    drawShip();
    writeScore();
    drawParticles();
}

var start = Date.now();

async function gameLoop() {
    if (Date.now() - start < 30) {
        request = window.requestAnimationFrame(gameLoop);
        return;
    } else start = Date.now();
    ctx.clearRect(0, 0, c.width, c.height)
    drawHearts();
    lazerLoop();
    asteroidLoop();
    noAsteroids();
    if (resets >= 10 && !game.infinite) game.win();
    draw();
    if (game.paused) return;
    request = window.requestAnimationFrame(gameLoop);
}
game.start()