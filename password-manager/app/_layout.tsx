import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack initialRouteName="LoginScreen">
      <Stack.Screen name="LoginScreen" options={{ headerShown: false, title : 'Login' }} />
      <Stack.Screen name="AddAccount" options={{ title: 'Add Account' }} />
      <Stack.Screen name="HomeScreen" options={{ title: 'Home' }} />
      <Stack.Screen name="DeleteAccount" options={{ title: 'Delete Account' }} />
      <Stack.Screen name="VaultScreen" options={{ title: 'Vault Screen' }} />
      <Stack.Screen name="UpdateAccount" options={{ title: 'Update Account' }} />
    </Stack>
  );
}
