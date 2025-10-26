/**
 * Oyun modeli
 */
export class Game {
  constructor(puzzle, solution, difficulty) {
    this.id = Date.now().toString();
    this.puzzle = puzzle; // Başlangıç puzzle'ı
    this.solution = solution; // Çözüm
    this.currentGrid = JSON.parse(JSON.stringify(puzzle)); // Mevcut durum
    this.difficulty = difficulty;
    this.timeSpent = 0; // Saniye cinsinden
    this.mistakes = 0;
    this.hintsUsed = 0;
    this.isCompleted = false;
    this.isPaused = false;
    this.createdAt = new Date().toISOString();
    this.notes = this.initializeNotes(); // Her hücre için notlar
  }

  /**
   * Not sistemi için boş array başlat
   */
  initializeNotes() {
    return Array(9).fill(null).map(() => 
      Array(9).fill(null).map(() => [])
    );
  }

  /**
   * Hücreye sayı yerleştir
   */
  placeNumber(row, col, num) {
    // Sabit hücreleri değiştirme
    if (this.puzzle[row][col] !== 0) {
      return false;
    }

    this.currentGrid[row][col] = num;
    
    // Yanlışsa hata say
    if (num !== 0 && num !== this.solution[row][col]) {
      this.mistakes++;
      return false;
    }

    return true;
  }

  /**
   * Hücreye not ekle/çıkar
   */
  toggleNote(row, col, num) {
    if (this.puzzle[row][col] !== 0) {
      return;
    }

    const noteIndex = this.notes[row][col].indexOf(num);
    if (noteIndex > -1) {
      this.notes[row][col].splice(noteIndex, 1);
    } else {
      this.notes[row][col].push(num);
      this.notes[row][col].sort();
    }
  }

  /**
   * Hücreyi temizle
   */
  clearCell(row, col) {
    if (this.puzzle[row][col] === 0) {
      this.currentGrid[row][col] = 0;
      this.notes[row][col] = [];
    }
  }

  /**
   * Oyunun tamamlanıp tamamlanmadığını kontrol et
   */
  checkCompletion() {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (this.currentGrid[i][j] !== this.solution[i][j]) {
          return false;
        }
      }
    }
    this.isCompleted = true;
    return true;
  }

  /**
   * JSON'a çevir (kaydetmek için)
   */
  toJSON() {
    return {
      id: this.id,
      puzzle: this.puzzle,
      solution: this.solution,
      currentGrid: this.currentGrid,
      difficulty: this.difficulty,
      timeSpent: this.timeSpent,
      mistakes: this.mistakes,
      hintsUsed: this.hintsUsed,
      isCompleted: this.isCompleted,
      isPaused: this.isPaused,
      createdAt: this.createdAt,
      notes: this.notes
    };
  }

  /**
   * JSON'dan Game objesi oluştur
   */
  static fromJSON(data) {
    const game = new Game(data.puzzle, data.solution, data.difficulty);
    game.id = data.id;
    game.currentGrid = data.currentGrid;
    game.timeSpent = data.timeSpent;
    game.mistakes = data.mistakes;
    game.hintsUsed = data.hintsUsed;
    game.isCompleted = data.isCompleted;
    game.isPaused = data.isPaused;
    game.createdAt = data.createdAt;
    game.notes = data.notes || game.initializeNotes();
    return game;
  }
}
