import React from 'react';
import './styles/Timer.css';

function Timer(props){
  let t = props.turntime;
  // TODO
  return(
    <div className="Timer">{t}</div>
  );
}

export default Timer;