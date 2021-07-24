import './styles/Buttons.css';

function Yeah() {
  return (
    <div className="Yeah centered invisible" id="yes">
      <b>YEAH!<br></br>👍</b>
    </div>
  );
}

function Nah() {
  return (
    <div className="Nah centered invisible" id="no">
      <b>nah.<br></br>👎</b>
    </div>
  );
}

export { Yeah, Nah };