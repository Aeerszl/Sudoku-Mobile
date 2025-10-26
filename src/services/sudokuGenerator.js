import { GRID_SIZE, BOX_SIZE, DIFFICULTY_HOLES } from '../utils/constants';
import { 
  createEmptyGrid, 
  isValidPlacement, 
  copyGrid, 
  shuffleArray,
  randomInt 
} from '../utils/helpers';
import { solveSudoku, hasSolution } from './sudokuSolver';

/**
 * Tamamlanmış bir Sudoku grid'i oluştur
 */
const generateCompleteGrid = () => {
  const grid = createEmptyGrid();
  
  const fillGrid = (currentGrid) => {
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (currentGrid[row][col] === 0) {
          // Sayıları rastgele sırayla dene
          const numbers = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
          
          for (const num of numbers) {
            if (isValidPlacement(currentGrid, row, col, num)) {
              currentGrid[row][col] = num;
              
              if (fillGrid(currentGrid)) {
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
  
  fillGrid(grid);
  return grid;
};

/**
 * Zorluk seviyesine göre Sudoku puzzle'ı oluştur
 */
export const generateSudoku = (difficulty = 'medium') => {
  // Tamamlanmış grid oluştur
  const solution = generateCompleteGrid();
  const puzzle = copyGrid(solution);
  
  // Zorluk seviyesine göre sayıları çıkar
  const holes = DIFFICULTY_HOLES[difficulty] || DIFFICULTY_HOLES.medium;
  let attempts = 0;
  let holesCreated = 0;
  
  while (holesCreated < holes && attempts < 100) {
    const row = randomInt(0, GRID_SIZE);
    const col = randomInt(0, GRID_SIZE);
    
    if (puzzle[row][col] !== 0) {
      const backup = puzzle[row][col];
      puzzle[row][col] = 0;
      
      // Hala tek bir çözümü olup olmadığını kontrol et
      const testGrid = copyGrid(puzzle);
      if (hasSolution(testGrid)) {
        holesCreated++;
      } else {
        // Geri al
        puzzle[row][col] = backup;
      }
    }
    attempts++;
  }
  
  return {
    puzzle,
    solution
  };
};

/**
 * Hızlı Sudoku oluştur (tek çözüm kontrolü yapmadan)
 */
export const generateFastSudoku = (difficulty = 'medium') => {
  const solution = generateCompleteGrid();
  const puzzle = copyGrid(solution);
  
  const holes = DIFFICULTY_HOLES[difficulty] || DIFFICULTY_HOLES.medium;
  let holesCreated = 0;
  
  while (holesCreated < holes) {
    const row = randomInt(0, GRID_SIZE);
    const col = randomInt(0, GRID_SIZE);
    
    if (puzzle[row][col] !== 0) {
      puzzle[row][col] = 0;
      holesCreated++;
    }
  }
  
  return {
    puzzle,
    solution
  };
};
