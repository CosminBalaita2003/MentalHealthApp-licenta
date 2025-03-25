import { StyleSheet } from 'react-native';
import theme from './theme'; // Importam paleta de culori
import axios from 'axios';
import { Dimensions } from "react-native";
const screenWidth = Dimensions.get("window").width;
export default {
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "center",

    padding: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: theme.colors.background,

    alignItems: "center", //  Centrare orizontală
    justifyContent: "center", //  Centrare verticală
    width: "100%",
    paddingVertical: 20, //  Spațiere mică pentru aspect echilibrat
  },

  text: {
    fontSize: 18,
    color: theme.colors.text,
    textAlign: "center", //  Centrare text
    marginBottom: 10,
  },
  sstext: {
    fontSize: 18,
    marginBottom: 10,

    color: theme.colors.background,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 20,
    marginTop: 100,
    textAlign: "center", //  Centrare titlu
  },
  time: {
    width: '100%',
    height: 45, // Dimensiune mai mare pentru lizibilitate
    borderWidth: 2, //  Asigura ca exista un chenar vizibil
    borderColor: theme.colors.semiaccent, //  Foloseste o culoare accentuata
    borderRadius: 10, //  Colturi rotunjite pentru un aspect modern
    paddingHorizontal: 15,
    marginBottom: 10,
    backgroundColor: theme.colors.text, //  Fundal alb pentru contrast mai bunr
    justifyContent: 'center',

  },
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.text,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: theme.colors.semiaccent,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: theme.colors.background,
  },
  passwordInput: {
    flex: 1,
    height: 50,
    color: theme.colors.background,
  },
  eyeIcon: {
    padding: 10,
  },
  button: {
    backgroundColor: theme.colors.accent,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",

    width: "80%", //  Butoanele sunt mai echilibrate
    marginTop: 15,

  },
  logoutButton: {
    backgroundColor: "#AE445A", //  Culoare specială pentru logout
  },
  buttonText: {
    padding: 10,
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",

  },
  linkText: {
    marginTop: 10,
    color: theme.colors.text,
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    paddingVertical: 200,
    justifyContent: 'top',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'rgba(29, 26, 57, 0.8)',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalInput: {
    width: '100%',
    height: 50,
    borderWidth: 2,
    borderColor: theme.colors.accent,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
    color: theme.colors.background,
  },
  cityListItem: {
    width: '100%',
    padding: 20,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderRadius: 50,
    borderColor: 'rgba(29, 26, 57, 0.8)',
    backgroundColor: 'rgba(29, 26, 57, 0.8)',
  },
  cityListItemText: {
    fontSize: 16,
    textAlign: 'center',
    color: theme.colors.text,
  },
  tabBar: {
    backgroundColor: "#16132D",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: 70,
    borderTopWidth: 0,
    position: "absolute",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  tabBarIcon: {
    size: 24, // Adjust icon size
  },
  stackHeader: {
    backgroundColor: theme.colors.backgroundDark, // Same as tab bar
    height: 60,
    shadowColor: "#000", // Add shadow
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    elevation: 5, // For Android shadow
  },
  stackHeaderTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
    backgroundColor: theme.colors.backgroundDark, // Same as tab bar
  },
  testCard: {
    width: "100%",
    maxWidth: screenWidth, // Dynamic width based on screen size
    alignItems: "center",
    padding: 20,
    backgroundColor: theme.colors.backgroundDark,
    borderRadius: 10,
    marginBottom: 10,
  },

  questionContainer: {
    width: "100%",
    paddingVertical: 10,
    marginBottom: 20,
    alignItems: "center",
  },

  questionText: {
    fontSize: 18,
    color: theme.colors.text,
    textAlign: "center",
    width: "90%",
    maxWidth: screenWidth * 0.9, // Ensure text fits within the screen width
    flexWrap: "wrap",
  },

  optionContainer: {
    width: "100%",
    alignItems: "center",
    flexDirection: "column", // Force buttons to stack properly
    marginTop: 10,
  },

  optionButton: {
    backgroundColor: theme.colors.card,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    width: "90%", // Ensure it doesn't exceed screen width
    // maxWidth: screenWidth * 0.9, // Adjust dynamically
    marginVertical: 5,
  },

  selectedOption: {
    backgroundColor: theme.colors.accent,
  },

  submitButton: {
    backgroundColor: theme.colors.accent,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: "center",
    width: "90%",
    maxWidth: screenWidth * 0.9, // Ensure it fits
    marginTop: 20,
  },
  flatListContainer: {
    maxHeight: 300, // 🔥 Asigură că lista are spațiu vizibil
    width: "100%",
    backgroundColor: "rgba(29, 26, 57, 0.9)", //  Fundal semitransparent
    borderRadius: 10,
    padding: 10,
    marginTop: 10, //  Distanță față de input
  },

  chartContainer: {
    backgroundColor: theme.colors.backgroundDark, // Fundal mai întunecat pentru contrast
    padding: 15,
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  //  Container pentru interpretarea ultimului test
  interpretationContainer: {
    backgroundColor: theme.colors.background, // Fundal mai puțin intens decât graficul
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
  },

  //  Text pentru interpretarea scorului
  interpretationText: {
    fontSize: 16,
    color: theme.colors.neutral, // Verde-albăstrui pentru evidențiere
    fontWeight: "bold",
    textAlign: "center",
  },

  //  Container pentru legendă
  legendContainer: {
    backgroundColor: theme.colors.background, // Fundal mai puțin intens
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
    width: "100%",
    alignSelf: "center",
  },

  //  Text pentru fiecare nivel din legendă
  legendText: {
    fontSize: 14,
    color: theme.colors.text,
    textAlign: "center",
    marginVertical: 2, // Spațiere între rânduri
  },

  //  Stil pentru titlurile secțiunilor (grafic, interpretare, legendă)
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: 10,
  },

  backButton: {
    backgroundColor: theme.colors.accent,
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    position: "absolute",
    bottom: 90, // Mută mai sus să nu fie acoperit
    alignSelf: "center",
  },
  pickerContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  picker: {
    height: 50,
    color: "#000", // Text negru
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  cardText: {
    fontSize: 14,
    color: "#D3D3D3",
    marginTop: 5,
  },
  emotionList: {
    flexDirection: "row",
    paddingVertical: 10,
    justifyContent: "center",
  },

  carouselContainer: {
    alignItems: "center",
    padding: 10,
  },

  carouselContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 20,
    width: "100%",
    marginTop: 10,
  },

  emotionCard: {
    width: 150,
    height: 150,
    backgroundColor: "#1E1B3A",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    marginHorizontal: 10,
    padding: 20,
    marginBottom: 80,
  },

  selectedEmotion: {
    backgroundColor: "#4ECDC4",
  },

  emotionText: {
    color: "#ffffff",
    fontSize: 15,
    textAlign: "center",
    width: "100%",
  },

  emotionImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },


  journalCard: {
    backgroundColor: "#1E1B3A",
    borderRadius: 12,
    padding: 15,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,

    width: "100%", //  Ocupă toată lățimea posibilă
    alignSelf: "center", //  Asigură că este centrat corect
  },


  journalEmotionTitle: {
    fontSize: 18,
    color: "white", //  Emoția este albă
    marginBottom: 5,
  },

  journalContentText: {
    fontSize: 14,
    color: "white", //  Textul jurnalului este alb
    marginBottom: 8,
    width: "90%",
    maxWidth: screenWidth * 0.9, // Ensure text fits within the screen width
    flexWrap: "wrap",
  },

  journalDateText: {
    fontSize: 12,
    color: "white", //  Data este albă
    textAlign: "right",
    marginTop: 5,
  },
};


