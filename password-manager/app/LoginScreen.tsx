import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { loginStyles } from './styles/LoginStyles'; 
import {useNavigation} from '@react-navigation/native';
import { RootStackParamList } from './App';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';


type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;



export default function LoginScreen() {
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [username, setUsername] = useState('');
  const navigation = useNavigation<LoginScreenNavigationProp>();


  function handleLogin() {
    if (password.length > 0) 
    {
      Alert.alert('Success', 'Logged in!');
    } 
    else {
      Alert.alert('Error', 'Please enter a password');
    }
  }


  function navigateToSignUp() {
      navigation.navigate('SignUp'); 
  }


  return (
  <View style={{ flex: 1 }}>
<Text style={{ textAlign: 'center' }}>Login</Text>

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
      <TouchableOpacity onPress={navigateToSignUp} style={loginStyles.button}>
          <Text style={loginStyles.buttonText}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>

    </View>
  </View>
);

}
