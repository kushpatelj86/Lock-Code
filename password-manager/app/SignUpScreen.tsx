import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { insertMasterUser } from '../utils/database'; 
import { signupstyles } from './styles/SignUpScreenStyles'; 

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
      console.error(error);
      Alert.alert('Error', 'Something went wrong. Try again.');
    }
  }

  return (
    <View style={signupstyles.outercontainer}>
      <Text style={signupstyles.label}>Sign Up</Text>

      <View style={signupstyles.innercontainer}>
        <View style={signupstyles.form}>
          <Text style={signupstyles.label}>Username</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            style={signupstyles.input}
          />

          
          <Text style={signupstyles.label}>Master Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={signupstyles.input}
          />

          <Text style={signupstyles.label}>First Name</Text>
          <TextInput
            value={firstName}
            onChangeText={setFirstName}
            style={signupstyles.input}
          />

          <Text style={signupstyles.label}>Last Name</Text>
          <TextInput
            value={lastName}
            onChangeText={setLastName}
            style={signupstyles.input}
          />

          <Text style={signupstyles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            style={signupstyles.input}
          />

          <Text style={signupstyles.label}>Phone Number</Text>
          <TextInput
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            style={signupstyles.input}
          />

          <TouchableOpacity onPress={handleSignUp} style={signupstyles.button}>
            <Text style={signupstyles.buttonText}>Sign Up</Text>
          </TouchableOpacity>

          
          <TouchableOpacity
            onPress={() => navigation.navigate('LoginScreen')}
            style={signupstyles.button}
          >
            <Text style={signupstyles.buttonText}>
              Already have an account? Log In
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
