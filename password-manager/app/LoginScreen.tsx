import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './App';
import { loginStyles } from './styles/LoginStyles'; 
import { verifyMasterUser } from '../utils/database'; 

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'LoginScreen'>;

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation<LoginScreenNavigationProp>();

  async function handleLogin() {
    if (!username || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const isValid = await verifyMasterUser(username, password);

      if (isValid) {
        Alert.alert('Success', 'Logged in!');
        navigation.navigate('HomeScreen');
      } else {
        Alert.alert('Error', 'Invalid username or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Something went wrong. Try again.');
    }
  }

  function navigateToSignUp() {
    navigation.navigate('SignUpScreen');
  }

  return (
    <View style={{ flex: 1 }}>
      <Text style={{ textAlign: 'center', fontSize: 24, marginVertical: 20 }}>Login</Text>
      <View style={loginStyles.container}>
        <View style={loginStyles.form}>
          <Text style={loginStyles.label}>Username</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            style={loginStyles.input}
            autoCapitalize="none"
          />

          <Text style={loginStyles.label}>Master Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={loginStyles.input}
            autoCapitalize="none"
          />

          <TouchableOpacity onPress={handleLogin} style={loginStyles.button}>
            <Text style={loginStyles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={navigateToSignUp} style={loginStyles.button}>
            <Text style={loginStyles.buttonText}>Don't have an account? Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
