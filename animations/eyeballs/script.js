const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext('2d');
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
let W = canvas.width;
let H = canvas.height;
let eyes = [];
let theta;

const mouse = {
    x: undefined,
    y: undefined
};

window.addEventListener('mousemove', function(e){
    mouse.x = e.x;
    mouse.y = e.y;
});

class Eye {
    constructor(x, y, radius){
        this.x = x;
        this.y = y;
        this.radius = radius;
    };

    draw(){

        //get angle
        let dX = (mouse.x - this.x);
        let dY = (mouse.y - this.y);
        theta = Math.atan2(dY, dX);

        //draw eye
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI, true);
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.closePath();
        

        //draw iris
        let irisX = this.x + Math.cos(theta) * this.radius/10;
        let irisY = this.y + Math.sin(theta) * this.radius/10;
        let irisRadius = this.radius / 1.2;
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.arc(irisX, irisY, irisRadius, 0, Math.PI * 2, );
        ctx.fill();
        ctx.closePath();

        //draw pupillary
        let pupilRadius = this.radius / 2.5;
        let pupilX = this.x + Math.cos(theta) * this.radius/1.9;
        let pupilY = this.y + Math.sin(theta) * this.radius/1.9;
        ctx.beginPath();
        ctx.arc(pupilX, pupilY, pupilRadius, 0, Math.PI*2);
        ctx.fillStyle = 'black';
        ctx.fill();
        ctx.closePath();

        //draw pupillary reflection
        ctx.beginPath();
        ctx.arc(pupilX - pupilRadius/3, pupilY - pupilRadius/3, pupilRadius/2, 0, Math.PI*2);
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.fill();
        ctx.closePath();

    }
}

function init() {
    eyes = [];
    let overlapping = false;
    let numberOfEyes = 500;
    let protection = 10000;
    let counter = 0;

    while(eyes.length < numberOfEyes){
        let eye = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: rand(10, 50),
        };

        overlapping = false;
        for(i=0; i<eyes.length; i++){
            let prevEye = eyes[i];
            let dx = eye.x - prevEye.x;
            let dy = eye.y - prevEye.y;
            let distance = Math.sqrt(dx*dx + dy*dy);
            if(distance < (eye.radius + prevEye.radius)){
                overlapping = true;
                break;
            }
        }
        if(!overlapping){
            eyes.push(new Eye(eye.x, eye.y, eye.radius))
        }
        counter++;
    }        
}



function animate() {
    requestAnimationFrame(animate);
    ctx.fillStyle = 'rgba(0,0,0,.25)'
    ctx.fillRect(0,0,W,H);
    for(i=0; i<eyes.length; i++){
        eyes[i].draw();
        
            
     
    }
}

window.addEventListener('resize', function(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
})



function rand(min, max){
    return (Math.random() * (max - min)) + min  ;
}
function drawLine(startX, startY, endX, endY){
    ctx.strokeStyle = 'white';
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.closePath();
    ctx.stroke();
}

init();
animate();
