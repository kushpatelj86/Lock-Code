import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { loginStyles } from './styles/LoginStyles'; 
import { insertMasterUser } from '../utils/database'; 

// 👇 Define your RootStackParamList here or import it from a central types file
export type RootStackParamList = {
  LoginScreen: undefined;
  SignUpScreen: undefined;
  // Add other screens here if needed
};

type SignUpScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'SignUpScreen'
>;

export default function SignUpScreen() {
  const navigation = useNavigation<SignUpScreenNavigationProp>();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  async function handleSignUp() {
    if (!username || !password || !email) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    try {
      const inserted = await insertMasterUser(
        username,
        password,
        firstName,
        lastName,
        phoneNumber
      );

      if (inserted?.success === true) {
        Alert.alert('Success', 'Account created!');
        navigation.navigate('LoginScreen');
      } 
      else {
        Alert.alert('Error', 'Username already exists.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong. Try again.');
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <Text style={loginStyles.label}>Sign Up</Text>
      <View style={loginStyles.container}>
        <View style={loginStyles.form}>
          <Text style={loginStyles.label}>Username</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            style={loginStyles.input}
          />

          <Text style={loginStyles.label}>Master Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={loginStyles.input}
          />

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

          <TouchableOpacity onPress={handleSignUp} style={loginStyles.button}>
            <Text style={loginStyles.buttonText}>Sign Up</Text>
          </TouchableOpacity>

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
