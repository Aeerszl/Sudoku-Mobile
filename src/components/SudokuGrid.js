import React from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { GRID_SIZE } from '../utils/constants';

const screenWidth = Dimensions.get('window').width;
const gridSize = Math.min(screenWidth - 32, 400);
const cellSize = gridSize / GRID_SIZE;

export default function SudokuGrid({ game, selectedCell, onCellPress }) {
  if (!game) return null;

  const renderCell = (row, col) => {
    const value = game.currentGrid[row][col];
    const isFixed = game.puzzle[row][col] !== 0;
    const isSelected = selectedCell.row === row && selectedCell.col === col;
    const isError = value !== 0 && value !== game.solution[row][col];
    const notes = game.notes[row][col];

    // Stil belirleme
    const cellStyles = [styles.cell];
    
    if (isSelected) {
      cellStyles.push(styles.cellSelected);
    } else if (isError) {
      cellStyles.push(styles.cellError);
    } else if (isFixed) {
      cellStyles.push(styles.cellFixed);
    }

    return (
      <TouchableOpacity
        key={`${row}-${col}`}
        style={[
          cellStyles, 
          { 
            width: cellSize, 
            height: cellSize,
          }
        ]}
        onPress={() => onCellPress(row, col)}
        activeOpacity={0.6}
      >
        {value !== 0 ? (
          <Text 
            style={[
              styles.cellValue,
              isFixed ? styles.cellValueFixed : styles.cellValueUser,
              { fontSize: cellSize * 0.5 }
            ]}
          >
            {value}
          </Text>
        ) : notes && notes.length > 0 ? (
          <View style={styles.notesContainer}>
            {notes.map((note) => (
              <Text 
                key={note} 
                style={[styles.noteText, { fontSize: cellSize * 0.2, width: cellSize / 3 }]}
              >
                {note}
              </Text>
            ))}
          </View>
        ) : null}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.gridContainer, { width: gridSize, height: gridSize }]}>
      {/* Grid çizgileri */}
      <View style={styles.gridLines}>
        {/* Yatay çizgiler - 10 tane (0-9) */}
        {Array.from({ length: 10 }).map((_, i) => (
          <View
            key={`h-${i}`}
            style={[
              styles.horizontalLine,
              {
                top: i * (gridSize / 9),
                width: gridSize,
                height: (i % 3 === 0) ? 2 : 0.5, // 0, 3, 6, 9 kalın
              }
            ]}
          />
        ))}
        
        {/* Dikey çizgiler - 10 tane (0-9) */}
        {Array.from({ length: 10 }).map((_, i) => (
          <View
            key={`v-${i}`}
            style={[
              styles.verticalLine,
              {
                left: i * (gridSize / 9),
                height: gridSize,
                width: (i % 3 === 0) ? 2 : 0.5, // 0, 3, 6, 9 kalın
              }
            ]}
          />
        ))}
      </View>
      
      {/* Hücreler */}
      <View style={styles.grid}>
        {Array.from({ length: GRID_SIZE }).map((_, row) => (
          <View key={row} style={styles.row}>
            {Array.from({ length: GRID_SIZE }).map((_, col) => 
              renderCell(row, col)
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  gridContainer: {
    position: 'relative',
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  gridLines: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    pointerEvents: 'none',
  },
  horizontalLine: {
    position: 'absolute',
    backgroundColor: '#000',
  },
  verticalLine: {
    position: 'absolute',
    backgroundColor: '#000',
  },
  grid: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellSelected: {
    backgroundColor: '#DBEAFE',
  },
  cellError: {
    backgroundColor: '#FEE2E2',
  },
  cellFixed: {
    backgroundColor: '#F9FAFB',
  },
  cellValue: {
    fontSize: 20,
  },
  cellValueFixed: {
    color: '#1F2937',
    fontWeight: 'bold',
  },
  cellValueUser: {
    color: '#3B82F6',
  },
  notesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
  },
  noteText: {
    color: '#9CA3AF',
    textAlign: 'center',
  },
});
