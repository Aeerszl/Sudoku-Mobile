import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Image, TouchableOpacity, Text, StyleSheet } from 'react-native';

// Screens
import HomeScreen from '../screens/HomeScreen';
import GameScreen from '../screens/GameScreen';
import StatsScreen from '../screens/StatsScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#3B82F6',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,
          },
          headerTitleAlign: 'center', // Logoyu merkeze al
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={({ navigation }) => ({
            headerTitle: () => (
              <View style={styles.headerCenterContainer}>
                <Image 
                  source={require('../../assets/alieelogo.png')} 
                  style={styles.headerLogo}
                  resizeMode="contain"
                />
              </View>
            ),
            headerLeft: () => (
              <View style={styles.headerLeftContainer}>
                <Text style={styles.headerLeftText}>Sudoku</Text>
              </View>
            ),
            headerRight: () => (
              <TouchableOpacity 
                onPress={() => navigation.navigate('Settings')}
                style={styles.headerIcon}
              >
                <Text style={styles.settingsIcon}>⚙️</Text>
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen 
          name="Game" 
          component={GameScreen}
          options={{ title: 'Oyun' }}
        />
        <Stack.Screen 
          name="Stats" 
          component={StatsScreen}
          options={{ title: 'İstatistikler' }}
        />
        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen}
          options={{ title: 'Ayarlar' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  headerCenterContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLogo: {
    width: 100,
    height: 100,
  },
  headerLeftContainer: {
    marginLeft: 4,
  },
  headerLeftText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerIcon: {
    padding: 8,
  },
  settingsIcon: {
    fontSize: 28,
  },
});
