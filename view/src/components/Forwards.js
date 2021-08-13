import './styles/Forwards.css';
import Hazards from './Hazards.js';

function Forwards(props) {
   return (
    <div className="Forwards play">
      <div className="head">🕑</div>
      <Hazards info={props.hazards} />
    </div>
  );
}

export default Forwards;