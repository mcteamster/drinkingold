import './styles/Player.css';

function Player(props) {
  let style = {
    backgroundColor: props.info.colour
  }

  if(props.view === "forwards"){
    style.borderRadius = "2vw 25vw 2vw 25vw/25vw 2vw 25vw 2vw";
    style.width = `calc(1.5em + ${0.1*props.info.roundScore}em)`;
    return (
      <div className="Player">
        <div className="meeple centered" style={style}>{props.info.roundScore}</div>
        <div>{props.info.name}</div>
      </div>
    );
  } else if(props.view === "backwards") {
    style.borderRadius = "25vw 2vw 25vw 2vw/2vw 25vw 2vw 25vw";
    style.width = `calc(1.5em + ${0.1*props.info.totalScore}em)`;
    return (
      <div className="Player">
        <div className="meeple centered" style={style}>{props.info.totalScore}</div>
        <div>{props.info.name}</div>
      </div>
    );
  }
}

export default Player;