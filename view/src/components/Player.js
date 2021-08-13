import './styles/Player.css';

function Player(props) {
  let score = props.score;
  let turn = props?.turn;
  if(props.info.active != true && props.info.active != turn) {
    score = 0;
  }
  let percent = 100*(props.info.totalScore/(props.info.totalScore + score));
  let style = {
    backgroundColor: props.info.colour,
    backgroundImage: `linear-gradient(90deg, ${props.info.colour}, ${percent}%, ${props.info.colour}, ${percent}%, rgba(0,0,0,0.25))` 
  }

  style.borderRadius = "25vw 2vw 25vw 2vw/2vw 25vw 2vw 25vw";
  style.width = `calc(1.5em + ${0.1*(props.info.totalScore + score)}em)`;
  return (
    <div className="Player">
      <div className="meeple centered number" style={style}>{props.info.totalScore + score}</div>
      <div>{props.info.name}</div>
    </div>
  );
}

export default Player;