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
        phase: "resolve",
        card: 0,
        score: 0
      },
      players: [],
      hazards: [
        { "id": 1, "symbol": "👮", "active": false },
        { "id": 2, "symbol": "🤮", "active": false },
        { "id": 3, "symbol": "🚕", "active": false },
        { "id": 4, "symbol": "⛔", "active": false },
        { "id": 5, "symbol": "💔", "active": false }
      ],
      bonuses: [
        { "id": 0, "symbol": "🍺", "active": true, "value": 0 }
      ]
    };
  }

  componentDidMount() {
    // Websocket Connection
    const ws = new WebSocket('ws://10.0.0.2:8080');

    // Bind Listeners to YEAH and NAH buttons
    ws.onopen = () => {
      document.querySelector('#yes').addEventListener('click', () => {
        ws.send("YEAH!");
      });
      document.querySelector('#no').addEventListener('click', () => {
        ws.send("nah.");
      });
    };

    // Update Game State
    ws.onmessage = (msg) => {
      this.setState(JSON.parse(msg.data));
    };
  }

  render() {
    return (
      <div className="App">
        <MenuButton />
        <Backwards players={this.state.players} bonuses={this.state.bonuses} />
        <Card data={cardData[this.state.meta.card]} />
        <Forwards players={this.state.players} hazards={this.state.hazards} score={this.state.meta.score} />
        <Yeah />
        <Nah />
      </div>
    );
  }
}

export default App;