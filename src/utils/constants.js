// Oyun sabitleri
export const GRID_SIZE = 9;
export const BOX_SIZE = 3;

// Zorluk seviyeleri
export const DIFFICULTY = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
  EXPERT: 'expert'
};

// Her zorluk seviyesi için çıkarılacak sayı sayısı
export const DIFFICULTY_HOLES = {
  [DIFFICULTY.EASY]: 35,
  [DIFFICULTY.MEDIUM]: 45,
  [DIFFICULTY.HARD]: 52,
  [DIFFICULTY.EXPERT]: 58
};

// Renkler
export const COLORS = {
  primary: '#3B82F6',
  secondary: '#8B5CF6',
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  background: '#F3F4F6',
  backgroundDark: '#1F2937',
  text: '#111827',
  textLight: '#6B7280',
  white: '#FFFFFF',
  cellDefault: '#FFFFFF',
  cellSelected: '#DBEAFE',
  cellSameNumber: '#E0E7FF',
  cellError: '#FEE2E2',
  cellFixed: '#F9FAFB'
};

// Animasyon süreleri (ms)
export const ANIMATION = {
  fast: 150,
  medium: 300,
  slow: 500
};
