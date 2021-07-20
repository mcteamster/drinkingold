import './styles/Endgame.css';
import Player from './Player.js';

function Endgame(props) {
    const players = props.players.sort((a,b)=> a.name > b.name).sort((a,b)=> a.totalScore < b.totalScore); // Sort By Score, Tiebreak Alphabetically
    const playerList = players.map((player)=>
      (player.active === true) &&
      (<li key={player.id}>
        <Player info={player} view="backwards"/>
      </li>)
    );

    return (
      <div className="Endgame endgame">
        <h1>Final Scores</h1>
        <ul className="playerList">
            {playerList}
        </ul>
      </div>
    );
}

export default Endgame;