import './styles/Card.css';

function Card(props) {
  return (
    <div className="Card">
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
                {props.text}&nbsp;
                Spin a yarn about what just happened lol
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