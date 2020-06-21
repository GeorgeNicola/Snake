import React from 'react';
import './Score.css';

const Score = props => (
    <div className="score-board">
        <p> Score: {props.score} </p>
        <p> Best Score: {props.bestScore} </p> 
    </div>
  );
  
  export default Score;