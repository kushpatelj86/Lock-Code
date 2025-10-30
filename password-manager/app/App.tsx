import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './LoginScreen';
import SignUpScreen from './SignUpScreen';
import HomeScreen from './HomeScreen';
import AddAccount from './AddAccount';
import VaultScreen from './VaultScreen';
import { initDatabase } from '../utils/database';
import UpdateAccount from './UpdateAccount';

export type RootStackParamList = {
  LoginScreen: undefined;
  SignUpScreen: undefined;
  HomeScreen: undefined;
  AddAccount: undefined;
  VaultScreen: undefined;
  UpdateAccount: undefined;

};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  useEffect(() => {
    initDatabase();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="LoginScreen"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="LoginScreen" component={LoginScreen} />

        <Stack.Screen
          name="SignUpScreen"
          component={SignUpScreen}
          options={{ headerShown: true, title: 'Sign Up' }}
        />

        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{ headerShown: true, title: 'Home' }}
        />

        <Stack.Screen
          name="AddAccount"
          component={AddAccount}
          options={{ headerShown: true, title: 'Add Account' }}
        />

        <Stack.Screen
          name="UpdateAccount"
          component={UpdateAccount}
          options={{ headerShown: true, title: 'Update Account' }}
        />

        <Stack.Screen
          name="VaultScreen"
          component={VaultScreen}
          options={{ headerShown: true, title: 'Vault' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}