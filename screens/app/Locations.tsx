import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const MOCK_GYMS = [
    { id: '1', name: 'Iron Paradise Gym', address: '123 Main St' },
    { id: '2', name: 'Flex Fitness', address: '456 Elm St' },
    { id: '3', name: 'Powerhouse Training', address: '789 Oak Ave' },
];

export default function LocationsScreen() {
    const [zipCode, setZipCode] = useState('');
    const [gyms, setGyms] = useState<typeof MOCK_GYMS>([]);

    const handleFindGyms = () => {
        if (zipCode.length !== 5) return;
        Keyboard.dismiss();
        setGyms(MOCK_GYMS);
    };

    const renderMapPlaceholder = () => (
        <View style={styles.mapPlaceholder}>
            <Text style={styles.mapTitle}>Map View</Text>
            <Text style={styles.mapSubtitle}>Map preview coming soon</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.headerText}>Find Gyms Near You</Text>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Zip Code</Text>
                <TextInput
                    style={styles.textInput}
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

            <FlatList
                data={gyms}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingTop: 10 }}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.gymName}>{item.name}</Text>
                        <Text style={styles.address}>{item.address}</Text>
                    </View>
                )}
            />
        </SafeAreaView>
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
        textAlign: 'center',
    },

    inputContainer: {
        marginBottom: 20,
    },

    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#f8fafc',
        marginBottom: 6,
    },

    textInput: {
        borderWidth: 1,
        borderColor: '#334155',
        borderRadius: 12,
        padding: 12,
        marginBottom: 10,
        backgroundColor: '#1e293b',
        color: '#f8fafc',
    },

    button: {
        backgroundColor: '#22c55e',
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
    },

    buttonText: {
        color: '#0f172a',
        fontWeight: '700',
        fontSize: 16,
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
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
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
