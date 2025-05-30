import { StyleSheet } from 'react-native';
import theme from './theme';

export default StyleSheet.create({
    container: {
        padding: 20,
        paddingBottom: 50,
        backgroundColor: theme.colors.background,
        flexGrow: 1,
        alignItems: 'center',
        marginBottom: 40, // adaugă margine jos pentru a evita suprapunerea cu butonul de navigare
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start', // asigură poziționare în stânga
        width: '100%',
        paddingHorizontal: 20,
        marginTop: 50,
        marginBottom: 20,
    },
    iconButton: {
        paddingRight: 12,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        flexShrink: 1, // previne ca textul să iasă din rând
    },


    loader: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: theme.colors.background,
    },

    card: {
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
    cardTitle: {
          fontWeight: 'bold',
  color: '#fff',
  fontSize: 16,
  marginBottom: 8,
    },
    text: {
         color: '#ddd',
  fontSize: 14,
  lineHeight: 20,
    },
    interpretation: {
        fontSize: 15,
  color: '#E8BCB9',
  textAlign: 'center',
  fontStyle: 'italic',
  paddingHorizontal: 12,
    },
    bold: {
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    subtitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginTop: 12,
        marginBottom: 5,
        textAlign: 'center',
    },
    legend: {
        fontSize: 14,
        color: theme.colors.text,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#E8BCB9',
        padding: 12,
        borderRadius: 12,
        marginTop: 10,
        alignSelf: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
    },
    chartWrapper: {
        alignItems: 'center', // ✅ centrează graficul orizontal
        backgroundColor: theme.colors.background,
        padding: 16,
        borderRadius: 16,
        marginTop: 16,
        marginBottom: 16,
        width: '100%', // ✅ asigură că padding-ul este egal stânga/dreapta
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
