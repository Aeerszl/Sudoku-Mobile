import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Switch, ScrollView, Alert, StyleSheet } from 'react-native';
import { loadSettings, saveSettings, clearAllData } from '../services/gameStorage';

export default function SettingsScreen() {
  const [settings, setSettings] = useState({
    theme: 'light',
    soundEnabled: true,
    hapticEnabled: true,
    highlightSimilar: true,
    autoCheckErrors: false,
    timerEnabled: true
  });

  useEffect(() => {
    const load = async () => {
      const s = await loadSettings();
      if (s) setSettings(s);
    };
    load();
  }, []);

  const update = async (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    await saveSettings(newSettings);
  };

  const reset = () => {
    Alert.alert('Verileri Sıfırla', 'Tüm veriler silinecek. Emin misiniz?', [
      { text: 'İptal' },
      { text: 'Sıfırla', style: 'destructive', onPress: async () => { await clearAllData(); Alert.alert('Başarılı', 'Tüm veriler silindi.'); } }
    ]);
  };

  return (
    <ScrollView style={s.container}>
      <View style={s.card}>
        <Text style={s.title}>🎮 Oyun Ayarları</Text>
        <Item label="Zamanlayıcı" desc="Oyun süresini göster" value={settings.timerEnabled} onChange={(v) => update('timerEnabled', v)} />
        <Item label="Aynı Sayıları Vurgula" desc="Seçili sayıyı vurgula" value={settings.highlightSimilar} onChange={(v) => update('highlightSimilar', v)} />
        <Item label="Otomatik Hata Kontrolü" desc="Hataları otomatik kontrol" value={settings.autoCheckErrors} onChange={(v) => update('autoCheckErrors', v)} />
      </View>

      <View style={s.card}>
        <Text style={s.title}>🔊 Ses & Titreşim</Text>
        <Item label="Ses Efektleri" desc="Oyun seslerini aç/kapat" value={settings.soundEnabled} onChange={(v) => update('soundEnabled', v)} />
        <Item label="Titreşim" desc="Dokunmatik geri bildirim" value={settings.hapticEnabled} onChange={(v) => update('hapticEnabled', v)} />
      </View>

      <View style={s.card}>
        <Text style={s.title}>⚠️ Tehlikeli Bölge</Text>
        <TouchableOpacity style={s.resetBtn} onPress={reset}>
          <Text style={s.resetBtnText}>Tüm Verileri Sıfırla</Text>
        </TouchableOpacity>
      </View>

      <View style={s.footer}>
        <Text style={s.footerText}>Sudoku v1.0.0</Text>
        <Text style={s.footerSubtext}>Made with ❤️</Text>
      </View>
    </ScrollView>
  );
}

function Item({ label, desc, value, onChange }) {
  return (
    <View style={s.item}>
      <View style={s.itemText}>
        <Text style={s.itemLabel}>{label}</Text>
        <Text style={s.itemDesc}>{desc}</Text>
      </View>
      <Switch value={value} onValueChange={onChange} trackColor={{ false: '#D1D5DB', true: '#3B82F6' }} thumbColor="#FFF" />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  card: { backgroundColor: '#FFF', borderRadius: 24, padding: 24, margin: 16, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, elevation: 5 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  item: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  itemText: { flex: 1, marginRight: 16 },
  itemLabel: { fontWeight: '600', marginBottom: 4 },
  itemDesc: { fontSize: 12, color: '#6B7280' },
  resetBtn: { backgroundColor: '#EF4444', borderRadius: 12, padding: 16 },
  resetBtnText: { color: '#FFF', fontWeight: 'bold', textAlign: 'center' },
  footer: { marginTop: 32, marginBottom: 16, alignItems: 'center' },
  footerText: { color: '#9CA3AF', fontSize: 12 },
  footerSubtext: { color: '#9CA3AF', fontSize: 10, marginTop: 4 },
});
