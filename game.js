const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Game settings
const paddleWidth = 15;
const paddleHeight = 100;
const ballRadius = 10;
const playerX = 20;
const aiX = canvas.width - playerX - paddleWidth;

// State
let playerY = (canvas.height - paddleHeight) / 2;
let aiY = (canvas.height - paddleHeight) / 2;

let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    vx: 6 * (Math.random() > 0.5 ? 1 : -1),
    vy: 4 * (Math.random() > 0.5 ? 1 : -1),
    radius: ballRadius
};

let playerScore = 0;
let aiScore = 0;

// Mouse control for player paddle
canvas.addEventListener('mousemove', function(e) {
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    playerY = mouseY - paddleHeight / 2;
    // Clamp paddle inside canvas
    playerY = Math.max(0, Math.min(canvas.height - paddleHeight, playerY));
});

// Simple AI for right paddle
function updateAI() {
    // AI follows the ball with some delay
    const aiCenter = aiY + paddleHeight / 2;
    if (aiCenter < ball.y - 20) {
        aiY += 5;
    } else if (aiCenter > ball.y + 20) {
        aiY -= 5;
    }
    // Clamp AI paddle inside canvas
    aiY = Math.max(0, Math.min(canvas.height - paddleHeight, aiY));
}

// Ball movement and collision
function updateBall() {
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Top and bottom wall collision
    if (ball.y - ball.radius < 0) {
        ball.y = ball.radius;
        ball.vy = -ball.vy;
    }
    if (ball.y + ball.radius > canvas.height) {
        ball.y = canvas.height - ball.radius;
        ball.vy = -ball.vy;
    }

    // Left paddle collision
    if (ball.x - ball.radius < playerX + paddleWidth &&
        ball.y > playerY &&
        ball.y < playerY + paddleHeight) {
        ball.x = playerX + paddleWidth + ball.radius;
        ball.vx = -ball.vx;
        // Add effect based on hit position
        ball.vy += (ball.y - (playerY + paddleHeight / 2)) * 0.05;
    }

    // Right paddle collision (AI)
    if (ball.x + ball.radius > aiX &&
        ball.y > aiY &&
        ball.y < aiY + paddleHeight) {
        ball.x = aiX - ball.radius;
        ball.vx = -ball.vx;
        ball.vy += (ball.y - (aiY + paddleHeight / 2)) * 0.05;
    }

    // Score/Reset
    if (ball.x - ball.radius < 0) {
        aiScore++;
        resetBall();
    }
    if (ball.x + ball.radius > canvas.width) {
        playerScore++;
        resetBall();
    }
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.vx = 6 * (Math.random() > 0.5 ? 1 : -1);
    ball.vy = 4 * (Math.random() > 0.5 ? 1 : -1);
}

// Drawing
function draw() {
    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw center line
    ctx.strokeStyle = "#444";
    ctx.setLineDash([10, 15]);
    ctx.beginPath();
    ctx.moveTo(canvas.width/2, 0);
    ctx.lineTo(canvas.width/2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw paddles
    ctx.fillStyle = "#fff";
    ctx.fillRect(playerX, playerY, paddleWidth, paddleHeight);
    ctx.fillRect(aiX, aiY, paddleWidth, paddleHeight);

    // Draw ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
    ctx.fill();

    // Draw scores
    ctx.font = "40px Arial";
    ctx.fillStyle = "#fff";
    ctx.fillText(playerScore, canvas.width/2 - 60, 60);
    ctx.fillText(aiScore, canvas.width/2 + 30, 60);
}

// Game loop
function loop() {
    updateAI();
    updateBall();
    draw();
    requestAnimationFrame(loop);
}

// Start
loop();