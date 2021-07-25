import './styles/Forwards.css';
import Player from './Player.js';
import Hazards from './Hazards.js';

function Forwards(props) {
  let players;
  let playerList;
  if(props.meta.card !== 0){
    players = props.players.sort((a,b)=> a.name > b.name).sort((a,b)=> a.totalScore < b.totalScore); // Sort By Score, Tiebreak Alphabetically
    playerList = players.map((player)=>{
      if(player.active === true) {
        return (<li key={player.id}>
          <Player info={player} view="forwards"/>
        </li>)
      } else {
        return false;
      }
    });
  }

  return (
    <div className="Forwards play">
      <div className="head grey" id="up">👍</div>
      <ul className="playerList">
        {playerList}
      </ul>
      <Hazards info={props.hazards} />
    </div>
  );
}

export default Forwards;