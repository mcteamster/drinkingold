// Lobby Class
class Lobby {
    constructor(roomID){
        this.roomID = roomID,
        this.players = []
    }

    addPlayer(player, gs){
        // Check for Unique Name
        if(this.players.find(x=>x.name === player.data)){
            return (new Date + "Name Taken");
        } else {
            let p = {
                id: this.players.length+1,
                secret: Math.floor(Math.random()*100000000000),
                name: player.data,
                meta: {
                    type: "secret"
                }
            }
            // Add to Game State and Lobby
            gs.players.push({ "id": p.id, "colour": "red", "name": p.name, "roundScores": new Array(5), "totalScore": 0, "active": true });
            this.players.push(p);
            return p
        }
    }
}

module.exports = Lobby;