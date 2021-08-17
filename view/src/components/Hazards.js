import './styles/Hazards.css';

function Hazards(props) {
  const hazardList = props.info.map((hazard)=>
    (<li key={hazard.id} className={(hazard.active === 0) ? "grey hazardSymbol" : "hazardSymbol"}>
      {hazard.symbol}
    </li>)
  );

  return (
    <div className="Hazards">
      <li className="tip">Strike twice and your night is over</li>
      {hazardList}
    </div>
  );
}

export default Hazards;