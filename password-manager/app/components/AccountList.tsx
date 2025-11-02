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

      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
        <Text style={{ fontWeight: 'bold' }}>Password: </Text>
        <Text selectable={false} style={{ color: '#333', marginRight: 10 }}>
          {item.decrypted_pass ? maskedIndicator : 'Unavailable'}
        </Text>
      </View>

      {item.crackTime && (
        <Text style={{ color: 'green', marginTop: 2 }}>
          Estimated crack time: {item.crackTime}
        </Text>
      )}

      {item.url && <Text>URL: {item.url}</Text>}
      {item.add_date && <Text>Added: {item.add_date}</Text>}
      {item.expiry_date && <Text>Expires: {item.expiry_date}</Text>}
      {item.notes && <Text>Notes: {item.notes}</Text>}
    </TouchableOpacity>
  );
}
