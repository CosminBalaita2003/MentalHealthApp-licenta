import { StyleSheet } from 'react-native';
import theme from './theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 20,
  },
  scrollContainer: {
    paddingBottom: 50,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: 40,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: theme.colors.text,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#2B2A4C',
    color: '#fff',
    padding: 12,
    borderRadius: 12,
    marginTop: 6,
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 1,
  },
  error: {
    fontSize: 13,
    color: 'red',
    marginTop: 4,
  },
  button: {
    backgroundColor: theme.colors.semiaccent,
    padding: 14,
    borderRadius: 14,
    marginTop: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: theme.colors.text,
    borderRadius: 5,
    marginRight: 10,
  },
  text: {
    fontSize: 16,
    color: theme.colors.text,
    marginTop: 12,
    marginBottom: 6,
  },
  checkboxChecked: {
    backgroundColor: theme.colors.text,
  },
  time: {
    backgroundColor: '#FAECEB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(22, 19, 45, 0.9)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: 16,
    padding: 20,
  },
  modalInput: {
    backgroundColor: '#FAECEB',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    color: theme.colors.black,
  },
  flatListContainer: {
    maxHeight: 200,
    marginTop: 10,
  },
  cityListItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomColor: '#E0E0E0',
    borderBottomWidth: 1,
  },
  cityListItemText: {
    fontSize: 16,
    color: '#fff',
  },
  
});
