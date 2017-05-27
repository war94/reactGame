import React, { Component } from 'react';
import './App.css';
import Board from './Board';
import Constants from './Constants';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playerPosition: [],
      status: Constants.status_playing,
      flowers: [],
      stage_number: 1,
      board: Constants['board_stage1']
    };

    this.setFlowersAndPlayer();
  }

  setFlowersAndPlayer(){
    for(let l = 0; l < this.state.board.length; l++){
      for(let c = 0; c < this.state.board[0].length; c++){
        if(this.state.board[l][c] === Constants.square_flower){
          this.state.flowers.push([l,c]);
        }else if(this.state.board[l][c] === Constants.square_player){
          this.state.playerPosition = [l, c];
        }
      }
    }
  }

  setNextStage(){
    var nextStage = this.state.stage_number + 1;
    
    var arrayvar = this.state.board;

    for(let l = 0; l < this.state.board.length; l++){
      for(let c = 0; c < this.state.board[0].length; c++){
        arrayvar[l][c] = Constants['board_stage' + nextStage][l][c];
      }
    }

    this.setState({stage_number: nextStage, board: arrayvar});

    var flw = [];

    for(let l = 0; l < this.state.board.length; l++){
      for(let c = 0; c < this.state.board[0].length; c++){
        if(this.state.board[l][c] === Constants.square_flower){
          flw.push([l,c]);
        }else if(this.state.board[l][c] === Constants.square_player){
          this.setState({playerPosition: [l, c]});
        }
      }
    }

    this.setState({flowers: flw});
    this.forceUpdate();
  }

  move(direction){
    let nextMove = {};
    
    switch(direction) {
      case Constants.dir_up:
        nextMove.line = this.state.playerPosition[0] - 1;
        nextMove.column = this.state.playerPosition[1];
        break;
      case Constants.dir_right:
        nextMove.line = this.state.playerPosition[0];
        nextMove.column = this.state.playerPosition[1] + 1;
        break;
      case Constants.dir_down:
        nextMove.line = this.state.playerPosition[0] + 1;
        nextMove.column = this.state.playerPosition[1];
        break;
      case Constants.dir_left:
        nextMove.line = this.state.playerPosition[0];
        nextMove.column = this.state.playerPosition[1] - 1;
        break;
      case Constants.dir_upRight:
        nextMove.line = this.state.playerPosition[0] - 1;
        nextMove.column = this.state.playerPosition[1] + 1;
        break;
      case Constants.dir_upLeft:
        nextMove.line = this.state.playerPosition[0] - 1;
        nextMove.column = this.state.playerPosition[1] - 1;
        break;
      case Constants.dir_downRight:
        nextMove.line = this.state.playerPosition[0] + 1;
        nextMove.column = this.state.playerPosition[1] + 1;
        break;
      case Constants.dir_downLeft:
        nextMove.line = this.state.playerPosition[0] + 1;
        nextMove.column = this.state.playerPosition[1] - 1;
        break;
      default:
        break;
    }

    nextMove.direction = direction;
    this.tryMove(nextMove);
  }

  getBoardInfo(){
    return {
      numberOfLines: this.state.board.length,
      numberOfColumns: this.state.board[0].length,
    };
  }

  tryMove(nextMove){
    
    if(this.state.status !== Constants.status_playing){
      return;
    }

    let boardInfo = this.getBoardInfo();    
    let outOfBoard = nextMove.line < 0 || nextMove.line >= boardInfo.numberOfLines || nextMove.column < 0 || nextMove.column >= boardInfo.numberOfColumns;
    let currentLine = this.state.playerPosition[0];
    let currentColumn = this.state.playerPosition[1];

    if(outOfBoard){
      return;
    }
    
    let nextBoardPosition = this.state.board[nextMove.line][nextMove.column];

    if(nextBoardPosition === Constants.square_wall){
      return;
    }

    var arrayvar = this.state.board.slice();

    if(nextBoardPosition === Constants.square_rock){
      if(nextMove.direction === Constants.dir_right){
        if(arrayvar[nextMove.line][nextMove.column + 1] === Constants.square_empty){
          arrayvar[nextMove.line][nextMove.column + 1] = Constants.square_rock;
          arrayvar[nextMove.line][nextMove.column] = Constants.square_empty;

          this.setState({ board: arrayvar });

          let position = {line: nextMove.line + 1, column: nextMove.column + 1};

          this.makeFall(nextMove.direction, position);
        }else{
          return;
        }
      }else if(nextMove.direction === Constants.dir_left){
        if(arrayvar[nextMove.line][nextMove.column - 1] === Constants.square_empty){
          arrayvar[nextMove.line][nextMove.column - 1] = Constants.square_rock;
          arrayvar[nextMove.line][nextMove.column] = Constants.square_empty;

          this.setState({ board: arrayvar });

          let position = {line: nextMove.line + 1, column: nextMove.column - 1};

          this.makeFall(nextMove.direction, position);          
        }else{
          return;
        }
      }
      else{
        return;
      }      
    }

    let perviousPosition = {line: this.state.playerPosition[0], column: this.state.playerPosition[1]};

    arrayvar[currentLine][currentColumn] = Constants.square_empty;
    arrayvar[nextMove.line][nextMove.column] = Constants.square_player;

    this.setState({ board: arrayvar });

    this.setState({playerPosition: [nextMove.line, nextMove.column]});

    this.removeFlower(nextMove);

    this.makeFall(nextMove.direction, perviousPosition);

    if(this.playerWin()){    
      alert('Win');
      this.setNextStage();
    }
  }

  removeFlower(position){
    for(let f in this.state.flowers){
      if(f < this.state.flowers.length && this.state.flowers[f][0] === position.line && this.state.flowers[f][1] === position.column){
        var flw = this.state.flowers.slice();
        flw.splice(f,1);
        this.setState({flowers: flw});
      }
    }
  }

  playerWin(){
    return this.state.flowers.length === 0;
  }

  makeFall(direction, position){
    if(direction === Constants.dir_up || position.line === 0) return;

    var arrayvar = this.state.board.slice();

    if(position.line < arrayvar.length 
      && arrayvar[position.line - 1][position.column] === Constants.square_rock
      && arrayvar[position.line][position.column] === Constants.square_empty){

      arrayvar[position.line - 1][position.column] = Constants.square_empty;
      arrayvar[position.line][position.column] = Constants.square_rock;

      this.setState({board: arrayvar});

      this.playerKilled(position);

      this.makeSlide(direction, position);

      let position2 = {line: position.line - 1, column: position.column};

      position.line += 1;

      setTimeout(() => this.makeFall(direction, position), 10);

      setTimeout(() => this.makeFall(direction, position2), 10);
    }
  }

  playerKilled(position){
    if(this.state.playerPosition[0] === position.line + 1 
      && this.state.playerPosition[1] === position.column){
        this.setState({status: Constants.status_die});
        alert('Game Over');
      }
  }

  makeSlide(direction, pos){
    let dif = -1;

    var position = {line: pos.line, column: pos.column};

    if(direction === Constants.dir_right || direction === Constants.dir_downRight || direction === Constants.dir_upRight)
      dif = 1;

    if(position.line + 1 < this.state.board.length
      && position.column + dif > 0 && position.column + dif < this.state.board[0].length
      && this.state.board[position.line + 1][position.column] === Constants.square_rock
      && this.state.board[position.line + 1][position.column + dif] === Constants.square_empty){
      
      var arrayvar = this.state.board.slice();
      arrayvar[position.line][position.column] = Constants.square_empty;
      arrayvar[position.line + 1][position.column + dif] = Constants.square_rock;
      
      this.setState({board: arrayvar});

      this.playerKilled({line: position.line + 1, column: position.column + dif});

      position.line += 1;
      position.column += dif;

      this.makeSlide(direction, position);
    }
  }

  render() {
    return (
      <div className="App">
        <Board key="board" board={this.state.board} move={this.move.bind(this)} />
      </div>
    );
  }
}

export default App;