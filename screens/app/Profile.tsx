import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { Picker } from '@react-native-picker/picker';
import BottomFooter from '../../navigation/BottomFooter';

export default function ProfileScreen() {
    const navigation = useNavigation<any>();

    const [editing, setEditing] = useState(false);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [gymGoal, setGymGoal] = useState('');
    const [mealGoal, setMealGoal] = useState('');

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
                    },
                    { merge: true }
                );

            setEditing(false);
            console.log('Profile saved!');
        } catch (error) {
            console.log('Error saving profile:', error);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.headerText}>Profile</Text>

                {/* Profile Image */}
                <View style={styles.profilePicContainer}>
                    <Image source={{ uri: 'https://via.placeholder.com/120' }} style={styles.profilePic} />
                </View>

                {/* Profile Fields */}
                <View style={styles.card}>
                    {/* Name */}
                    <Text style={styles.label}>Name</Text>
                    <TextInput
                        style={styles.input}
                        value={name}
                        editable={editing}
                        onChangeText={setName}
                        placeholder="Enter name"
                        placeholderTextColor="#64748b"
                    />

                    {/* Email */}
                    <Text style={styles.label}>Email</Text>
                    <TextInput style={styles.input} value={email} editable={false} />

                    {/* Weight */}
                    <Text style={styles.label}>Weight</Text>
                    <TextInput
                        style={styles.input}
                        value={weight}
                        editable={editing}
                        onChangeText={setWeight}
                        placeholder="Enter weight"
                        placeholderTextColor="#64748b"
                    />

                    {/* Height */}
                    <Text style={styles.label}>Height</Text>
                    <TextInput
                        style={styles.input}
                        value={height}
                        editable={editing}
                        onChangeText={setHeight}
                        placeholder="Enter height"
                        placeholderTextColor="#64748b"
                    />

                    {/* Gym Goal Picker */}
                    <Text style={styles.label}>Gym Goal</Text>
                    <Picker
                        selectedValue={gymGoal}
                        onValueChange={(itemValue) => setGymGoal(itemValue)}
                        enabled={editing}
                        style={styles.picker}
                        dropdownIconColor="#22c55e"
                    >
                        <Picker.Item label="Select goal" value="" />
                        <Picker.Item label="Lose Weight" value="Lose Weight" />
                        <Picker.Item label="Build Muscle" value="Build Muscle" />
                        <Picker.Item label="Improve Endurance" value="Improve Endurance" />
                        <Picker.Item label="General Fitness" value="General Fitness" />
                    </Picker>

                    {/* Meal Goal Picker */}
                    <Text style={styles.label}>Meal Goal</Text>
                    <Picker
                        selectedValue={mealGoal}
                        onValueChange={(itemValue) => setMealGoal(itemValue)}
                        enabled={editing}
                        style={styles.picker}
                        dropdownIconColor="#22c55e"
                    >
                        <Picker.Item label="Select goal" value="" />
                        <Picker.Item label="High Protein" value="High Protein" />
                        <Picker.Item label="Weight Loss" value="Weight Loss" />
                        <Picker.Item label="Maintenance" value="Maintenance" />
                        <Picker.Item label="Bulk" value="Bulk" />
                    </Picker>
                </View>

                {/* Edit / Save Buttons */}
                {!editing ? (
                    <TouchableOpacity style={styles.button} onPress={() => setEditing(true)}>
                        <Text style={styles.buttonText}>Edit Profile</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.button} onPress={handleSave}>
                        <Text style={styles.buttonText}>Save Profile</Text>
                    </TouchableOpacity>
                )}

                {/* Settings */}
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Settings')}>
                    <Text style={styles.buttonText}>Settings</Text>
                </TouchableOpacity>
            </ScrollView>

            <BottomFooter activeTab="Profile" />
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
    profilePicContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    profilePic: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    card: {
        backgroundColor: '#1e293b',
        borderRadius: 18,
        padding: 18,
        marginBottom: 20,
    },
    label: {
        color: '#f8fafc',
        marginTop: 10,
        marginBottom: 4,
        fontWeight: '600',
    },
    input: {
        backgroundColor: '#0f172a',
        borderRadius: 10,
        padding: 10,
        color: '#f8fafc',
    },
    picker: {
        backgroundColor: '#0f172a',
        color: '#f8fafc',
        marginBottom: 10,
        borderRadius: 10,
    },
    button: {
        backgroundColor: '#1e293b',
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