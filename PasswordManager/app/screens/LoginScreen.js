import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router'; // Expo Router navigation
import bcrypt from 'bcryptjs';
import { getMasterPasswordHash } from '../services/database';
import { tailwind } from '../constants/theme';

export default function LoginScreen() {
  const router = useRouter(); // replace useNavigation()
  const [password, setPassword] = useState('');

  async function handleLogin() {
    try {
      const hash = await getMasterPasswordHash();

      if (!hash) {
        Alert.alert('No Master Password', 'Please create a Master Password first.');
        return;
      }

      const isValid = bcrypt.compareSync(password, hash);
      if (isValid) {
        router.push('/VaultScreen'); // correct Expo Router navigation
      } else {
        Alert.alert('Invalid Password', 'Please try again.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong.');
    }
  }

  return (
    <View style={tailwind('flex-1 justify-center items-center bg-gray-50 p-4')}>
      <Text style={tailwind('text-2xl font-bold mb-6')}>Password Manager</Text>
      <TextInput
        placeholder="Enter Master Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={tailwind('border border-gray-300 rounded-lg p-3 w-full mb-4')}
      />
      <TouchableOpacity
        onPress={handleLogin}
        style={tailwind('bg-blue-500 rounded-lg py-3 w-full items-center')}
      >
        <Text style={tailwind('text-white font-bold')}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}
