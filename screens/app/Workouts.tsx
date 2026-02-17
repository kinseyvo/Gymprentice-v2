import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';

export default function WorkoutsScreen() {
    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
            <Text style={styles.headerText}>Workouts</Text>

            <Text style={styles.headerText}>TODO: Find API for this lol</Text>
            <Text style={styles.headerText}>everything below is all TEMPORARY</Text>

            {/* Categories */}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Categories</Text>

                <View style={styles.categoryGrid}>
                    <TouchableOpacity style={styles.categoryBox}>
                        <Text style={styles.categoryText}>Strength</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.categoryBox}>
                        <Text style={styles.categoryText}>Hypertrophy</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.categoryBox}>
                        <Text style={styles.categoryText}>Cardio</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.categoryBox}>
                        <Text style={styles.categoryText}>Mobility</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.categoryBox}>
                        <Text style={styles.categoryText}>Beginner</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.categoryBox}>
                        <Text style={styles.categoryText}>Advanced</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a',
        paddingHorizontal: 20,
        paddingTop: 20,
    },

    headerText: {
        fontSize: 26,
        fontWeight: '700',
        color: '#22c55e',
        marginBottom: 20,
    },

    card: {
        backgroundColor: '#1e293b',
        borderRadius: 18,
        padding: 18,
        marginBottom: 20,
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#f8fafc',
        marginBottom: 15,
    },

    workoutItem: {
        paddingVertical: 10,
    },

    workoutTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#f8fafc',
        marginBottom: 4,
    },

    workoutSubtitle: {
        fontSize: 13,
        color: '#94a3b8',
    },

    divider: {
        height: 1,
        backgroundColor: '#334155',
        marginVertical: 10,
    },

    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },

    categoryBox: {
        width: '48%',
        backgroundColor: '#0f172a',
        paddingVertical: 18,
        borderRadius: 14,
        alignItems: 'center',
        marginBottom: 12,
    },

    categoryText: {
        color: '#f8fafc',
        fontWeight: '600',
        fontSize: 14,
    },
});
