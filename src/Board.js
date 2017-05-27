import React, { Component } from 'react';
import Square from './Square';
import KeyHandler, {KEYPRESS} from 'react-key-handler';
import Constants from './Constants';

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      board: props.board,
      move: props.move
    };
  }

  renderCell(squareId, squareType){
    return <Square key={squareId} squareType={squareType} />;
  }

  render() {

    let lines = [];
    for (let i = 0; i < 18; i++){
      let cells = [];
      for (let j = 0; j < 31; j++){
        cells.push(this.renderCell('l' + i + 'c' + j, this.state.board[i][j]));
      }

      lines.push(<div className="board-row" key={'line' + i} >{cells}</div>);
    }

    return (
      <div>
        <KeyHandler keyEventName={KEYPRESS} keyValue="w" onKeyHandle={this.onKeyHandle.bind(this)} />
        <KeyHandler keyEventName={KEYPRESS} keyValue="a" onKeyHandle={this.onKeyHandle.bind(this)} />
        <KeyHandler keyEventName={KEYPRESS} keyValue="s" onKeyHandle={this.onKeyHandle.bind(this)} />
        <KeyHandler keyEventName={KEYPRESS} keyValue="d" onKeyHandle={this.onKeyHandle.bind(this)} />
        <KeyHandler keyEventName={KEYPRESS} keyValue="q" onKeyHandle={this.onKeyHandle.bind(this)} />
        <KeyHandler keyEventName={KEYPRESS} keyValue="e" onKeyHandle={this.onKeyHandle.bind(this)} />
        <KeyHandler keyEventName={KEYPRESS} keyValue="z" onKeyHandle={this.onKeyHandle.bind(this)} />
        <KeyHandler keyEventName={KEYPRESS} keyValue="x" onKeyHandle={this.onKeyHandle.bind(this)} />
        {lines}
      </div>
    );
  }

  onKeyHandle(event){
    let direction;
    
    switch(event.key) {
      case 'w':
        direction = Constants.dir_up;
        break;
      case 'a':
        direction = Constants.dir_left;
        break;
      case 's':
        direction = Constants.dir_down;
        break;
      case 'd':
        direction = Constants.dir_right;
        break;
      case 'q':
        direction = Constants.dir_upLeft;
        break;
      case 'e':
        direction = Constants.dir_upRight;
        break;
      case 'z':
        direction = Constants.dir_downLeft;
        break;
      case 'x':
        direction = Constants.dir_downRight;
        break;
      default:
        break;
    }
    this.props.move(direction);
  }
}

export default Board;