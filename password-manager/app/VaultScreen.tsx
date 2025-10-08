import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { homescreenstyles } from './styles/HomeScreenStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { retrievePassword } from '../utils/database';

type Password = {
  id: number;
  user_id: number;
  account: string;
  password: string;
};

export default function VaultScreen() {
  const [passwords, setPasswords] = useState<Password[]>([]);

  useEffect(() => {
    getPasswords();
  }, []);

async function getPasswords() {
    try {
      const storedUserId = await AsyncStorage.getItem('loggedInUserId');
      if (!storedUserId) {
        Alert.alert('Error', 'No logged in user found.');
        return;
      }

      const result = await retrievePassword(Number(storedUserId));

      if (result.success) {
        if(result.data)
        {
        setPasswords(result.data as Password[]);

        }
      } 
      else {
        Alert.alert('Info', result.message || 'No passwords found.');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to load passwords.');
    }
  }






  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={homescreenstyles.title}>Welcome to Vault Screen</Text>
      <Text style={homescreenstyles.subtitle}>
        Here is a list of all your credentials
      </Text>

    </View>
  );
}
