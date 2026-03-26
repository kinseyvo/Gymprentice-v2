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
import BottomFooter from '../../navigation/BottomFooter';
import { useTheme } from '../../src/context/ThemeContext';

const db = getFirestore();

export default function SettingsScreen() {
    const [showReauthModal, setShowReauthModal] = useState(false);
    const [password, setPassword] = useState('');
    const [pendingAction, setPendingAction] = useState<'delete' | 'deactivate' | null>(null);
    const { darkMode, setDarkMode } = useTheme();
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

    const bgColor = darkMode ? '#0f172a' : '#ffffff';
    const cardColor = darkMode ? '#1e293b' : '#f1f5f9';
    const textColor = darkMode ? '#f8fafc' : '#0f172a';
    const secondaryColor = darkMode ? '#94a3b8' : '#64748b';
    const inputBg = darkMode ? '#334155' : '#e2e8f0';

    return (
        <View style={[styles.container, { backgroundColor: bgColor }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={[styles.headerText, { color: '#22c55e' }]}>Settings</Text>

                <View style={[styles.card, { backgroundColor: cardColor }]}>
                    <Text style={[styles.sectionTitle, { color: textColor }]}>General</Text>

                    <View style={styles.row}>
                        <Text style={[styles.label, { color: textColor }]}>Dark Mode</Text>
                        <Switch
                            value={darkMode}
                            onValueChange={setDarkMode}
                            trackColor={{ false: '#334155', true: '#22c55e' }}
                            thumbColor="#fff"
                        />
                    </View>

                    <View style={[styles.divider, { backgroundColor: darkMode ? '#334155' : '#cbd5e1' }]} />

                    <View style={styles.row}>
                        <Text style={[styles.label, { color: textColor }]}>Notifications</Text>
                        <Switch
                            value={notificationsEnabled}
                            onValueChange={setNotificationsEnabled}
                            trackColor={{ false: '#334155', true: '#22c55e' }}
                            thumbColor="#fff"
                        />
                    </View>
                </View>

                <View style={[styles.card, { backgroundColor: cardColor }]}>
                    <Text style={[styles.sectionTitle, { color: textColor }]}>Account</Text>

                    <TouchableOpacity
                        style={[styles.secondaryButton, { backgroundColor: darkMode ? '#334155' : '#e2e8f0' }]}
                        onPress={() => requestReauth('deactivate')}
                    >
                        <Text style={[styles.buttonText, { color: darkMode ? '#f8fafc' : '#0f172a' }]}>Deactivate Account</Text>
                    </TouchableOpacity>

                    <Text style={[styles.info, { color: secondaryColor }]}>
                        Account will reactivate if signed in.
                    </Text>

                    <View style={[styles.divider, { backgroundColor: darkMode ? '#334155' : '#cbd5e1' }]} />

                    <TouchableOpacity
                        style={[styles.dangerButton, { backgroundColor: '#dc2626' }]}
                        onPress={() => requestReauth('delete')}
                    >
                        <Text style={styles.buttonText}>Delete Account</Text>
                    </TouchableOpacity>

                    <Text style={[styles.info, { color: secondaryColor }]}>
                        All user data and account will be deleted.
                    </Text>

                    <View style={[styles.divider, { backgroundColor: darkMode ? '#334155' : '#cbd5e1' }]} />

                    <TouchableOpacity
                        style={[styles.primaryButton, { backgroundColor: '#22c55e' }]}
                        onPress={handleLogout}
                    >
                        <Text style={[styles.buttonText, { color: darkMode ? '#0f172a' : '#ffffff' }]}>Log Out</Text>
                    </TouchableOpacity>
                </View>

                <Modal transparent visible={showReauthModal} animationType="fade">
                    <View style={[styles.modalBackdrop]}>
                        <View style={[styles.modal, { backgroundColor: cardColor }]}>
                            <Text style={[styles.modalTitle, { color: textColor }]}>Confirm Password</Text>

                            <TextInput
                                secureTextEntry
                                placeholder="Enter password"
                                placeholderTextColor={secondaryColor}
                                value={password}
                                onChangeText={setPassword}
                                style={[styles.input, { backgroundColor: inputBg, color: textColor }]}
                            />

                            <TouchableOpacity
                                style={[styles.primaryButton, { backgroundColor: '#22c55e' }]}
                                onPress={handleReauthenticate}
                            >
                                <Text style={[styles.buttonText, { color: darkMode ? '#0f172a' : '#ffffff' }]}>Confirm</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {
                                    setShowReauthModal(false);
                                    setPassword('');
                                    setPendingAction(null);
                                }}
                            >
                                <Text style={[styles.cancel, { color: secondaryColor }]}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </ScrollView>

            <BottomFooter activeTab="Home" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 80,
    },

    headerText: {
        fontSize: 26,
        fontWeight: '700',
        marginBottom: 20,
    },

    card: {
        borderRadius: 18,
        padding: 18,
        marginBottom: 20,
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 15,
    },

    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    label: {
        fontSize: 14,
    },

    divider: {
        height: 1,
        marginVertical: 15,
    },

    primaryButton: {
        padding: 14,
        borderRadius: 14,
        alignItems: 'center',
        marginBottom: 8,
    },

    secondaryButton: {
        padding: 14,
        borderRadius: 14,
        alignItems: 'center',
        marginBottom: 8,
    },

    dangerButton: {
        padding: 14,
        borderRadius: 14,
        alignItems: 'center',
        marginBottom: 8,
    },

    buttonText: {
        fontWeight: '600',
    },

    info: {
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
        width: '85%',
        padding: 20,
        borderRadius: 16,
    },

    modalTitle: {
        fontSize: 18,
        marginBottom: 15,
    },

    input: {
        padding: 12,
        borderRadius: 10,
        marginBottom: 15,
    },

    cancel: {
        textAlign: 'center',
        marginTop: 10,
    },
});