import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

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
};

interface AccountCardProps {
  item: Password;
}

export default function AccountCard({ item }: AccountCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Account Name: {item.account_name}</Text>
      <Text>Username: {item.account_username}</Text>
      <Text>Encrypted Password: {item.encrypted_pass}</Text>
      <Text>IV: {item.iv}</Text>
      {item.url && <Text>URL: {item.url}</Text>}
      {item.add_date && <Text>Added Date: {item.add_date}</Text>}
      {item.expiry_date && <Text>Expiry Date: {item.expiry_date}</Text>}
      {item.notes && <Text>Notes: {item.notes}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
});
