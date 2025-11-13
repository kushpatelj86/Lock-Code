import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Navbar from './components/Navbar';
import { homescreenstyles } from './styles/HomeScreenStyles';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './App';

// Define navigation type for HomeScreen
type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'HomeScreen'
>;
  const AUTO_LOGOUT_MS = 5 * 60 * 1000;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const timerRef = useRef<number | null>(null);

  // Functional Requirement: Logout and Auto Logout
  //  User manually clicks Logout, which returns to the Login Screen and System auto logs out after inactivity
  async function handleLogout(auto = false) {
    try {
      await AsyncStorage.removeItem('loggedInUser');
      await AsyncStorage.removeItem('loggedInUserId');

      if (auto) {
        Alert.alert('Session expired', 'You were logged out due to inactivity.');
      } 
      else {
        Alert.alert('Logged out', 'You have been logged out successfully.');
      }

      navigation.replace('LoginScreen');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  }

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      handleLogout(true);
    }, AUTO_LOGOUT_MS); 

    return () => {
      if (timerRef.current)
      { 
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <View style={homescreenstyles.container}>
      <Text style={homescreenstyles.title}>Welcome to Lock Code</Text>

      <Text style={homescreenstyles.subtitle}>
        This is the place where you store all your information regarding user credentials.
      </Text>

      <TouchableOpacity
        style={homescreenstyles.loginbutton}
        onPress={() => handleLogout(false)}
      >
        <Text style={homescreenstyles.logoutbutton}>Logout</Text>
      </TouchableOpacity>

      <Navbar />
    </View>
  );
}
