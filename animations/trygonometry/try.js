const radius = 200;
const circleCenterX = 300;
const circleCenterY = 300;
let canvas;
let ctx;
let W;
let H;
let xEndPoint;
let yEndPoint;
class mousePosition{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}
let mousePos = new mousePosition(0,0);

document.addEventListener('DOMContentLoaded', setupCanvas);

function setupCanvas() {
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext('2d');
    W = canvas.width;
    H = canvas.height;
    drawCanvas();
    document.addEventListener('mousemove', redrawCanvas);
}

function drawCanvas() {
    drawRectangle(0, 0, W, H, 2, "black");
    drawCircle(circleCenterX, circleCenterY, radius, 1, "black");
    drawLine(W/2, 0, W/2, H, 2, "black");
    drawLine(0, H/2, W, H/2, 2, "black");
    

}

function redrawCanvas(e) {
    ctx.clearRect(0,0,W,H);
    drawCanvas();
    getmousePosition(e);
    drawTriangle(getAngleUsingXandY(mousePos.y, mousePos.x));
    
    drawText(20, 20, "X: " + mousePos.x);
    drawText(20, 40, "Y: " + mousePos.y);
    drawText(20, 60, "ANGLE: " + getAngleUsingXandY(mousePos.y, mousePos.x));
}

function drawCircle(x, y, r, lineWidth, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI *2);
    ctx.stroke();
    ctx.closePath();
   
}

function drawRectangle(x, y, width, height, lineWidth, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.strokeRect(x, y, width, height);
    ctx.stroke();
    ctx.closePath();

}

function drawTriangle(angle){
    ctx.moveTo(circleCenterX, circleCenterY);
    xEndPoint = circleCenterX + Math.cos(deg2rad(angle)) * radius;
    yEndPoint = circleCenterY + (-Math.sin(deg2rad(angle)) * radius);
    ctx.lineTo(xEndPoint, yEndPoint);
    ctx.stroke();

    ctx.moveTo(xEndPoint, yEndPoint);
    ctx.lineTo(xEndPoint, circleCenterY);
    ctx.stroke();

    drawText(xEndPoint, yEndPoint - 10, "X: " + xEndPoint.toFixed(2) +" | " + "Y: " + yEndPoint.toFixed(2));
    drawText(20, 80,"HYPOTENUSE: " + getLineLength(xEndPoint, yEndPoint, circleCenterX ,circleCenterY));
    drawText(20,100,"OPPOSITE: " + getLineLength(xEndPoint, yEndPoint,xEndPoint, H/2));
    drawText(20,120,"ADJACENT: " + getLineLength(xEndPoint, H/2, circleCenterX, circleCenterY))
        

}

function getmousePosition(e) {
    let canvasDimensions = canvas.getBoundingClientRect();
    mousePos.x = e.clientX - canvasDimensions.left;
    mousePos.y = e.clientY - canvasDimensions.top;
    mousePos.x -= 300;
    mousePos.y = (mousePos.y - 300) *-1;
    
}

function getAngleUsingXandY(x, y) {
    return rad2deg(Math.atan2(x, y));
}

function drawLine(startX, startY, endX, endY, lineWidth, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
}

function drawText(x, y, text) {
    ctx.fillText(text, x, y);
}

function deg2rad(deg) {
    return (deg * Math.PI/180).toFixed(2);
}

function rad2deg(rad) {
    if(rad < 0){
        return (360 + (rad * 180/Math.PI)).toFixed(2);
    } else
    return (rad * 180/Math.PI).toFixed(2);
}

function getLineLength(x1, y1, x2, y2) {
    let xD = (x1 - x2);
    xD = xD * xD;
    let yD = (y1 - y2);
    yD = yD * yD;
    return(Math.sqrt(xD + yD).toFixed(2));
}