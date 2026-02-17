import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a',
        paddingHorizontal: 20,
    },

    logoText: {
        fontSize: 28,
        fontWeight: '700',
        color: '#22c55e',
        marginTop: 10,
        fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
    },

    greetingText: {
        fontSize: 20,
        color: '#f8fafc',
        marginTop: 8,
        fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
    },

    tipCard: {
        backgroundColor: '#1e293b',
        padding: 16,
        borderRadius: 16,
        marginTop: 15,
    },

    tipText: {
        color: '#cbd5e1',
        fontSize: 14,
        lineHeight: 20,
        fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
    },

    quickGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 30,
    },

    quickBox: {
        width: '31%',
        backgroundColor: '#1e293b',
        paddingVertical: 20,
        borderRadius: 50,
        alignItems: 'center',
        marginBottom: 14,
    },

    quickBoxText: {
        color: '#f1f5f9',
        fontSize: 14,
        fontWeight: '600',
        fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
    },

    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 15,
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#f8fafc',
        fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
    },

    viewAllText: {
        color: '#22c55e',
        fontSize: 14,
        fontWeight: '500',
        fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
    },

    workoutCard: {
        width: 160,
        backgroundColor: '#1e293b',
        borderRadius: 16,
        padding: 12,
        marginRight: 15,
    },

    workoutImage: {
        width: '100%',
        height: 100,
        borderRadius: 12,
        marginBottom: 8,
    },

    workoutTitle: {
        color: '#f8fafc',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
        fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
    },

    workoutDescription: {
        color: '#94a3b8',
        fontSize: 12,
        fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
    },

    statsCard: {
        backgroundColor: '#1e293b',
        borderRadius: 18,
        padding: 18,
        marginBottom: 30,
    },

    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },

    statBlock: {
        alignItems: 'center',
    },

    statNumber: {
        fontSize: 18,
        fontWeight: '700',
        color: '#22c55e',
        fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
    },

    statLabel: {
        fontSize: 12,
        color: '#94a3b8',
        marginTop: 4,
        fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
    },

    graphContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        height: 70,
    },

    graphBar: {
        width: 14,
        backgroundColor: '#22c55e',
        borderRadius: 6,
    },

});
