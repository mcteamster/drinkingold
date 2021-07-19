// Styles
import './App.css';

// React Components
import React from 'react';
import Card from './components/Card.js';
import Backwards from './components/Backwards';
import Forwards from './components/Forwards';
import MenuButton, { Yeah, Nah } from './components/Buttons';

// Card Data
import cardData from './data/cardData.json';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      meta: {
        room: "0000",
        round: 0,
        turn: 0,
        phase: "setup",
        card: 0,
        score: 0
      },
      players: [],
      hazards: [
        { "id": 1, "class": "A", "symbol": "👮", "active": 0 },
        { "id": 2, "class": "B", "symbol": "🤮", "active": 0 },
        { "id": 3, "class": "C", "symbol": "☣️", "active": 0 },
        { "id": 4, "class": "D", "symbol": "⛔", "active": 0 },
        { "id": 5, "class": "E", "symbol": "💔", "active": 0 }
      ],
      bonuses: [
        { "id": 0, "symbol": "🍺", "active": true, "value": 0 }
      ]
    };
  }

  componentDidMount() {
    // Websocket Connection
    const ws = new WebSocket('ws://10.0.0.2:8080');

    // Bind Listeners to YEAH and NAH buttons (Multipurpose Input Elements)
    ws.onopen = () => {
      // YES
      document.querySelector('#yes').addEventListener('click', () => {
        let msg = {
          roomID: sessionStorage.getItem("roomID"),
          playerID: sessionStorage.getItem("playerID"),
          clientSecret: sessionStorage.getItem("clientSecret")
        };

        if (this.state.meta.phase === "play") {
          // Signal Intent and update local state in advance
          let p = this.state.players.find((x) => x.id === parseInt(sessionStorage.getItem("playerID")))
          if (p.active === true || p.active === this.state.meta.turn) {
            p.active = true;
          };
          this.setState(this.state);
          msg.data = true;
        } else if (this.state.meta.phase === "setup") {
          // Set Player Name
          msg.data = "INSERT NAME HERE";
        }

        // Send
        ws.send(JSON.stringify(msg));
      });

      // NO
      document.querySelector('#no').addEventListener('click', () => {
        // Send Intent 
        let msg = {
          roomID: sessionStorage.getItem("roomID"),
          playerID: sessionStorage.getItem("playerID"),
          clientSecret: sessionStorage.getItem("clientSecret")
        };

        if (this.state.meta.phase === "play") {
          // Update local state in advance

          let p = this.state.players.find((x) => x.id === parseInt(sessionStorage.getItem("playerID")))
          if (p.active === true || p.active === this.state.meta.turn) {
            p.active = this.state.meta.turn;
          };
          this.setState(this.state);
          msg.data = false;
        } else if (this.state.meta.phase === "setup") {
          msg.data = "start"
        }

        ws.send(JSON.stringify(msg));
      });
    };

    // Update Game State
    ws.onmessage = (msg) => {
      msg = JSON.parse(msg.data);
      console.dir(msg);
      if (msg.meta?.type === "gameState") {
        this.setState(msg);
      } else if (msg.meta?.type === "secret") {
        sessionStorage.setItem("playerID", msg.id);
        sessionStorage.setItem("clientSecret", msg.secret);
      }
    };
  }

  render() {
    return (
      <div className="App">
        <MenuButton />
        <Backwards players={this.state.players} bonuses={this.state.bonuses} round={this.state.meta.round} />
        <Card data={cardData[this.state.meta.card]} />
        <Forwards players={this.state.players} hazards={this.state.hazards} score={this.state.meta.score} />
        <Yeah />
        <Nah />
      </div>
    );
  }
}

export default App;