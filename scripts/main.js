//This is the setup to draw on the canvas
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext('2d');

//This makes the "new game" button work
const newGameButton = document.getElementById('newGameButton');
newGameButton.addEventListener('click', () => {
    score = 0;
    lives = 3;
    pauseAble = true;
    brickReset();
    setUpRound();
}, false);

//This makes the "pause" button work
let pauseStatus = true;
let pauseAble = true;
const pauseButton = document.getElementById('pauseButton');
pauseButton.addEventListener('click', pauseGame, false);
function pauseGame() {
    if(pauseAble){
        pauseStatus = !pauseStatus;
        if(!pauseStatus) {
            draw();
        }
    }
}

//ball variables
const ballRadius = 10;
let x = canvas.width/2;
let y = canvas.height-20;
let dx = 2;
let dy = -2;
let color = '#0095DD';

//paddle variables
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width-paddleWidth)/2;

//brick variables
let brickRowCount = 3;
let brickColumnCount = 5;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;
let bricks = [];
for(let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for(let r = 0; r < brickRowCount; r++) {
        let brickX = brickOffsetLeft + c*(brickWidth + brickPadding);
        let brickY = brickOffsetTop + r*(brickHeight + brickPadding);
        bricks[c][r] = {x: brickX, y: brickY, status: 1};
    }
}

//Scoring and lives varibles
let score = 0;
let lives = 3;

//code to read if the left and right arrow keys are pressed or not
let rightPressed = false;
let leftPressed = false;
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
//Code to read if the mouse is moved 
document.addEventListener("mousemove", mouseMoveHandler, false);
canvas.addEventListener("click", clickHandler, false);

function keyDownHandler(e) {
    if(e.key == "ArrowUp") {
        pauseGame();
    }
    else if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

function mouseMoveHandler(e) {
    let relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX - paddleWidth/2 < 0) {
        paddleX = 0;
    }
    else if(relativeX + paddleWidth/2 > canvas.width) {
        paddleX = canvas.width - paddleWidth;
    }
    else /*if(relativeX > 0 && relativeX < canvas.width)*/ {
        paddleX = relativeX - paddleWidth/2;
    }
}

function clickHandler(e) {
    pauseGame();
}

//This generates a the hexadecimal string for a random color
function randColor() {
    let hexArr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
    let color = '#';
    for(let i =0; i<3; i++) {
        let num = Math.floor(Math.random()*256);
        num = hexArr[Math.trunc(num/16)] + hexArr[num % 16]
        color= color + num;
    }
    return color;
}

//This draws the ball on the canvas at position x, y
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

//This draws the paddle
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
}

//This draws the bricks
function drawBricks() {
    for(let c = 0; c < brickColumnCount; c++) {
        for(let r = 0; r < brickRowCount; r++) {
            if(bricks[c][r].status === 1) {
                ctx.beginPath();
                ctx.rect(bricks[c][r].x, bricks[c][r].y, brickWidth, brickHeight);
                ctx.fillStyle = '#FF0020';
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

//This detects if the ball collides with a brick
function collisionDetection() {
    for(let c = 0; c < brickColumnCount; c++) {
        for(let r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r];
            if(b.status === 1) {
                if(x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    b.status = 0;
                    dy = -dy;
                    color = randColor();
                    score++;
                    let allBricksBroken = true;
                    for(let c = 0; c < brickColumnCount; c++) {
                        for(let r = 0; r < brickRowCount; r++) {
                            let b = bricks[c][r];
                            if(b.status === 1) {
                                allBricksBroken = false;
                            }
                        }
                    }
                    if(allBricksBroken) {
                        brickReset();
                        setUpRound();
                    }
                }
            }
        }
    }
}


//This resets all the bricks to status 1
function brickReset() {
    for(let c = 0; c < brickColumnCount; c++) {
        for(let r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r];
            b.status = 1;
        }
    }
}

//This draws the score
function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 20);
}

//This draws the lives
function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0096DD";
    ctx.fillText(`Lives: ${lives}`, canvas.width-65, 20);
}

//This is the function to animate the game
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    collisionDetection();
    if(x+dx > canvas.width-ballRadius || x+dx < ballRadius){
        dx = -dx;
        color = randColor();
    }
    if(y+dy < ballRadius) {
        dy = -dy;
        color = randColor();
    }
    else if(y+dy > canvas.height-ballRadius) {
        if(x>paddleX && x<paddleX+paddleWidth) {
            dy = -dy;
        }
        else {
            lives--;
            if(lives <= 0) {
                alert("GAME OVER" + "\nScore: " + score);
                pauseStatus = true;
                pauseAble = false;
            }
            else {
                setUpRound();
            }
        }
    }

    if(rightPressed) {
        paddleX += 7;
        if(paddleX+paddleWidth > canvas.width){
            paddleX = canvas.width - paddleWidth;
        }
    }
    else if(leftPressed){
        paddleX -= 7;
        if(paddleX < 0) {
            paddleX = 0;
        }
    }

    drawLives();
    x += dx;
    y += dy;
    if(!pauseStatus) {
        requestAnimationFrame(draw); //This runs the animation function repeatedly
    }
    
}

function setUpRound() {
    pauseStatus = true;
    x = canvas.width/2;
    y = canvas.height-20;
    dx = 2;
    dy = -2;
    paddleX = (canvas.width-paddleWidth)/2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
}

setUpRound(); //This runs the animation function the first time
