import './styles/Backwards.css';
import Player from './Player.js';
import Bonuses from './Bonuses.js';

function Backwards(props) {
  const players = props.players.sort((a,b)=> a.name > b.name).sort((a,b)=> a.totalScore < b.totalScore); // Sort By Score, Tiebreak Alphabetically
  const playerList = players.map((player)=>
    (props.meta.card === 0 || player.active !== true) &&
    (<li key={player.id}>
      <Player info={player} view="backwards" />
    </li>)
  );

  return (
    <div className="Backwards play">
      <div className="head grey" id="down">👎</div>
      <ul className="playerList">
        {playerList}
      </ul>
      <Bonuses info={props.bonuses}/>
    </div>
  );
}

export default Backwards;