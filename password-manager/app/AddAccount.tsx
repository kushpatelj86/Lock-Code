import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { AddAccountStyles } from './styles/AddAccountStyles';
import { insertPassword } from '../utils/database'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddAccount() {
  const [description, setDescription] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [url, setURL] = useState('');
  const [add_date, setAddDate] = useState('');
  const [expiry_date, setExpiryDate] = useState('');
  const [notes, setNotes] = useState('');

  const router = useRouter();




    async function handleAddAccount() {


     const encrypted_password = password;
  if (!description || !username || !password || !url || !add_date || !expiry_date) {
    Alert.alert('Error', 'Please fill in all required fields.');
    return;
  }


  const storedUserId = await AsyncStorage.getItem('loggedInUserId');
    if (!storedUserId) {
      Alert.alert('Error', 'No logged in user found.');
      return;
    }

  try {
    const inserted = await insertPassword(
      1,
      description,
      username,
      encrypted_password,
      url,
      add_date,
      expiry_date
    );

    if (inserted.success) {
      Alert.alert('Success', 'Account created!');
    } 
    else {
      Alert.alert('Error', inserted.message);
    }
  } catch (error) {
    console.error(error);
    Alert.alert('Error', 'Something went wrong. Try again.');
  }
}



  return (
    <View style={AddAccountStyles.container}>
      <View style={AddAccountStyles.form}>

        <Text style={AddAccountStyles.label}>URL</Text>
        <TextInput
          value={url}
          onChangeText={setURL}
          style={AddAccountStyles.input}
        />

        <Text style={AddAccountStyles.label}>Description</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          style={AddAccountStyles.input}
        />

        <Text style={AddAccountStyles.label}>Username</Text>
        <TextInput
          value={username}
          onChangeText={setUsername}
          style={AddAccountStyles.input}
        />

        <Text style={AddAccountStyles.label}>Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={AddAccountStyles.input}
        />

        <Text style={AddAccountStyles.label}>Add Date</Text>
        <TextInput
          value={add_date}
          onChangeText={setAddDate}
          style={AddAccountStyles.input}
        />

        <Text style={AddAccountStyles.label}>Expiry Date</Text>
        <TextInput
          value={expiry_date}
          onChangeText={setExpiryDate}
          style={AddAccountStyles.input}
        />


         <Text style={AddAccountStyles.label}>Notes</Text>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          style={AddAccountStyles.input}
        />
      </View>

      <Text style={AddAccountStyles.registrationLink}>Don't have an account? Register</Text>
    </View>
  );
}
