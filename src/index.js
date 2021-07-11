import React from 'react';
import ReactDOM from 'react-dom';
import "./index.css";
import App from './App';

// Mock Game State - this should be retrieved from server
let gameState = {
  meta: {
    room: "0000",
    round: 1,
    turn: 1,
    phase: "resolve",
    card: Math.floor(Math.random()*35)
  },
  players: [
    {"id": 1, "colour": "red", "name": "mcteamster", "roundScore": 1, "totalScore": 0, "left": false},
    {"id": 2, "colour": "lightblue", "name": "tonz", "roundScore": 1, "totalScore": 50, "left": false},
    {"id": 3, "colour": "green", "name": "skree", "roundScore": 11, "totalScore": 28, "left": false},
    {"id": 4, "colour": "yellow", "name": "tonz", "roundScore": 11, "totalScore": 10, "left": false},
    {"id": 5, "colour": "pink", "name": "mcteamster", "roundScore": 1, "totalScore": 0, "left": false},
    {"id": 6, "colour": "cyan", "name": "tonz", "roundScore": 1, "totalScore": 50, "left": false},
    {"id": 7, "colour": "lime", "name": "skree", "roundScore": 2, "totalScore": 28, "left": false},
    {"id": 8, "colour": "orange", "name": "tonz", "roundScore": 5, "totalScore": 10, "left": false}
  ],
  hazards: [
    {"id": 1, "symbol": "👮", "active": true},
    {"id": 2, "symbol": "🤮", "active": true},
    {"id": 3, "symbol": "🚕", "active": true},
    {"id": 4, "symbol": "⛔", "active": true},
    {"id": 5, "symbol": "💔", "active": true}
  ],
  bonuses: [
    {"id": 0, "symbol": "🍺", "active": true, "value": 2},
    {"id": 1, "symbol": "🍗", "active": false, "value": 5},
    {"id": 2, "symbol": "🌯", "active": false, "value": 5},
    {"id": 3, "symbol": "🍕", "active": true, "value": 5},
    {"id": 4, "symbol": "🛑", "active": false, "value": 10},
    {"id": 5, "symbol": "💸", "active": false, "value": 10}
  ]
}


ReactDOM.render(
  <React.StrictMode>
    <App gameState={gameState}/>
  </React.StrictMode>,
  document.getElementById('root')
);