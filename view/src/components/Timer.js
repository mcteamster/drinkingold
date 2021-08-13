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
      let glass = document.querySelector(".Card");
      if(this.turntime === this.props.turntime - 1000){
        let fullness = 100*this.state.time/this.turntime - 10;
        glass.style.backgroundImage = `linear-gradient(0deg, goldenrod, ${fullness}%, goldenrod, ${fullness}%, beige)`;
        if(this.state.time > 30){
          t = this.state.time - 30;
        } else {
          t = 0;
        }
      } else {
        t = this.props.turntime - 1000;
        this.turntime = t;
      }
      this.setState({time: t});
    }, 30)
  }

  /*
  formatTime() {
    let clock = this.state.time;
    return `⏰ ${Math.floor(clock/1000)}.${Math.floor((clock%1000)/100)}`;
  }
  */

  render(){
    //let clock = this.formatTime();
    return(
      //<div className="Timer play">{clock}</div>
      <div></div>
    )
  }
}

export default Timer;