function warp(object){
    if(object.position.x < 0 - object.size){
        object.position.x = c.width + object.size
    }else if (object.position.x > c.width + object.size){
        object.position.x = 0 - object.size;
    }
    if(object.position.y < 0 - object.size){
        object.position.y = c.height + object.size 
    }else if (object.position.y > c.height + object.size){
        object.position.y = 0 - object.size;
    }
}

function draw() {
    ctx.clearRect(0, 0, c.width, c.height)
    ship.draw();

};
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
            las.draw()
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
            ast.draw();
            if (esp) {
                collisionBox(ast.position.x, ast.position.y, ast.size)
            }
        }
    }
}

function gameLoop() {
    ship.update();
    draw();
    if (esp) {
        collisionBox(ship.position.x, ship.position.y, ship.r)
    }
    lazerLoop();
    asteroidLoop();
    request = window.requestAnimationFrame(gameLoop);
}
game.start();