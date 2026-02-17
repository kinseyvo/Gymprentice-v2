import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert
} from 'react-native';
import { createUserWithEmailAndPassword, sendEmailVerification } from '@react-native-firebase/auth';
import { auth } from '../../firebase/firebaseConfig';

export default function SignUpScreen({ navigation }: any) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSignUp = async () => {
        setError('');

        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            setError('Please fill all fields.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            // Only create the user (does NOT auto-login)
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Send verification email
            await sendEmailVerification(user);

            // Sign out immediately so they are not logged in
            await auth.signOut();

            // Notify the user
            Alert.alert(
                'Account Created',
                'Please check your email to verify your account before logging in.',
                [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
            );

            // Optionally clear inputs
            setFirstName('');
            setLastName('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');

        } catch (error: any) {
            let message = 'Something went wrong. Please try again.';

            switch (error.code) {
                case 'auth/email-already-in-use':
                    message = 'Email already in use.';
                    break;
                case 'auth/invalid-email':
                    message = 'Invalid email address.';
                    break;
                case 'auth/weak-password':
                    message = 'Password is too weak.';
                    break;
            }

            setError(message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign Up</Text>

            <View style={styles.nameRow}>
                <TextInput
                    style={styles.inputFlex}
                    placeholder="First Name"
                    value={firstName}
                    onChangeText={(text) => {
                        setFirstName(text);
                        if (error) setError('');
                    }}
                />
                <TextInput
                    style={styles.inputFlex}
                    placeholder="Last Name"
                    value={lastName}
                    onChangeText={(text) => {
                        setLastName(text);
                        if (error) setError('');
                    }}
                />
            </View>

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

            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={(text) => {
                    setPassword(text);
                    if (error) setError('');
                }}
            />

            <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                secureTextEntry
                value={confirmPassword}
                onChangeText={(text) => {
                    setConfirmPassword(text);
                    if (error) setError('');
                }}
            />

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
                <Text>Already have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.link}>Login</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
    title: { fontSize: 32, fontWeight: 'bold', marginBottom: 32, textAlign: 'center' },
    nameRow: { flexDirection: 'row', marginBottom: 16, gap: 8 },
    inputFlex: { flex: 1, borderWidth: 1, borderRadius: 8, padding: 14 },
    input: { borderWidth: 1, borderRadius: 8, padding: 14, marginBottom: 16 },
    button: { backgroundColor: '#000', padding: 16, borderRadius: 8, marginTop: 8 },
    buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
    link: { color: '#007AFF', fontWeight: '600' },
    errorText: { color: 'red', marginBottom: 12, textAlign: 'center' },
});
