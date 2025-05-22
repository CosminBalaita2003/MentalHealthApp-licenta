import { StyleSheet } from 'react-native';
import theme from './theme';

const astroChartStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start', // asigură poziționare în stânga
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 60
    ,
    marginBottom: 20,
},
backIcon: {
  paddingRight: 12,
},
title: {
  fontSize: 24,
  fontWeight: 'bold',
  color: '#fff',
  flexShrink: 1, // previne ca textul să iasă din rând
},
  chartImage: {
    width: '90%',
    height: undefined,
    aspectRatio: 1,
    alignSelf: 'center',
    marginVertical: 20,
  },
  sectionContainer: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    color: theme.colors.text,
    fontWeight: 'bold',
    marginBottom: 10,
    
  },
  explanation: {
    color: theme.colors.text,
    fontSize: 14,
    marginBottom: 10,
    fontStyle: 'italic',
  },
  text: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: 6,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    
    marginBottom: 10,
  },
  sectionIcon: {
    marginRight: 6,
    marginBottom: 10,
  },

  tarotCard: {
  alignSelf: 'center',
  backgroundColor: '#1E1A38',
  borderRadius: 12,
  paddingVertical: 16,
  paddingHorizontal: 10,
  marginTop: 20,
  width: '95%',
  shadowColor: '#9f7aea',
  shadowOpacity: 0.4,
  shadowOffset: { width: 0, height: 4 },
  shadowRadius: 10,
  elevation: 4,
  borderWidth: 2,
  borderColor: '#E8BCB9',
},

chartImage: {
  width: '100%',
  height: '100%',
  borderRadius: 12,
},

cardTitle: {
  fontWeight: 'bold',
  color: '#fff',
  fontSize: 16,
  marginBottom: 8,
},

cardDescription: {
  color: '#ddd',
  fontSize: 14,
  lineHeight: 20,
},
tarotText: {
  fontSize: 15,
  color: '#E8BCB9',
  textAlign: 'center',
  fontStyle: 'italic',
  paddingHorizontal: 12,
},
imageShadowContainer: {
  width: '100%',
  aspectRatio: 1,
  shadowColor: '#9f7aea',
  shadowOpacity: 0.5,
  shadowOffset: { width: 0, height: 4 },
  shadowRadius: 10,
  elevation: 5,
},
showMore: {
  marginTop: 10,
  fontSize: 13,
  color: '#E8BCB9',
  fontStyle: 'italic',
},

modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
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
  alignSelf: 'center',
},

modalCloseText: {
  color: '#1E1A38',
  fontWeight: 'bold',
  textAlign: 'center',

},

  
});

export default astroChartStyles;
