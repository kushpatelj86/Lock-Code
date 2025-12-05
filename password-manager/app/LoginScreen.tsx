import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from './App';
import { loginStyles } from './styles/LoginScreenStyles'; 
import { verifyMasterUser } from '../utils/database'; 
import  LoginLoading from './components/LoginLoading'; 

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'LoginScreen'
>;

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingLogin, setCheckingLogin] = useState(true); // To check if user is already logged in
  const navigation = useNavigation<LoginScreenNavigationProp>();



  // Functional Requirement: When the user opens the application, the system shall display the Login Screen.
  // Checks if a user is already logged in (via AsyncStorage). If yes, navigates directly to the Home Screen.
  async function checkLoginStatus() {
      try {
        const storedUser = await AsyncStorage.getItem('loggedInUser');
        const storedUserId = await AsyncStorage.getItem('loggedInUserId');

        if (storedUser && storedUserId) {
          navigation.replace('HomeScreen');
          return;
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      } finally {

        setCheckingLogin(false);
      }
    }

  useEffect(() => {

    checkLoginStatus();
  }, []);

  // Functional Requirement: Master Password Login
  // Verifies the entered username and master password with the database. If valid, stores credentials in AsyncStorage and navigates to HomeScreen.
  async function handleLogin() {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    setLoading(true); 

    try {
      const result = await verifyMasterUser(username.trim(), password);
      
      if (result.success && result.userId) {
        await AsyncStorage.setItem('loggedInUser', username.trim());
        await AsyncStorage.setItem('loggedInUserId', String(result.userId));

        navigation.replace('HomeScreen'); 
      } 
      else {
        if (result.message) {
          Alert.alert('Error', result.message);
        } 
        else {
          Alert.alert('Error', 'Invalid username or password.');
        }

      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  }
  // Functional Requirement: If the user doesn't have an account, the system shall prompt them to create one.
  // Navigates to the Sign Up screen where new users can register.
  function navigateToSignUp() {
    navigation.navigate('SignUpScreen');
  }

  if (checkingLogin) {
    return (
      <View style={loginStyles.logincheck}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }
  // Functional Requirement:Master Password Login, Prompt to create account (Sign Up)
  // Contains username/password inputs, login button, and sign-up navigation.

  return (
    <View style={loginStyles.container}>
      <Text style={loginStyles.loginlabel}>Login</Text>

      <View style={loginStyles.container}>
        <View style={loginStyles.form}>
          <Text style={loginStyles.label}>Username</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            style={loginStyles.input}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={loginStyles.label}>Master Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={loginStyles.input}
            autoCapitalize="none"
          />

          <TouchableOpacity
            onPress={handleLogin}
            style={loginStyles.button}
            disabled={loading}
          >
            {<LoginLoading loading={loading}/>}
          </TouchableOpacity>

          <TouchableOpacity onPress={navigateToSignUp} style={loginStyles.button}>
            <Text style={loginStyles.buttonText}>
              Don't have an account? Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
