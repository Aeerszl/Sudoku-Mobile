/**
 * Kullanıcı istatistikleri modeli
 */
export class UserStats {
  constructor() {
    this.totalGames = 0;
    this.completedGames = 0;
    this.averageTime = 0;
    this.bestTime = null;
    this.streakDays = 0;
    this.lastPlayedDate = null;
    this.gamesByDifficulty = {
      easy: { played: 0, completed: 0, bestTime: null },
      medium: { played: 0, completed: 0, bestTime: null },
      hard: { played: 0, completed: 0, bestTime: null },
      expert: { played: 0, completed: 0, bestTime: null }
    };
  }

  /**
   * Oyun başlat
   */
  startGame(difficulty) {
    this.totalGames++;
    this.gamesByDifficulty[difficulty].played++;
  }

  /**
   * Oyun tamamla
   */
  completeGame(difficulty, timeSpent) {
    this.completedGames++;
    this.gamesByDifficulty[difficulty].completed++;

    // Ortalama süreyi güncelle
    this.averageTime = Math.floor(
      (this.averageTime * (this.completedGames - 1) + timeSpent) / this.completedGames
    );

    // En iyi süreyi güncelle
    if (!this.bestTime || timeSpent < this.bestTime) {
      this.bestTime = timeSpent;
    }

    // Zorluk seviyesine göre en iyi süre
    if (!this.gamesByDifficulty[difficulty].bestTime || 
        timeSpent < this.gamesByDifficulty[difficulty].bestTime) {
      this.gamesByDifficulty[difficulty].bestTime = timeSpent;
    }

    // Streak'i güncelle
    this.updateStreak();
  }

  /**
   * Günlük streak'i güncelle
   */
  updateStreak() {
    const today = new Date().toDateString();
    const lastPlayed = this.lastPlayedDate ? new Date(this.lastPlayedDate).toDateString() : null;

    if (!lastPlayed) {
      this.streakDays = 1;
    } else if (lastPlayed === today) {
      // Bugün zaten oynandı
      return;
    } else {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toDateString();

      if (lastPlayed === yesterdayStr) {
        this.streakDays++;
      } else {
        this.streakDays = 1;
      }
    }

    this.lastPlayedDate = new Date().toISOString();
  }

  /**
   * Başarı yüzdesi
   */
  getCompletionRate() {
    if (this.totalGames === 0) return 0;
    return Math.floor((this.completedGames / this.totalGames) * 100);
  }

  /**
   * Zorluk seviyesine göre başarı yüzdesi
   */
  getDifficultyCompletionRate(difficulty) {
    const diffStats = this.gamesByDifficulty[difficulty];
    if (diffStats.played === 0) return 0;
    return Math.floor((diffStats.completed / diffStats.played) * 100);
  }

  /**
   * JSON'a çevir
   */
  toJSON() {
    return {
      totalGames: this.totalGames,
      completedGames: this.completedGames,
      averageTime: this.averageTime,
      bestTime: this.bestTime,
      streakDays: this.streakDays,
      lastPlayedDate: this.lastPlayedDate,
      gamesByDifficulty: this.gamesByDifficulty
    };
  }

  /**
   * JSON'dan UserStats objesi oluştur
   */
  static fromJSON(data) {
    const stats = new UserStats();
    Object.assign(stats, data);
    return stats;
  }
}
