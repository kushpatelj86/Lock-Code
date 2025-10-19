import React from 'react';
import { View, Text } from 'react-native';
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
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Account Name: {item.account_name}</Text>
      <Text>Username: {item.account_username}</Text>
      <Text>Password: {item.decrypted_pass}</Text> 
      {item.url && <Text>URL: {item.url}</Text>}
      {item.add_date && <Text>Added Date: {item.add_date}</Text>}
      {item.expiry_date && <Text>Expiry Date: {item.expiry_date}</Text>}
      {item.notes && <Text>Notes: {item.notes}</Text>}
    </View>
  );
}
