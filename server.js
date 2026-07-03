const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Game state
let gameState = {
  playerY: 15,
  aiY: 15,
  ballX: 40,
  ballY: 20,
  ballDX: 1,
  ballDY: 1,
  playerScore: 0,
  aiScore: 0,
  gameRunning: false
};

// Game constants
const CANVAS_WIDTH = 80;
const CANVAS_HEIGHT = 40;
const PADDLE_HEIGHT = 5;

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Socket connection handling
io.on('connection', (socket) => {
  console.log('User connected');
  
  // Send initial game state to new client
  socket.emit('gameState', gameState);
  
  // Handle player input
  socket.on('playerMove', (data) => {
    if (data.direction === 'up') {
      gameState.playerY = Math.max(1, gameState.playerY - 2);
    } else if (data.direction === 'down') {
      gameState.playerY = Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT - 1, gameState.playerY + 2);
    }
    
    // Broadcast updated game state to all clients
    io.emit('gameState', gameState);
  });
  
  // Handle start game
  socket.on('startGame', () => {
    gameState.gameRunning = true;
    io.emit('gameState', gameState);
  });

  // Handle pause game
  socket.on('pauseGame', () => {
    gameState.gameRunning = false;
    io.emit('gameState', gameState);
  });

  // Handle reset game
  socket.on('resetGame', () => {
    gameState.playerY = 15;
    gameState.aiY = 15;
    gameState.playerScore = 0;
    gameState.aiScore = 0;
    gameState.gameRunning = false;
    resetBall();
    io.emit('gameState', gameState);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Update game logic periodically
setInterval(() => {
  if (gameState.gameRunning) {
    // Move ball
    gameState.ballX += gameState.ballDX;
    gameState.ballY += gameState.ballDY;
    
    // Ball collision with top and bottom walls
    if (gameState.ballY <= 0 || gameState.ballY >= CANVAS_HEIGHT - 1) {
      gameState.ballDY = -gameState.ballDY;
    }
    
    // Ball collision with player paddle
    if (gameState.ballX <= 3 && 
        gameState.ballY >= gameState.playerY && 
        gameState.ballY < gameState.playerY + PADDLE_HEIGHT) {
      gameState.ballDX = Math.abs(gameState.ballDX);
    }
    
    // Ball collision with AI paddle
    if (gameState.ballX >= CANVAS_WIDTH - 4 &&
        gameState.ballY >= gameState.aiY && 
        gameState.ballY < gameState.aiY + PADDLE_HEIGHT) {
      gameState.ballDX = -Math.abs(gameState.ballDX);
    }
    
    // Score points
    if (gameState.ballX < 0) {
      gameState.aiScore++;
      resetBall();
    } else if (gameState.ballX >= CANVAS_WIDTH) {
      gameState.playerScore++;
      resetBall();
    }
    
    // AI movement - follow the ball with some delay
    const aiPaddleCenter = gameState.aiY + PADDLE_HEIGHT / 2;
    if (aiPaddleCenter < gameState.ballY - 1) {
      gameState.aiY = Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT - 1, gameState.aiY + 1);
    } else if (aiPaddleCenter > gameState.ballY + 1) {
      gameState.aiY = Math.max(1, gameState.aiY - 1);
    }
    
    // Broadcast updated game state
    io.emit('gameState', gameState);
  }
}, 100);

// Reset ball position
function resetBall() {
  gameState.ballX = Math.floor(CANVAS_WIDTH / 2);
  gameState.ballY = Math.floor(CANVAS_HEIGHT / 2);
  
  // Random direction but always towards a player
  gameState.ballDX = Math.random() > 0.5 ? 1 : -1;
  gameState.ballDY = (Math.random() * 2) - 1; // -1 to 1
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Game accessible at http://localhost:${PORT}`);
});