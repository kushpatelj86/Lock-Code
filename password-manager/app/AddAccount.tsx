import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { AddAccountStyles } from './styles/AddAccountStyles';
import { insertPassword } from '../utils/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { estimateCrackTime, formatYears } from './components/PasswordStrength';
import { generateRandomPassword } from './components/PasswordGenerator';

export default function AddAccount() {
  // Functional Requirement: Add / Edit / Delete Accounts
  // The system shall allow the user to add new account credentials into the vault.
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

  // Functional Requirement: Automatic Logout
  // The system shall automatically log out the user after a period of inactivity.
  async function handleLogout(auto = false) {
    try {
      await AsyncStorage.removeItem('loggedInUser');
      await AsyncStorage.removeItem('loggedInUserId');
      Alert.alert(
        auto ? 'Session expired' : 'Logged out',
        auto
          ? 'You were logged out due to inactivity.'
          : 'You have been logged out successfully.'
      );
      router.replace('/LoginScreen');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  }

  // Functional Requirement: Automatic Logout
  // The system shall trigger auto logout after inactivity.
  useEffect(() => {
    timerRef.current = setTimeout(() => handleLogout(true), 600000);
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Functional Requirement: Password Strength Evaluation
  // The system shall evaluate the password’s strength and show the estimated crack time.
  useEffect(() => {
    if (password.length > 0) {
      const estimate = estimateCrackTime(password);
      setCrackTime(formatYears(estimate.years));
    } 
    else 
    {
      setCrackTime('');
    }
  }, [password]);

  // Functional Requirement: Add / Edit / Delete Accounts
  // The system shall allow users to store credentials securely in the database.
  async function handleAddAccount() {
    if (!description || !username || !password || !add_date || !expiry_date) 
    {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    const storedUserId = await AsyncStorage.getItem('loggedInUserId');
    if (!storedUserId) 
    {
      Alert.alert('Error', 'No logged in user found.');
      return;
    }

    // Functional Requirement: Encryption
    // The system shall store passwords in encrypted form.
    const encrypted_password = password; // Placeholder for encryption

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

      if (inserted.success) 
      {
        Alert.alert('Success', 'Account created!');
        setDescription('');
        setUsername('');
        setPassword('');
        setURL('');
        setAddDate('');
        setExpiryDate('');
        setNotes('');
      } 
      else 
      {
        Alert.alert('Error', inserted.message);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong. Try again.');
    }
  }

  return (
    // Functional Requirement: Add / Edit / Delete Accounts
    // The system shall display an Add Account Screen to input new account credentials.
    <ScrollView contentContainerStyle={AddAccountStyles.container}>
      <View style={AddAccountStyles.form}>
        
        <Text style={AddAccountStyles.label}>URL (optional)</Text>
        <TextInput value={url} onChangeText={setURL} style={AddAccountStyles.input} />

        <Text style={AddAccountStyles.label}>Description *</Text>
        <TextInput value={description} onChangeText={setDescription} style={AddAccountStyles.input} />

        <Text style={AddAccountStyles.label}>Username *</Text>
        <TextInput value={username} onChangeText={setUsername} style={AddAccountStyles.input} />

        <Text style={AddAccountStyles.label}>Password *</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={AddAccountStyles.input}
        />

        {/* Functional Requirement: Password Generation and Management
            The system shall generate strong and unique passwords for each account. */}
        <TouchableOpacity
          style={[AddAccountStyles.button, { marginVertical: 10 }]}
          onPress={() => setPassword(generateRandomPassword(16))}
        >
          <Text style={AddAccountStyles.buttonText}>Generate Password</Text>
        </TouchableOpacity>

        {/* Functional Requirement: Password Strength Evaluation
            The system shall provide feedback on estimated password crack time. */}
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

        {/* Functional Requirement: Add / Edit / Delete Accounts
            The system shall save new credentials securely to the vault. */}
        <TouchableOpacity style={AddAccountStyles.button} onPress={handleAddAccount}>
          <Text style={AddAccountStyles.buttonText}>Add Account</Text>
        </TouchableOpacity>
      </View>

      {/* Functional Requirement: Master Password Login
          The system shall allow users to register or log in securely. */}
      <Text style={AddAccountStyles.registrationLink}>
        Don't have an account? Register
      </Text>
    </ScrollView>
  );
}
