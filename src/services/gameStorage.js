import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  CURRENT_GAME: '@sudoku_current_game',
  USER_STATS: '@sudoku_user_stats',
  SETTINGS: '@sudoku_settings',
  GAME_HISTORY: '@sudoku_game_history'
};

/**
 * Mevcut oyunu kaydet
 */
export const saveGame = async (gameData) => {
  try {
    const jsonValue = JSON.stringify(gameData);
    await AsyncStorage.setItem(KEYS.CURRENT_GAME, jsonValue);
    return true;
  } catch (e) {
    console.error('Oyun kaydedilirken hata:', e);
    return false;
  }
};

/**
 * Mevcut oyunu yükle
 */
export const loadGame = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(KEYS.CURRENT_GAME);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Oyun yüklenirken hata:', e);
    return null;
  }
};

/**
 * Mevcut oyunu sil
 */
export const clearCurrentGame = async () => {
  try {
    await AsyncStorage.removeItem(KEYS.CURRENT_GAME);
    return true;
  } catch (e) {
    console.error('Oyun silinirken hata:', e);
    return false;
  }
};

/**
 * Kullanıcı istatistiklerini kaydet
 */
export const saveStats = async (stats) => {
  try {
    const jsonValue = JSON.stringify(stats);
    await AsyncStorage.setItem(KEYS.USER_STATS, jsonValue);
    return true;
  } catch (e) {
    console.error('İstatistikler kaydedilirken hata:', e);
    return false;
  }
};

/**
 * Kullanıcı istatistiklerini yükle
 */
export const loadStats = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(KEYS.USER_STATS);
    return jsonValue != null ? JSON.parse(jsonValue) : {
      totalGames: 0,
      completedGames: 0,
      averageTime: 0,
      bestTime: null,
      streakDays: 0,
      lastPlayedDate: null,
      gamesByDifficulty: {
        easy: { played: 0, completed: 0 },
        medium: { played: 0, completed: 0 },
        hard: { played: 0, completed: 0 },
        expert: { played: 0, completed: 0 }
      }
    };
  } catch (e) {
    console.error('İstatistikler yüklenirken hata:', e);
    return null;
  }
};

/**
 * Ayarları kaydet
 */
export const saveSettings = async (settings) => {
  try {
    const jsonValue = JSON.stringify(settings);
    await AsyncStorage.setItem(KEYS.SETTINGS, jsonValue);
    return true;
  } catch (e) {
    console.error('Ayarlar kaydedilirken hata:', e);
    return false;
  }
};

/**
 * Ayarları yükle
 */
export const loadSettings = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(KEYS.SETTINGS);
    return jsonValue != null ? JSON.parse(jsonValue) : {
      theme: 'light',
      soundEnabled: true,
      hapticEnabled: true,
      highlightSimilar: true,
      autoCheckErrors: false,
      timerEnabled: true
    };
  } catch (e) {
    console.error('Ayarlar yüklenirken hata:', e);
    return null;
  }
};

/**
 * Oyun geçmişine ekle
 */
export const addToHistory = async (gameResult) => {
  try {
    const historyJson = await AsyncStorage.getItem(KEYS.GAME_HISTORY);
    const history = historyJson != null ? JSON.parse(historyJson) : [];
    
    history.unshift({
      ...gameResult,
      timestamp: new Date().toISOString()
    });
    
    // Son 50 oyunu sakla
    const trimmedHistory = history.slice(0, 50);
    
    await AsyncStorage.setItem(KEYS.GAME_HISTORY, JSON.stringify(trimmedHistory));
    return true;
  } catch (e) {
    console.error('Geçmiş kaydedilirken hata:', e);
    return false;
  }
};

/**
 * Oyun geçmişini yükle
 */
export const loadHistory = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(KEYS.GAME_HISTORY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Geçmiş yüklenirken hata:', e);
    return [];
  }
};

/**
 * Tüm verileri sil (reset)
 */
export const clearAllData = async () => {
  try {
    await AsyncStorage.multiRemove([
      KEYS.CURRENT_GAME,
      KEYS.USER_STATS,
      KEYS.GAME_HISTORY
    ]);
    return true;
  } catch (e) {
    console.error('Veriler silinirken hata:', e);
    return false;
  }
};
