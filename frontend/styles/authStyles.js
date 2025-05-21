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
    marginTop: 5,
    marginBottom: 6,
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
    backgroundColor: '#2B2A4C',
    color: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    
  },
  modalContainer: {
    flex: 1,
    backgroundColor: theme.colors.backgroundDark,
    justifyContent: 'flex-start',
    padding: 20,
    marginTop: '30%',
    alignContent: 'center',
  },
  modalContent: {
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: 16,
    padding: 20,
  },
  modalInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.text,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.colors.accent,
  },
  searchIcon: {
    marginRight: 8,
  },
  flatListContainer: {
    maxHeight: 200,
    marginTop: 10,
  },
  cityListItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    // borderBottomColor: '#E0E0E0',
    // borderBottomWidth: 1,
    borderColor: theme.colors.semiaccent,
    backgroundColor: theme.colors.accent,
    shadowColor: '#fff',
    shadowOffset: {
      width: 5,
      height: 2,
    },
    borderWidth: 1,
    borderRadius: 20,
    marginBottom: 10,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',


  },
  cityListItemText: {
    fontSize: 16,
    color: '#fff',
  },
  loadingOverlay: {
  ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.64)',
    justifyContent: 'center',
    alignItems: 'center',
},
loadingContent:{
 width: '80%',
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    position: 'relative',
},
loadingText: {
  fontSize: 16,
    textAlign: 'center',
    color: theme.colors.text,
    letterSpacing: 1,
    rowSpacing: 1,
    marginTop: 20,
    marginBottom: 5,
  
},
 errorOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.64)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContent: {
    width: '80%',
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    position: 'relative',
  },
  errorClose: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 4,
  },
  errorCloseText: {
    fontSize: 18,
    color: '#999',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    color: theme.colors.text,
    letterSpacing: 1,
    rowSpacing: 1,
    marginBottom: 20,
  },
  errorButton: {
    backgroundColor: theme.colors.semiaccent,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 20,
    width: '100%',
  

  },
  errorButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    width: '100%',
    textAlign: 'center',
  },

});
