import { useState, useEffect, useRef } from 'react';
import { Game } from '../models/Game';
import { generateFastSudoku } from '../services/sudokuGenerator';
import { saveGame, loadGame, clearCurrentGame } from '../services/gameStorage';

/**
 * Sudoku oyun mantığını yöneten custom hook
 */
export const useSudoku = (difficulty = 'medium') => {
  const [game, setGame] = useState(null);
  const [selectedCell, setSelectedCell] = useState({ row: null, col: null });
  const [isNoteMode, setIsNoteMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const timerRef = useRef(null);

  /**
   * Yeni oyun başlat
   */
  const startNewGame = async (diff = difficulty) => {
    setIsLoading(true);
    
    // Eski oyunu temizle
    await clearCurrentGame();
    
    // Yeni puzzle oluştur
    const { puzzle, solution } = generateFastSudoku(diff);
    const newGame = new Game(puzzle, solution, diff);
    
    setGame(newGame);
    setSelectedCell({ row: null, col: null });
    setIsLoading(false);
    
    // Oyunu kaydet
    await saveGame(newGame.toJSON());
    
    // Timer'ı başlat
    startTimer();
  };

  /**
   * Mevcut oyunu yükle
   */
  const loadExistingGame = async () => {
    setIsLoading(true);
    const savedGame = await loadGame();
    
    if (savedGame) {
      const loadedGame = Game.fromJSON(savedGame);
      setGame(loadedGame);
      
      if (!loadedGame.isPaused) {
        startTimer();
      }
    }
    
    setIsLoading(false);
    return savedGame !== null;
  };

  /**
   * Timer başlat
   */
  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setGame(prevGame => {
        if (!prevGame || prevGame.isCompleted || prevGame.isPaused) {
          return prevGame;
        }

        const updatedGame = { ...prevGame };
        updatedGame.timeSpent++;
        
        // Her 10 saniyede bir kaydet
        if (updatedGame.timeSpent % 10 === 0) {
          saveGame(updatedGame);
        }

        return updatedGame;
      });
    }, 1000);
  };

  /**
   * Timer durdur
   */
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  /**
   * Oyunu duraklat/devam ettir
   */
  const togglePause = async () => {
    if (!game) return;

    const updatedGame = { ...game };
    updatedGame.isPaused = !updatedGame.isPaused;
    
    setGame(updatedGame);
    await saveGame(updatedGame);

    if (updatedGame.isPaused) {
      stopTimer();
    } else {
      startTimer();
    }
  };

  /**
   * Hücreye sayı yerleştir
   */
  const placeNumber = async (num) => {
    if (!game || selectedCell.row === null || selectedCell.col === null) {
      return;
    }

    const { row, col } = selectedCell;
    const updatedGame = { ...game };

    if (isNoteMode) {
      // Not modu
      updatedGame.toggleNote(row, col, num);
    } else {
      // Sayı yerleştirme modu
      updatedGame.placeNumber(row, col, num);
      
      // Tamamlanma kontrolü
      if (updatedGame.checkCompletion()) {
        stopTimer();
      }
    }

    setGame(updatedGame);
    await saveGame(updatedGame);
  };

  /**
   * Seçili hücreyi temizle
   */
  const clearCell = async () => {
    if (!game || selectedCell.row === null || selectedCell.col === null) {
      return;
    }

    const { row, col } = selectedCell;
    const updatedGame = { ...game };
    updatedGame.clearCell(row, col);

    setGame(updatedGame);
    await saveGame(updatedGame);
  };

  /**
   * İpucu al
   */
  const useHint = async () => {
    if (!game || selectedCell.row === null || selectedCell.col === null) {
      return;
    }

    const { row, col } = selectedCell;
    
    if (game.puzzle[row][col] === 0 && game.currentGrid[row][col] === 0) {
      const updatedGame = { ...game };
      updatedGame.currentGrid[row][col] = updatedGame.solution[row][col];
      updatedGame.hintsUsed++;

      setGame(updatedGame);
      await saveGame(updatedGame);

      // Tamamlanma kontrolü
      if (updatedGame.checkCompletion()) {
        stopTimer();
      }
    }
  };

  /**
   * Component unmount olduğunda timer'ı temizle
   */
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return {
    game,
    selectedCell,
    setSelectedCell,
    isNoteMode,
    setIsNoteMode,
    isLoading,
    startNewGame,
    loadExistingGame,
    placeNumber,
    clearCell,
    useHint,
    togglePause
  };
};
