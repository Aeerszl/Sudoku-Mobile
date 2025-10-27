import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import { useSudoku } from '../hooks/useSudoku';
import SudokuGrid from '../components/SudokuGrid';
import NumberPad from '../components/NumberPad';
import Timer from '../components/Timer';
import { saveStats, loadStats } from '../services/gameStorage';
import { UserStats } from '../models/UserStats';
import { MAX_MISTAKES, HINT_LIMITS } from '../utils/constants';

export default function GameScreen({ route, navigation }) {
  const { difficulty = 'medium', isNew = true } = route.params || {};
  const {
    game, selectedCell, setSelectedCell, isNoteMode, setIsNoteMode,
    isLoading, startNewGame, loadExistingGame, placeNumber,
    clearCell, useHint, togglePause
  } = useSudoku(difficulty);

  useEffect(() => {
    const init = async () => {
      if (isNew) {
        await startNewGame(difficulty);
      } else {
        const loaded = await loadExistingGame();
        if (!loaded) await startNewGame(difficulty);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (game && game.isCompleted) {
      const complete = async () => {
        // Hata limiti aşıldı mı kontrol et
        if (game.mistakes >= MAX_MISTAKES) {
          Alert.alert('😢 Oyun Bitti!', `Hata limitini aştınız!\nToplam Hata: ${game.mistakes}/${MAX_MISTAKES}`, [
            { text: 'Yeni Oyun', onPress: () => startNewGame(difficulty) },
            { text: 'Ana Menü', onPress: () => navigation.goBack() }
          ]);
        } else {
          // Başarıyla tamamlandı
          const stats = await loadStats();
          const userStats = UserStats.fromJSON(stats);
          userStats.completeGame(game.difficulty, game.timeSpent);
          await saveStats(userStats.toJSON());
          Alert.alert('🎉 Tebrikler!', `Süre: ${Math.floor(game.timeSpent / 60)}:${(game.timeSpent % 60).toString().padStart(2, '0')}\nHatalar: ${game.mistakes}/${MAX_MISTAKES}`, [
            { text: 'Yeni Oyun', onPress: () => startNewGame(difficulty) },
            { text: 'Ana Menü', onPress: () => navigation.goBack() }
          ]);
        }
      };
      complete();
    }
  }, [game?.isCompleted]);

  if (isLoading || !game) {
    return <View style={s.loading}><ActivityIndicator size="large" color="#3B82F6" /><Text style={s.loadingText}>Yükleniyor...</Text></View>;
  }

  const hintLimit = HINT_LIMITS[game.difficulty] || 3;
  const hintsRemaining = hintLimit - game.hintsUsed;

  return (
    <View style={s.container}>
      <View style={s.topBar}>
        <View style={s.row}>
          <Timer timeSpent={game.timeSpent} isPaused={game.isPaused} />
          <View style={s.info}><Text style={s.label}>Zorluk</Text><Text style={s.value}>{difficulty}</Text></View>
          <View style={s.info}>
            <Text style={s.label}>Hatalar</Text>
            <Text style={[s.value, { color: game.mistakes >= MAX_MISTAKES - 1 ? '#EF4444' : '#6B7280' }]}>
              {game.mistakes}/{MAX_MISTAKES}
            </Text>
          </View>
          <TouchableOpacity style={s.pauseBtn} onPress={togglePause}><Text style={s.pauseBtnText}>{game.isPaused ? '▶️' : '⏸️'}</Text></TouchableOpacity>
        </View>
      </View>
      
      {game.isPaused && (
        <View style={s.pauseOverlay}>
          <View style={s.pauseCard}>
            <Text style={s.pauseEmoji}>⏸️</Text>
            <Text style={s.pauseTitle}>Duraklatıldı</Text>
            <TouchableOpacity style={s.resumeBtn} onPress={togglePause}><Text style={s.resumeBtnText}>Devam Et</Text></TouchableOpacity>
          </View>
        </View>
      )}

      <View style={s.gridContainer}>
        <SudokuGrid game={game} selectedCell={selectedCell} onCellPress={(row, col) => setSelectedCell({ row, col })} />
      </View>

      <View style={s.controls}>
        <View style={s.actionRow}>
          {[
            { icon: '💡', label: `İpucu (${hintsRemaining})`, onPress: useHint, disabled: hintsRemaining <= 0 },
            { icon: '🗑️', label: 'Sil', onPress: clearCell },
            { icon: isNoteMode ? '✏️' : '📝', label: 'Not', onPress: () => setIsNoteMode(!isNoteMode), active: isNoteMode },
            { icon: '🔄', label: 'Yeni', onPress: () => Alert.alert('Yeni Oyun', 'Devam?', [{ text: 'Hayır' }, { text: 'Evet', onPress: () => startNewGame(difficulty) }]) }
          ].map((btn, i) => (
            <TouchableOpacity 
              key={i} 
              style={[
                s.actionBtn, 
                (selectedCell.row === null && i === 1) && s.actionBtnDis,
                btn.disabled && s.actionBtnDis,
                btn.active && s.actionBtnActive
              ]} 
              onPress={btn.onPress} 
              disabled={(selectedCell.row === null && i === 1) || btn.disabled}
            >
              <Text style={s.actionIcon}>{btn.icon}</Text>
              <Text style={s.actionLabel}>{btn.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <NumberPad onNumberPress={placeNumber} isNoteMode={isNoteMode} disabled={selectedCell.row === null} />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F3F4F6' },
  loadingText: { marginTop: 16, color: '#6B7280' },
  topBar: { backgroundColor: '#FFF', padding: 12, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  info: { marginLeft: 16 },
  label: { fontSize: 10, color: '#6B7280' },
  value: { fontWeight: 'bold', color: '#1F2937' },
  pauseBtn: { backgroundColor: '#3B82F6', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 8 },
  pauseBtnText: { color: '#FFF', fontWeight: 'bold' },
  pauseOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 999, alignItems: 'center', justifyContent: 'center' },
  pauseCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 32, alignItems: 'center' },
  pauseEmoji: { fontSize: 48, marginBottom: 16 },
  pauseTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 24 },
  resumeBtn: { backgroundColor: '#3B82F6', borderRadius: 12, paddingHorizontal: 32, paddingVertical: 12 },
  resumeBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 18 },
  gridContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  controls: { backgroundColor: '#FFF', paddingHorizontal: 16, paddingBottom: 16, paddingTop: 8 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 },
  actionBtn: { alignItems: 'center', borderRadius: 8, padding: 8 },
  actionBtnDis: { opacity: 0.4 },
  actionBtnActive: { backgroundColor: '#DBEAFE' },
  actionIcon: { fontSize: 24, marginBottom: 4 },
  actionLabel: { fontSize: 10, color: '#6B7280' },
});
