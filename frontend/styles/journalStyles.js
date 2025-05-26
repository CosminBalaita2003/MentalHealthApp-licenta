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

  // button: {
  //   backgroundColor: theme.colors.accent,
  //   paddingVertical: 12,
  //   paddingHorizontal: 30,
  //   borderRadius: 10,
  //   alignItems: "center",
  //   justifyContent: "center",
  //   alignSelf: "center",
  //   marginBottom: 10,
    
    
  // },

  // buttonText: {
  //   color: theme.colors.text,
  //   fontSize: 16,
  //   fontWeight: "bold",
  // },
  button: {
    backgroundColor: "#FAECEB",
    padding: 12,
    borderRadius: 12,
    marginTop: 0,
    marginBottom: 10,
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "bold",
    color: "#5A4E4D",
  },

  listContainer: {
    flexGrow: 1,
    width: "100%",
    paddingBottom: 100,
    marginBottom: 50,
    gap: 10,
  },

  journalCard: {
    backgroundColor: "#1E1B3A",
    borderRadius: 12,
    padding: 15,
    marginVertical: 20,
    
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
    paddingVertical: 16,
    backgroundColor: "transparent",    // fără fundal
    marginBottom: 30, // spațiu între carusel și alte elemente
  },
  carouselContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
  },
  emotionCard: {
    width: 140,
    height: 160,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 40,

    // fără backgroundColor, fără borderRadius
  },
  emotionImage: {
    width: 250,
    height: 150,
    borderRadius: 60,
    overflow: "hidden",
  },
  emotionText: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: "center",
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
     modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#1E1A38",
    borderRadius: 16,
    padding: 20,
    maxHeight: "80%",
    width: "100%",
    borderWidth: 2,
    borderColor: "#E8BCB9",
    shadowColor: "#9f7aea",
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 10,
  },
  modalCloseButton: {
    marginTop: 20,
    backgroundColor: "#E8BCB9",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: "flex-end",
  },
  modalCloseText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#E8BCB9",
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
    color: "#E8BCB9",
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  modalAdvice: {
    fontSize: 16,
    color: "#E8BCB9",
    fontStyle: "italic",
  },
  
  emptyContainer: {
    flex: 1,
    justifyContent: "flex-start",  // pin to top
    alignItems: "center",
    paddingTop: 20,                // adjust as needed
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 18,
    color: theme.colors.text,
    fontWeight: "bold",
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
    lineHeight: 22,
  },
  ModalJournalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    
    justifyContent: "center",
    alignItems: "center",

    padding: 20,
  },
  ModalJournalContent: {
    backgroundColor: "#1E1A38",
    borderRadius: 16,
    padding: 20,
    maxHeight: "80%",
    width: "100%",
    borderWidth: 2,
    borderColor: "#E8BCB9",
    shadowColor: "#9f7aea",
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 10,
  },
  ModalJournalEditButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  ModalJournalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#E8BCB9",
    marginBottom: 10,
  },
  ModalJournalDate: {
    fontSize: 14,
    color: "gray",
    marginBottom: 10,
  },
  ModalJournalDescription: {
    fontSize: 16,
    lineHeight: 22,
    color: theme.colors.text,
  },
  ModalJournalCloseButton: {
    marginTop: 15,
    alignSelf: "center",
    backgroundColor: "#E8BCB9",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  ModalJournalCloseText: {
    color: theme.colors.background,
    fontWeight: "bold",
    textAlign: "center",
  },
   ModalJournalLoadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.64)",
    justifyContent: "center",
    alignItems: "center",
  },
  ModalJournalLoadingContent: {
    width: "80%",
    backgroundColor: "#1E1A38",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  ModalJournalLoadingText: {
    marginTop: 20,
    fontSize: 16,
    color: theme.colors.text,
    textAlign: "center",
  },

  ModalJournalConfirmationOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.64)",
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  ModalJournalConfirmationContent: {
    backgroundColor: "#1E1A38",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    maxHeight: "80%",
    borderWidth: 2,
    borderColor: "#E8BCB9",
    shadowColor: "#9f7aea",
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 10,
    alignItems: "center",
  },
  ModalJournalConfirmationTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#E8BCB9",
    marginBottom: 20,
    textAlign: "center",
  },
  ModalJournalConfirmationButton: {
    backgroundColor: "#E8BCB9",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  ModalJournalConfirmationButtonText: {
    color: "#1E1A38",
    fontWeight: "bold",
    textAlign: "center",
  },

});

export default journalStyles;
