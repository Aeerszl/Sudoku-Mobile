import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatTime } from '../utils/helpers';

export default function Timer({ timeSpent, isPaused }) {
  return (
    <View>
      <Text style={styles.label}>Süre</Text>
      <Text style={[styles.time, isPaused && styles.timePaused]}>
        ⏱️ {formatTime(timeSpent)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    color: '#6B7280',
    fontSize: 12,
  },
  time: {
    color: '#1F2937',
    fontSize: 20,
    fontWeight: 'bold',
  },
  timePaused: {
    color: '#F97316',
  },
});
