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
    fontSize: 18,
    color: theme.colors.text,
    fontWeight: 'bold',
    marginBottom: 0,
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
  },
  
});

export default astroChartStyles;
