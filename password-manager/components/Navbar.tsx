import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { styles } from '../styles/NavBarStyling'; // adjust path if needed

export default function Navbar() {
  const router = useRouter();

  return (
    <View style={styles.navbar}>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/HomeScreen')}>
        <Text style={styles.buttonText}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/AddAccount')}>
        <Text style={styles.buttonText}>Add Account</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/Vault')}>
        <Text style={styles.buttonText}>Vault</Text>
      </TouchableOpacity>
    </View>
  );
}
