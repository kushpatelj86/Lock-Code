import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from './App';
import { loginStyles } from './styles/LoginStyles'; 
import { verifyMasterUser } from '../utils/database'; 

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'LoginScreen'
>;

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingLogin, setCheckingLogin] = useState(true); 
  const navigation = useNavigation<LoginScreenNavigationProp>();

  useEffect(() => {
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

    checkLoginStatus();
  }, []);

  async function handleLogin() {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const result = await verifyMasterUser(username.trim(), password);
      
      if (result?.success && result.userId) {
        await AsyncStorage.setItem('loggedInUser', username.trim());
        await AsyncStorage.setItem('loggedInUserId', String(result.userId));

        navigation.replace('HomeScreen'); 
      } else {
        Alert.alert('Error', result?.message || 'Invalid username or password.');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  }

  function navigateToSignUp() {
    navigation.navigate('SignUpScreen');
  }

  if (checkingLogin) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, paddingHorizontal: 20 }}>
      <Text style={{ textAlign: 'center', fontSize: 28, marginVertical: 30 }}>Login</Text>

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
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={loginStyles.buttonText}>Login</Text>
            )}
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
