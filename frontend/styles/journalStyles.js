import { StyleSheet, Dimensions } from 'react-native';
import theme from './theme';

const screenWidth = Dimensions.get("window").width;

const journalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 20,
    alignContent: "center",
    justifyContent: "center",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: 20,
    marginTop: 50,
  },
   title: {
      fontSize: 28,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: 20,
      marginTop: 100,
      textAlign: "center", //  Centrare titlu
    },

  button: {
    backgroundColor: theme.colors.accent,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 10,
    
    
  },

  buttonText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "bold",
  },

  listContainer: {
    flexGrow: 1,
    width: "100%",
    paddingBottom: 100,
    marginBottom: 50,
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
    width: screenWidth - 20, //  Se extinde aproape pe toată lățimea ecranului
    alignSelf: "center",
  },

  journalEmotionTitle: {
    fontSize: 15,
    color: "white",
    fontWeight: "bold",
    marginBottom: 10,
  },

  journalContentText: {
    fontSize: 14,
    color: "white",
    marginBottom: 8,
    width: "100%",
    flexWrap: "wrap",
  },

  journalDateText: {
    fontSize: 12,
    color: "white",
    textAlign: "right",
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
    marginTop: 20,
  },

  carouselContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent:"space-evenly",
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
    marginBottom: 50,
    marginTop: 25,
  },

  selectedEmotion: {
    backgroundColor: "#4ECDC4",
  },

  emotionText: {
    color: "#ffffff",
    fontSize: 14,
    textAlign: "center",
    width: "100%",
    marginTop: 10,
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


  

  journalContentText: {
    fontSize: 14,
    color: "white", //  Textul jurnalului este alb
    marginBottom: 8,
    width: "90%",
    maxWidth: screenWidth * 0.9, // Ensure text fits within the screen width
    flexWrap: "wrap",
  },


  subtitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.colors.text,
      textAlign: "center",
      marginBottom: 10,
    },
    textBoxContainer: {
      borderWidth: 2,
      borderColor: "#ccc",
      borderRadius: 10,
      padding: 10,
      marginVertical: 10,
      height: 300
      
    },
    textBox: {
      height: 250,
      textAlignVertical: "top",
      color: "#fff",  //  Face textul alb
      fontSize: 16,
    },

    journalEmotionLabel: {
      fontSize: 12,
      color: "gray",
    },
    journalEmotionValue: {
      fontSize: 12,
      color: "white",
      fontWeight: "bold",
      marginBottom: 10,
    },
});

export default journalStyles;
