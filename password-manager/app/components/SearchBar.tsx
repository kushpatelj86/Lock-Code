import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { styles } from './styles/SearchBarStyling';



type SearchBarProps = {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
};

export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search...',
  onClear,
}: SearchBarProps) {
  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="#aaa"
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.input}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={onClear} style={styles.clearButton}>
          <Text style={styles.clearText}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
