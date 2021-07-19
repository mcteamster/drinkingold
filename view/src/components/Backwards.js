import './styles/Backwards.css';
import Player from './Player.js';
import Bonuses from './Bonuses.js';

function Backwards(props) {
  const players = props.players.sort((a,b)=> a.name > b.name).sort((a,b)=> a.totalScore < b.totalScore); // Sort By Score, Tiebreak Alphabetically
  const playerList = players.map((player)=>
    (player.active !== true) &&
    (<li key={player.id}>
      <Player info={player} view="backwards" />
    </li>)
  );
  let ordinal;
  switch(props.round){
    case 1:
      ordinal = "1st";
      break;
    case 2:
      ordinal = "2nd";
      break;
    case 3:
      ordinal = "3rd";
      break;
    case 4:
      ordinal = "4th";
      break;
    default:
      ordinal = "Last";
      break;
  }

  return (
    <div className="Backwards">
      <div className="head">{ordinal}&nbsp;🌙</div>
      <ul className="playerList">
        {playerList}
      </ul>
      <Bonuses info={props.bonuses}/>
    </div>
  );
}

export default Backwards;