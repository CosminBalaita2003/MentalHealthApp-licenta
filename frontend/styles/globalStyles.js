import { StyleSheet } from 'react-native';
import theme from './theme'; // Importam paleta de culori

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: theme.colors.text,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
    
    color: theme.colors.text,
  },
  input: {
    width: '100%',
    height: 45, // Dimensiune mai mare pentru lizibilitate
    borderWidth: 2, // 🔹 Asigura ca exista un chenar vizibil
    borderColor: theme.colors.accent, // 🔹 Foloseste o culoare accentuata
    borderRadius: 10, // 🔹 Colturi rotunjite pentru un aspect modern
    paddingHorizontal: 15,
    marginBottom: 10,
    backgroundColor: '#FFFFFF', // 🔹 Fundal alb pentru contrast mai bunr
    textAlignVertical: 'center',

  },
  time: {
    width: '100%',
    height: 45, // Dimensiune mai mare pentru lizibilitate
    borderWidth: 2, // 🔹 Asigura ca exista un chenar vizibil
    borderColor: theme.colors.accent, // 🔹 Foloseste o culoare accentuata
    borderRadius: 10, // 🔹 Colturi rotunjite pentru un aspect modern
    paddingHorizontal: 15,
    marginBottom: 10,
    backgroundColor: '#FFFFFF', // 🔹 Fundal alb pentru contrast mai bunr
    justifyContent: 'center',

  },
  button: {
    backgroundColor: theme.colors.accent,
    padding: 12,
    marginTop: 20,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
   
  },
});
