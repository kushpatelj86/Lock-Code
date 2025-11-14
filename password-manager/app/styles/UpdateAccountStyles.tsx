import { StyleSheet } from 'react-native';

export const updateaccountstyles = StyleSheet.create({


  container: {
     marginTop: 10, 
  },
  selectedlabel: { 
    fontWeight: 'bold' 
},
updatelabel: { 
    marginTop: 15 
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
  

});
