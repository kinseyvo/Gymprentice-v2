import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    headerText: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    buttonGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    cardButton: {
        width: '45%',
        height: 100,
        marginVertical: 10,
        backgroundColor: '#4a90e2',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
    },
    cardButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
    },
});
