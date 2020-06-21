import React, {Component} from 'react';
import './App.css';
import Score from './Score';
import Matrix from './Matrix';



class App extends Component {
  constructor(props){
    super(props);
    this.changeScore = this.changeScore.bind(this);//Function changeScore doesn't recognise "this" 
    this.state = {
        score: 0,
        bestScore: 0
    }
  } 

  changeBestScore(){
    this.setState({bestScore: this.state.score});
    window.localStorage.setItem('storedBestScore', this.state.score);
  }

  changeScore(newScore){
    this.setState({score: newScore});
    if(newScore > this.state.bestScore){
      this.changeBestScore();
    }
  }

  componentDidMount(){
    let storedBestScore = Number(window.localStorage.getItem('storedBestScore'));

    if (typeof storedBestScore === 'undefined' && storedBestScore === null){
      window.localStorage.setItem('storedBestScore', '0');
      this.setState({bestScore: 0});
    }else{
      this.setState({bestScore: storedBestScore});
    }//Store bestScore in localStorage

    console.log('%c React Snake Game', 'color:#00e59b; font-weight:bold');
    //Signature
  }

  componentWillUnmount(){

  }

  render() {
    return (
      <div className="App">
          <div className="aspect-ratio"> 
              <Score score={this.state.score} bestScore={this.state.bestScore}/>
              <Matrix changeScore={this.changeScore}/>
          </div>
      </div>
  )}
}

export default App;
