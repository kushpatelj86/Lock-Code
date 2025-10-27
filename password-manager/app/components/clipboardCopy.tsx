import { Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';

export async function copyToClipboard(text?: string) {
  if (!text) {
    Alert.alert('Error', 'No password available to copy.');
    return;
  }

  try {
    await Clipboard.setStringAsync(text);
    Alert.alert('Copied!', 'Password copied to clipboard.');

    // Clear clipboard after 30 seconds
    setTimeout(async () => {
      try {
        await Clipboard.setStringAsync('');
      } catch (err) {
        console.warn('Failed to clear clipboard.');
      }
    }, 30000);
  } catch (err) {
    console.error('Clipboard copy failed:', err);
    Alert.alert('Error', 'Failed to copy password.');
  }
}
