// Game State Class
const cardData = require("../view/src/data/cardData.json");

class GameState {
    constructor(roomID) {
        this.meta = {
            type: "gameState",
            room: roomID,
            round: 1,
            turn: 1,
            phase: "setup",
            card: 0,
            score: 1,
            turntime: 0
        },
            this.deck = new Array(cardData.length).fill().map((a, i) => i), // Cards that haven't been drawn
            this.history = [], // What cards have been drawn
            this.burnt = [], // Cards that will no longer appear
            this.voted = {}, // Players who have explictly voted
            this.delta = [], // This is what the client will animate
            this.players = [
            ],
            this.hazards = [
                { "id": 1, "class": "A", "symbol": "🚨", "active": 0 },
                { "id": 2, "class": "B", "symbol": "🤮", "active": 0 },
                { "id": 3, "class": "C", "symbol": "☣️", "active": 0 },
                { "id": 4, "class": "D", "symbol": "🥾", "active": 0 },
                { "id": 5, "class": "E", "symbol": "💔", "active": 0 }
            ],
            this.bonuses = [
                { "id": 0, "class": "B0", "symbol": "🥤", "active": true, "value": 0 },
                { "id": 1, "class": "B1", "symbol": "🍗", "active": 0, "value": 0 },
                { "id": 2, "class": "B2", "symbol": "🌮", "active": 0, "value": 0 },
                { "id": 3, "class": "B3", "symbol": "🍕", "active": 0, "value": 0 },
                { "id": 4, "class": "B4", "symbol": "🍟", "active": 0, "value": 0 },
                { "id": 5, "class": "B5", "symbol": "🍜", "active": 0, "value": 0 }
            ]
    }

    // Receive Player Input
    setIntent(player) {
        try {
            // Set activity
            let p = this.players.find(x => x.id == player.playerID);
            if (p.active === true || p.active === this.meta.turn) {
                (player.data === true) ? p.active = true : p.active = this.meta.turn; // Mark when you left (the card after which you leave)
                this.voted[p.id] = true;
            }
            return this.voted;
        } catch (err) {
            console.error(new Date() + err);
            return false;
        }
    }

    // Get List of Active Players
    getActive() {
        return this.players.filter((p)=>{
            return (p.active === true || p.active === this.meta.turn);
        })
    }

    // Calculate new Game State
    update() {
        // Housekeeping
        this.meta.turntime *= 0.98; // Every turn gets 2% shorter
        let card = Object.assign({}, cardData[this.meta.card]); // Get current card data
        card.drawnTurn = this.meta.turn; // Stamp the drawn turn
        this.history.push(card); // Archive old card
        this.deck = this.deck.filter((c => c !== this.meta.card)) // Remove from deck
        this.meta.turn++; // Increment Turn (lock in the intents);
        this.voted = {}; // Reset explicit voters

        // Leavers Score
        let leavers = this.players.filter(p => p.active === this.meta.turn - 1);
        leavers.forEach((player) => {
            let score = this.meta.score; // Round Score
            if (leavers.length === 1) {
                this.bonuses.filter(b => b.active !== 0).forEach((bonus) => {
                    score += bonus.value; // Collect All Bonuses
                    bonus.value = 0; // Reset Bonus Value
                    if(bonus.class !== "B0"){
                        bonus.active = 0;
                        this.burnt.push(cardData.find(c => c.class === bonus.class).id);
                    } else {
                        bonus.active = true;
                    }
                })
            } else {
                score += Math.floor(this.bonuses[0].value / leavers.length); // Split Remainders
            }
            player.roundScores[this.meta.round - 1] = score;
            player.totalScore += score;
        });
        if(leavers.length >= 1) {
            this.bonuses[0].value = this.bonuses[0].value % leavers.length // Remainder of the remainders
        }

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
                            player.active = false;
                        });
                        this.burnt.push(newCard.id); // Burn this hazard
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

        // Reset Card and Score
        this.meta.card = 0;
        this.meta.score = ++this.meta.round;

        // Next Round
        if (this.meta.round > 5) {
            this.meta.phase = "endgame";
        }
    }
}

module.exports = GameState;