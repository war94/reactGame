import React, { Component } from 'react';
import Constants from './Constants';

class Square extends Component {

  getSquareClass(squareType){
    switch(squareType) {
      case Constants.square_grass:
        return "square squareGrass";
      case Constants.square_rock:
        return "square squareRock";
      case Constants.square_wall:
        return "square squareWall";
      case Constants.square_flower:
        return "square squareFlower";
      case Constants.square_player:
        return "square squarePlayer";
      default:
        return "square squareEmpty";
    }
  }

  render() {
    let squareClass = this.getSquareClass(this.props.squareType);
    return (
      <div className={squareClass}>
      </div>
    );
  }
}

export default Square;