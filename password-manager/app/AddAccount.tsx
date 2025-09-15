import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { loginStyles } from './styles/LoginStyles';

export default function AddAccount() {
  const [description, setDescription] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [url, setURL] = useState('');
  const [add_date, setAddDate] = useState('');
  const [expiry_date, setExpiryDate] = useState('');

  const router = useRouter();

  return (
    <View style={loginStyles.container}>
      <View style={loginStyles.form}>

        <Text style={loginStyles.label}>URL</Text>
        <TextInput
          value={url}
          onChangeText={setURL}
          style={loginStyles.input}
        />

        <Text style={loginStyles.label}>Description</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          style={loginStyles.input}
        />

        <Text style={loginStyles.label}>Username</Text>
        <TextInput
          value={username}
          onChangeText={setUsername}
          style={loginStyles.input}
        />

        <Text style={loginStyles.label}>Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={loginStyles.input}
        />

        <Text style={loginStyles.label}>Add Date</Text>
        <TextInput
          value={add_date}
          onChangeText={setAddDate}
          style={loginStyles.input}
        />

        <Text style={loginStyles.label}>Expiry Date</Text>
        <TextInput
          value={expiry_date}
          onChangeText={setExpiryDate}
          style={loginStyles.input}
        />

       

      </View>

      <Text style={loginStyles.registrationLink}>Don't have an account? Register</Text>
    </View>
  );
}
