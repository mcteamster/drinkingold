// Websocket Server
const WebSocket = require('ws');
const server = new WebSocket.Server({
    port: 8080
});

// Model
const Lobby = require("../model/lobby.js");

server.on('connection', function (socket) {
    // Send the game state
    socket.send(JSON.stringify({meta: {type: "connection"}}));

    // 1. Process inputs
    socket.on('message', function (msg) {
        // Expect roomID, playerID, clientSecret, and data
        msg = JSON.parse(msg);
        
        // Lobby Init
        if(!this.lobby){
            if(parseInt(msg.roomID < 10000)){
                // Lookup Lobby an Retrieve
                //this.lobby = something? DB READ
            } else {
                this.lobby = new Lobby("1234") // RNG a lobby number, store in DB
            }
            this.lobby.sockets.push(socket);
        }

        // Authenticate against the lobby
        let authed = this.lobby.auth(msg);

        // Switch depending on Game Phase
        switch (this.lobby.gs.meta.phase) {
            case "setup":
                if(authed && msg.playerID === "1" && msg.data === "start"){
                    this.lobby.gs.meta.phase = "play"; // Host can start the game 
                    tick(this.lobby, 5000);
                } else {
                    socket.send(JSON.stringify(this.lobby.addPlayer(msg))); // Add player to the lobby and return secret
                }
                this.lobby.sockets.forEach(s => s.send(JSON.stringify(this.lobby.gs))); // Broadcast Updates
                break;
            case "play":
                // Collect intent from all players until time is up // how to rejoin in the midle of a game??
                authed && socket.send(JSON.stringify(this.lobby.gs.setIntent(msg)));
                break;
            case "endgame":
                break;
            default:
                break;
        }
    });

    socket.on('close', () => {
        if(this.lobby){this.lobby.sockets = this.lobby.sockets.filter(s => s !== socket);}
    });
});

// 2. Gameplay Loop: Update Game State and Publish When Time is Up
function tick(lobby, timeout){
    setTimeout(()=>{
        if(lobby.gs.meta.phase === "play") {
            lobby.gs.update();
            tick(lobby, 5000);
        } else if(lobby.gs.meta.phase === "endgame") {
            console.debug(new Date() + "The Game Is Over");
        }
    
        // Broadcast Update
        lobby.sockets.forEach(s => s.send(JSON.stringify(lobby.gs)));
    }, timeout);
}