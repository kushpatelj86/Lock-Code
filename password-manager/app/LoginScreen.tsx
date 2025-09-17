import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { loginStyles } from './styles/LoginStyles'; 
export default function LoginScreen() {
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [username, setUsername] = useState('');

  function handleLogin() {
    if (password.length > 0) 
    {
      Alert.alert('Success', 'Logged in!');
    } 
    else {
      Alert.alert('Error', 'Please enter a password');
    }
  }

  return (
  <View style={{ flex: 1 }}>
    <Text>Login</Text>

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

        <TouchableOpacity onPress={handleLogin} style={loginStyles.button}>
          <Text style={loginStyles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>

      <Text style={loginStyles.registrationLink}>
        Don't have an account? Register
      </Text>
    </View>
  </View>
);

}
