import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
    TextInput,
    Modal,
} from 'react-native';

import {
    signOut,
    deleteUser,
    EmailAuthProvider,
    reauthenticateWithCredential,
} from '@react-native-firebase/auth';

import { getFirestore, doc, deleteDoc, updateDoc, serverTimestamp } from '@react-native-firebase/firestore';
import { auth } from '../../firebase/firebaseConfig';

const db = getFirestore(); // modular Firestore

export default function SettingsScreen() {
    const [showReauthModal, setShowReauthModal] = useState(false);
    const [password, setPassword] = useState('');
    const [pendingAction, setPendingAction] = useState<'delete' | 'deactivate' | null>(null);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            Alert.alert('Logged out', 'You have been successfully logged out.');
        } catch {
            Alert.alert('Error', 'Failed to log out.');
        }
    };

    const requestReauth = (action: 'delete' | 'deactivate') => {
        setPendingAction(action);
        setShowReauthModal(true);
    };

    const handleReauthenticate = async () => {
        try {
            const user = auth.currentUser;
            if (!user || !user.email) throw new Error('No user');

            const credential = EmailAuthProvider.credential(user.email, password);
            await reauthenticateWithCredential(user, credential);

            setShowReauthModal(false);
            setPassword('');

            if (pendingAction === 'delete') {
                await deleteAccount();
            } else if (pendingAction === 'deactivate') {
                await deactivateAccount();
            }

            setPendingAction(null);
        } catch {
            Alert.alert('Authentication Failed', 'Incorrect password.');
        }
    };

    const deleteAccount = async () => {
        try {
            const user = auth.currentUser;
            if (!user) return;

            // Delete Firestore user data (modular API)
            const userRef = doc(db, 'users', user.uid);
            await deleteDoc(userRef);

            // Delete Firebase Auth user
            await deleteUser(user);

            Alert.alert('Account Deleted', 'Your account has been permanently deleted.');
        } catch (err: any) {
            console.log('Delete account error:', err);
            Alert.alert('Error', 'Failed to delete account.');
        }
    };

    const deactivateAccount = async () => {
        try {
            const user = auth.currentUser;
            if (!user) return;

            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, {
                active: false,
                deactivatedAt: serverTimestamp(),
            });

            await signOut(auth);

            Alert.alert(
                'Account Deactivated',
                'Your account has been deactivated. You can reactivate by logging in again.'
            );
        } catch (err: any) {
            console.log('Deactivate account error:', err);
            Alert.alert('Error', 'Failed to deactivate account.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Settings</Text>

            <TouchableOpacity style={styles.button} onPress={handleLogout}>
                <Text style={styles.buttonText}>Log Out</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.deactivateButton}
                onPress={() => requestReauth('deactivate')}
            >
                <Text style={styles.buttonText}>Deactivate Account</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => requestReauth('delete')}
            >
                <Text style={styles.buttonText}>Delete Account</Text>
            </TouchableOpacity>

            <Modal transparent visible={showReauthModal} animationType="fade">
                <View style={styles.modalBackdrop}>
                    <View style={styles.modal}>
                        <Text style={styles.modalTitle}>Confirm Password</Text>

                        <TextInput
                            secureTextEntry
                            placeholder="Enter your password"
                            value={password}
                            onChangeText={setPassword}
                            style={styles.input}
                        />

                        <TouchableOpacity style={styles.confirmButton} onPress={handleReauthenticate}>
                            <Text style={styles.buttonText}>Confirm</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                setShowReauthModal(false);
                                setPassword('');
                                setPendingAction(null);
                            }}
                        >
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    title: {
        fontSize: 24,
        marginBottom: 30
    },
    button: {
        backgroundColor: '#444',
        padding: 15,
        borderRadius: 8,
        minWidth: 220,
        alignItems: 'center',
        marginBottom: 15
    },
    deactivateButton: {
        backgroundColor: '#f59e0b',
        padding: 15,
        borderRadius: 8,
        minWidth: 220,
        alignItems: 'center',
        marginBottom: 15
    },
    deleteButton: {
        backgroundColor: 'red',
        padding: 15,
        borderRadius: 8,
        minWidth: 220,
        alignItems: 'center'
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold'
    },
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modal: {
        backgroundColor: '#fff',
        width: '85%',
        padding: 20,
        borderRadius: 10
    },
    modalTitle: {
        fontSize: 18,
        marginBottom: 10
    },
    input: {
        borderWidth: 1,
        borderRadius: 6,
        padding: 10,
        marginBottom: 15
    },
    confirmButton: { 
        backgroundColor: '#000',
        padding: 12,
        borderRadius: 6,
        alignItems: 'center',
        marginBottom: 10
    },
    cancelText: {
        textAlign: 'center',
        color: '#007AFF'
    },
});
