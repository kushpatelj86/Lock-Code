import React, { useEffect, useState } from 'react';
import { View, Text, Alert, ScrollView } from 'react-native';
import { homescreenstyles } from './styles/HomeScreenStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { retrievePassword } from '../utils/database';
import { decrypt } from '../utils/encryption'; 
import SearchBar from './components/SearchBar';
import AccountCard from './components/AccountCard';
import { estimateCrackTime, formatYears } from './components/PasswordStrength';

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
  crackTime?: string; // new optional property
};

export default function VaultScreen() {
  const [passwords, setPasswords] = useState<Password[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPasswords, setFilteredPasswords] = useState<Password[]>([]);

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

      if (result.success && result.data) {
        const decryptedData: Password[] = await Promise.all(
          (result.data as Password[]).map(async (item) => {
            try {
              const decrypted_pass = await decrypt(item.encrypted_pass, item.iv);
              const crackTime = decrypted_pass
                ? formatYears(estimateCrackTime(decrypted_pass).years)
                : '';
              return { ...item, decrypted_pass, crackTime };
            } catch (err) {
              console.error('Failed to decrypt password for', item.account_name, err);
              return { ...item, decrypted_pass: 'Error decrypting', crackTime: '' };
            }
          })
        );

        setPasswords(decryptedData);
        setFilteredPasswords(decryptedData);
      } else {
        Alert.alert('Info', result.message || 'No passwords found.');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to load passwords.');
    }
  }

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPasswords(passwords);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = passwords.filter((p) => {
        const nameMatch = p.account_name?.toLowerCase().includes(query);
        const usernameMatch = p.account_username?.toLowerCase().includes(query);
        const decryptedMatch = p.decrypted_pass?.toLowerCase().includes(query);
        return nameMatch || usernameMatch || decryptedMatch;
      });
      setFilteredPasswords(filtered);
    }
  }, [searchQuery, passwords]);

  function handleClear() {
    setSearchQuery('');
    setFilteredPasswords(passwords);
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={homescreenstyles.title}>Welcome to Vault Screen</Text>
      <Text style={homescreenstyles.subtitle}>
        Here is a list of all your credentials
      </Text>

      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        onClear={handleClear}
        placeholder="Search accounts..."
      />

      <ScrollView>
        {filteredPasswords.length > 0 ? (
          filteredPasswords.map((item) => (
            <AccountCard key={item.password_id} item={item} />
          ))
        ) : (
          <Text>No results found</Text>
        )}
      </ScrollView>
    </View>
  );
}
