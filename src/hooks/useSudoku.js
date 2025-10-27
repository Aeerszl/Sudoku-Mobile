import { useState, useEffect, useRef } from 'react';
import { Game } from '../models/Game';
import { generateFastSudoku } from '../services/sudokuGenerator';
import { saveGame, loadGame, clearCurrentGame, loadSettings } from '../services/gameStorage';
import { MAX_MISTAKES, HINT_LIMITS } from '../utils/constants';
import { soundService } from '../services/soundService';
import { hapticService } from '../services/hapticService';

/**
 * Sudoku oyun mantığını yöneten custom hook
 */
export const useSudoku = (difficulty = 'medium') => {
  const [game, setGame] = useState(null);
  const [selectedCell, setSelectedCell] = useState({ row: null, col: null });
  const [isNoteMode, setIsNoteMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const timerRef = useRef(null);

  // Sesleri ve ayarları yükle (ilk render'da)
  useEffect(() => {
    const init = async () => {
      await soundService.loadSounds();
      
      // Ayarları yükle
      const settings = await loadSettings();
      if (settings && settings.soundEnabled !== undefined) {
        soundService.setEnabled(settings.soundEnabled);
        console.log(`🔊 Oyunda ses ayarı: ${settings.soundEnabled ? 'AÇIK' : 'KAPALI'}`);
      }
      if (settings && settings.hapticEnabled !== undefined) {
        hapticService.setEnabled(settings.hapticEnabled);
        console.log(`📳 Oyunda titreşim ayarı: ${settings.hapticEnabled ? 'AÇIK' : 'KAPALI'}`);
      }
    };
    init();
    
    return () => {
      soundService.unloadAll();
    };
  }, []);

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

        prevGame.timeSpent++;
        const updatedGame = Game.fromJSON(prevGame.toJSON());
        
        // Her 10 saniyede bir kaydet
        if (updatedGame.timeSpent % 10 === 0) {
          saveGame(updatedGame.toJSON());
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

    game.isPaused = !game.isPaused;
    const updatedGame = Game.fromJSON(game.toJSON());
    
    setGame(updatedGame);
    await saveGame(updatedGame.toJSON());

    // Pause sesi ve titreşim
    soundService.play('click');
    hapticService.light();

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

    if (isNoteMode) {
      // Not modu
      if (game.puzzle[row][col] !== 0) return;
      
      const noteIndex = game.notes[row][col].indexOf(num);
      if (noteIndex > -1) {
        game.notes[row][col].splice(noteIndex, 1);
      } else {
        game.notes[row][col].push(num);
        game.notes[row][col].sort();
      }
      
      // Not ekleme/çıkarma sesi ve titreşim
      soundService.play('click');
      hapticService.light();
    } else {
      // Sayı yerleştirme modu
      if (game.puzzle[row][col] !== 0) return;
      
      game.currentGrid[row][col] = num;
      
      // Yanlışsa hata say
      if (num !== 0 && num !== game.solution[row][col]) {
        game.mistakes++;
        
        // Hata sesi ve titreşim
        soundService.play('error');
        hapticService.heavy();
        
        // Hata limiti aşıldı mı kontrol et
        if (game.mistakes >= MAX_MISTAKES) {
          game.isCompleted = true; // Oyunu bitir (kaybedildi)
          hapticService.error(); // Game over titreşimi
          const updatedGame = Game.fromJSON(game.toJSON());
          setGame(updatedGame);
          await saveGame(updatedGame.toJSON());
          stopTimer();
          return; // Fonksiyondan çık
        }
      } else if (num !== 0) {
        // Doğru sayı sesi ve titreşim
        soundService.play('success');
        hapticService.medium();
      }
    }

    // Yeni state oluştur (React re-render için)
    const updatedGame = Game.fromJSON(game.toJSON());
    
    // Tamamlanma kontrolü
    let isComplete = true;
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (updatedGame.currentGrid[i][j] !== updatedGame.solution[i][j]) {
          isComplete = false;
          break;
        }
      }
      if (!isComplete) break;
    }
    
    if (isComplete) {
      updatedGame.isCompleted = true;
      stopTimer();
      
      // Kazanma sesi ve titreşim
      soundService.play('win');
      hapticService.success();
    }

    setGame(updatedGame);
    await saveGame(updatedGame.toJSON());
  };

  /**
   * Seçili hücreyi temizle
   */
  const clearCell = async () => {
    if (!game || selectedCell.row === null || selectedCell.col === null) {
      return;
    }

    const { row, col } = selectedCell;
    
    if (game.puzzle[row][col] === 0) {
      game.currentGrid[row][col] = 0;
      game.notes[row][col] = [];
      
      // Temizleme sesi ve titreşim
      soundService.play('click');
      hapticService.light();
    }

    const updatedGame = Game.fromJSON(game.toJSON());
    setGame(updatedGame);
    await saveGame(updatedGame.toJSON());
  };

  /**
   * İpucu al
   */
  const useHint = async () => {
    if (!game) return;

    // Limit kontrolü
    const hintLimit = HINT_LIMITS[game.difficulty] || 3;
    if (game.hintsUsed >= hintLimit) {
      // Limit aşıldı - hata sesi ve titreşim
      soundService.play('error');
      hapticService.heavy();
      return;
    }

    // Game class'ındaki useHint metodunu kullan
    const result = game.useHint();
    
    if (!result) {
      // Boş hücre kalmamış
      soundService.play('error');
      hapticService.light();
      return;
    }

    // İpucu sesi ve titreşim
    soundService.play('success');
    hapticService.medium();

    const updatedGame = Game.fromJSON(game.toJSON());
    
    // Tamamlanma kontrolü
    if (updatedGame.checkCompletion()) {
      stopTimer();
      soundService.play('win');
      hapticService.success();
    }

    setGame(updatedGame);
    await saveGame(updatedGame.toJSON());
    
    // İpucu kullanılan hücreyi seç
    setSelectedCell({ row: result.row, col: result.col });
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
