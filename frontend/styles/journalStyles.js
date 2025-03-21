import { StyleSheet, Dimensions } from 'react-native';
import theme from './theme';

const screenWidth = Dimensions.get("window").width;

const journalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 20,
  },

  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: 20,
    marginTop: 50,
  },

  button: {
    backgroundColor: theme.colors.accent,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
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
    paddingBottom: 20,
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
    width: screenWidth - 20, // 🔹 Se extinde aproape pe toată lățimea ecranului
    alignSelf: "center",
  },

  journalEmotionTitle: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
    marginBottom: 5,
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
});

export default journalStyles;
