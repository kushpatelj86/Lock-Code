import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginStyles } from './styles/LoginStyles'; 
import { insertMasterUser } from '../utils/database'; 

// RootStackParamList defines the app's navigation routes
export type RootStackParamList = {
  LoginScreen: undefined;
  SignUpScreen: undefined;
};

// Navigation prop type for SignUpScreen
type SignUpScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'SignUpScreen'
>;

export default function SignUpScreen() {
  const navigation = useNavigation<SignUpScreenNavigationProp>();

  // State hooks to capture user input for the account
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Handles the Sign Up process
  async function handleSignUp() {
    // Functional Requirement: Required fields must be filled
    if (!username || !password || !email) {
      // Postcondition: User alerted to fill required fields
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    try {
      // Insert new master user into SQLite database
      // Functional Requirement: Master Password Login, Secure Storage
      const inserted = await insertMasterUser(
        username,
        password,
        firstName,
        lastName,
        phoneNumber
      );

      if (inserted.success === true) {
        // Postcondition: Store username for session management
        await AsyncStorage.setItem('username', username);

        // Functional Requirement: Navigate back to Login after successful sign-up
        Alert.alert('Success', 'Account created!');
        navigation.navigate('LoginScreen');
      } 
      else {
        // Functional Requirement: Username uniqueness check
        Alert.alert('Error', 'Username already exists.');
      }
    } catch (error) {
      // Functional Requirement: Error handling
      console.error(error);
      Alert.alert('Error', 'Something went wrong. Try again.');
    }
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Screen title */}
      <Text style={loginStyles.label}>Sign Up</Text>

      <View style={loginStyles.container}>
        <View style={loginStyles.form}>
          {/* Username input */}
          <Text style={loginStyles.label}>Username</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            style={loginStyles.input}
          />

          {/* Password input */}
          {/* Functional Requirement: Master Password login */}
          <Text style={loginStyles.label}>Master Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={loginStyles.input}
          />

          {/* Optional user info fields */}
          <Text style={loginStyles.label}>First Name</Text>
          <TextInput
            value={firstName}
            onChangeText={setFirstName}
            style={loginStyles.input}
          />

          <Text style={loginStyles.label}>Last Name</Text>
          <TextInput
            value={lastName}
            onChangeText={setLastName}
            style={loginStyles.input}
          />

          <Text style={loginStyles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            style={loginStyles.input}
          />

          <Text style={loginStyles.label}>Phone Number</Text>
          <TextInput
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            style={loginStyles.input}
          />

          {/* Sign Up button */}
          {/* Functional Requirement: Create Account, Secure Storage */}
          <TouchableOpacity onPress={handleSignUp} style={loginStyles.button}>
            <Text style={loginStyles.buttonText}>Sign Up</Text>
          </TouchableOpacity>

          {/* Navigate to Login */}
          {/* Functional Requirement: Already have an account? Return to Login */}
          <TouchableOpacity
            onPress={() => navigation.navigate('LoginScreen')}
            style={loginStyles.button}
          >
            <Text style={loginStyles.buttonText}>
              Already have an account? Log In
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
