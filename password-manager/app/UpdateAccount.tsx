import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Alert, ScrollView, TouchableWithoutFeedback, Keyboard, TextInput, Button } from 'react-native';
import { homescreenstyles } from './styles/HomeScreenStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { retrievePassword, updateUsername, updatePassword, updateName, updateAddDate,updateExpiryDate ,updateNotes, updateURL} from '../utils/database';
import { decrypt } from '../utils/encryption'; 
import SearchBar from './components/SearchBar';
import { estimateCrackTime, formatYears } from './components/PasswordStrength';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './App';
import { generateRandomPassword } from './components/PasswordGenerator';
import AccountList from './components/AccountList';

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

const AUTO_LOGOUT_MS = 600000; // 10 minutes

export default function UpdateAccount() {
  const navigation = useNavigation<VaultScreenNavigationProp>();
  const timerRef = useRef<number | null>(null);

  const [passwords, setPasswords] = useState<Password[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPasswords, setFilteredPasswords] = useState<Password[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Password | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newName, setNewName] = useState('');
  const [newURL, setNewURL] = useState('');
  const [newAddDate, setNewAddDate] = useState('');
  const [newExpiryDate, setNewExpiryDate] = useState('');
  const [newNotes, setNewNotes] = useState('');

  // Auto logout
  async function handleLogout(auto = false) {
    try {
      await AsyncStorage.removeItem('loggedInUser');
      await AsyncStorage.removeItem('loggedInUserId');

      Alert.alert(auto ? 'Session expired' : 'Logged out', auto ? 'You were logged out due to inactivity.' : 'You have been logged out successfully.');

      navigation.replace('LoginScreen');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  }

  function resetTimer() {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => handleLogout(true), AUTO_LOGOUT_MS);
  }

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Load passwords
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

        const passwords = result.data as Password[]

        for (const item of passwords) {
          try {
            const decrypted_pass = await decrypt(item.encrypted_pass, item.iv);
            let crackTime = '';

            if (decrypted_pass) {
              const estimated = estimateCrackTime(decrypted_pass);
              crackTime = formatYears(estimated.years);
            }

            if (item.expiry_date) {
              const currentDate = new Date();
              const expiryDate = new Date(item.expiry_date);

              if (currentDate > expiryDate) {
                Alert.alert('Password Expired', `The password for "${item.account_name}" has expired. Generating a new password.`);
                const newPass = generateRandomPassword();
                await updatePassword(item.user_id, item.password_id, newPass);
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
    setNewName('');
  }

  // Update handlers
  async function handleUpdatePassword() {
    if (!newPassword || !selectedAccount) {
      Alert.alert('Error', 'Please select an account and enter a new password.');
      return;
    }

    const storedUserId = Number(await AsyncStorage.getItem('loggedInUserId'));

    try {
      const result = await updatePassword(storedUserId, selectedAccount.password_id, newPassword);
      if (result.success) {
        const updatedPasswords = [...passwords]; 
        for (let i = 0; i < updatedPasswords.length; i++) 
        {
          if (updatedPasswords[i].password_id === selectedAccount.password_id) {
            updatedPasswords[i] = {...updatedPasswords[i],encrypted_pass: newPassword,decrypted_pass: newPassword };
            break; 
          }
        }

        setPasswords(updatedPasswords);
        Alert.alert('Success', 'Password updated!');
        setNewPassword('');
      }

      else {
        Alert.alert('Error', result.message || 'Update failed.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong. Try again.');
    }
  }

  async function handleUpdateUsername() {
    if (!newUsername || !selectedAccount) {
      Alert.alert('Error', 'Please select an account and enter a new username.');
      return;
    }

    const storedUserId = Number(await AsyncStorage.getItem('loggedInUserId'));

    try {
      const result = await updateUsername(storedUserId, selectedAccount.password_id, newUsername);
       if (result.success) {
        const updatedPasswords = [...passwords]; 
        for (let i = 0; i < updatedPasswords.length; i++) 
        {
          if (updatedPasswords[i].password_id === selectedAccount.password_id) {
            updatedPasswords[i] = {...updatedPasswords[i],encrypted_pass: newPassword,decrypted_pass: newPassword };
            break; 
          }
        }

        setPasswords(updatedPasswords);
        Alert.alert('Success', 'Password updated!');
        setNewPassword('');
      }
      else {
        Alert.alert('Error', result.message || 'Update failed.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong. Try again.');
    }
  }

  async function handleUpdateName() {
    if (!newName || !selectedAccount) {
      Alert.alert('Error', 'Please select an account and enter a new name.');
      return;
    }

    const storedUserId = Number(await AsyncStorage.getItem('loggedInUserId'));

    try {
      const result = await updateName(storedUserId,selectedAccount.password_id, newName);
       if (result.success) {
        const updatedPasswords = [...passwords]; 
        for (let i = 0; i < updatedPasswords.length; i++) 
        {
          if (updatedPasswords[i].password_id === selectedAccount.password_id) {
            updatedPasswords[i] = {...updatedPasswords[i],encrypted_pass: newPassword,decrypted_pass: newPassword };
            break; 
          }
        }

        setPasswords(updatedPasswords);
        Alert.alert('Success', 'Password updated!');
        setNewPassword('');
      }
      else {
        Alert.alert('Error', result.message || 'Update failed.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong. Try again.');
    }
  }



  async function handleUpdateURL() {
    if (!newURL || !selectedAccount) {
      Alert.alert('Error', 'Please select an account and enter a new name.');
      return;
    }

    const storedUserId = Number(await AsyncStorage.getItem('loggedInUserId'));

    try {
      const result = await updateURL(storedUserId,selectedAccount.password_id, newURL);
       if (result.success) {
        const updatedPasswords = [...passwords]; 
        for (let i = 0; i < updatedPasswords.length; i++) 
        {
          if (updatedPasswords[i].password_id === selectedAccount.password_id) {
            updatedPasswords[i] = {...updatedPasswords[i],encrypted_pass: newPassword,decrypted_pass: newPassword };
            break; 
          }
        }

        setPasswords(updatedPasswords);
        Alert.alert('Success', 'Password updated!');
        setNewPassword('');
      }
      else {
        Alert.alert('Error', result.message || 'Update failed.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong. Try again.');
    }
  }



   async function handleUpdateNotes() {
    if (!newNotes || !selectedAccount) {
      Alert.alert('Error', 'Please select an account and enter a new name.');
      return;
    }

    const storedUserId = Number(await AsyncStorage.getItem('loggedInUserId'));

    try {
      const result = await updateNotes(storedUserId,selectedAccount.password_id, newNotes);
       if (result.success) {
        const updatedPasswords = [...passwords]; 
        for (let i = 0; i < updatedPasswords.length; i++) 
        {
          if (updatedPasswords[i].password_id === selectedAccount.password_id) {
            updatedPasswords[i] = {...updatedPasswords[i],encrypted_pass: newPassword,decrypted_pass: newPassword };
            break; 
          }
        }

        setPasswords(updatedPasswords);
        Alert.alert('Success', 'Password updated!');
        setNewPassword('');
      }
      else {
        Alert.alert('Error', result.message || 'Update failed.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong. Try again.');
    }
  }






  // Search filter
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPasswords(passwords);
    } 
    else {
      const query = searchQuery.toLowerCase();
      setFilteredPasswords(
        passwords.filter(
          p =>
            p.account_name?.toLowerCase().includes(query) ||
            p.account_username?.toLowerCase().includes(query) ||
            p.decrypted_pass?.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, passwords]);

  function handleClear() {
    setSearchQuery('');
    setFilteredPasswords(passwords);
  }

  return (
    <TouchableWithoutFeedback
      onPress={(event) => {
        const target = event.target as any;
        const isTextInput = target && target._internalFiberInstanceHandleDEV?.type === TextInput;
        if (!isTextInput) {
          Keyboard.dismiss();
          resetTimer();
        }
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
          onClear={handleClear}
          placeholder="Search accounts..."
        />

        <ScrollView style={{ marginBottom: 20 }}>
          {filteredPasswords.length > 0 ? (
            filteredPasswords.map((item) => (
              <AccountList
                key={item.password_id}
                item={item}
                onPress={() => handleSelectAccount(item)}
              />
            ))
          ) : (
            <Text>No results found</Text>
          )}
        </ScrollView>

        {selectedAccount && (
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontWeight: 'bold' }}>
              Selected: {selectedAccount.account_name}
            </Text>

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

            <Text style={{ marginTop: 15 }}>Update Account Name</Text>
            <TextInput
              value={newName}
              onChangeText={setNewName}
              placeholder="Enter new account name"
            />
            <Button title="Update Account Name" onPress={handleUpdateName} />


             <Text style={{ marginTop: 15 }}>Update URL</Text>
            <TextInput
              value={newURL}
              onChangeText={setNewURL}
              placeholder="Enter new URL"
            />
            <Button title="Update URL" onPress={handleUpdateURL} />
       
          <Text style={{ marginTop: 15 }}>Update Notes</Text>
            <TextInput
              value={newNotes}
              onChangeText={setNewNotes}
              placeholder="Enter new notes"
            />
            <Button title="Update Notes" onPress={handleUpdateNotes} />
       
       
          </View>

        )}
      </View>
    </TouchableWithoutFeedback>
  );
}
