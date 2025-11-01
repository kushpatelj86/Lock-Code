import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Alert, ScrollView, TouchableWithoutFeedback, Keyboard, TextInput, Button } from 'react-native';
import { homescreenstyles } from './styles/HomeScreenStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { retrievePassword, updateUsername,updatePassword } from '../utils/database';
import { decrypt } from '../utils/encryption'; 
import SearchBar from './components/SearchBar';
import { estimateCrackTime, formatYears } from './components/PasswordStrength';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './App';
import {generateRandomPassword} from './components/PasswordGenerator';
import AccountList from './components/AccountList';

// VaultScreen navigation type
type VaultScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'VaultScreen'>;

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

// Auto logout timeout in milliseconds
const AUTO_LOGOUT_MS = 10000; // 10 seconds, adjust as needed

export default function UpdateAccount() {
  const navigation = useNavigation<VaultScreenNavigationProp>();
  const timerRef = useRef<number | null>(null);

  const [passwords, setPasswords] = useState<Password[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPasswords, setFilteredPasswords] = useState<Password[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Password | null>(null);

    const [newPassword, setNewPassword] = useState('');

    const [newUsername, setNewUsername] = useState('');

  // Logout function
  async function handleLogout(auto = false) {
    try {
      await AsyncStorage.removeItem('loggedInUser');
      await AsyncStorage.removeItem('loggedInUserId');

      if (auto) {
        Alert.alert('Session expired', 'You were logged out due to inactivity.');
      } 
      else {
        Alert.alert('Logged out', 'You have been logged out successfully.');
      }

      navigation.replace('LoginScreen');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  }

  // Reset the auto-logout timer
  function resetTimer() {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() =>
       handleLogout(true)
    
    , AUTO_LOGOUT_MS);
  }

  // Start timer on mount
  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current){ 
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Load passwords from DB
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
          const decryptedData: Password[] = [];
          for (const item of result.data as Password[]) {
            try {
              const decrypted_pass = await decrypt(item.encrypted_pass, item.iv);
              let crackTime = '';

              if (decrypted_pass) 
              {
                const estimated = estimateCrackTime(decrypted_pass);
                crackTime = formatYears(estimated.years);
              }
              if (item.expiry_date) {
                const currentDate = new Date();

                const expiryDate = new Date(item.expiry_date);

                if(currentDate > expiryDate)
                {
                  Alert.alert(
                    'Password Expired',
                    `The password for "${item.password_id}" has expired. Please update it.`
  
                  );

                  const newPassword = generateRandomPassword();
                  updatePassword(item.user_id,newPassword);
                }
              }



              decryptedData.push({ ...item, decrypted_pass, crackTime });

            } catch (error) {
              console.error('Failed to decrypt password for', item.account_name, error);
              decryptedData.push({ ...item, decrypted_pass: 'Error decrypting', crackTime: '' });
            }
            
            


          }


        setPasswords(decryptedData);
        setFilteredPasswords(decryptedData);
      } 
      else {
        Alert.alert('Info', result.message || 'No passwords found.');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to load passwords.');
    }
  }


    async function handleSelectAccount(account: Password) {
      setSelectedAccount(account);
      setNewPassword('');
      setNewUsername('');
  }


  async function handleUpdatePassword() {
    if (!newPassword ) 
    {
      Alert.alert('Error', 'Please fill in the required field.');
      return;
    }

    const storedUserId = await AsyncStorage.getItem('loggedInUserId');
    if (!storedUserId) 
    {
      Alert.alert('Error', 'No logged in user found.');
      return;
    }

     try {
          const inserted = await updatePassword(
            Number(storedUserId),
           newPassword
         );

         if (inserted.success) 
         {
            Alert.alert('Success', 'Account created!');
            setNewPassword('');
          
         } 
        else 
        {
          Alert.alert('Error', inserted.message);
        }
  }
  catch(error){
     console.error(error);
     Alert.alert('Error', 'Something went wrong. Try again.');
  }



  }





  async function handleUpdateUsername() {
    if (!newUsername ) 
    {
      Alert.alert('Error', 'Please fill in the required field.');
      return;
    }

    const storedUserId = await AsyncStorage.getItem('loggedInUserId');
    if (!storedUserId) 
    {
      Alert.alert('Error', 'No logged in user found.');
      return;
    }

     try {
          const inserted = await updateUsername(
            Number(storedUserId),
           newUsername
         );

         if (inserted.success) 
         {
            Alert.alert('Success', 'Account created!');
            setNewPassword('');
          
         } 
        else 
        {
          Alert.alert('Error', inserted.message);
        }
  }
  catch(error){
     console.error(error);
     Alert.alert('Error', 'Something went wrong. Try again.');
  }



  }


  // Filter passwords based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPasswords(passwords);
    } 
    else {
        const query = searchQuery.toLowerCase();
        const filtered = passwords.filter((p) => {
        const nameMatch = p.account_name?.toLowerCase().includes(query);
        const usernameMatch = p.account_username?.toLowerCase().includes(query);
        const decryptedMatch = p.decrypted_pass?.toLowerCase().includes(query);
        if(nameMatch || usernameMatch || decryptedMatch)
        {
          return true;
        }
        else
        {
          return false;
        }
      });
      setFilteredPasswords(filtered);
    }
  }, [searchQuery, passwords]);

  function handleClear() {
    setSearchQuery('');
    setFilteredPasswords(passwords);
  }

  // Wrap the screen in a touchable to detect interactions and reset timer
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
        resetTimer();
      }}
    >
      <View style={{ flex: 1, padding: 20 }}>
        <Text style={homescreenstyles.title}>Update Account</Text>

        <SearchBar
          value={searchQuery}
          onChange={(text) => {
            setSearchQuery(text);
            resetTimer();
          }}
          onClear={() => setSearchQuery('')}
          placeholder="Search accounts..."
        />

        <ScrollView style={{ marginBottom: 20 }}>
          {filteredPasswords.length > 0 ? (
            filteredPasswords.map((item) => (
              <AccountList key={item.password_id} item={item} onPress={() => handleSelectAccount(item)} />
            ))
          ) : (
            <Text>No results found</Text>
          )}
        </ScrollView>

        {selectedAccount && (
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontWeight: 'bold' }}>Selected: {selectedAccount.account_name}</Text>

            <Text>Update Password</Text>
            <TextInput
              value={newPassword}
              onChangeText={setNewPassword}
              
              placeholder="Enter new password"
            />
            <Button title="Update Password" onPress={handleUpdatePassword} />

            <Text style={{ marginTop: 15 }}>Update Username</Text>
            <TextInput
              value={newUsername}
              onChangeText={setNewUsername}
              
              placeholder="Enter new username"
            />
            <Button title="Update Username" onPress={handleUpdateUsername} />

            
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}