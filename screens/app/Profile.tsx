import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Image,
    Alert,
    Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import { Picker } from '@react-native-picker/picker';
import ImagePicker from 'react-native-image-crop-picker';
import BottomFooter from '../../navigation/BottomFooter';
import { useTheme } from '../../src/context/ThemeContext';

export default function ProfileScreen() {
    const navigation = useNavigation<any>();
    const { darkMode } = useTheme();

    const [editing, setEditing] = useState(false);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [gymGoal, setGymGoal] = useState('');
    const [mealGoal, setMealGoal] = useState('');
    const [profilePicUri, setProfilePicUri] = useState<string | null>(null);

    useEffect(() => {
        const loadUserData = async () => {
            const user = auth().currentUser;
            if (!user) return;

            const doc = await firestore().collection('users').doc(user.uid).get();

            if (doc.exists()) {
                const data = doc.data() as any;
                setName(data?.name || '');
                setEmail(data?.email || user.email || '');
                setWeight(data?.weight || '');
                setHeight(data?.height || '');
                setGymGoal(data?.gymGoal || '');
                setMealGoal(data?.mealGoal || '');
                setProfilePicUri(data?.profilePic || null);
            } else {
                setEmail(user.email || '');
            }
        };

        loadUserData();
    }, []);

    const handleSave = async () => {
        const user = auth().currentUser;
        if (!user) return;

        try {
            await firestore()
                .collection('users')
                .doc(user.uid)
                .set(
                    {
                        name,
                        email,
                        weight,
                        height,
                        gymGoal,
                        mealGoal,
                        profilePic: profilePicUri,
                    },
                    { merge: true }
                );

            setEditing(false);
        } catch (error) {
            console.log('Error saving profile:', error);
        }
    };

    const handleChangePhoto = () => {
        Alert.alert("Change Photo", "Choose photo source", [
            {
                text: "Camera",
                onPress: async () => {
                    try {
                        const result = await ImagePicker.openCamera({
                            width: 300,
                            height: 300,
                            cropping: true,
                            cropperCircleOverlay: true,
                            compressImageQuality: 0.8,
                        });
                        uploadPhoto(result.path);
                    } catch { }
                },
            },
            {
                text: "Gallery",
                onPress: async () => {
                    try {
                        const result = await ImagePicker.openPicker({
                            width: 300,
                            height: 300,
                            cropping: true,
                            cropperCircleOverlay: true,
                            compressImageQuality: 0.8,
                        });
                        uploadPhoto(result.path);
                    } catch { }
                },
            },
            { text: "Cancel", style: "cancel" },
        ]);
    };

    const uploadPhoto = async (uri: string) => {
        const user = auth().currentUser;
        if (!user) return;

        const filename = `profilePics/${user.uid}.jpg`;
        const reference = storage().ref(filename);

        try {
            const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
            await reference.putFile(uploadUri);

            const url = await reference.getDownloadURL();
            setProfilePicUri(url);

            await firestore().collection('users').doc(user.uid).set(
                { profilePic: url },
                { merge: true }
            );
        } catch {
            Alert.alert('Upload failed');
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: darkMode ? '#0f172a' : '#ffffff' }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={[styles.headerText, { color: darkMode ? '#22c55e' : '#16a34a' }]}>
                    Profile
                </Text>

                <View style={styles.profilePicContainer}>
                    <Image
                        source={{ uri: profilePicUri || 'https://via.placeholder.com/120' }}
                        style={styles.profilePic}
                    />
                    <TouchableOpacity style={styles.changePhotoButton} onPress={handleChangePhoto}>
                        <Text style={styles.changePhotoText}>Change Photo</Text>
                    </TouchableOpacity>
                </View>

                <View style={[styles.card, { backgroundColor: darkMode ? '#1e293b' : '#e2e8f0' }]}>
                    <Text style={[styles.label, { color: darkMode ? '#f8fafc' : '#0f172a' }]}>Name</Text>
                    <TextInput
                        style={[styles.input, { backgroundColor: darkMode ? '#0f172a' : '#ffffff', color: darkMode ? '#f8fafc' : '#0f172a' }]}
                        value={name}
                        editable={editing}
                        onChangeText={setName}
                    />

                    <Text style={[styles.label, { color: darkMode ? '#f8fafc' : '#0f172a' }]}>Email</Text>
                    <TextInput style={[styles.input, { color: darkMode ? '#f8fafc' : '#0f172a' }]} value={email} editable={false} />

                    <Text style={[styles.label, { color: darkMode ? '#f8fafc' : '#0f172a' }]}>Weight</Text>
                    <TextInput
                        style={[styles.input, { backgroundColor: darkMode ? '#0f172a' : '#ffffff', color: darkMode ? '#f8fafc' : '#0f172a' }]}
                        value={weight}
                        editable={editing}
                        onChangeText={setWeight}
                    />

                    <Text style={[styles.label, { color: darkMode ? '#f8fafc' : '#0f172a' }]}>Height</Text>
                    <TextInput
                        style={[styles.input, { backgroundColor: darkMode ? '#0f172a' : '#ffffff', color: darkMode ? '#f8fafc' : '#0f172a' }]}
                        value={height}
                        editable={editing}
                        onChangeText={setHeight}
                    />

                    <Text style={[styles.label, { color: darkMode ? '#f8fafc' : '#0f172a' }]}>Gym Goal</Text>
                    <Picker
                        selectedValue={gymGoal}
                        onValueChange={(itemValue) => setGymGoal(itemValue)}
                        enabled={editing}
                        style={[styles.picker, { backgroundColor: darkMode ? '#0f172a' : '#ffffff', color: darkMode ? '#f8fafc' : '#0f172a' }]}
                    >
                        <Picker.Item label="Select goal" value="" />
                        <Picker.Item label="Lose Weight" value="Lose Weight" />
                        <Picker.Item label="Build Muscle" value="Build Muscle" />
                        <Picker.Item label="Improve Endurance" value="Improve Endurance" />
                        <Picker.Item label="General Fitness" value="General Fitness" />
                    </Picker>

                    <Text style={[styles.label, { color: darkMode ? '#f8fafc' : '#0f172a' }]}>Meal Goal</Text>
                    <Picker
                        selectedValue={mealGoal}
                        onValueChange={(itemValue) => setMealGoal(itemValue)}
                        enabled={editing}
                        style={[styles.picker, { backgroundColor: darkMode ? '#0f172a' : '#ffffff', color: darkMode ? '#f8fafc' : '#0f172a' }]}
                    >
                        <Picker.Item label="Select goal" value="" />
                        <Picker.Item label="High Protein" value="High Protein" />
                        <Picker.Item label="Weight Loss" value="Weight Loss" />
                        <Picker.Item label="Maintenance" value="Maintenance" />
                        <Picker.Item label="Bulk" value="Bulk" />
                    </Picker>
                </View>

                <TouchableOpacity style={[styles.button, { backgroundColor: darkMode ? '#1e293b' : '#e2e8f0' }]} onPress={() => setEditing(!editing)}>
                    <Text style={styles.buttonText}>
                        {editing ? 'Save Profile' : 'Edit Profile'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, { backgroundColor: darkMode ? '#1e293b' : '#e2e8f0' }]} onPress={() => navigation.navigate('Settings')}>
                    <Text style={styles.buttonText}>Settings</Text>
                </TouchableOpacity>
            </ScrollView>

            <BottomFooter activeTab="Profile" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 80
    },
    headerText: {
        fontSize: 26,
        fontWeight: '700',
        marginBottom: 20
    },
    profilePicContainer: {
        alignItems: 'center',
        marginBottom: 20
    },
    profilePic: {
        width: 120,
        height: 120,
        borderRadius: 60
    },
    changePhotoButton: {
        marginTop: 10,
        backgroundColor: '#22c55e',
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 12,
    },
    changePhotoText: {
        color: '#0f172a',
        fontWeight: '600'
    },
    card: {
        borderRadius: 18,
        padding: 18,
        marginBottom: 20
    },
    label: {
        marginTop: 10,
        marginBottom: 4,
        fontWeight: '600'
    },
    input: {
        borderRadius: 10,
        padding: 10
    },
    picker: {
        marginBottom: 10,
        borderRadius: 10
    },
    button: {
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
});