import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { AddAccountStyles } from './styles/AddAccountStyles';
import { insertPassword } from '../utils/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddAccount() {
  // Functional Requirement: Users can add new account credentials
  // State variables store the user’s input for account details
  const [description, setDescription] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [url, setURL] = useState('');
  const [add_date, setAddDate] = useState('');
  const [expiry_date, setExpiryDate] = useState('');
  const [notes, setNotes] = useState('');

  const router = useRouter();

  // Functional Requirement: Handles adding new credentials securely
  async function handleAddAccount() {
    // Functional Requirement: Error handling and validation
    // Precondition: All required fields (marked with *) must be filled
    if (!description || !username || !password || !add_date || !expiry_date) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    // Functional Requirement: Vault access requires authentication
    // Retrieves the logged-in user’s ID from AsyncStorage for database linkage
    const storedUserId = await AsyncStorage.getItem('loggedInUserId');
    if (!storedUserId) {
      Alert.alert('Error', 'No logged in user found.');
      return;
    }

    // Functional Requirement: Encryption
    // In the final version, password should be encrypted using AES-256 before storage
    const encrypted_password = password; // placeholder for encryption logic

    try {
      // Functional Requirement: Add Account
      // Postcondition: Account information securely stored in the encrypted SQLite database
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
        // Functional Requirement: Confirmation message
        Alert.alert('Success', 'Account created!');

        // Reset input fields after successful insertion
        setDescription('');
        setUsername('');
        setPassword('');
        setURL('');
        setAddDate('');
        setExpiryDate('');
        setNotes('');
        
      } else {
        // Functional Requirement: Error Handling
        Alert.alert('Error', inserted.message);
      }
    } catch (error) {
      // Functional Requirement: System feedback on failure
      console.error(error);
      Alert.alert('Error', 'Something went wrong. Try again.');
    }
  }

  return (
    // Functional Requirement: Add Account Screen
    // Precondition: User is on the Home Page and selects “Add Account”
    // Postcondition: System displays the Add Account screen ready for input
    <ScrollView contentContainerStyle={AddAccountStyles.container}>
      <View style={AddAccountStyles.form}>

        {/* Optional field for a website or app URL */}
        <Text style={AddAccountStyles.label}>URL (optional)</Text>
        <TextInput
          value={url}
          onChangeText={setURL}
          style={AddAccountStyles.input}
        />

        {/* Required description field */}
        {/* Functional Requirement: Description is mandatory for identification */}
        <Text style={AddAccountStyles.label}>Description *</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          style={AddAccountStyles.input}
        />

        {/* Required username field */}
        {/* Functional Requirement: Username input */}
        <Text style={AddAccountStyles.label}>Username *</Text>
        <TextInput
          value={username}
          onChangeText={setUsername}
          style={AddAccountStyles.input}
        />

        {/* Required password field */}
        {/* Functional Requirement: Password input (secure text entry) */}
        <Text style={AddAccountStyles.label}>Password *</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={AddAccountStyles.input}
        />

        {/* Required Add Date */}
        {/* Functional Requirement: Add Date for account tracking */}
        <Text style={AddAccountStyles.label}>Add Date *</Text>
        <TextInput
          value={add_date}
          onChangeText={setAddDate}
          style={AddAccountStyles.input}
        />

        {/* Required Expiry Date */}
        {/* Functional Requirement: Expiry Date to remind users when to rotate passwords */}
        <Text style={AddAccountStyles.label}>Expiry Date *</Text>
        <TextInput
          value={expiry_date}
          onChangeText={setExpiryDate}
          style={AddAccountStyles.input}
        />

        {/* Optional Notes */}
        {/* Functional Requirement: Notes for storing additional account details */}
        <Text style={AddAccountStyles.label}>Notes (optional)</Text>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          style={AddAccountStyles.input}
        />

        {/* Button to submit new account details */}
        {/* Functional Requirement: If the User clicks “Add Account,” the system shall save credentials */}
        <TouchableOpacity
          style={AddAccountStyles.button}
          onPress={handleAddAccount}
        >
          <Text style={AddAccountStyles.buttonText}>Add Account</Text>
        </TouchableOpacity>
      </View>

      {/* Registration link for users who haven’t signed up yet */}
      {/* Functional Requirement: If User doesn’t have an account, prompt to create one */}
      <Text style={AddAccountStyles.registrationLink}>Don't have an account? Register</Text>
    </ScrollView>
  );
}
