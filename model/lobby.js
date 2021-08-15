// Lobby Class
const GameState = require("../model/gameState.js");

class Lobby {
    constructor(roomID) {
        this.creationTime = new Date(),
        this.roomID = roomID,
        this.sockets = []
        this.players = []
        this.colours = [
            "AliceBlue",
            "AntiqueWhite",
            "Aqua",
            "Aquamarine",
            "Azure",
            "Bisque",
            "BlanchedAlmond",
            "BlueViolet",
            "Brown",
            "BurlyWood",
            "CadetBlue",
            "Chartreuse",
            "Chocolate",
            "Coral",
            "CornflowerBlue",
            "Cornsilk",
            "Crimson",
            "Cyan",
            "DarkCyan",
            "DarkGoldenRod",
            "DarkGray",
            "DarkGrey",
            "DarkKhaki",
            "DarkMagenta",
            "DarkOrange",
            "DarkOrchid",
            "DarkRed",
            "DarkSalmon",
            "DarkSeaGreen",
            "DarkTurquoise",
            "DarkViolet",
            "DeepPink",
            "DeepSkyBlue",
            "DodgerBlue",
            "FireBrick",
            "FloralWhite",
            "ForestGreen",
            "Fuchsia",
            "Gainsboro",
            "Gold",
            "GoldenRod",
            "Green",
            "GreenYellow",
            "HotPink",
            "IndianRed",
            "Indigo",
            "Khaki",
            "Lavender",
            "LavenderBlush",
            "LawnGreen",
            "LemonChiffon",
            "LightBlue",
            "LightCoral",
            "LightCyan",
            "LightGreen",
            "LightPink",
            "LightSalmon",
            "LightSeaGreen",
            "LightSkyBlue",
            "LightSteelBlue",
            "Lime",
            "LimeGreen",
            "Linen",
            "Magenta",
            "MediumAquaMarine",
            "MediumOrchid",
            "MediumSeaGreen",
            "MediumSpringGreen",
            "MediumTurquoise",
            "MediumVioletRed",
            "MistyRose",
            "Moccasin",
            "NavajoWhite",
            "Orange",
            "OrangeRed",
            "Orchid",
            "PaleGoldenRod",
            "PaleGreen",
            "PaleTurquoise",
            "PaleVioletRed",
            "PapayaWhip",
            "PeachPuff",
            "Pink",
            "Plum",
            "PowderBlue",
            "Red",
            "RosyBrown",
            "Salmon",
            "SandyBrown",
            "SeaGreen",
            "SeaShell",
            "Silver",
            "SkyBlue",
            "Snow",
            "SpringGreen",
            "Tan",
            "Thistle",
            "Tomato",
            "Turquoise",
            "Violet",
            "Wheat",
            "Yellow",
            "YellowGreen",
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
            this.gs.players.push({ "id": p.id, "colour": this.colours.splice(Math.floor(Math.random()*this.colours.length), 1), "name": p.name, "roundScores": new Array(5), "totalScore": 0, "active": true });
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
}

module.exports = Lobby;