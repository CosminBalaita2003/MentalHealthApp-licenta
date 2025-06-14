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
   modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#1E1A38",
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: "#E8BCB9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#E8BCB9",
    marginBottom: 12,
    textAlign: "center",
  },
  modalDescription: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 12,
    lineHeight: 20,
  },
  modalText: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 8,
  },
  modalButton: {
    marginTop: 16,
    backgroundColor: "#E8BCB9",
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: "center",
    paddingHorizontal: 20,
  },
  modalButtonText: {
    color: "#1E1A38",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});
