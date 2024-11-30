import React, { useState, useEffect } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet } from 'react-native';

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
    const startRow = row - (row % 3);
    const startCol = col - (col % 3);

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
  const puzzleGrid = grid.map((row) => [...row]);
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
        setTime((prevTime) => prevTime + 1);
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
        const newPuzzle = puzzle.map((r) => [...r]);
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
      <View key={rowIndex} style={styles.row}>
        {row.map((cell, colIndex) => (
          <TouchableOpacity
            key={colIndex}
            style={[
              styles.cell,
              selectedCell?.row === rowIndex && selectedCell?.col === colIndex && styles.selectedCell,
              rowIndex % 3 === 0 && styles.borderTop,
              colIndex % 3 === 0 && styles.borderLeft,
              rowIndex === 8 && styles.borderBottom,
              colIndex === 8 && styles.borderRight,
            ]}
            onPress={() => handleCellPress(rowIndex, colIndex)}
          >
            <Text style={styles.cellText}>{cell !== 0 ? cell : ''}</Text>
          </TouchableOpacity>
        ))}
      </View>
    ));
  };

  const renderNumberPad = () => {
    return (
      <View style={styles.numberPad}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <TouchableOpacity
            key={num}
            style={styles.numberButton}
            onPress={() => handleNumberInput(num)}
          >
            <Text style={styles.numberButtonText}>{num}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>Time: {formatTime(time)}</Text>
      </View>

      <View style={styles.gridContainer}>
        {renderGrid()}
      </View>

      {renderNumberPad()}

      {isGameComplete && (
        <View style={styles.overlay}>
          <View style={styles.overlayContent}>
            <Text style={styles.congratulationsText}>Congratulations!</Text>
            <Text style={styles.timeText}>Your Time: {formatTime(time)}</Text>
            <Button title="Play Again" onPress={startNewGame} color="#6200ee" />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  timerContainer: {
    marginBottom: 20,
  },
  timerText: {
    fontSize: 18,
    color: '#1E88E5',
  },
  gridContainer: {
    borderWidth: 2,
    borderColor: '#1E88E5',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E88E5',
  },
  selectedCell: {
    backgroundColor: '#BBDEFB',
  },
  borderTop: {
    borderTopWidth: 2,
  },
  borderLeft: {
    borderLeftWidth: 2,
  },
  borderBottom: {
    borderBottomWidth: 2,
  },
  borderRight: {
    borderRightWidth: 2,
  },
  cellText: {
    fontSize: 18,
    color: '#1E88E5',
  },
  numberPad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 20,
  },
  numberButton: {
    width: 60,
    height: 60,
    backgroundColor: '#1E88E5',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderRadius: 10,
  },
  numberButtonText: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayContent: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  congratulationsText: {
    fontSize: 24,
    color: '#1E88E5',
    marginBottom: 10,
  },
  timeText: {
    fontSize: 18,
    color: '#1E88E5',
    marginBottom: 20,
  },
});