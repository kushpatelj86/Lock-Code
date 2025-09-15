import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack initialRouteName="LoginScreen">
      <Stack.Screen name="LoginScreen" options={{ headerShown: false, title : 'Login' }} />
      <Stack.Screen name="AddAccount" options={{ title: 'Add Account' }} />
      <Stack.Screen name="Home" options={{ title: 'Home' }} />
    </Stack>
  );
}
