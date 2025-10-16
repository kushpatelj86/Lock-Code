import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: {
    marginVertical: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f4f4f4',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  title: {
    fontFamily: 'serif',
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
    textAlign: 'center',
  },
  button: {
    backgroundColor: 'rgb(171, 235, 108)', 
    borderRadius: 5,
    marginVertical: 10,
    marginHorizontal: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'serif',
    color: '#000',
    fontSize: 16,
    textAlign: 'center',
  },
});
