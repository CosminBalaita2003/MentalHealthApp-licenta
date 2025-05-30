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
    marginLeft: 0,
    fontSize: 16,
    color: "black",
    fontWeight: "500",
    
  },
  button: {
    backgroundColor: "#FAECEB",
    padding: 12,
    borderRadius: 12,
    marginTop: 30,
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "bold",
    color: "#5A4E4D",
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
  description: {
    color: "#ccc",
    fontSize: 14,
    marginTop: 10,
    marginBottom: 20,
    lineHeight: 20,
  },
  grid: {
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-between",
  marginTop: 30,
},

exerciseCard: {
  width: "47%", // două pe rând cu spațiu
  aspectRatio: 1.2,
  backgroundColor: "#FAECEB",
  borderRadius: 16,
  marginBottom: 20,
  alignItems: "center",
  justifyContent: "center",
  padding: 12,
  shadowColor: "#9f7aea",
  shadowOpacity: 0.2,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 6,
  elevation: 3,
},

cardIconWrapper: {
  marginBottom: 10,
},

cardIcon: {
  fontSize: 28,
  marginBottom: 8,
},

cardLabel: {
  fontSize: 14,
  fontWeight: "bold",
  color: "#5A4E4D",
  textAlign: "center",
},

centeredContainer: {
  alignItems: "center",
  marginTop: -80,
},

recommendButton: {
  width: "40%",
  aspectRatio: 1.2,
  backgroundColor: "#FAECEB",
  borderRadius: 16,
  marginBottom: 20,
  alignItems: "center",
  justifyContent: "center",
  padding: 12,
  shadowColor: "#9f7aea",
  shadowOpacity: 0.2,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 6,
  elevation: 3,
},

recommendText: {
  fontWeight: "bold",
  color: "#5A4E4D",
  fontSize: 14,
  textAlign: "center",
},
modalOverlay: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.7)',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 20,
  zIndex: 1000,
},
modalContent: {
  backgroundColor: '#1E1A38',
  borderRadius: 16,
  padding: 20,
  maxHeight: '80%',
  width: '100%',
  borderWidth: 2,
  borderColor: '#E8BCB9',
  shadowColor: '#9f7aea',
  shadowOpacity: 0.5,
  shadowOffset: { width: 0, height: 4 },
  shadowRadius: 12,
  elevation: 10,
},
modalCloseButton: {
  marginTop: 20,
  backgroundColor: '#E8BCB9',
  borderRadius: 8,
  paddingVertical: 8,
  paddingHorizontal: 16,
  alignSelf: 'flex-end',
},
modalCloseText: {
  color: '#FFFFFF',
  fontWeight: 'bold',
  textAlign: 'center',
},
cardTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#E8BCB9',
  marginBottom: 10,
},
cardDescription: {
  fontSize: 16,
  color: '#E8BCB9',
  marginBottom: 10,
  letterSpacing: 0.5,
},
cardGrid: {
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-between",
  marginTop: 5,
  gap : 10, 
},

cardBreathing: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#FAECEB",
  padding: 16,
  borderRadius: 16,
  marginTop: 0,
  width: "48%",          // două card-uri pe rând, cu spațiu între ele
  justifyContent: "center",
  
},

cardTextBreathing: {
  marginLeft: 0,
  fontSize: 16,
  color: "black",
  fontWeight: "500",
},

  
});
