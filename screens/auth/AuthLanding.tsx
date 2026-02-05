import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function AuthLanding({ navigation }: any) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Gymprentice</Text>

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Login')}
            >
                <Text style={styles.buttonText}>Log In</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('SignUp')}
            >
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
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
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 40
    },
    button: {
        width: '70%',
        padding: 15,
        backgroundColor: '#000',
        marginBottom: 15,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16
    },
});