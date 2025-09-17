import React from 'react';
import { View, Text } from 'react-native';
import Navbar from '../components/NavBar'
import { homescreenstyles } from './styles/HomeScreenStyles';

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={homescreenstyles.title}>Welcome to Lock Code</Text>
      <Text style={homescreenstyles.subtitle}>
        This is the place where you store all your information regarding user credentials.
      </Text>

      <Navbar />
    </View>
  );
}
