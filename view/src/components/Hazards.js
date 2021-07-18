import './styles/Hazards.css';

function Hazards(props) {
  const hazardList = props.info.map((hazard)=>
    (<li key={hazard.id} className={(hazard.active === 0) ? "grey" : undefined}>
      {hazard.symbol}
    </li>)
  );

  return (
    <div className="Hazards">
      {hazardList}
    </div>
  );
}

export default Hazards;