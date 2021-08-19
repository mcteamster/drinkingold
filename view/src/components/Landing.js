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
          🎉&nbsp;Get&nbsp;ready&nbsp;for&nbsp;a&nbsp;5&nbsp;day&nbsp;bender! Who&nbsp;will&nbsp;drink&nbsp;the&nbsp;most&nbsp;🍻?<br></br>
          👍 Tap right ➡️ to keep drinking 🍺<br></br>
          👎 Tap left ⬅️ to go to sleep 😴<br></br>
          🍕 Maybe pick up a snacc on the way home?<br></br>
          ⚠️&nbsp;Look&nbsp;out&nbsp;for&nbsp;hazards - 2&nbsp;strikes&nbsp;will&nbsp;ruin&nbsp;your&nbsp;night&nbsp;🤮
        </div>
        <ul className="playerList" id="lobbyList">
            {playerList}
        </ul>
        <div className="number" id="lobbyMessage">{lobbyMessage}</div>
        <input id="roomInput" className="hidden" type="number" placeholder="Room 🔑" min="1000" max="9999"></input>
        <input id="nameInput" type="text" placeholder="Name 👋" maxLength="12"></input>
        <div id="warning"></div>
        <div id="buttonTray" className="centered">
          <div id="joinGame" className="lobbyButton">Join</div>
          <div id="enterGame" className="lobbyButton">Create</div>
          <div id="startGame" className="lobbyButton hidden">START</div>
        </div>
      </div>
    );
}

export default Landing;