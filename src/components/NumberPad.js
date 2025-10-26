import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';

export default function NumberPad({ onNumberPress, isNoteMode, disabled }) {
  const handlePress = async (num) => {
    if (!disabled) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onNumberPress(num);
    }
  };

  return (
    <View style={styles.container}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
        <TouchableOpacity
          key={num}
          style={[
            styles.button,
            disabled && styles.buttonDisabled,
            isNoteMode && styles.buttonNoteMode
          ]}
          onPress={() => handlePress(num)}
          disabled={disabled}
          activeOpacity={0.7}
        >
          <Text style={[styles.buttonText, disabled && styles.buttonTextDisabled]}>
            {num}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    margin: 4,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  buttonNoteMode: {
    borderWidth: 2,
    borderColor: '#F97316',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  buttonTextDisabled: {
    color: '#9CA3AF',
  },
});
