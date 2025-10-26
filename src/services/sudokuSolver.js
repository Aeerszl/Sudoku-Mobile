import { GRID_SIZE } from '../utils/constants';
import { isValidPlacement, copyGrid } from '../utils/helpers';

/**
 * Sudoku'yu backtracking algoritması ile çöz
 */
export const solveSudoku = (grid) => {
  const gridCopy = copyGrid(grid);
  
  const solve = (currentGrid) => {
    // Boş hücre bul
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (currentGrid[row][col] === 0) {
          // 1'den 9'a kadar dene
          for (let num = 1; num <= 9; num++) {
            if (isValidPlacement(currentGrid, row, col, num)) {
              currentGrid[row][col] = num;
              
              if (solve(currentGrid)) {
                return true;
              }
              
              // Backtrack
              currentGrid[row][col] = 0;
            }
          }
          return false; // Hiçbir sayı uygun değilse
        }
      }
    }
    return true; // Tüm hücreler dolu
  };
  
  solve(gridCopy);
  return gridCopy;
};

/**
 * Sudoku'nun çözümü olup olmadığını kontrol et
 */
export const hasSolution = (grid) => {
  const gridCopy = copyGrid(grid);
  
  const solve = (currentGrid) => {
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (currentGrid[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValidPlacement(currentGrid, row, col, num)) {
              currentGrid[row][col] = num;
              
              if (solve(currentGrid)) {
                return true;
              }
              
              currentGrid[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  };
  
  return solve(gridCopy);
};

/**
 * Belirli bir hücre için ipucu ver
 */
export const getHint = (puzzle, solution, row, col) => {
  if (puzzle[row][col] === 0) {
    return solution[row][col];
  }
  return null;
};
