import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BottomFooter from '../../navigation/BottomFooter';

export default function ProfileScreen() {
    const navigation = useNavigation<any>();

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.headerText}>Profile</Text>

                <Text style={styles.headerText}>TODO: add editable fields for name/email, profile pic upload</Text>
                <Text style={styles.headerText}>everything below is all TEMPORARY</Text>

                {/* Settings Button */}
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('Settings')}
                >
                    <Text style={styles.buttonText}>Settings</Text>
                </TouchableOpacity>

                {/* Placeholder for Profile Info */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>User Information</Text>
                    <Text style={styles.placeholderText}>Name: John Doe</Text>
                    <Text style={styles.placeholderText}>Email: john.doe@example.com</Text>
                </View>

                {/* Placeholder for Achievements / Stats */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Achievements</Text>
                    <Text style={styles.placeholderText}>🏆 10 workouts completed</Text>
                    <Text style={styles.placeholderText}>🥗 7 meals tracked</Text>
                </View>
            </ScrollView>

            <BottomFooter activeTab="Profile" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a',
    },

    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 80, // space for footer
    },

    headerText: {
        fontSize: 26,
        fontWeight: '700',
        color: '#22c55e',
        marginBottom: 20,
        textAlign: 'center',
    },

    button: {
        backgroundColor: '#1e293b',
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 18,
        alignItems: 'center',
        marginBottom: 20,
    },

    buttonText: {
        color: '#22c55e',
        fontWeight: '600',
        fontSize: 16,
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
        marginBottom: 12,
    },

    placeholderText: {
        fontSize: 14,
        color: '#94a3b8',
        lineHeight: 20,
    },
});
