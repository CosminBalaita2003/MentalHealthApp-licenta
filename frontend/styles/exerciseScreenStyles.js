import { StyleSheet } from "react-native";
import theme from "./theme";

export default StyleSheet.create({
  container: {
    padding: 20,
    // alignItems: "center",
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  loader: {
    padding: 20,
    backgroundColor: "#FFF7F1",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: theme.colors.text,
    marginTop: 50,
    textAlign: "center",
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
    marginLeft: 10,
    fontSize: 16,
    color: "black",
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#E8BCB9",
    padding: 12,
    borderRadius: 12,
    marginTop: 30,
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "bold",
    color: "#fff",
  },
  text: {
    fontSize: 16,
    color: "white",
    marginTop: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  iconButton: {
    padding: 8,
    borderRadius: 12,
  },
  
});
