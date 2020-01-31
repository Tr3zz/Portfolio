let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let W = canvas.width;
let H = canvas.height;
let GAME = {};
let keys = [];

function Ball(color, r) {
    this.color = color;
    this.r = r;
    this.x = 0;
    this.y = 0;
    this.offsetX = 0
    this.offsetY = 0

    this.draw = function () {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI);
        ctx.fill();
        ctx.closePath();
    }
}

function Paddle(name, width, height, offset, color){    
    this.width = width;
    this.height = height;
    this.color = color;
    this.name = name;
    this.offset = offset;
    this.score = 0;
    this.x = 0;
    this.y = 0;
    this.moveUp = false;
    this.moveDown = false;


    this.draw = function () {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fill();
        ctx.closePath();
    }
}

function gameInit() {
    GAME.state = 0; // 0-beginning 1-playing 2-score 3-win
    GAME.pause = true;
    GAME.ball = new Ball("#ffffff", 6);
    GAME.players = [];
    GAME.players[0] = new Paddle("left Player", 15, 60, 7, "#fff")
    GAME.players[1] = new Paddle("right Player", 15, 60, 7, "#fff");
    GAME.lives = 3;
    GAME.winner = 0; //1-leftP wins 2-rightP wins
    gameReset();

}

function gameReset() {
    GAME.ball.x = W/2;
    GAME.ball.y = H/2;
    GAME.pause = true;
    GAME.ball.offsetX = 6;
    GAME.ball.offsetY = 3;
    GAME.players[0].x = 0;
    GAME.players[0].y = H/2 - GAME.players[0].height/2;
    GAME.players[1].x = W - GAME.players[1].width;
    GAME.players[1].y = H/2 - GAME.players[0].height/2;

}

// Key handler
    function keyDownHandler(e) {
        if(e.keyCode == 65){ GAME.players[0].moveUp = true} else
        if(e.keyCode == 90){ GAME.players[0].moveDown = true} else
        if(e.keyCode == 38){ GAME.players[1].moveUp = true} else
        if(e.keyCode == 40){ GAME.players[1].moveDown = true} else
        if(e.keyCode == 32){GAME.pause = !GAME.pause};
    }
    function keyUpHandler(e) {  
        if(e.keyCode == 65){ GAME.players[0].moveUp = false} else
        if(e.keyCode == 90){ GAME.players[0].moveDown = false} else
        if(e.keyCode == 38){ GAME.players[1].moveUp = false} else
        if(e.keyCode == 40){ GAME.players[1].moveDown = false}        
    }

    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('keyup', keyUpHandler);

    

    function ballCollidesPaddle(ball,paddle) {
        dx = Math.abs(ball.x - (paddle.x + paddle.width/2));
        dy = Math.abs(ball.y - (paddle.y + paddle.height/2))
        
        if(dx > ball.r + paddle.width/2){return false};
        if(dy > ball.r + paddle.height/2){return false};

        if(dx <= paddle.width){return true};
        if(dy <= paddle.height){return true};

        var dx = dx - paddle.width;
        var dy = dy - paddle.height;

        return(dx*dx + dy*dy <= circle.r * circle.r);
    }

    function drawScore() {
        ctx.font = '50px Arial';
        ctx.fillText( GAME.players[0].score, W/2-100, 50);
        ctx.fillText( GAME.players[1].score, W/2+100, 50);
        
    }

    function drawHeader(x, y, text){
        ctx.font = '20px Arial';
        ctx.fillText(text, x, y);
    }
    function drawPause(text){
        ctx.font = '20px Arial';
        ctx.fillText(text, W/2 , H/2-100)
    }

    function drawTips(text){
        ctx.font = '20px Arial';
        ctx.fillText(text, W/2 - 70, H/2-50);
    }

    function gameDraw() {
        GAME.ball.draw();
        GAME.players[0].draw();
        GAME.players[1].draw();
        drawScore();

    }

    function drawLine(startX, startY, endX, endY, dashes, space) {
        ctx.lineWidth = 10;
        ctx.strokeStyle = 'white';
        ctx.beginPath();
        ctx.setLineDash([dashes, space]);
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
    }

    

    function gameUpdate(){
        //ball moving
        GAME.ball.x += GAME.ball.offsetX;
        GAME.ball.y += GAME.ball.offsetY;

        //ball bounce vertical walls
        if(GAME.ball.y - GAME.ball.r < 0 || GAME.ball.y + GAME.ball.r > H){
            GAME.ball.offsetY *= -1;        
        }

        //players handling
        for(i=0; i<GAME.players.length; i++){
            //moving up
            if(GAME.players[i].moveUp && GAME.players[i].y > 0){
                GAME.players[i].y -= GAME.players[i].offset
            }
            //moving down
            if(GAME.players[i].moveDown && GAME.players[i].y + GAME.players[i].height < H){
                GAME.players[i].y += GAME.players[i].offset
            }

            if(ballCollidesPaddle(GAME.ball, GAME.players[i])){
                GAME.ball.offsetX *= -1;
                if(GAME.players[i].moveUp){GAME.ball.offsetY--};
                if(GAME.players[i].moveDown){GAME.ball.offsetY++};
            }
        }

        //left P scores
        if(GAME.ball.x < 0){
            GAME.players[1].score++;
            GAME.state = 2;
            GAME.pause = true;
        }

        //rigth P scores
        if(GAME.ball.x > W){
            GAME.players[0].score++;
            GAME.state = 2;
            GAME.pause = true;
        }

        //game winning
        for(i=0; i<GAME.players.length; i++){
            if(GAME.players[i].score == GAME.lives){
                GAME.state = 3;
                GAME.pause = true;
                GAME.winner = i;
            }
        }
    }


    function gamePlay() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        gameDraw();
        //drawLine(W/2,0,W/2,H,10,5);
     
        if (GAME.pause) {
            switch(GAME.state) {
                case 0:
                    drawHeader(W/5, H*0.3,'Keys: A,Z ');
                    drawHeader(W*0.7, H*0.3,'keys: UP,DOWN ');
                    drawTips('(Wciśnij SPACJĘ)');
                    break;
                case 2:
                    gameReset();
                    //drawHeader('Punkt!');
                    drawTips('(Wciśnij SPACJĘ)');
                    break;
                case 3:
                    gameReset();
                    //drawHeader(GAME.players[GAME.winner].name + ' wygrywa!');
                    drawHeader(W/2 - 70, H/3, "WYGRYWA GRACZ " + GAME.winner)
                    drawTips('Ponowna gra: SPACJA');
                    break;
                default:
                    drawPause('Pauza');    
                    drawTips('Wznowienie gry: SPACJA');
            }
        } else {
            switch(GAME.state) {
                case 0:
                case 2:
                    GAME.state = 1;
                    break;
                case 3:
                    gameInit();
                    break;
                default:
                    gameUpdate();
            }
        }
     
        // odswiezanie
        requestAnimationFrame(gamePlay);
    }

    gameInit();
    gamePlay();