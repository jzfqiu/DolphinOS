import './TicTacToe.css';
import { useReducer } from 'react';


export default function TicTacToe () {

  const initialState = {
    board: [["", "", ""], ["", "", ""], ["", "", ""]],
    moves: 0,
  };
  
  function gameOver(board) {
    for (let r of [0,1,2]) {
     if (board[r][0]!=="" && board[r][0] === board[r][1] && board[r][0] === board[r][2]) 
      return board[r][0]
    }
    for (let c of [0,1,2]) {
     if (board[0][c]!=="" && board[0][c] === board[1][c] && board[0][c] === board[2][c]) 
      return board[0][c]
    }
    if (board[0][0] === board[1][1] && board[0][0] === board[2][2]) 
      return board[0][0]
    if (board[2][0] === board[1][1] && board[2][0] === board[0][2]) 
      return board[2][0]
    return "";
  }
  
  function reducer(state, action) {
    switch (action.type) {
      case "move":
        let board = state.board;
        board[action.row][action.col] = state.moves%2===1 ? 'O' : 'X';
        return {
          board: board,
          moves: state.moves + 1,
        }
      case "reset":
        return initialState
      default:
        throw Error;
    }
  }
  
  const [state, dispatch] = useReducer(reducer, initialState)
  const winner = gameOver(state.board);


  function cell(content, row, col) {
    return (
      <div className="Cell" onClick={ () => {
        if (content === "" && winner === "") {
          dispatch({type: "move", row: row, col: col})
        }
      } }>{content}</div>
    )
  }

  function cellRow(row) {
    return (
      <div className='row'>
        {cell(state.board[row][0], row, 0)}
        {cell(state.board[row][1], row, 1)}
        {cell(state.board[row][2], row, 2)}
      </div>
    )
  }

  return (
    <div className="TicTacToe">
      <div className='board'>
        {cellRow(0)}
        {cellRow(1)}
        {cellRow(2)}
      </div>
      <p>{winner==="" ?  "" : `${winner} won!`}</p>
      <button onClick={() => dispatch({type: "reset"})}>Reset</button>
    </div>
  )
}