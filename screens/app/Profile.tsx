import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BottomFooter from '../../navigation/BottomFooter';

export default function ProfileScreen() {
    const navigation = useNavigation<any>();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Profile</Text>

            <TouchableOpacity
                style={styles.settingsButton}
                onPress={() => navigation.navigate('Settings')}
            >
                <Text style={styles.buttonText}>Settings</Text>
            </TouchableOpacity>

            <BottomFooter activeTab="Profile" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20
    },
    settingsButton: {
        backgroundColor: '#000',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
        marginBottom: 30
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold'
    }
});
