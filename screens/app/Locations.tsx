import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Keyboard,
} from 'react-native';
import BottomFooter from '../../navigation/BottomFooter';
import { useTheme } from '../../src/context/ThemeContext';

const MOCK_GYMS = [
    { id: '1', name: 'Iron Paradise Gym', address: '123 Main St' },
    { id: '2', name: 'Flex Fitness', address: '456 Elm St' },
    { id: '3', name: 'Powerhouse Training', address: '789 Oak Ave' },
];

export default function LocationsScreen() {
    const [zipCode, setZipCode] = useState('');
    const [gyms, setGyms] = useState<typeof MOCK_GYMS>([]);

    const { darkMode } = useTheme();

    const handleFindGyms = () => {
        if (zipCode.length !== 5) return;
        Keyboard.dismiss();
        setGyms(MOCK_GYMS);
    };

    const renderMapPlaceholder = () => (
        <View
            style={[
                styles.mapPlaceholder,
                {
                    backgroundColor: darkMode ? '#1e293b' : '#e2e8f0',
                    borderColor: darkMode ? '#22c55e' : '#16a34a',
                },
            ]}
        >
            <Text
                style={[
                    styles.mapTitle,
                    { color: darkMode ? '#22c55e' : '#16a34a' },
                ]}
            >
                Map View
            </Text>
            <Text
                style={[
                    styles.mapSubtitle,
                    { color: darkMode ? '#94a3b8' : '#475569' },
                ]}
            >
                Map preview coming soon
            </Text>
        </View>
    );

    return (
        <View
            style={[
                styles.container,
                { backgroundColor: darkMode ? '#0f172a' : '#ffffff' },
            ]}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text
                    style={[
                        styles.headerText,
                        { color: darkMode ? '#22c55e' : '#16a34a' },
                    ]}
                >
                    Gym Locations
                </Text>

                <View style={styles.inputContainer}>
                    <Text
                        style={[
                            styles.label,
                            { color: darkMode ? '#f8fafc' : '#0f172a' },
                        ]}
                    >
                        Zip Code:
                    </Text>

                    <TextInput
                        style={[
                            styles.textInput,
                            {
                                backgroundColor: darkMode ? '#1e293b' : '#e2e8f0',
                                color: darkMode ? '#f8fafc' : '#0f172a',
                                borderColor: darkMode ? '#334155' : '#cbd5e1',
                            },
                        ]}
                        placeholder="99999"
                        placeholderTextColor="#94a3b8"
                        value={zipCode}
                        onChangeText={setZipCode}
                        keyboardType="numeric"
                        maxLength={5}
                        returnKeyType="search"
                        onSubmitEditing={handleFindGyms}
                    />

                    <TouchableOpacity style={styles.button} onPress={handleFindGyms}>
                        <Text style={styles.buttonText}>Search</Text>
                    </TouchableOpacity>
                </View>

                {renderMapPlaceholder()}

                {gyms.map((gym) => (
                    <View
                        key={gym.id}
                        style={[
                            styles.card,
                            {
                                backgroundColor: darkMode ? '#1e293b' : '#e2e8f0',
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.gymName,
                                { color: darkMode ? '#f8fafc' : '#0f172a' },
                            ]}
                        >
                            {gym.name}
                        </Text>
                        <Text
                            style={[
                                styles.address,
                                { color: darkMode ? '#94a3b8' : '#475569' },
                            ]}
                        >
                            {gym.address}
                        </Text>
                    </View>
                ))}
            </ScrollView>

            <BottomFooter activeTab="Home" />
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
        paddingBottom: 80,
    },

    headerText: {
        fontSize: 26,
        fontWeight: '700',
        color: '#22c55e',
        marginBottom: 20,
        textAlign: 'left',
    },

    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },

    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#f8fafc',
    },

    textInput: {
        width: 110,
        borderWidth: 1,
        borderColor: '#334155',
        borderRadius: 10,
        padding: 10,
        marginHorizontal: 10,
        backgroundColor: '#1e293b',
        color: '#f8fafc',
    },

    button: {
        backgroundColor: '#22c55e',
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 10,
    },

    buttonText: {
        color: '#0f172a',
        fontWeight: '700',
        fontSize: 14,
    },

    mapPlaceholder: {
        height: 160,
        borderRadius: 12,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: '#22c55e',
        backgroundColor: '#1e293b',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },

    mapTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#22c55e',
    },

    mapSubtitle: {
        fontSize: 14,
        color: '#94a3b8',
        marginTop: 4,
    },

    card: {
        backgroundColor: '#1e293b',
        padding: 18,
        borderRadius: 18,
        marginBottom: 20,
    },

    gymName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#f8fafc',
        marginBottom: 4,
    },

    address: {
        fontSize: 14,
        color: '#94a3b8',
    },
});