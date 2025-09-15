import {Stack} from "expo-router"
import LoginScreen from './components/screens/LoginScreen';
import VaultScreen from './components/screens/VaultScreen';
import AddPasswordScreen from './components/screens/AddPasswordScreen';
export default function TabLayout() {

  return (
    <Stack>
      <Stack.Screen name="Vault" component={LoginScreen} />
    </Stack>
  );
}
