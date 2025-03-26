import { StyleSheet } from 'react-native';
import theme from './theme';

export default StyleSheet.create({
    container: {
        padding: 20,
        paddingBottom: 50,
        backgroundColor: theme.colors.background,
        flexGrow: 1,
        alignItems: 'center',

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
        backgroundColor: theme.colors.backgroundLight,
        padding: 12,
        borderRadius: 16,
        width: '100%',
        marginBottom: 25,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 10,
        textAlign: 'center',
    },
    text: {
        fontSize: 16,
        color: theme.colors.text,
        textAlign: 'center',
        marginBottom: 10,
    },
    interpretation: {
        fontSize: 16,
        color: theme.colors.text,
        textAlign: 'center',
        marginBottom: 10,
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


});
