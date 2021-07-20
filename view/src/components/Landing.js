import './styles/Landing.css';
import Player from './Player.js';

function Landing(props) {
    const players = props.players.sort((a,b)=> a.id > b.id) // Sort by ID in the lobby
    const playerList = players.map((player)=>
      (player.active === true) &&
      (<li key={player.id}>
        <Player info={player} view="forwards"/>
      </li>)
    );

    return (
      <div className="Landing setup">
        <h1>Drinkin' Gold</h1>
        <ul className="playerList">
            {playerList}
        </ul>
        <input id="roomInput" type="text" placeholder="Room" maxLength="4"></input>
        <input id="nameInput" type="text" placeholder="Name" maxLength="10"></input>
        <div id="enterGame" className="rounded">ENTER</div>
        <div id="startGame">START</div>
      </div>
    );
}

export default Landing;