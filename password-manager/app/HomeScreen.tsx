import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Navbar from './components/Navbar';
import { homescreenstyles } from './styles/HomeScreenStyles';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './App';

// Define navigation type for HomeScreen
// Functional Requirement: Enables screen transitions such as Logout → LoginScreen or navigation to Vault, Add Account, etc.
type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'HomeScreen'
>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  // Handles user logout process
  async function handleLogout() {
    try {
      // Functional Requirement: Logout clears session information
      // Remove stored session data from AsyncStorage to ensure security
      await AsyncStorage.removeItem('loggedInUser');
      await AsyncStorage.removeItem('loggedInUserId');

      // Functional Requirement: Automatic Logout and Manual Logout
      // Postcondition: User session is securely terminated
      Alert.alert('Logged out', 'You have been logged out successfully.');

      // Functional Requirement: After logout, system returns to Login Screen
      navigation.replace('LoginScreen');
    } catch (error) {
      // Functional Requirement: Error handling for logout failure
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  }

  return (
    // Functional Requirement: When User logs in, display Home Page
    // The Home Page is the landing screen where navigation to Vault or Add Account can occur
    <View style={{ flex: 1, padding: 20 }}>
      {/* Welcome message displayed upon login */}
      {/* Functional Requirement: Home Page Display */}
      <Text style={homescreenstyles.title}>Welcome to Lock Code</Text>

      {/* Subtext explaining the purpose of the application */}
      {/* Functional Requirement: Description - Application helps manage and store credentials securely */}
      <Text style={homescreenstyles.subtitle}>
        This is the place where you store all your information regarding user credentials.
      </Text>

      {/* Logout button */}
      {/* Functional Requirement: If the user clicks Logout, system shall return to Login Screen */}
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

      {/* Navbar Component */}
      {/* Functional Requirement: From Home Page, User can navigate to Vault Screen or Add Account Screen */}
      {/* The Navbar provides direct access to other functionalities of the application */}
      <Navbar />
    </View>
  );
}
