import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar, StyleSheet } from 'react-native';
import { loadGame, loadStats } from '../services/gameStorage';
import { DIFFICULTY } from '../utils/constants';

export default function HomeScreen({ navigation }) {
  const [hasSavedGame, setHasSavedGame] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    checkSavedGame();
    loadUserStats();
  }, []);

  const checkSavedGame = async () => {
    const saved = await loadGame();
    setHasSavedGame(saved !== null && !saved.isCompleted);
  };

  const loadUserStats = async () => {
    const userStats = await loadStats();
    setStats(userStats);
  };

  const startNewGame = (difficulty) => {
    navigation.navigate('Game', { difficulty, isNew: true });
  };

  const continueGame = () => {
    navigation.navigate('Game', { isNew: false });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.emoji}>🎮</Text>
          <Text style={styles.title}>Sudoku</Text>
          <Text style={styles.subtitle}>Zihin Oyunu</Text>
        </View>

        {hasSavedGame && (
          <TouchableOpacity style={styles.continueButton} onPress={continueGame} activeOpacity={0.8}>
            <Text style={styles.continueButtonText}>▶️ Oyuna Devam Et</Text>
          </TouchableOpacity>
        )}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Yeni Oyun</Text>
          
          <View>
            <DifficultyButton title="Kolay" emoji="😊" color="#10B981" onPress={() => startNewGame(DIFFICULTY.EASY)} />
            <DifficultyButton title="Orta" emoji="🤔" color="#F59E0B" onPress={() => startNewGame(DIFFICULTY.MEDIUM)} />
            <DifficultyButton title="Zor" emoji="😰" color="#F97316" onPress={() => startNewGame(DIFFICULTY.HARD)} />
            <DifficultyButton title="Uzman" emoji="🤯" color="#EF4444" onPress={() => startNewGame(DIFFICULTY.EXPERT)} />
          </View>
        </View>

        {stats && stats.totalGames > 0 && (
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Stats')} activeOpacity={0.8}>
            <Text style={styles.cardTitle}>📊 İstatistikler</Text>
            <View style={styles.statsRow}>
              <StatItem label="Oyun" value={stats.totalGames} />
              <StatItem label="Tamamlanan" value={stats.completedGames} />
              <StatItem label="Seri" value={`${stats.streakDays} gün`} />
            </View>
            <Text style={styles.linkText}>Detayları gör →</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.settingsButton} onPress={() => navigation.navigate('Settings')} activeOpacity={0.8}>
          <Text style={styles.settingsButtonText}>⚙️ Ayarlar</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function DifficultyButton({ title, emoji, color, onPress }) {
  return (
    <TouchableOpacity style={[styles.difficultyButton, { backgroundColor: color }]} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.difficultyContent}>
        <View style={styles.difficultyLeft}>
          <Text style={styles.difficultyEmoji}>{emoji}</Text>
          <Text style={styles.difficultyTitle}>{title}</Text>
        </View>
        <Text style={styles.difficultyArrow}>→</Text>
      </View>
    </TouchableOpacity>
  );
}

function StatItem({ label, value }) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#3B82F6' },
  scrollView: { flex: 1, padding: 24 },
  header: { alignItems: 'center', marginTop: 48, marginBottom: 32 },
  emoji: { fontSize: 60, marginBottom: 8 },
  title: { fontSize: 36, fontWeight: 'bold', color: '#FFFFFF' },
  subtitle: { color: '#FFFFFF', opacity: 0.8, marginTop: 8 },
  continueButton: { backgroundColor: '#10B981', borderRadius: 16, padding: 20, marginBottom: 16 },
  continueButtonText: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24, marginBottom: 24 },
  cardTitle: { fontSize: 24, fontWeight: 'bold', color: '#1F2937', marginBottom: 16 },
  difficultyButton: { borderRadius: 12, padding: 16, marginBottom: 12 },
  difficultyContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  difficultyLeft: { flexDirection: 'row', alignItems: 'center' },
  difficultyEmoji: { fontSize: 24, marginRight: 12 },
  difficultyTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  difficultyArrow: { color: '#FFFFFF', fontSize: 20 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: 'bold', color: '#3B82F6' },
  statLabel: { color: '#6B7280', fontSize: 12 },
  linkText: { color: '#3B82F6', textAlign: 'center', marginTop: 12 },
  settingsButton: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, marginBottom: 24 },
  settingsButtonText: { color: '#1F2937', fontSize: 18, fontWeight: '600', textAlign: 'center' },
});
