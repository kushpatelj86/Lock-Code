import React from 'react';
import { View, Text } from 'react-native';
import { homescreenstyles } from './styles/HomeScreenStyles';

export default function VaultScreen() {
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={homescreenstyles.title}>Welcome to Vault Screen</Text>
      <Text style={homescreenstyles.subtitle}>
        Here is a list of all your credentials
      </Text>

    </View>
  );
}
