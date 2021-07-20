// Websocket Server
const WebSocket = require('ws');
const server = new WebSocket.Server({
    port: 8080
});

// Model
const GameState = require("../model/gameState.js");
let gs = new GameState("1234");
const Lobby = require("../model/lobby.js");
let lobby = new Lobby("1234");

server.on('connection', function (socket) {
    lobby.sockets.push(socket);

    // Send the game state
    socket.send(JSON.stringify(gs));

    // 1. Process inputs
    socket.on('message', function (msg) {
        // Expect roomID, playerID, clientSecret, and data
        msg = JSON.parse(msg);
        
        // TODO AUTH HERE - Load in the respective gamestate // unauth = spectate?
        // Check against the lobby object, check is name and secret match
        // DATABASE CALL get this

        // Switch depending on Game Phase
        switch (gs.meta.phase) {
            case "setup":
                console.log(msg);
                if(msg.playerID === "1" && msg.data === "start"){
                    gs.meta.phase = "play"; // Host can start the game 
                    tick(5000);
                } else {
                    socket.send(JSON.stringify(lobby.addPlayer(msg, gs))); // Add player to the lobby and return secret
                }
                lobby.sockets.forEach(s => s.send(JSON.stringify(gs))); // Broadcast Updates
                break;
            case "play":
                // Collect intent from all players until time is up
                socket.send(JSON.stringify(gs.setIntent(msg)));
                break;
            case "endgame":
                break;
            default:
                lobby = new Lobby("1234"); // New Lobby
                gs = new GameState("1234"); // Setup a new room // RNG a room ID
                // DATABASE CALL store this
                break;
        }
    });

    socket.on('close', () => {
        lobby.sockets = lobby.sockets.filter(s => s !== socket);
    });
});

// 2. Gameplay Loop: Update Game State and Publish When Time is Up
function tick(timeout){
    setTimeout(()=>{
        if(gs.meta.phase === "play") {
            gs.update();
            tick(5000);
        } else if(gs.meta.phase === "endgame") {
            console.debug(new Date() + "The Game Is Over");
        }
    
        // Broadcast Update
        lobby.sockets.forEach(s => s.send(JSON.stringify(gs)));
    }, timeout);
}