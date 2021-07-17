import './styles/Bonuses.css';

function Bonuses(props) {
  const bonusList = props.info.map((bonus)=>
    (bonus.active === true) && 
    (<li key={bonus.id}>
      <div className="bonusSymbol">
        {bonus.symbol}
      </div>
      <div className="bonusValue number">
        {(bonus.id === 0) ? `${bonus.value}` : `+${bonus.value}`}
      </div>
    </li>)
  );

  return (
    <div className="Bonuses">
      {bonusList}
    </div>
  );
}

export default Bonuses;