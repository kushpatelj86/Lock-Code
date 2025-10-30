import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../LoginScreen';
import SignUpScreen from '../SignUpScreen';
import AddAccount from '../AddAccount';
import UpdateAccount from '../UpdateAccount';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignUpScreen} />
      <Stack.Screen name="AddAccount" component={AddAccount} />
      <Stack.Screen name="UpdateAccount" component={UpdateAccount} />

    </Stack.Navigator>
  );
}
