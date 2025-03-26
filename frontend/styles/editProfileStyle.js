import { StyleSheet } from 'react-native';
import theme from './theme';

export default StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: theme.colors.background,
    flexGrow: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  loader: {
    padding: 20,
    backgroundColor: '#FFF7F1',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 20,
    marginTop: 40,
    textAlign: 'left',
  },
  text: {
    fontSize: 16,
    color: theme.colors.text,
    marginTop: 12,
    marginBottom: 6,
  },
  inputContainer: {
    backgroundColor: '#FAECEB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 12,
  },
  input: {
    fontSize: 16,
    color: '#5A4E4D',
  },
  time: {
    backgroundColor: '#FAECEB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
  },
  button: {
    backgroundColor: theme.colors.accent,
    padding: 14,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 16,
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
