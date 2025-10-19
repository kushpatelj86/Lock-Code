import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { styles } from './styles/AccountCardStyling';

type Password = {
  password_id: number;
  user_id: number;
  account_name: string;
  account_username: string;
  encrypted_pass: string;
  iv: string;
  url?: string;
  add_date?: string;
  expiry_date?: string;
  notes?: string;
  decrypted_pass?: string;
};

interface AccountCardProps {
  item: Password;
}

export default function AccountCard({ item }: AccountCardProps) {
  const copyToClipboard = async (text?: string) => {
    if (!text) {
      Alert.alert('Error', 'No password available to copy.');
      return;
    }

    try {
      await Clipboard.setStringAsync(text);
      Alert.alert('Copied!', 'Password copied to clipboard.');

      setTimeout(async () => {
        try {
          await Clipboard.setStringAsync('');
          console.log('Clipboard cleared after 30 seconds for security.');
        } catch (err) {
          console.warn('Failed to clear clipboard:', err);
        }
      }, 30000);
    } catch (err) {
      console.error('Clipboard copy failed:', err);
      Alert.alert('Error', 'Failed to copy password.');
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Account Name: {item.account_name}</Text>
      <Text>Username: {item.account_username}</Text>
      <Text>Password: {item.decrypted_pass || 'Unavailable'}</Text>

      {item.url && <Text>URL: {item.url}</Text>}
      {item.add_date && <Text>Added: {item.add_date}</Text>}
      {item.expiry_date && <Text>Expires: {item.expiry_date}</Text>}
      {item.notes && <Text>Notes: {item.notes}</Text>}

      <TouchableOpacity
        onPress={() => copyToClipboard(item.decrypted_pass)}
        style={{
          backgroundColor: '#007AFF',
          paddingVertical: 8,
          paddingHorizontal: 12,
          borderRadius: 8,
          marginTop: 10,
          alignSelf: 'flex-start',
        }}
      >
        <Text style={{ color: '#fff', fontWeight: '600' }}>Copy Password</Text>
      </TouchableOpacity>
    </View>
  );
}
