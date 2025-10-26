import { GRID_SIZE, BOX_SIZE } from './constants';

/**
 * Zamanı formatla (saniye -> MM:SS)
 */
export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Satırda sayının geçerli olup olmadığını kontrol et
 */
export const isValidInRow = (grid, row, num) => {
  for (let col = 0; col < GRID_SIZE; col++) {
    if (grid[row][col] === num) return false;
  }
  return true;
};

/**
 * Sütunda sayının geçerli olup olmadığını kontrol et
 */
export const isValidInCol = (grid, col, num) => {
  for (let row = 0; row < GRID_SIZE; row++) {
    if (grid[row][col] === num) return false;
  }
  return true;
};

/**
 * 3x3 kutuda sayının geçerli olup olmadığını kontrol et
 */
export const isValidInBox = (grid, row, col, num) => {
  const boxRow = Math.floor(row / BOX_SIZE) * BOX_SIZE;
  const boxCol = Math.floor(col / BOX_SIZE) * BOX_SIZE;
  
  for (let i = 0; i < BOX_SIZE; i++) {
    for (let j = 0; j < BOX_SIZE; j++) {
      if (grid[boxRow + i][boxCol + j] === num) return false;
    }
  }
  return true;
};

/**
 * Sayının hücrede geçerli olup olmadığını kontrol et
 */
export const isValidPlacement = (grid, row, col, num) => {
  return (
    isValidInRow(grid, row, num) &&
    isValidInCol(grid, col, num) &&
    isValidInBox(grid, row, col, num)
  );
};

/**
 * Boş 9x9 grid oluştur
 */
export const createEmptyGrid = () => {
  return Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0));
};

/**
 * Grid'i deep copy et
 */
export const copyGrid = (grid) => {
  return grid.map(row => [...row]);
};

/**
 * İki grid'in eşit olup olmadığını kontrol et
 */
export const areGridsEqual = (grid1, grid2) => {
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (grid1[i][j] !== grid2[i][j]) return false;
    }
  }
  return true;
};

/**
 * Grid'in tamamen dolu ve doğru olup olmadığını kontrol et
 */
export const isGridComplete = (grid, solution) => {
  return areGridsEqual(grid, solution);
};

/**
 * Random sayı üret (min dahil, max hariç)
 */
export const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

/**
 * Array'i karıştır (Fisher-Yates shuffle)
 */
export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};
