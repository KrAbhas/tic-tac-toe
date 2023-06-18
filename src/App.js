import React, {useState} from 'react';

export default function Board() {
  const [turn, setTurn] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(squareNumber) {
    if (squares[squareNumber] !== null || calculateWinner(squares)) return;
    const nextSquares = squares.slice();
    let val = "O";
    if (turn)
      val = "X";
    nextSquares[squareNumber] = val;
    setTurn(!turn);
    setSquares(nextSquares);
  }

  if (!turn) {
    setTimeout(() => {
      const aiMove = getAIMove(squares);
      handleClick(aiMove);
    }, 700);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (turn ? 'X' : 'O');
  }

  return (
    <div>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={()=>handleClick(0)}/>
        <Square value={squares[1]} onSquareClick={()=>handleClick(1)}/>
        <Square value={squares[2]} onSquareClick={()=>handleClick(2)}/>
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={()=>handleClick(3)}/>
        <Square value={squares[4]} onSquareClick={()=>handleClick(4)}/>
        <Square value={squares[5]} onSquareClick={()=>handleClick(5)}/>
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={()=>handleClick(6)}/>
        <Square value={squares[7]} onSquareClick={()=>handleClick(7)}/>
        <Square value={squares[8]} onSquareClick={()=>handleClick(8)}/>
      </div>
    </div>
  );
}

function Square({value, onSquareClick}) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function getAIMove(squares) {
  // Determine the best move for the AI using the Minimax algorithm with alpha-beta pruning
  const bestMove = minimax(squares, true, -Infinity, +Infinity).index;
  return bestMove;
}

function minimax(squares, isMaximizing, alpha, beta) {
  const winner = calculateWinner(squares);
  if (winner === 'X') {
    return { score: -1 };
  } else if (winner === 'O') {
    return { score: 1 };
  } else if (squares.every((square) => square !== null)) {
    return { score: 0 };
  }

  let bestMove;
  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < squares.length; i++) {
      if (squares[i] === null) {
        squares[i] = 'O';
        const score = minimax(squares, false, alpha, beta).score;
        squares[i] = null;
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
        alpha = Math.max(alpha, bestScore);
        if (beta <= alpha) {
          break;
        }
      }
    }
    return { score: bestScore, index: bestMove };
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < squares.length; i++) {
      if (squares[i] === null) {
        squares[i] = 'X';
        const score = minimax(squares, true, alpha, beta).score;
        squares[i] = null;
        if (score < bestScore) {
          bestScore = score;
          bestMove = i;
        }
        beta = Math.min(beta, bestScore);
        if (beta <= alpha) {
          break;
        }
      }
    }
    return { score: bestScore, index: bestMove };
  }
}