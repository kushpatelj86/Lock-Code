import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    marginVertical: 10,
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#000',
    fontFamily: 'serif',
    paddingHorizontal: 8,
  },
  clearButton: {
    backgroundColor: 'rgb(171, 235, 108)',
    borderRadius: 5,
    marginLeft: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearText: {
    fontFamily: 'serif',
    color: '#000',
    fontSize: 16,
    textAlign: 'center',
  },
});
