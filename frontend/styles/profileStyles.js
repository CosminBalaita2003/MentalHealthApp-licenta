import { StyleSheet } from 'react-native';
import theme from './theme';
export default StyleSheet.create({
  container: {
    padding: 20,
    allignItems: 'center',
   
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  loader: {
   
    padding: 20,
    
    backgroundColor: '#FFF7F1',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color:theme.colors.text,
    marginTop: 50,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    
    borderRadius: 12,
    padding: 8,
    marginTop:50,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAECEB',
    padding: 16,
    borderRadius: 16,
    marginTop: 20,
  },
  cardText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#5A4E4D',
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#E8BCB9',
    padding: 12,
    borderRadius: 12,
    marginTop: 20,
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#fff',
  },
  text: {
    fontSize: 16,
    color: '#5A4E4D',
  },
});
