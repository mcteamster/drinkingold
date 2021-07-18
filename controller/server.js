// Websocket Server
const WebSocket = require('ws');
const server = new WebSocket.Server({
    port: 8080
});
const GameState = require("../model/gameState.js");
let gs = new GameState("0000"); // this should be initialised in the setup phase
console.dir(gs);

let sockets = []; // This should be stored in the database
server.on('connection', function (socket) {
    sockets.push(socket);

    // Send the game state
    socket.send(JSON.stringify(gs));

    // 1. Process inputs
    socket.on('message', function (msg) {
        msg = JSON.parse(msg);

        // Switch depending on Game Phase
        switch (gs.meta.phase) {
            case "setup":
                // Configure Game, Start Gameplay Loop
                break;
            case "play":
                socket.send(JSON.stringify(gs.setIntent(msg))); // Collect intent from all players until time is up or all players have explicitly answered
                break;
            case "endgame":
                break;
            default:
                console.error(new Date() + "Missing Game Phase");
                break;
        }
    });

    socket.on('close', () => {
        sockets = sockets.filter(s => s !== socket);
    });
});

// 2. Gameplay Loop: Update Game State and Publish When Time is Up
let gameLoop = setInterval(()=>{
    if(gs.meta.phase === "play") {
        gs.update();
    } else if(gs.meta.phase === "endgame") {
        clearInterval(gameLoop); // Stop Updating Game State
        console.debug(new Date() + "The Game Is Over");
    }

    // Broadcast Update
    sockets.forEach(s => s.send(JSON.stringify(gs)));
}, 200);