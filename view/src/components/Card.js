import './styles/Card.css';

function Card(props) {
  return (
    <div className="Card play">
        <Title text={props.data.title} />
        <FlavourText text={props.data.description} />
        <Value data={props.data} />
    </div>
  );
}

function Title(props) {
    return (
        <div className="Title centered">
            {props.text}
        </div>
    )
}

function FlavourText(props) {
    return (
        <div className="FlavourText centered">
            <p>
                {props.text}&nbsp;add some dynamic stuff here too i dunno like comment on who just bailed and whatnot
            </p>
        </div>
    );
}

function Value(props) {
    return (
        <div className="Value centered number">
            {(props.data.type === "points") ? `${props.data.value}${props.data.symbol}` : `${props.data.symbol}`}
        </div>
    )
}

export default Card;