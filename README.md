# Terminal Ping Pong Game

A terminal-based ping pong game with web interface that runs in your VM.

## Features

- Play against AI opponent
- Web-based interface accessible from any browser
- Responsive controls using arrow keys
- Real-time multiplayer support
- Terminal and web viewing options

## Requirements

- Node.js (v14 or higher)
- npm (usually comes with Node.js)

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Start the game server:
```bash
npm start
```

3. Open your browser and navigate to:
```
http://localhost:3000
```

## How to Play

- Use UP and DOWN arrow keys to move your paddle
- First player to score wins!
- Press Start to begin, Pause to pause, Reset to restart

## Game Controls

- Arrow Up: Move paddle up
- Arrow Down: Move paddle down
- Start Button: Begin the game
- Pause Button: Pause the game
- Reset Button: Restart the match

## Development

To run in development mode with auto-restart:
```bash
npm run dev
```

## File Structure

```
.
├── server.js          # Main server logic and game state
├── package.json       # Node.js dependencies
├── public/
│   ├── index.html     # Game web interface
│   └── style.css      # Optional styling (included in HTML)
└── README.md
```

## Running on VM

To run on your VM:

1. Upload all files to your VM
2. Install Node.js and npm if not already installed
3. Run `npm install` to install dependencies
4. Start the server with `npm start`
5. Access the game from your browser at http://localhost:3000

## Troubleshooting

- If you get permission errors, try running with sudo or check your port access
- Make sure firewall settings allow connections on port 3000
