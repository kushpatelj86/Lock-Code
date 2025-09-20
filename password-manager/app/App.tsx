import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './LoginScreen';
import AddAccount from './AddAccount';
import VaultScreen from './VaultScreen';
import SignUp from './SignUpScreen';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  AddAccount: undefined;
  VaultScreen: undefined;
  SignUp: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const linking = {
  prefixes: ['http://localhost:8081'],
  config: {
    screens: {
      Login: '',
      Home: 'home',
      AddAccount: 'add-account',
      VaultScreen: 'vault-screen',
      SignUp: 'sign-up',
    },
  },
};

export default function App() {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="SignUp" 
          component={SignUp}
          options={{ title: 'Sign Up' }}
        />

        <Stack.Screen
          name="AddAccount"
          component={AddAccount}
          options={{ title: 'Add Account' }}
        />

        <Stack.Screen
          name="VaultScreen"
          component={VaultScreen}
          options={{ title: 'Vault Screen' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
