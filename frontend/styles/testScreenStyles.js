import { StyleSheet } from "react-native";
import theme from "./theme";

export default StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: theme.colors.background,
  },
  container: {
    padding: 20,
    backgroundColor: theme.colors.background,
    flexGrow: 1,
  },
  scroll: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: theme.colors.text,
    marginTop: 50,
  },
  divider: {
    marginTop: 20,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAECEB",
    padding: 16,
    borderRadius: 16,
    marginTop: 20,
    width: "100%",
  },
  cardText: {
    marginLeft: 0,
    fontSize: 16,
    color: "black",
    fontWeight: "500",
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