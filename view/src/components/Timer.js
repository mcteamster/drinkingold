import React from 'react';
import './styles/Timer.css';

class Timer extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      tunrntime: this.props.tunrntime - 1000, // One Second Buffer
      time: this.turntime
    }
  }

  componentDidMount() {
    setInterval(()=>{
      let t;
      if(this.turntime === this.props.turntime - 1000){
        if(this.state.time > 100){
          t = this.state.time - 100;
        } else {
          t = 0;
        }
      } else {
        t = this.props.turntime - 1000;
        this.turntime = t;
      }
      this.setState({time: t});
    }, 100)
  }

  formatTime() {
    let clock = this.state.time;
    return `⏰ ${Math.floor(clock/1000)}.${Math.floor((clock%1000)/100)}`;
  }

  render(){
    let clock = this.formatTime();
    return(
      <div className="Timer play">{clock}</div>
    )
  }
}

export default Timer;