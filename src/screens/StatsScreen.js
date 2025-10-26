import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { loadStats } from '../services/gameStorage';
import { formatTime } from '../utils/helpers';

export default function StatsScreen() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const load = async () => {
      const s = await loadStats();
      setStats(s);
    };
    load();
  }, []);

  if (!stats) return <View style={s.loading}><Text>Yükleniyor...</Text></View>;

  const rate = stats.totalGames > 0 ? Math.floor((stats.completedGames / stats.totalGames) * 100) : 0;

  return (
    <ScrollView style={s.container}>
      <View style={s.card}>
        <Text style={s.title}>📊 Genel İstatistikler</Text>
        <Row label="Toplam Oyun" value={stats.totalGames} />
        <Row label="Tamamlanan" value={stats.completedGames} />
        <Row label="Başarı Oranı" value={`${rate}%`} />
        <Row label="Ortalama Süre" value={stats.averageTime > 0 ? formatTime(stats.averageTime) : '-'} />
        <Row label="En İyi Süre" value={stats.bestTime ? formatTime(stats.bestTime) : '-'} />
        <Row label="Günlük Seri" value={`${stats.streakDays} gün 🔥`} />
      </View>

      <View style={s.card}>
        <Text style={s.title}>🎯 Zorluk Seviyeleri</Text>
        {Object.entries(stats.gamesByDifficulty).map(([d, data]) => (
          <DiffStats key={d} difficulty={d} data={data} />
        ))}
      </View>
    </ScrollView>
  );
}

function Row({ label, value }) {
  return (
    <View style={s.row}>
      <Text style={s.label}>{label}</Text>
      <Text style={s.value}>{value}</Text>
    </View>
  );
}

function DiffStats({ difficulty, data }) {
  const rate = data.played > 0 ? Math.floor((data.completed / data.played) * 100) : 0;
  const colors = { easy: '#10B981', medium: '#F59E0B', hard: '#F97316', expert: '#EF4444' };
  const names = { easy: 'Kolay 😊', medium: 'Orta 🤔', hard: 'Zor 😰', expert: 'Uzman 🤯' };

  return (
    <View style={[s.diffCard, { borderLeftColor: colors[difficulty] }]}>
      <Text style={s.diffName}>{names[difficulty]}</Text>
      <View style={s.diffRow}>
        <Text style={s.diffText}>Oynanan: {data.played}</Text>
        <Text style={s.diffText}>Tamamlanan: {data.completed}</Text>
        <Text style={s.diffText}>Başarı: {rate}%</Text>
      </View>
      {data.bestTime && <Text style={s.diffText}>En iyi: {formatTime(data.bestTime)}</Text>}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: { backgroundColor: '#FFF', borderRadius: 24, padding: 24, margin: 16, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, elevation: 5 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  label: { color: '#6B7280' },
  value: { fontWeight: 'bold', fontSize: 18 },
  diffCard: { borderLeftWidth: 4, borderRadius: 8, padding: 16, marginBottom: 12, backgroundColor: '#F9FAFB' },
  diffName: { fontWeight: 'bold', marginBottom: 8 },
  diffRow: { flexDirection: 'row', justifyContent: 'space-between' },
  diffText: { fontSize: 12, color: '#6B7280' },
});
