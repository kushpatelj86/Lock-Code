import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './LoginScreen';
import SignUpScreen from './SignUpScreen';
import HomeScreen from './HomeScreen';
import AddAccount from './AddAccount';
import VaultScreen from './VaultScreen';
import { initDatabase } from '../utils/database';

export type RootStackParamList = {
  Login: undefined;
  SignUpScreen: undefined;
  Home: undefined;
  AddAccount: undefined;
  VaultScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();



export default function App() {
  useEffect(() => {
    initDatabase();
  }, []);

  return (
    <NavigationContainer >
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} options={{ title: 'Sign Up' }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AddAccount" component={AddAccount} options={{ title: 'Add Account' }} />
        <Stack.Screen name="VaultScreen" component={VaultScreen} options={{ title: 'Vault Screen' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
