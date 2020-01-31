let canvas;
let ctx;
let W = 1400;
let H = 1000;
let ship;
let keys = [];
let bullets = [];
let asteroids = [];
let score = 0;
let lives = 5;

document.addEventListener('DOMContentLoaded', setupCanvas);

function setupCanvas(){
    canvas = document.getElementById('myCanvas');
    ctx = canvas.getContext('2d');
    canvas.width = W;
    canvas.height = H;
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0,W,H);
    ship = new Ship();

    for(i=0; i<8; i++){
        asteroids.push(new Asteroid())
    };

    //key handling functions
    document.addEventListener('keydown', keyIsDown)
    document.addEventListener('keyup', keyIsUp)
        
    render();

}

//key handling functions
function keyIsDown(e) {
    keys[e.keyCode] = true;
}
function keyIsUp(e) {
    keys[e.keyCode] = false;
    if(e.keyCode === 32 ){
        bullets.push( new Bullet(ship.angle))
    };
}

class Ship{
    constructor(){
        this.visible = true;
        this.x = W/2;
        this.y = H/2;
        this.movingForward = false;
        this.speed = 0.2;
        this.velX = 0;
        this.velY = 0;
        this.rotateSpeed = 0.002;
        this.radius = 15;
        this.angle = 0;
        this.strokeColor = 'white';

        //ship nose from the bullets are fired
        this.nosX = W/2 -15;
        this.noxY = H/2;
    }

    rotate(dir){
        this.angle += this.rotateSpeed * dir;
    }

    update(){
        //converting degrees to radians
        let radians = this.angle / Math.PI * 180;

        //if ship is moving calculating velocity direction values 
        if(this.movingForward){
            this.velX += Math.cos(radians) * this.speed;
            this.velY += Math.sin(radians) * this.speed;
        }

        //ship behind a screen - change place to opposite side
        if(this.x < this.radius){
            this.x = W;
        }
        if(this.x > W){
            this.x = this.radius;
        }
        if(this.y < this.radius){
            this.y = H;
        }
        if(this.y > H){
            this.y = this.radius;
        }
        //slowing dowon if ship is not moving
        this.velX *= 0.99;
        this.velY *= 0.99;

        this.x -= this.velX;
        this.y -= this.velY;

    }

    draw(){
        ctx.strokeStyle = this.strokeColor;
        ctx.beginPath();
        //360 degress divide by 3 - points of ship triangle
        let vertAngle = (Math.PI*2) / 3;
        let radians = this.angle / Math.PI * 180;

        //points from where bullets are fired
        this.nosX = this.x - Math.cos(radians) * this.radius;
        this.nosY = this.y - Math.sin(radians) * this.radius;

        //drawing ship
        ctx.moveTo(this.x, this.y);
        for(let i=0; i<4; i++){
            ctx.lineTo(
                this.x - Math.cos(i * vertAngle + radians) * this.radius,
                this.y - Math.sin(i * vertAngle + radians) * this.radius
            )
        }
        ctx.closePath();
        ctx.stroke();

    }


}

class Bullet{
    constructor(angle){
        this.visible = true;
        this.x = ship.nosX;
        this.y = ship.nosY;
        this.angle = angle;
        this.height = 4;
        this.width = 4;
        this.speed = 5;
        this.velX = 0;
        this.velY = 0;
    }
    //calculating bullet direction
    update(){
        let radians = this.angle / Math.PI * 180;
        this.x -= Math.cos(radians) * this.speed;
        this.y -= Math.sin(radians) * this.speed;
    }

    draw(){
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x, this.y, this.width, this.height);

    }
}

class Asteroid{
    constructor(x, y, radius, level, collisionRadius){
        this.visible = true;
        this.x = x || Math.floor(Math.random() * W);
        this.y = y || Math.floor(Math.random() * H);
        this.speed = 3;
        this.radius = radius || 50;
        this.angle = Math.floor(Math.random() * 359);
        this.strokeColor = 'white';
        this.collisionRadius = collisionRadius || 46;
        //asteroids size level -1-biggest 2-middle 3-smallest
        this.level = level || 1;
    }

