import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Navbar from './components/Navbar';
import { homescreenstyles } from './styles/HomeScreenStyles';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './App';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'HomeScreen'
>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  async function handleLogout() {
    try {
      await AsyncStorage.removeItem('loggedInUser');
      await AsyncStorage.removeItem('loggedInUserId');

      Alert.alert('Logged out', 'You have been logged out successfully.');

      navigation.replace('LoginScreen');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={homescreenstyles.title}>Welcome to Lock Code</Text>
      <Text style={homescreenstyles.subtitle}>
        This is the place where you store all your information regarding user credentials.
      </Text>

      <TouchableOpacity
        style={{
          marginTop: 20,
          backgroundColor: '#ff4d4d',
          padding: 10,
          borderRadius: 5,
          alignItems: 'center',
        }}
        onPress={handleLogout}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Logout</Text>
      </TouchableOpacity>

      <Navbar />
    </View>
  );
}
