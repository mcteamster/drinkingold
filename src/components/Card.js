import './styles/Card.css';

function Card(props) {
  return (
    <div className="Card">
        <Symbol symbol={props.data.symbol} />
        <Value data={props.data} />
        <Title text={props.data.title} />
        <FlavourText text={props.data.description} />
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
            {props.text}
        </div>
    );
}

function Symbol(props) {
    return (
        <div className="Symbol centered">
            {props.symbol}
        </div>
    )
}

function Value(props) {
    return (
        <div className="Value centered">
            {(props.data.type === "points") ? `${props.data.value}p` : props.data.symbol}
        </div>
    )
}

export default Card;