    update(){
        let radians = this.angle / Math.PI * 180;
        this.x += Math.cos(radians) * this.speed;
        this.y += Math.sin(radians) * this.speed;

        if(this.x < this.radius){
            this.x = W;
        }
        if(this.x > W){
            this.x = this.radius;
        }
        if(this.y < this.radius){
            this.y = H;
        }
        if(this.y > H){
            this.y = this.radius;
        }

    }
    draw(){
        ctx.beginPath();
        //360 degrees divided by 6  - hexagonal shape
        let vertAngle = (Math.PI * 2) / 6;
        var radians = this.angle / Math.PI * 180;
        for(let i=0; i<6; i++){
            ctx.lineTo(
                this.x - Math.cos(i * vertAngle + radians) * this.radius,
                this.y - Math.sin(i * vertAngle + radians) * this.radius
            )
        }
        ctx.closePath();
        ctx.stroke();
    }
}

//collision detector - every collision is considered as circles collision
function circleCollision(p1x, p1y, r1, p2x, p2y, r2) {    
    let radiusSum = r1 + r2;
    let xDiff = p1x - p2x;
    let yDiff = p1y - p2y;
    return (Math.pow(xDiff, 2) + Math.pow(yDiff, 2) <= Math.pow(radiusSum, 2));
}

// drawing lifes on the screen
function drawLifeships() {
    let startX = 1350;
    let startY = 10;
    let  points = [[9,9], [-9,9]];
    ctx.strokeStyle = 'white';
    for(let i=0; i<lives; i++){
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        for(let j=0; j<points.length; j++){
            ctx.lineTo(startX + points[j][0], startY + points[j][1]);
        }
        ctx.closePath();
        ctx.stroke()
        startX -= 30;
    }
}

function render() {
    //ship mowing - treu or false
    ship.movingForward = keys[87];

    //rotating ship - right
    if(keys[68]){
        ship.rotate(1);
    }
    //rotating ship - left
    if(keys[65]){
        ship.rotate(-1);
    }

    ctx.clearRect(0,0,W,H);

    //drawing score on the screen
    ctx.fillStyle = 'white';
    ctx.font = '21px Arial';
    ctx.fillText('SCORE: ' + score.toString(), 20, 35);

    //Game over handling
    if(lives <= 0){

        //removie event listener to stop keybord input 
        document.removeEventListener('keydown', keyIsDown)
        document.removeEventListener('keyup', keyIsUp)

        ship.visible = false;
        ctx.fillStyle = 'white';
        ctx.font = '50px Arial';
        ctx.fillText('GAME OVER', W/2 - 150, H/2);
    }
    drawLifeships();

    //ship collision with asteroids
    if(asteroids.length !== 0 ){
        for(let k=0; k<asteroids.length; k++){
            if(circleCollision(ship.x, ship.y, 11, asteroids[k].x, asteroids[k].y, asteroids[k].collisionRadius )){
                ship.x = W/2;
                ship.y = H/2;
                ship.velX = 0;
                ship.velY = 0;
                lives--;

            }
        }
    }

    //asteroids collision with bullets
    if(asteroids.length !==0 && bullets.length !== 0){
        Loop1:
        for(let m=0; m<asteroids.length; m++){
            for(let l=0; l<bullets.length; l++){
                if(circleCollision(bullets[l].x, bullets[l].y, 5, asteroids[m].x, asteroids[m].y, asteroids[m].collisionRadius)){
                    if(asteroids[m].level === 1){
                        asteroids.push(new Asteroid(asteroids[m].x - 5, asteroids[m].y - 5, 25, 2, 22));
                        asteroids.push(new Asteroid(asteroids[m].x + 5, asteroids[m].y + 5, 25, 2, 22));
                    } else if(asteroids[m].level === 2){
                        asteroids.push(new Asteroid(asteroids[m].x - 5, asteroids[m].y - 5, 15, 3, 12));
                        asteroids.push(new Asteroid(asteroids[m].x + 5, asteroids[m].y + 5, 15, 3, 12));
                    }

                    asteroids.splice(m, 1);
                    bullets.splice(l, 1);
                    score +=20;
                    break Loop1;
                    
                }
            }
        }
    }

    if(ship.visible){
        ship.update();
        ship.draw();
    }

    if(bullets.length !== 0){
        for(i=0; i<bullets.length; i++){
            bullets[i].update();
            bullets[i].draw();
        }
    }
    if(asteroids.length !== 0){
        for(j=0; j<asteroids.length; j++){
            asteroids[j].update();
            asteroids[j].draw();
        }
    }
    requestAnimationFrame(render)
}



