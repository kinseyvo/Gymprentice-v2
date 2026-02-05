import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from '@react-native-firebase/auth';
import { auth } from '../../firebase/firebaseConfig';

export default function LoginScreen({ navigation }: any) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        setError('');

        if (!email || !password) {
            setError('Please enter email and password.');
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error: any) {
            let message = 'Something went wrong. Please try again.';

            switch (error.code) {
                case 'auth/user-not-found':
                    message = 'No account found with this email.';
                    break;
                case 'auth/wrong-password':
                    message = 'Incorrect password.';
                    break;
                case 'auth/invalid-email':
                    message = 'Invalid email address.';
                    break;
            }

            setError(message);
        }
    };

    const handleForgotPassword = async () => {
        setError('');

        if (!email) {
            setError('Please enter your email first.');
            return;
        }

        try {
            await sendPasswordResetEmail(auth, email);
            setError('Password reset email sent. Check your inbox.');
        } catch (error: any) {
            setError(error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome</Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                autoCapitalize="none"
                value={email}
                onChangeText={(text) => {
                    setEmail(text);
                    if (error) setError('');
                }}
            />

            <View style={styles.inputRow}>
                <TextInput
                    style={styles.inputFlex}
                    placeholder="Password"
                    secureTextEntry
                    value={password}
                    onChangeText={(text) => {
                        setPassword(text);
                        if (error) setError('');
                    }}
                />

                <TouchableOpacity onPress={handleForgotPassword}>
                    <Text style={styles.forgotText}>Forgot?</Text>
                </TouchableOpacity>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
                <Text>Don't have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                    <Text style={styles.link}>Sign Up</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 24
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 32,
        textAlign: 'center'
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 14,
        marginBottom: 16
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 14,
        marginBottom: 16,
    },
    inputFlex: {
        flex: 1,
        paddingVertical: 14
    },
    forgotText: {
        color: '#007AFF',
        fontWeight: '500'
    },
    button: {
        backgroundColor: '#000',
        padding: 16,
        borderRadius: 8,
        marginTop: 8
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold'
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24
    },
    link: {
        color: '#007AFF',
        fontWeight: '600'
    },
    errorText: {
        color: 'red',
        marginBottom: 12,
        textAlign: 'center'
    },
});
