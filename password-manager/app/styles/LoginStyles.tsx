// app/styles/LoginStyles.ts
import { StyleSheet } from 'react-native';

export const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff', 
  },
  form: {
    backgroundColor: 'aquamarine',
    padding: 20,
    marginVertical: 20,
    borderRadius: 8,
    width: '90%',
    maxWidth: 500,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5, 
  },
  label: {
    fontFamily: 'Arial',
    backgroundColor: 'aliceblue',
    borderRadius: 8,
    padding: 5,
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'aliceblue',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: 'aliceblue',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    fontFamily: 'Arial',
    fontSize: 16,
    color: '#000',
  },
  registrationLink: {
    marginVertical: 20,
    alignSelf: 'center',
  },
});
