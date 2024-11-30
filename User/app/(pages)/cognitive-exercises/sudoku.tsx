import React, { useState, useEffect } from 'react';

// Utility function to generate a Sudoku puzzle
const generateSudokuPuzzle = () => {
  const grid = Array.from({ length: 9 }, () => Array(9).fill(0));
  
  const isValid = (grid, row, col, num) => {
    // Check row
    for (let x = 0; x < 9; x++) {
      if (grid[row][x] === num) return false;
    }
    
    // Check column
    for (let x = 0; x < 9; x++) {
      if (grid[x][col] === num) return false;
    }
    
    // Check 3x3 box
    const startRow = row - row % 3;
    const startCol = col - col % 3;
    
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (grid[i + startRow][j + startCol] === num) return false;
      }
    }
    
    return true;
  };
  
  const solve = (grid) => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValid(grid, row, col, num)) {
              grid[row][col] = num;
              
              if (solve(grid)) return true;
              
              grid[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  };
  
  solve(grid);
  
  // Remove some numbers to create puzzle
  const puzzleGrid = grid.map(row => [...row]);
  const difficultyLevels = [30, 40, 50];
  const difficulty = difficultyLevels[Math.floor(Math.random() * difficultyLevels.length)];
  
  for (let i = 0; i < difficulty; i++) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    puzzleGrid[row][col] = 0;
  }
  
  return { solution: grid, puzzle: puzzleGrid };
};

export default function SudokuGame() {
  const [puzzle, setPuzzle] = useState(null);
  const [solution, setSolution] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  const [time, setTime] = useState(0);
  const [isGameComplete, setIsGameComplete] = useState(false);
  
  useEffect(() => {
    startNewGame();
  }, []);
  
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isGameComplete) {
        setTime(prevTime => prevTime + 1);
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isGameComplete]);
  
  const startNewGame = () => {
    const { solution, puzzle } = generateSudokuPuzzle();
    setPuzzle(puzzle);
    setSolution(solution);
    setTime(0);
    setIsGameComplete(false);
    setSelectedCell(null);
  };
  
  const checkGameCompletion = (currentPuzzle) => {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (currentPuzzle[i][j] === 0 || currentPuzzle[i][j] !== solution[i][j]) {
          return false;
        }
      }
    }
    return true;
  };
  
  const handleCellPress = (row, col) => {
    setSelectedCell({ row, col });
  };
  
  const handleNumberInput = (num) => {
    if (selectedCell) {
      const { row, col } = selectedCell;
      if (solution[row][col] === num) {
        const newPuzzle = puzzle.map(r => [...r]);
        newPuzzle[row][col] = num;
        setPuzzle(newPuzzle);
        
        if (checkGameCompletion(newPuzzle)) {
          setIsGameComplete(true);
        }
      }
    }
  };
  
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  const renderGrid = () => {
    return puzzle?.map((row, rowIndex) => (
      <div key={rowIndex} className="flex">
        {row.map((cell, colIndex) => (
          <button
            key={colIndex}
            className={`
              w-10 h-10 flex justify-center items-center border 
              ${selectedCell?.row === rowIndex && selectedCell?.col === colIndex ? 'bg-blue-100' : ''}
              ${rowIndex % 3 === 0 ? 'border-t-2' : 'border-t'}
              ${colIndex % 3 === 0 ? 'border-l-2' : 'border-l'}
              ${rowIndex === 8 ? 'border-b-2' : 'border-b'}
              ${colIndex === 8 ? 'border-r-2' : 'border-r'}
              border-blue-600 text-blue-600
            `}
            onClick={() => handleCellPress(rowIndex, colIndex)}
          >
            {cell !== 0 ? cell : ''}
          </button>
        ))}
      </div>
    ));
  };
  
  const renderNumberPad = () => {
    return (
      <div className="flex flex-wrap justify-center mt-5">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <button
            key={num}
            className="w-16 h-16 bg-blue-600 text-white text-2xl m-1 rounded-lg"
            onClick={() => handleNumberInput(num)}
          >
            {num}
          </button>
        ))}
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center p-5">
      <div className="mb-5">
        <p className="text-lg text-blue-600">Time: {formatTime(time)}</p>
      </div>
      
      <div className="border-2 border-blue-600">
        {renderGrid()}
      </div>
      
      {renderNumberPad()}
      
      {isGameComplete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg text-center">
            <h2 className="text-2xl text-blue-600 mb-4">Congratulations!</h2>
            <p className="text-lg text-blue-600 mb-6">Your Time: {formatTime(time)}</p>
            <button 
              className="bg-blue-600 text-white px-6 py-2 rounded-lg"
              onClick={startNewGame}
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}