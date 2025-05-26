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
});