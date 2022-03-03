import { useState } from "react";
import "./App.css";

let initial = [
  [-1, 5, -1, 9, -1, -1, -1, -1, -1],
  [8, -1, -1, -1, 4, -1, 3, -1, 7],
  [-1, -1, -1, 2, 8, -1, 1, 9, -1],
  [5, 3, 8, 6, -1, 7, 9, 4, -1],
  [-1, 2, -1, 3, -1, 1, -1, -1, -1],
  [1, -1, 9, 8, -1, 4, 6, 2, 3],
  [9, -1, 7, 4, -1, -1, -1, -1, -1],
  [-1, 4, 5, -1, -1, -1, 2, -1, 9],
  [-1, -1, -1, -1, 3, -1, -1, 7, -1],
];

function App() {
  const [sudokuArr, setSudokuArr] = useState(getDeepCopy(initial));

  function getDeepCopy(arr) {
    return JSON.parse(JSON.stringify(arr));
  }

  function onInputChange(e, row, col) {
    var val = parseInt(e.target.value) || -1;
    var grid = getDeepCopy(sudokuArr);

    //Input value should be between 1-9 and -1 in case of empty cell
    if (val === -1 || (val >= 1 && val <= 9)) {
      grid[row][col] = val;
    }
    setSudokuArr(grid);
  }

  //Function to compare solved and current sudoku
  function compareSudokus(currentSudoku, solvedSudoku) {
    let res = {
      isComplete: true,
      isSolvable: true,
    };

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (currentSudoku[i][j] != solvedSudoku[i][j]) {
          if (currentSudoku[i][j] != -1) {
            res.isSolvable = false;
          }

          res.isComplete = false;
        }
      }
    }
    console.log(res);
    return res;
  }

  //To check if sudoku is valid or not
  function check() {
    let sudoku = getDeepCopy(initial);
    sudokuHelper(0, 0, sudoku);
    let solvedSudoku = sudoku;

    let compare = compareSudokus(sudokuArr, solvedSudoku);

    if (compare.isComplete) alert("Congratulations!!!");
    else if (compare.isSolvable && !compare.isComplete)
      alert("Keep going, you're doing great! 🚀");
    else alert("blehhhhhh, wrong Number");
  }

  function checkValid(row, col, grid, guess) {
    let x = row - (row % 3);
    let y = col - (col % 3);

    //Column check
    for (let i = 0; i < 9; i++) if (grid[i][col] === guess) return false;

    //Row Check
    for (let j = 0; j < 9; j++) if (grid[row][j] === guess) return false;

    //3X3 Grid Check
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (grid[x + i][y + j] === guess) return false;
      }
    }

    return true;
  }

  //Recursive function to solve sudoku
  function sudokuHelper(row, col, grid) {
    //Base Cases
    if (row === 9) return true;

    if (col === 9) return sudokuHelper(row + 1, 0, grid);

    if (grid[row][col] !== -1) return sudokuHelper(row, col + 1, grid);

    //Recursive Case
    for (let guess = 1; guess <= 9; guess++) {
      if (checkValid(row, col, grid, guess)) {
        grid[row][col] = guess;
        if (sudokuHelper(row, col + 1, grid)) return true;
        grid[row][col] = -1;
      }
    }

    return false;
  }

  //To solve the sudoku
  function solve() {
    let sudoku = getDeepCopy(initial);
    sudokuHelper(0, 0, sudoku);
    setSudokuArr(sudoku);
  }

  //To reset the sudoku
  function reset() {
    let sudoku = getDeepCopy(initial);
    setSudokuArr(sudoku);
  }

  return (
    <div className="App">
      <header className="App-header">
        <h3>Sudoku Solver</h3>

        <table>
          <tbody>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((row, rIndex) => {
              return (
                <tr
                  key={rIndex}
                  className={(row + 1) % 3 === 0 ? "bBorder" : ""}
                >
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((col, cIndex) => {
                    return (
                      <td
                        key={rIndex + cIndex}
                        classsName={(col + 1) % 3 === 0 ? "rBorder" : ""}
                      >
                        <input
                          onChange={(e) => onInputChange(e, row, col)}
                          value={
                            sudokuArr[row][col] === -1
                              ? ""
                              : sudokuArr[row][col]
                          }
                          className="cellInput"
                          disabled={initial[row][col] !== -1}
                        />
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="buttonContainer">
          <button className="checkButton" onClick={check}>
            Check
          </button>
          <button className="solveButton" onClick={solve}>
            Solve
          </button>
          <button className="resetButton" onClick={reset}>
            Reset
          </button>
        </div>
      </header>
    </div>
  );
}

export default App;
