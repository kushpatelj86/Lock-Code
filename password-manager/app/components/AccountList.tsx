import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
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
  crackTime?: string; 
};

interface AccountListProps {
  item: Password;
  onPress?: () => void; 
}

export default function AccountList({ item, onPress }: AccountListProps) {
  const maskedIndicator = '••••••••'; // fixed 8 bullets

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.card}>
      <Text style={styles.title}>User Id: {item.user_id}</Text>
      <Text style={styles.title}>Account Name: {item.account_name}</Text>
      <Text>Username: {item.account_username}</Text>
      <Text>Password: </Text>
      <Text selectable={false} >
        {item.decrypted_pass ? maskedIndicator : 'Unavailable'}
      </Text>
      {item.crackTime && (
        <Text style={{ color: 'green', marginTop: 2 }}>
          Estimated crack time: {item.crackTime}
        </Text>
      )}
      <Text>Name: {item.account_name}</Text>
      <Text>URL: {item.url}</Text>
      <Text>Add Date: {item.add_date}</Text>
      <Text>Expiry Date: {item.expiry_date}</Text>
      <Text>Notes: {item.notes}</Text>

    </TouchableOpacity>
  );
}
