
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

  categoryCard: {
  backgroundColor: '#1E1A38',
  borderRadius: 12,
  padding: 12,
  marginVertical: 6,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderWidth: 2,
  borderColor: '#E8BCB9',
  shadowColor: '#9f7aea',
  shadowOpacity: 0.3,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 6,
  elevation: 3,
},

categoryLeft: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
},

categoryTitle: {
  color: '#fff',
  fontSize: 15,
  fontWeight: 'bold',
},

categoryCount: {
  color: '#E8BCB9',
  fontSize: 16,
  fontWeight: 'bold',
},

modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.7)',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 20,
  
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
  color: '#white',
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

}
);
