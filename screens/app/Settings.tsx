import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
    TextInput,
    Modal,
    Switch,
    ScrollView,
} from 'react-native';

import {
    signOut,
    deleteUser,
    EmailAuthProvider,
    reauthenticateWithCredential,
} from '@react-native-firebase/auth';

import {
    getFirestore,
    doc,
    deleteDoc,
    updateDoc,
    serverTimestamp,
} from '@react-native-firebase/firestore';

import { auth } from '../../firebase/firebaseConfig';

const db = getFirestore();

export default function SettingsScreen() {

    const [showReauthModal, setShowReauthModal] = useState(false);
    const [password, setPassword] = useState('');
    const [pendingAction, setPendingAction] = useState<'delete' | 'deactivate' | null>(null);
    const [darkModeEnabled, setDarkModeEnabled] = useState(true);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

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

            if (pendingAction === 'delete') await deleteAccount();
            if (pendingAction === 'deactivate') await deactivateAccount();

            setPendingAction(null);
        } catch {
            Alert.alert('Authentication Failed', 'Incorrect password.');
        }
    };

    const deleteAccount = async () => {
        try {
            const user = auth.currentUser;
            if (!user) return;

            await deleteDoc(doc(db, 'users', user.uid));
            await deleteUser(user);

            Alert.alert('Account Deleted', 'Your account has been permanently deleted.');
        } catch {
            Alert.alert('Error', 'Failed to delete account.');
        }
    };

    const deactivateAccount = async () => {
        try {
            const user = auth.currentUser;
            if (!user) return;

            await updateDoc(doc(db, 'users', user.uid), {
                active: false,
                deactivatedAt: serverTimestamp(),
            });

            await signOut(auth);

            Alert.alert(
                'Account Deactivated',
                'Your account has been deactivated. You can reactivate by logging in again.'
            );
        } catch {
            Alert.alert('Error', 'Failed to deactivate account.');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.headerText}>Settings</Text>

            <View style={styles.card}>
                <Text style={styles.sectionTitle}>General</Text>

                <View style={styles.row}>
                    <Text style={styles.label}>Dark Mode</Text>
                    <Switch
                        value={darkModeEnabled}
                        onValueChange={setDarkModeEnabled}
                        trackColor={{ false: '#334155', true: '#22c55e' }}
                        thumbColor="#fff"
                    />
                </View>

                <View style={styles.divider} />

                <View style={styles.row}>
                    <Text style={styles.label}>Notifications</Text>
                    <Switch
                        value={notificationsEnabled}
                        onValueChange={setNotificationsEnabled}
                        trackColor={{ false: '#334155', true: '#22c55e' }}
                        thumbColor="#fff"
                    />
                </View>
            </View>

            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Account</Text>

                <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={() => requestReauth('deactivate')}
                >
                    <Text style={styles.buttonText}>Deactivate Account</Text>
                </TouchableOpacity>

                <Text style={styles.info}>
                    Account will reactivate if signed in.
                </Text>

                <View style={styles.divider} />

                <TouchableOpacity
                    style={styles.dangerButton}
                    onPress={() => requestReauth('delete')}
                >
                    <Text style={styles.buttonText}>Delete Account</Text>
                </TouchableOpacity>

                <Text style={styles.info}>
                    All user data and account will be deleted.
                </Text>

                <View style={styles.divider} />

                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={handleLogout}
                >
                    <Text style={styles.buttonText}>Log Out</Text>
                </TouchableOpacity>
            </View>

            <Modal transparent visible={showReauthModal} animationType="fade">
                <View style={styles.modalBackdrop}>
                    <View style={styles.modal}>
                        <Text style={styles.modalTitle}>Confirm Password</Text>

                        <TextInput
                            secureTextEntry
                            placeholder="Enter password"
                            placeholderTextColor="#94a3b8"
                            value={password}
                            onChangeText={setPassword}
                            style={styles.input}
                        />

                        <TouchableOpacity
                            style={styles.primaryButton}
                            onPress={handleReauthenticate}
                        >
                            <Text style={styles.buttonText}>Confirm</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                setShowReauthModal(false);
                                setPassword('');
                                setPendingAction(null);
                            }}
                        >
                            <Text style={styles.cancel}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a',
        padding: 20,
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

    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    label: {
        color: '#f8fafc',
        fontSize: 14,
    },

    divider: {
        height: 1,
        backgroundColor: '#334155',
        marginVertical: 15,
    },

    primaryButton: {
        backgroundColor: '#22c55e',
        padding: 14,
        borderRadius: 14,
        alignItems: 'center',
    },

    secondaryButton: {
        backgroundColor: '#334155',
        padding: 14,
        borderRadius: 14,
        alignItems: 'center',
        marginBottom: 8,
    },

    dangerButton: {
        backgroundColor: '#dc2626',
        padding: 14,
        borderRadius: 14,
        alignItems: 'center',
        marginBottom: 8,
    },

    buttonText: {
        color: '#fff',
        fontWeight: '600',
    },

    info: {
        color: '#94a3b8',
        fontSize: 13,
        marginBottom: 10,
    },

    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    modal: {
        backgroundColor: '#1e293b',
        width: '85%',
        padding: 20,
        borderRadius: 16,
    },

    modalTitle: {
        color: '#f8fafc',
        fontSize: 18,
        marginBottom: 15,
    },

    input: {
        backgroundColor: '#0f172a',
        color: '#fff',
        padding: 12,
        borderRadius: 10,
        marginBottom: 15,
    },

    cancel: {
        textAlign: 'center',
        color: '#94a3b8',
        marginTop: 10,
    },
});
