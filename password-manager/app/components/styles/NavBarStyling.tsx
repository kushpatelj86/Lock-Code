import { StyleSheet } from 'react-native';


export const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f4f4f4'}, 
  button: {
    backgroundColor: 'rgb(171, 235, 108)',
    borderRadius: 5,
    marginVertical: 10,
    marginHorizontal: 5,
    paddingVertical: 10,
    paddingHorizontal: 30,
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