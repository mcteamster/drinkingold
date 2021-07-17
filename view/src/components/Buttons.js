import './styles/Buttons.css';

function MenuButton() {
  return (
    <div className="MenuButton">
      ❌
    </div>
  );
}

function Yeah() {
  return (
    <div className="Yeah centered invisible" id="yes">
      YEAH!
    </div>
  );
}

function Nah() {
  return (
    <div className="Nah centered invisible" id="no">
      nah.
    </div>
  );
}

export default MenuButton;
export { Yeah, Nah };