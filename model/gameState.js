// Game State Class
const cardData = require("../view/src/data/cardData.json");

class GameState {
    // Add a more sophisticated constructor
    constructor(roomID) {
        this.meta = {
            type: "gameState",
            room: roomID,
            round: 1,
            turn: 1,
            phase: "play",
            card: 0,
            score: 0
        },
            this.deck = new Array(cardData.length).fill().map((a, i) => i), // Cards that haven't been drawn
            this.history = [], // What cards have been drawn
            this.burnt = [], // Cards that will no longer appear
            this.delta = [], // This is what the client will animate
            this.players = [
                { "id": 1, "colour": "red", "name": "mcteamster", "roundScores": new Array(5), "totalScore": 0, "active": true },
                { "id": 2, "colour": "lightblue", "name": "tonz", "roundScores": new Array(5), "totalScore": 0, "active": true },
                { "id": 3, "colour": "green", "name": "skree", "roundScores": new Array(5), "totalScore": 0, "active": true },
                { "id": 4, "colour": "yellow", "name": "toose", "roundScores": new Array(5), "totalScore": 0, "active": true },
                { "id": 5, "colour": "pink", "name": "boose", "roundScores": new Array(5), "totalScore": 0, "active": true },
                { "id": 6, "colour": "cyan", "name": "gong", "roundScores": new Array(5), "totalScore": 0, "active": true },
                { "id": 7, "colour": "lime", "name": "ronz", "roundScores": new Array(5), "totalScore": 0, "active": true },
                { "id": 8, "colour": "orange", "name": "jojo", "roundScores": new Array(5), "totalScore": 0, "active": true }
            ],
            this.hazards = [
                { "id": 1, "class": "A", "symbol": "👮", "active": 0 },
                { "id": 2, "class": "B", "symbol": "🤮", "active": 0 },
                { "id": 3, "class": "C", "symbol": "☣️", "active": 0 },
                { "id": 4, "class": "D", "symbol": "⛔", "active": 0 },
                { "id": 5, "class": "E", "symbol": "💔", "active": 0 }
            ],
            this.bonuses = [
                { "id": 0, "class": "B0", "symbol": "🍺", "active": true, "value": 0 },
                { "id": 1, "class": "B1", "symbol": "🍗", "active": 0, "value": 0 },
                { "id": 2, "class": "B2", "symbol": "🌯", "active": 0, "value": 0 },
                { "id": 3, "class": "B3", "symbol": "🍕", "active": 0, "value": 0 },
                { "id": 4, "class": "B4", "symbol": "🛑", "active": 0, "value": 0 },
                { "id": 5, "class": "B5", "symbol": "💸", "active": 0, "value": 0 }
            ]
    }

    // Receive Player Input
    setIntent(player) {
        try {
            // Validate Some attributes of the player input object
            console.log(player.playerID, player.clientSecret); // TODO

            // Set activity
            let p = this.players.find(x => x.id == player.playerID);
            if (p.active === true || p.active === this.meta.turn) {
                (player.vote === true) ? p.active = true : p.active = this.meta.turn; // Mark when you left (the card after which you leave)
            }
            return new Date();
        } catch (err) {
            console.error(new Date() + err);
            return false;
        }
    }

    // Calculate new Game State
    update() {
        // Housekeeping
        this.history.push(cardData[this.meta.card]); // Archive old card
        this.deck = this.deck.filter((c => c !== this.meta.card)) // Remove from deck
        this.meta.turn++; // Increment Turn (lock in the intents);

        // Leavers Score
        let leavers = this.players.filter(p => p.active === this.meta.turn - 1);
        leavers.forEach((player) => {
            let score = this.meta.score; // Round Score
            if (leavers.length === 1) {
                this.bonuses.filter(b => b.active !== 0).forEach((bonus) => {
                    score += bonus.value; // Collect All Bonuses
                    bonus.value = 0; // Reset Bonus Value
                    (bonus.class !== "B0") ? bonus.active = 0 : bonus.active = true; // Disable Bonus
                })
            } else {
                score += Math.floor(this.bonuses[0].value / leavers.length); // Split Remainders
                this.bonuses[0].value = this.bonuses[0].value % leavers.length // Remainder of the remainders
            }
            player.roundScores[this.meta.round - 1] = score;
            player.totalScore += score;
        });

        // If there are still players
        if (this.players.filter(p => (p.active === true || p.active === this.meta.turn)).length > 0) {
            // Flip It
            this.meta.card = this.deck[Math.floor(Math.random() * this.deck.length)] // RNG a new card from the deck
            let newCard = cardData[this.meta.card]; // Get Current Card
            switch (newCard?.type) {
                case "points":
                    this.meta.score += Math.floor(newCard.value / this.players.filter(p => (p.active === true || p.active === this.meta.turn)).length); // Increase Round Score
                    this.bonuses[0].value += newCard.value % this.players.filter(p => (p.active === true || p.active === this.meta.turn)).length; // Remainders
                    break;
                case "hazard":
                    let hazard = this.hazards.find(h => h.class === newCard.class); // Activate Hazard
                    if (++hazard.active === 2) {
                        let losers = this.players.filter(p => (p.active === true || p.active === this.meta.turn));
                        losers.forEach(player => {
                            player.roundScores[this.meta.round - 1] = 0;
                        });
                        this.burnt.push(newCard.id); // Burn this hazard
                        this.reset();
                    }
                    break;
                case "bonus":
                    let bonus = this.bonuses.find(b => b.class === newCard.class)
                    bonus.active = true;
                    (this.history.filter(c => c.type === "bonus").length > 3) ? bonus.value = 10 : bonus.value = 5;
                    break;
                default:
                    console.error(new Date() + "Card Type Mismatch");
                    break;
            }
            console.log(newCard);
        } else {
            this.reset(); // Next Round
        }
    }

    // Clean Gamestate for a new round
    reset() {
        // Burn Unclaimed Bonuses
        this.bonuses.forEach(bonus => {
            if (bonus.class !== "B0" && bonus.active === true) {
                bonus.active = 0;
                this.burnt.push(cardData.find(c => c.class === bonus.class).id);
            }
            bonus.value = 0;
        });

        // Deactivate Hazards
        this.hazards.forEach(hazard => {
            hazard.active = 0;
        })

        // Reactivate Players
        this.players.forEach(player => {
            player.active = true;
        });

        // Replenish the deck
        this.deck = new Array(cardData.length).fill().map((a, i) => i).filter(b => !this.burnt.includes(b)); // Filter out burnt cards
        console.log(this.burnt, this.deck);

        // Next Round
        if (this.meta.round++ > 5) {
            this.meta.phase = "endgame";
        }
    }
}

module.exports = GameState;