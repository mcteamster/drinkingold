// HTTP and WebSocket Server
const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

const STATIC_ROOT = path.resolve(__dirname, '../view/build');
const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.js':   'application/javascript; charset=utf-8',
    '.css':  'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png':  'image/png',
    '.ico':  'image/x-icon',
    '.svg':  'image/svg+xml',
    '.woff2':'font/woff2',
    '.woff': 'font/woff',
    '.ttf':  'font/ttf',
};

const server = http.createServer((req, res) => {
    // Sanitise the URL path and map to a file under STATIC_ROOT
    let urlPath = req.url.split('?')[0];  // strip query string
    urlPath = urlPath.replace(/\.\./g, '');  // no directory traversal
    let filePath = path.join(STATIC_ROOT, urlPath);

    // If the path resolves to a directory, serve index.html (SPA fallback)
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, 'index.html');
    }

    // Serve the file if it exists, otherwise fall back to index.html
    if (!fs.existsSync(filePath)) {
        filePath = path.join(STATIC_ROOT, 'index.html');
    }

    // Safety check: resolved path must stay inside STATIC_ROOT
    const resolved = path.resolve(filePath);
    if (!resolved.startsWith(STATIC_ROOT + path.sep) && resolved !== STATIC_ROOT) {
        res.writeHead(403);
        res.end();
        return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end('Not found');
            return;
        }
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
});

const ws = new WebSocket.Server({ noServer: true });

server.listen(80);
server.on('upgrade', (request, socket, head) => {
    ws.handleUpgrade(request, socket, head, socket => {
        ws.emit('connection', socket, request);
    });
});

// Model
const Lobby = require("../model/lobby.js");
lobbies = [];
rooms = [];

// Websocket Controller
ws.on('connection', function (socket) {
    // Send a meta-only game state to induce Landing page
    socket.send(JSON.stringify({
        meta: {
            type: "gameState",
            round: 0,
            turn: 0,
            phase: "setup",
            card: 0,
            score: 0
        } 
    }));

    // 1. Process inputs
    socket.on('message', function (msg) {
        // Expect roomID, playerID, clientSecret, and data
        msg = JSON.parse(msg);

        // Lobby Init
        if (!this.lobby) {
            let room = parseInt(msg.roomID);
            if (room > 999 && rooms.indexOf(room) != -1) {
                // Lookup Lobby and Retrieve
                let l = lobbies.find(l => l.roomID == room);
                if (l) {
                    this.lobby = l;
                    this.lobby.sockets.push(socket); // Join Broadcast
                                        
                    // Rejoining Logic
                    if (this.lobby.gs.meta.phase === "play") {
                        if (this.lobby.checkPlayer(msg)) {
                            socket.send(JSON.stringify(this.lobby.gs));
                            return;
                        } else {
                            socket.send(JSON.stringify({ meta: { type: "error", data: "This game has already started, would you like to spectate?" } }));
                            return;
                        }
                    }
                } else {
                    socket.send(JSON.stringify({ meta: { type: "error", data: "Room is missing, game may no longer be in progress." } }));
                    return;
                }
            } else if(!isNaN(room)) {
                socket.send(JSON.stringify({ meta: { type: "error", data: "Room is missing, game may no longer be in progress.", code: "missingRoom" } }));
                return;
            } else {
                // Make a New Lobby!
                let retries = 0;
                while (retries < 10) {
                    room = Math.floor(Math.random()*1000 + 1000); // RNG a room Number
                    if (rooms.indexOf(room) == -1) {
                        let l = new Lobby(room);
                        this.lobby = l;
                        this.lobby.sockets.push(socket);
                        lobbies.push(l);
                        rooms.push(room); 
                        break;
                    } else {
                        retries++;
                    }
                }
                if (retries >= 10) {
                    socket.send(JSON.stringify({ meta: { type: "error", data: "Could not start a room, please try again later." } }));
                    return;
                }
            }
        }

        // Authenticate against the lobby
        let authed = this.lobby.auth(msg);

        // Switch depending on Game Phase
        switch (this.lobby.gs.meta.phase) {
            case "setup":
                if (authed && msg.playerID === "1" && msg.data === "start") {
                    this.lobby.gs.meta.phase = "play"; // Host can start the game 
                    this.lobby.gs.meta.turntime = 30000; // Set Turn Timer TODO Customise
                    tick(this.lobby, this.lobby.gs.meta.turntime);
                } else if (this.lobby.checkPlayer(msg) == true) {
                    socket.send(JSON.stringify({ meta: { type: "rejoin", data: "Welcome Back" } }))
                } else if(this.lobby.players.find(x => (x.name === msg.data))) {
                    // Error on Name Colissions
                    socket.send(JSON.stringify({ meta: { type: "error", data: "Someone has already taken that name!", code: "takenName" } }));
                    return;
                } else {
                    socket.send(JSON.stringify(this.lobby.addPlayer(msg))); // Add player to the lobby and return secret
                }
                this.lobby.sockets.forEach(s => s.send(JSON.stringify(this.lobby.gs))); // Broadcast Updates
                break;
            case "play":
                // Collect intent from all players until time is up
                if (authed) {
                    let voted = this.lobby.gs.setIntent(msg);
                    let allVoted = this.lobby.gs.getActive().map((p) => {
                        return voted[p.id];
                    }).reduce((x, y) => 
                        {return x && y}
                    );
                    if(allVoted) {
                        // Proceed Early if All Players have explictly voted
                        clearTimeout(this.lobby.nextTurn);
                        nextTurn(this.lobby);
                    } else {
                        // Brodcast Vote Status Updates
                        this.lobby.sockets.forEach(s => s.send(JSON.stringify({ meta: { type: "readyStatus", data: voted } }))); // Broadcast Updates
                    }
                }
                break;
            case "endgame":
                break;
            default:
                break;
        }
    });

    socket.on('close', () => {
        if (this.lobby) { this.lobby.sockets = this.lobby.sockets.filter(s => s !== socket); }
    });
});

// 2. Gameplay Loop: Update Game State and Publish When Time is Up
function tick(lobby, timeout) {
    lobby.nextTurn = setTimeout(()=>{nextTurn(lobby)}, timeout);
}

function nextTurn(lobby) {
    if (lobby.gs.meta.phase === "play") {
        lobby.gs.update();
        tick(lobby, lobby.gs.meta.turntime);
    } else if (lobby.gs.meta.phase === "endgame") {
        console.debug(new Date() + ` Game ${lobby.gs.meta.room} is Over`);
        rooms = rooms.filter(r => r != lobby.roomID);
        lobbies = lobbies.filter(l => l !== lobby);
    }
    // Broadcast Update
    lobby.sockets.forEach(s => s.send(JSON.stringify(lobby.gs)));
}

// 3. Cleanup abandoned lobbies
setInterval(()=>{
    lobbies.forEach(lobby => {
        let age = new Date() - lobby.creationTime;
        if(age > 1000*60*60){
            console.debug(new Date() + ` Cleaned ${lobby.roomID}`);
            rooms = rooms.filter(r => r != lobby.roomID);
            lobbies = lobbies.filter(l => l !== lobby);
        }
    })
}, 1000*60*10)

// Welcome to the Game
console.info(new Date() + " Welcome to Drinkin' Gold")