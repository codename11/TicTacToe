import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Square extends React.Component {
	
	constructor(props){
		super(props);
		this.state = {
			value: null,
		};
	}
	
  render() {
    return (
      <button className="square" onClick={this.props.onClick}>
        {this.state.value}{/*Pravi se prop pod imenom 'value'*/}
      </button>
    );
  }
}

class Board extends React.Component {
  renderSquare(i) {{/*Funkcija prosledjuje svoj parametar komponenti square.*/}
    return <Square value={i} onClick={() => console.log(i)}/>;{/*prop pod imenom 'value' iz Square komponente, dobija vrednost od parametra funkcije.*/}
  }

  render() {
    const status = 'Next player: X';

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}{/*Ovde se poziva funkcija koja renderuje square i za parametar se daje brojka. I tako redom...*/}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />,document.getElementById('root'));
