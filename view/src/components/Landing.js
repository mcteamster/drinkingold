import './styles/Landing.css';
import Player from './Player.js';

function Landing(props) {
    const players = props.players.sort((a,b)=> a.id > b.id) // Sort by ID in the lobby
    const playerList = players.map((player)=>
      (player.active === true) &&
      (<li key={player.id}>
        <Player info={player} score={0}/>
      </li>)
    );

    let lobbyMessage = (props.room) ? `🔑 ${props.room}` : ""

    return (
      <div className="Landing setup">
        <h1>Drinkin' Gold</h1>
        <div id="instructions">
          🎉 Get ready for 5 ripper nights out! Who will drink the most 🍻?<br></br>
          👍 Tap right ➡️ to keep going and drink more🍺<br></br>
          👎 Tap left ⬅️ to go home and pickup some goodies 🍕<br></br>
          ⚠️ Look out for hazards - 2 strikes will ruin your night 🤮
        </div>
        <ul className="playerList">
            {playerList}
        </ul>
        <div className="number" id="lobbyMessage">{lobbyMessage}</div>
        <input id="nameInput" type="text" placeholder="Name 👋" maxLength="12"></input>
        <input id="roomInput" className="hidden" type="number" placeholder="Room 🔑" min="1000" max="9999"></input>
        <div id="buttonTray" className="centered">
          <div id="joinGame" className="lobbyButton">Join</div>
          <div id="enterGame" className="lobbyButton">Create</div>
          <div id="startGame" className="lobbyButton hidden">START</div>
        </div>
      </div>
    );
}

export default Landing;