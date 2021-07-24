import './styles/Card.css';
import Timer from "./Timer";

function Card(props) {
  return (
    <div className="Card play">
        <div className="number centered" id="stats">
            <div>🔑&nbsp;{props.meta.room}</div>
            <div>🌙&nbsp;{props.meta.round}/5</div>
            <Timer turntime={props.meta.turntime} />
        </div>
        <Title text={props.data.title} />
        <div className="number centered" id="score">{(props.meta.score>0) && props.meta.score}🍻</div>
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
                {props.text}&nbsp;<b>-- Kick On??</b>
            </p>
        </div>
    );
}

function Value(props) {
    return (
        <div className="Value centered number">
            {(props.data.type === "points") ? `+${props.data.value}${props.data.symbol}` : `${props.data.symbol}`}
        </div>
    )
}

export default Card;