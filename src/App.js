// Styles
import './App.css';

// React Components
import Card from './components/Card.js';
import Backwards from './components/Backwards';
import Forwards from './components/Forwards';
import MenuButton from './components/Buttons';

// Card Data
import cardData from './data/cardData.json';

function App(props) {
  return (
    <div className="App">
      <MenuButton />
      <Backwards players={props.gameState.players} bonuses={props.gameState.bonuses}/>
      <Card data={cardData[props.gameState.meta.card]} />
      <Forwards players={props.gameState.players} hazards={props.gameState.hazards}/>
    </div>
  );
}

export default App;