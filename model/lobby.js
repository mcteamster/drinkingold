// Lobby Class
const GameState = require("../model/gameState.js");

class Lobby {
    constructor(roomID) {
        this.creationTime = new Date(),
        this.roomID = roomID,
        this.sockets = []
        this.players = []
        this.colours = [
            'red',
            'yellow',
            'green',
            'cyan',
            'lightblue',
            'pink',
            'orange',
            'lime'
        ],
        this.gs = new GameState(roomID)
    }

    addPlayer(player) {
        // Check for Unique Name
        if (this.players.find(x => x.name === player.data)) {
            return (new Date + "Name Taken");
        } else {
            let p = {
                id: this.players.length + 1,
                secret: Math.floor(Math.random() * 100000000000),
                name: player.data,
                meta: {
                    type: "secret"
                }
            }
            // Add to Game State and Lobby
            this.gs.players.push({ "id": p.id, "colour": this.colours.pop(), "name": p.name, "roundScores": new Array(5), "totalScore": 0, "active": true });
            this.players.push(p);
            return p
        }
    }

    checkPlayer(player) {
        // Check for Existing Name and Matching Secret
        if (this.players.find(x => (x.name === player.data) && (x.secret == player.clientSecret))) {
            return true;
        } else {
            return false;
        }
    }

    auth(player) {
        if (this.players.find(x => (x.id == player.playerID) && (x.secret == player.clientSecret))) {
            return new Date;
        } else {
            return false;
        }
    }

    cleanup() {

    }
}

module.exports = Lobby;