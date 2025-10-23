import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { AddAccountStyles } from './styles/AddAccountStyles';
import { insertPassword } from '../utils/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { estimateCrackTime, formatYears } from './components/PasswordStrength';

export default function AddAccount() {
  const [description, setDescription] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [url, setURL] = useState('');
  const [add_date, setAddDate] = useState('');
  const [expiry_date, setExpiryDate] = useState('');
  const [notes, setNotes] = useState('');
  const [crackTime, setCrackTime] = useState('');

  const router = useRouter();
  const timerRef = useRef<number | null>(null);

  // Auto logout handler
  async function handleLogout(auto = false) {
    try {
      await AsyncStorage.removeItem('loggedInUser');
      await AsyncStorage.removeItem('loggedInUserId');

      if (auto) {
        Alert.alert('Session expired', 'You were logged out due to inactivity.');
      } 
      else {
        Alert.alert('Logged out', 'You have been logged out successfully.');
      }

      router.replace('/LoginScreen');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  }

  // Start timer on mount
  useEffect(() => {
    timerRef.current = setTimeout(() => {
      handleLogout(true);
    }, 6000000); 
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Update crack time when password changes
  useEffect(() => {
    if (password.length > 0) {
      const estimate = estimateCrackTime(password);
      setCrackTime(formatYears(estimate.years));
    } else {
      setCrackTime('');
    }
  }, [password]);

  async function handleAddAccount() {
    if (!description || !username || !password || !add_date || !expiry_date) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    const storedUserId = await AsyncStorage.getItem('loggedInUserId');
    if (!storedUserId) {
      Alert.alert('Error', 'No logged in user found.');
      return;
    }

    const encrypted_password = password; // placeholder for encryption

    try {
      const inserted = await insertPassword(
        Number(storedUserId),
        description,
        username,
        encrypted_password,
        url,
        add_date,
        expiry_date,
        notes
      );

      if (inserted.success) {
        Alert.alert('Success', 'Account created!');
        setDescription('');
        setUsername('');
        setPassword('');
        setURL('');
        setAddDate('');
        setExpiryDate('');
        setNotes('');
      } else {
        Alert.alert('Error', inserted.message);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong. Try again.');
    }
  }

  return (
    <ScrollView contentContainerStyle={AddAccountStyles.container}>
      <View style={AddAccountStyles.form}>
        <Text style={AddAccountStyles.label}>URL (optional)</Text>
        <TextInput value={url} onChangeText={setURL} style={AddAccountStyles.input} />

        <Text style={AddAccountStyles.label}>Description *</Text>
        <TextInput value={description} onChangeText={setDescription} style={AddAccountStyles.input} />

        <Text style={AddAccountStyles.label}>Username *</Text>
        <TextInput value={username} onChangeText={setUsername} style={AddAccountStyles.input} />

        <Text style={AddAccountStyles.label}>Password *</Text>
        <TextInput value={password} onChangeText={setPassword} secureTextEntry style={AddAccountStyles.input} />

        {password.length > 0 && (
          <Text style={{ marginBottom: 10, color: 'green' }}>
            Estimated crack time: {crackTime}
          </Text>
        )}

        <Text style={AddAccountStyles.label}>Add Date *</Text>
        <TextInput value={add_date} onChangeText={setAddDate} style={AddAccountStyles.input} />

        <Text style={AddAccountStyles.label}>Expiry Date *</Text>
        <TextInput value={expiry_date} onChangeText={setExpiryDate} style={AddAccountStyles.input} />

        <Text style={AddAccountStyles.label}>Notes (optional)</Text>
        <TextInput value={notes} onChangeText={setNotes} style={AddAccountStyles.input} />

        <TouchableOpacity style={AddAccountStyles.button} onPress={handleAddAccount}>
          <Text style={AddAccountStyles.buttonText}>Add Account</Text>
        </TouchableOpacity>
      </View>

      <Text style={AddAccountStyles.registrationLink}>Don't have an account? Register</Text>
    </ScrollView>
  );
}
