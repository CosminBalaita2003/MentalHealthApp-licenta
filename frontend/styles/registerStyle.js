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
});
