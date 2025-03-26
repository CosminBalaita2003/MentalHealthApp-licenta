import { StyleSheet } from "react-native";
import theme from "./theme";

export default StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 40,
    marginBottom: 20,
  },
  iconButton: {
    marginRight: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "left",
  },
  progressText: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  
  progressBarBackground: {
    height: 8,
    backgroundColor: "#2B2A4C",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 24,
  },
  progressBarFill: {
    height: 8,
    backgroundColor: theme.colors.accent,
  },
  questionWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  questionText: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: "#2B2A4C",
    padding: 12,
    borderRadius: 12,
    marginVertical: 6,
    width: 250,
    alignSelf: "center",
  },
  selectedOption: {
    backgroundColor: theme.colors.accent,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },
  navButtons: {
    flexDirection: "row",
    justifyContent: "center",
  },
  navButton: {
    backgroundColor: theme.colors.semiaccent,
    padding: 12,
    borderRadius: 12,
    minWidth: 120,
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.5,
  },
});
