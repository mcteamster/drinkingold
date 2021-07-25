// Styles
import './App.css';

// React Components
import React from 'react';
import Landing from './components/Landing';
import Card from './components/Card';
import Backwards from './components/Backwards';
import Forwards from './components/Forwards';
import { Yeah, Nah } from './components/Buttons';
import Endgame from './components/Endgame';

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
    this.ws = new WebSocket('ws://drinkingold.mcteamster.com'); // Prod
    //this.ws = new WebSocket('ws://10.0.0.2'); // Dev

    // Bind Listeners to Buttons
    this.ws.onopen = () => {
      // Submit
      let enter = document.querySelector('#enterGame');
      enter.addEventListener('click', () => {
        this.sendMsg("enter");
      });

      // Start
      document.querySelector('#startGame').addEventListener('click', () => {
        this.sendMsg("start");
      });

      // YES
      document.querySelector('#yes').addEventListener('click', () => {
        if(this.state.meta.card !== 0){
          this.sendMsg("yeah");
          let yes = document.querySelector('#yes')
          yes.classList.add('visible');
          setTimeout(()=>{
            yes.classList.remove('visible');
          }, 1000);
        }
      });

      // NO
      document.querySelector('#no').addEventListener('click', () => {
        if(this.state.meta.card !== 0){
          this.sendMsg("nah");
          let no = document.querySelector('#no')
          no.classList.add('visible');
          setTimeout(()=>{
            no.classList.remove('visible');
          }, 1000);
        }
      });
    };

    // Update Game State
    this.ws.onmessage = (msg) => {
      msg = JSON.parse(msg.data);
      console.dir(msg);
      switch(msg.meta?.type) {
        case "gameState":
          this.setState(msg);
          document.getElementById("up").classList.remove("selected", "grey");
          document.getElementById("down").classList.remove("selected", "grey");
          if(this.state.meta.card === 0 || this.state.players.filter(p=>(p.active === true)).length === 0) {
            document.getElementById("up").classList.add("grey");
            document.getElementById("down").classList.add("grey");
          }
          document.querySelectorAll(".setup").forEach(e => e.style.visibility = (msg.meta.phase === "setup") ? "visible" : "hidden");
          document.querySelectorAll(".play").forEach(e => e.style.visibility = (msg.meta.phase === "play") ? "visible" : "hidden");
          document.querySelectorAll(".endgame").forEach(e => e.style.visibility = (msg.meta.phase === "endgame") ? "visible" : "hidden");
          break;
        case "secret":
          sessionStorage.setItem("playerID", msg.id);
          sessionStorage.setItem("clientSecret", msg.secret);
          if (msg.id === 1) {
            document.querySelector("#startGame").style.display = "block";
          }
          document.querySelector("#roomInput").style.display = "none";
          document.querySelector("#nameInput").style.display = "none";
          document.querySelector("#enterGame").style.display = "none";
          break;
        case "rejoin":
          document.querySelector("#roomInput").style.display = "none";
          document.querySelector("#nameInput").style.display = "none";
          document.querySelector("#enterGame").style.display = "none";
          break;
        case "error":
          console.error(new Date() + msg.meta.data);
          break;
        default:
          break;
      }
    };
  }

  // Send Message
  sendMsg(type) {
    let msg = {
      playerID: sessionStorage.getItem("playerID"),
      clientSecret: sessionStorage.getItem("clientSecret")
    };

    if (this.state.meta.phase === "play") {
      // Signal Intent and update local state in advance
      if (type === "yeah") {
        try {
          document.querySelector("#up").classList.add("selected");
          document.querySelector("#down").classList.remove("selected");
          let p = this.state.players.find((x) => x.id === parseInt(sessionStorage.getItem("playerID")))
          if (p.active === true || p.active === this.state.meta.turn) {
            p.active = true;
          };
          msg.data = true;
        } catch (err) {
          console.error("Player ID Not Found")
        }
      } else if (type === "nah") {
        try {
          document.querySelector("#up").classList.remove("selected");
          document.querySelector("#down").classList.add("selected");
          let p = this.state.players.find((x) => x.id === parseInt(sessionStorage.getItem("playerID")))
          if (p.active === true || p.active === this.state.meta.turn) {
            p.active = this.state.meta.turn;
          };
          msg.data = false;
        } catch (err) {
          console.error("Player ID Not Found")
        }
      }
      this.setState(this.state);
    } else if (this.state.meta.phase === "setup") {
      // Set Player Name
      if (type === "enter") {
        let roomInput = document.getElementById("roomInput").value;
        if(roomInput < 10000 && roomInput > 0){
          msg.roomID = Math.floor(roomInput);
        }
        msg.data = document.getElementById("nameInput").value;
      } else if (type === "start") {
        msg.data = "start";
      }
    }
    // Send
    this.ws.send(JSON.stringify(msg));
  }

  render() {
    return (
      <div className="App">
        <Landing players={this.state.players} room={this.state.meta.room}/>
        <Backwards players={this.state.players} bonuses={this.state.bonuses} meta={this.state.meta} />
        <Card data={cardData[this.state.meta.card]} meta={this.state.meta} />
        <Forwards players={this.state.players} hazards={this.state.hazards} meta={this.state.meta} />
        <Yeah />
        <Nah />
        <Endgame players={this.state.players} />
      </div>
    );
  }
}

export default App;