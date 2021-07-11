import './styles/Forwards.css';
import Player from './Player.js';
import Hazards from './Hazards.js';

function Forwards(props) {
  const players = props.players.sort((a,b)=> a.name > b.name).sort((a,b)=> a.totalScore < b.totalScore); // Sort By Score, Tiebreak Alphabetically
  const playerList = players.map((player)=>
    (player.left === false) &&
    (<li key={player.id}>
      <Player info={player} view="forwards"/>
    </li>)
  );

  return (
    <div className="Forwards">
      <ul className="playerList">
        {playerList}
      </ul>
      <Hazards info={props.hazards} />
    </div>
  );
}

export default Forwards;