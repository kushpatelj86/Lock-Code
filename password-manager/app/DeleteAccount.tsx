import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Alert, ScrollView, TouchableWithoutFeedback, Keyboard, TextInput, Button } from 'react-native';
import { homescreenstyles } from './styles/HomeScreenStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { retrievePassword, updatePassword ,deletePassword} from '../utils/database';
import { decrypt } from '../utils/encryption'; 
import SearchBar from './components/SearchBar';
import { estimateCrackTime, formatYears } from './components/PasswordStrength';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './App';
import { generateRandomPassword } from './components/PasswordGenerator';
import AccountList from './components/AccountList';
import { DeleteAccountStyles } from './styles/DeleteAccountStyles';
import DeleteAccountForm from './components/DeleteAccountForm';
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

// Functional Requirement: Automatic Logout
// Automatically logs out user after 5 minutes of inactivity

const AUTO_LOGOUT_MS = 5 * 60 * 1000;

export default function DeleteAccount() {

  const navigation = useNavigation<VaultScreenNavigationProp>();
  const timerRef = useRef<number | null>(null);

  const [passwords, setPasswords] = useState<Password[]>([]);
  const [filteredPasswords, setFilteredPasswords] = useState<Password[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<Password | null>(null);
  const [newPassword, setNewPassword] = useState('');



// Auto logout
  async function handleLogout(auto = false) {
    try {
      await AsyncStorage.removeItem('loggedInUser');
      await AsyncStorage.removeItem('loggedInUserId');

      if (auto) {
        Alert.alert('Session expired','You were logged out due to inactivity.');
      } 
      else {
        Alert.alert('Logged out','You have been logged out successfully.' );
      }
      navigation.replace('LoginScreen');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  }

  function resetTimer() {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => handleLogout(true), AUTO_LOGOUT_MS);
  }


   useEffect(() => {
      resetTimer();
      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    }, []);
  
    // Functional Requirement: Secure Storage & Encryption
    // Retrieve passwords from the encrypted vault
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
            // Functional Requirement: Decryption
            // Decrypt AES-256 encrypted passwords for display
            const decrypted_pass = await decrypt(item.encrypted_pass, item.iv);


            // Functional Requirement: Password Strength Evaluation
            // Estimate password crack time

            let crackTime = '';

            if (decrypted_pass) {
              const estimated = estimateCrackTime(decrypted_pass);
              crackTime = formatYears(estimated.years);
            }

            // Check password expiry and regenerate if needed
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


  // Functional Requirement: Account Selection
  // Select an account entry from the vault

  async function handleSelectAccount(account: Password) {
    setSelectedAccount(account);
    
  }
  // Functional Requirement: Search / Filter Accounts
  // Filter results by account name, username, or password
  useEffect(() => {
      if (searchQuery.trim() === '') {
        setFilteredPasswords(passwords);
      } 
      else {
        const query = searchQuery.toLowerCase();
        const password_list = []
        for(let i = 0; i < passwords.length;i++)
        {
          const p = passwords[i];
          let accountName = "";
          if (p.account_name) {
            accountName = p.account_name.toLowerCase();
          }

          let username = "";
          if (p.account_username) {
            username = p.account_username.toLowerCase();
          }

          let password = "";
          if (p.decrypted_pass) {
            password = p.decrypted_pass.toLowerCase();
          }
          if (accountName.includes(query) || username.includes(query) || password.includes(query))
          {
            password_list.push(p);

          }
        }
        setFilteredPasswords(password_list);

      }
    }, [searchQuery, passwords]);


    function handleClear() {
    setSearchQuery('');
    setFilteredPasswords(passwords);
  }

   // Functional Requirement: Delete Account
   // Allows user to delete a selected account from the vault

    async function handleDeletePassword() {

      if (!selectedAccount) {
        Alert.alert('Error', 'Please select an account and enter a new username.');
        return;
      }

      const storedUserId = Number(await AsyncStorage.getItem('loggedInUserId'));
      try {
            const result = await deletePassword(storedUserId, selectedAccount.password_id);
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

    return (
        <TouchableWithoutFeedback
          onPress={(event) => {
            const target = event.target as any;
            let isTextInput = false;

            if (target && target._internalFiberInstanceHandleDEV?.type === TextInput) {
              isTextInput = true;
            }    
            else
            {
              isTextInput = false;
            }        
            if (!isTextInput) {
              Keyboard.dismiss();
              resetTimer();
            }
          }}
        >
          <View style={DeleteAccountStyles.container}>
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
    
            <ScrollView style={DeleteAccountStyles.scroll}>
            {(() => {
              const accountItems = [];
              if (filteredPasswords.length > 0) {
                for (let i = 0; i < filteredPasswords.length; i++) {
                  const item = filteredPasswords[i];
                  accountItems.push(
                    <AccountList
                      key={item.password_id}
                      item={item}
                      onPress={() => handleSelectAccount(item)}
                    />
                  );
                }
                return accountItems;
              } 
              else {
                return <Text>No results found</Text>;
              }
            })()}
          </ScrollView>

            <DeleteAccountForm selectedAccount={selectedAccount} handleDeletePassword={handleDeletePassword}/> 
            
          </View>
        </TouchableWithoutFeedback>
      );



}
