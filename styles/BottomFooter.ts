import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    footerContainer: {
        height: 70,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#1f2937',
        backgroundColor: '#111827',
    },
    footerText: {
        fontSize: 16,
        color: '#9ca3af',
        fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
    },
    activeText: {
        color: '#22c55e',
        fontWeight: '600',
    },
});
