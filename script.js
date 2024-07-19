//HTML Elements
const board = document.getElementById("game-board");
const instructionText = document.getElementById("instruction-text");
const logo = document.getElementById("logo");
const score = document.getElementById("score");
const highScoreText = document.getElementById("highScore");

// Game Variable
const gridsize = 20;
let highScore = 0;
let snake = [{x: 10, y: 10}];
let food = generateFood();
let dir = "right";
let gameInterval;
let gameSpeedDelay = 250;
let gameStarted = false;

function draw () {
    board.innerHTML = "";
    drawSnake();
    drawFood();
    updateScore();
}

const drawSnake = () => {
    console.log("inside drawSnake");
    console.log(snake);
    snake.forEach( (pixel) => {
        const snakeEl = document.createElement("div", "snake");
        setPosition(snakeEl, pixel);
        board.appendChild(snakeEl);
    });
};

const drawFood = () => {
    if(gameStarted){
        const foodEl = createGameEl("div", "food");
        setPosition(foodEl, food);
        board.appendChild(foodEl);
    }
};

//creatGameEl
const createGameEl = (tag, className) => {
    const el = document.createElement(tag);
    el.className = className
    return el;
};

const setPosition = (el, pixel) => {
    el.style.gridColumn = pixel.x;
    el.style.gridRow = pixel.y;
};

function generateFood()  {
    const x = Math.floor(Math.random() * gridsize) + 1;
    const y = Math.floor(Math.random() * gridsize) + 1;

    return {x , y};
};

function move() {
    const head = {... snake[0]};
    switch (dir) {
        case "up" :
            head.y--;
            break;
        case "down" :
            head.y++; 
            break;
        case "left" :
            head.x--;
            break;
        case "right" :
            head.x++;
            break;
    }
    snake.unshift(head);

    //eat food
    if(head.x == food.x && head.y == food.y) {
        food = generateFood();
        increaseSpeed();
        clearInterval(gameInterval);
        gameInterval = setInterval ( () => {
                move();
                checkCollision();
                draw();
            }, gameSpeedDelay);
    } else {

        snake.pop();
    }
}

function startGame() {
    gameStarted = true;
    instructionText.style.display = "none";
    logo.style.display = "none";
    gameInterval = setInterval(() => {
        move();
        checkCollision();
        draw();
    }, gameSpeedDelay);
}

function increaseSpeed () {
    if(gameSpeedDelay > 150){
        gameSpeedDelay -= 5;
    } else if (gameSpeedDelay > 100){
        gameSpeedDelay -= 3;
    } else if (gameSpeedDelay > 50){
        gameSpeedDelay -= 2;
    } else  {
        gameSpeedDelay -= 1;
    }
}

function handleKeyPress (event) {
    if(
        (!gameStarted && event.code == 'Space') || 
        (!gameStarted && event.code == " ") 
    ){
        startGame();
    } else {
        switch (event.key) {
            case "ArrowUp":
                dir = "up";    
                break;
            
            case "ArrowDown ":
                dir = "down";
                break;
            
            case "ArrowLeft":
                dir = "left";
                break;
            
            case "ArrowRight":
                dir = "right";
                break;
            
        }
    }
}

document.addEventListener("keydown" , handleKeyPress);

function checkCollision() {
    const head = snake[0];

    if(head.x  < 1 || head.y < 1 || head.y > gridsize || head.x > gridsize){
        resetGame();
    }

    for(let i = 1 ; i < snake.length; i++){
        if(head.x === snake[i].x && head.y === snake[i].y){
            resetGame();
        }
    }
}

function resetGame() {
    updateHighScore();
    stopGame();
    snake = [{x : 10, y: 10}];
    dir = "right";
    food = generateFood();
    gameSpeedDelay = 250;
    updateScore();
}

function updateScore() {
    const curr = snake.length  -1;
    score.innerHTML = curr.toString().padStart(3,"0");
}

function stopGame() {
    clearInterval(gameInterval);
    gameStarted = false;
    instructionText.style.display = "block";
    logo.style.display = "block";
}

function updateHighScore() {
    currScore = snake.length - 1;
    highScore = Math.max(highScore, currScore);
    highScoreText.style.display = "block";
    highScoreText.innerHTML = highScore.toString().padStart(3,"0");
}
//draw();