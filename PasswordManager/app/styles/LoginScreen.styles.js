import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: 'aquamarine',
    padding: 20,
    marginVertical: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    width: '90%',
    maxWidth: 500,
    alignSelf: 'center', 
  },
  label: {
    fontFamily: 'Arial',
    backgroundColor: 'aliceblue',
    borderRadius: 8,
    padding: 4,
    marginBottom: 6,
  },
  input: {
    backgroundColor: 'aliceblue',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  button: {
    backgroundColor: 'aliceblue',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Arial',
    fontWeight: 'bold',
  },
  registrationLink: {
    marginVertical: 20,
    alignSelf: 'center',
  },
});
