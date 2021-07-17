// Websocket Server
const WebSocket = require('ws');
const server = new WebSocket.Server({
    port: 8080
});

let sockets = [];
server.on('connection', function (socket) {
    // Add to sockets list
    sockets.push(socket);

    // Send latest game state
    socket.send(JSON.stringify(gameState));

    // Process inputs
    socket.on('message', function (msg) {
        gameState.meta.card = Math.floor(Math.random() * 35);
        sockets.forEach(s => s.send(JSON.stringify(gameState)));
        console.log(msg);
    });

    // When a socket closes, or disconnects, remove it
    socket.on('close', ()=>{
        sockets = sockets.filter(s => s !== socket);
    });
});

let gameState = {
    meta: {
        room: "0000",
        round: 1,
        turn: 1,
        phase: "resolve",
        card: Math.floor(Math.random() * 35),
        score: 20
    },
    players: [
        { "id": 1, "colour": "red", "name": "mcteamster", "roundScores": [1], "totalScore": 0, "left": false },
        { "id": 2, "colour": "lightblue", "name": "tonz", "roundScores": [2], "totalScore": 50, "left": false },
        { "id": 3, "colour": "green", "name": "skree", "roundScores": [3], "totalScore": 28, "left": true },
        { "id": 4, "colour": "yellow", "name": "toose", "roundScores": [4], "totalScore": 10, "left": false },
        { "id": 5, "colour": "pink", "name": "boose", "roundScores": [5], "totalScore": 0, "left": false },
        { "id": 6, "colour": "cyan", "name": "gong", "roundScores": [6], "totalScore": 50, "left": true },
        { "id": 7, "colour": "lime", "name": "ronz", "roundScores": [7], "totalScore": 28, "left": false },
        { "id": 8, "colour": "orange", "name": "jojo", "roundScores": [8], "totalScore": 10, "left": false }
    ],
    hazards: [
        { "id": 1, "symbol": "👮", "active": true },
        { "id": 2, "symbol": "🤮", "active": true },
        { "id": 3, "symbol": "🚕", "active": true },
        { "id": 4, "symbol": "⛔", "active": true },
        { "id": 5, "symbol": "💔", "active": true }
    ],
    bonuses: [
        { "id": 0, "symbol": "🍺", "active": true, "value": 2 },
        { "id": 1, "symbol": "🍗", "active": false, "value": 5 },
        { "id": 2, "symbol": "🌯", "active": false, "value": 5 },
        { "id": 3, "symbol": "🍕", "active": true, "value": 5 },
        { "id": 4, "symbol": "🛑", "active": false, "value": 5 },
        { "id": 5, "symbol": "💸", "active": false, "value": 5 }
    ]
}