
import { StyleSheet } from "react-native";
import theme from "./theme";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 50,
  },
  backIcon: {
    marginRight: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: theme.colors.text,
    
    
  },
  titleSection: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 10,
    
  },
  sectionContainer: {
    
    padding: 10 ,
    borderRadius: 12,
    
    
  },
  categoryTitle: {
    color: 'white',
    fontSize: 17,
    fontWeight: "bold",
  

  },
  count: {
    color: 'white',
    fontSize: 16,
    
  },
  exerciseItem: {
    color: "#ccc",
    fontSize: 14,
    marginLeft: 10,
  },
  description: {
    color: "#fff",
    fontStyle: "italic",
    fontSize: 13,
    marginBottom: 10,
  
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },

},

  
);
