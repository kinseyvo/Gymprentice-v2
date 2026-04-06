import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from '../../styles/HomeScreen';
import BottomFooter from '../../navigation/BottomFooter';
import { useTheme } from '../../src/context/ThemeContext';
import Config from 'react-native-config';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function HomeScreen({ navigation }: any) {
    const safeAreaInsets = useSafeAreaInsets();
    const { darkMode } = useTheme();

    const [userName, setUserName] = useState('Batman');
    const [latestWorkouts, setLatestWorkouts] = useState<any[]>([]);
    const [loadingWorkouts, setLoadingWorkouts] = useState(false);
    const [selectedWorkout, setSelectedWorkout] = useState<any | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    const [gymTip, setGymTip] = useState('');
    const [loadingTip, setLoadingTip] = useState(false);

    const [graphData, setGraphData] = useState<number[]>([]);

    const fetchTodayCalories = async () => {
        try {
            const user = auth().currentUser;
            if (!user) return;

            const today = new Date().toISOString().split('T')[0];

            const snapshot = await firestore()
                .collection('users')
                .doc(user.uid)
                .collection('schedule')
                .where('date', '==', today)
                .get();

            let caloriesArray: number[] = [];

            snapshot.forEach(doc => {
                const data = doc.data();
                if (data?.calories) {
                    caloriesArray.push(data.calories);
                }
            });

            if (caloriesArray.length === 0) {
                caloriesArray = [30, 45, 20, 69, 25, 50, 25];
            }

            setGraphData(caloriesArray);
        } catch (error) {
            console.error('Error fetching calories:', error);
        }
    };

    const fetchUserName = async () => {
        try {
            const user = auth().currentUser;
            if (!user) return;

            const userDoc = await firestore()
                .collection('users')
                .doc(user.uid)
                .get();

            if (userDoc.exists()) {
                const data = userDoc.data();
                setUserName(data?.name || 'User');
            }
        } catch (error) {
            console.error('Error fetching user name:', error);
        }
    };

    const fetchGymTip = async () => {
        try {
            const user = auth().currentUser;
            if (!user) return;

            const today = new Date().toISOString().split('T')[0];

            const tipRef = firestore()
                .collection('users')
                .doc(user.uid)
                .collection('dailyTip')
                .doc('tip');

            const doc = await tipRef.get();

            if (doc.exists()) {
                const data = doc.data();
                if (data?.date === today && data?.tip) {
                    setGymTip(data.tip);
                    return;
                }
            }

            setLoadingTip(true);

            const apiKey = Config.OPENAI_API_KEY;

            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    messages: [
                        {
                            role: 'user',
                            content: `Give me 1 short gym tip (1 sentence). No formatting.`,
                        },
                    ],
                }),
            });

            const data = await response.json();
            const tip = data?.choices?.[0]?.message?.content?.trim();

            if (tip) {
                setGymTip(tip);

                await tipRef.set({
                    tip,
                    date: today,
                });
            }
        } catch (error) {
            console.error('Error fetching gym tip:', error);
            setGymTip('Stay consistent and focus on proper form.');
        } finally {
            setLoadingTip(false);
        }
    };

    const fetchLatestWorkouts = async () => {
        try {
            setLoadingWorkouts(true);

            const apiKey = Config.API_NINJAS_KEY;

            if (!apiKey) {
                console.error('Missing API key');
                setLatestWorkouts([]);
                return;
            }

            const response = await fetch(
                'https://api.api-ninjas.com/v1/exercises?type=strength',
                {
                    headers: {
                        'X-Api-Key': apiKey,
                    },
                }
            );

            const data = await response.json();

            if (Array.isArray(data)) {
                setLatestWorkouts(data.slice(0, 6));
            } else {
                setLatestWorkouts([]);
            }
        } catch (error) {
            console.error('Error fetching latest workouts:', error);
            setLatestWorkouts([]);
        } finally {
            setLoadingWorkouts(false);
        }
    };

    useEffect(() => {
        fetchLatestWorkouts();
        fetchUserName();
        fetchGymTip();
        fetchTodayCalories();
    }, []);

    const getWorkoutIcon = (muscle: string) => {
        const m = muscle?.toLowerCase();

        if (m?.includes('chest')) return 'arm-flex';
        if (m?.includes('back')) return 'human-handsdown';
        if (m?.includes('legs') || m?.includes('quadriceps') || m?.includes('hamstrings'))
            return 'run';
        if (m?.includes('shoulders')) return 'arm-flex-outline';
        if (m?.includes('biceps') || m?.includes('triceps')) return 'arm-flex';
        if (m?.includes('abs')) return 'six-pack';

        return 'dumbbell';
    };

    return (
        <View
            style={[
                styles.container,
                {
                    paddingTop: safeAreaInsets.top,
                    backgroundColor: darkMode ? '#0f172a' : '#ffffff',
                },
            ]}
        >
            <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={[styles.logoText, { color: darkMode ? '#22c55e' : '#16a34a' }]}>
                    Gymprentice
                </Text>

                <Text style={[styles.greetingText, { color: darkMode ? '#f8fafc' : '#0f172a' }]}>
                    Hello, {userName}!
                </Text>

                <View style={[styles.tipCard, { backgroundColor: darkMode ? '#1e293b' : '#e2e8f0' }]}>
                    <Text style={[styles.tipText, { color: darkMode ? '#f8fafc' : '#0f172a' }]}>
                        {loadingTip ? 'Generating tip...' : gymTip}
                    </Text>
                </View>

                <View style={styles.quickGrid}>
                    {[
                        'Workouts',
                        'Nutrition',
                        'Schedule',
                        'Challenges',
                        'Locations',
                        'Community',
                    ].map((label) => (
                        <TouchableOpacity
                            key={label}
                            style={[
                                styles.quickBox,
                                { backgroundColor: darkMode ? '#1e293b' : '#e2e8f0' },
                            ]}
                            onPress={() => navigation.navigate(label)}
                        >
                            <Text style={[styles.quickBoxText, { color: darkMode ? '#f8fafc' : '#0f172a' }]}>
                                {label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: darkMode ? '#f8fafc' : '#0f172a' }]}>
                        Latest Workouts
                    </Text>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {loadingWorkouts && (
                        <ActivityIndicator style={{ marginTop: 20 }} />
                    )}

                    {!loadingWorkouts &&
                        latestWorkouts.map((workout, index) => (
                            <TouchableOpacity
                                key={workout.name + index}
                                style={[
                                    styles.workoutCard,
                                    { backgroundColor: darkMode ? '#1e293b' : '#e2e8f0' },
                                ]}
                                onPress={() => {
                                    setSelectedWorkout(workout);
                                    setModalVisible(true);
                                }}
                            >
                                <View style={[styles.workoutImage, { justifyContent: 'center', alignItems: 'center' }]}>
                                    <MaterialCommunityIcons
                                        name={getWorkoutIcon(workout.muscle)}
                                        size={40}
                                        color={darkMode ? '#22c55e' : '#16a34a'}
                                    />
                                </View>

                                <Text style={[styles.workoutTitle, { color: darkMode ? '#f8fafc' : '#0f172a' }]}>
                                    {workout.name}
                                </Text>

                                <Text style={[styles.workoutDescription, { color: darkMode ? '#94a3b8' : '#475569' }]}>
                                    {workout.muscle || 'Workout'}
                                </Text>
                            </TouchableOpacity>
                        ))}
                </ScrollView>

                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: darkMode ? '#f8fafc' : '#0f172a' }]}>
                        Today’s Stats
                    </Text>
                </View>

                <View
                    style={[
                        styles.statsCard,
                        {
                            backgroundColor: darkMode ? '#1e293b' : '#e2e8f0',
                            paddingBottom: 16,
                        },
                    ]}
                >
                    <View style={styles.statsRow}>
                        <View style={styles.statBlock}>
                            <Text style={styles.statNumber}>1,293</Text>
                            <Text style={styles.statLabel}>Calories</Text>
                        </View>

                        <View style={styles.statBlock}>
                            <Text style={styles.statNumber}>45m</Text>
                            <Text style={styles.statLabel}>Workout</Text>
                        </View>

                        <View style={styles.statBlock}>
                            <Text style={styles.statNumber}>9,280</Text>
                            <Text style={styles.statLabel}>Steps</Text>
                        </View>
                    </View>

                    <View style={{ height: 16 }} />

                    <View
                        style={{
                            height: 120,
                            flexDirection: 'row',
                            alignItems: 'flex-end',
                            justifyContent: 'space-between',
                            paddingHorizontal: 10,
                        }}
                    >
                        {graphData.map((value, index) => (
                            <View
                                key={index}
                                style={{
                                    width: 10,
                                    height: Math.min(value * 2, 100), // prevents overflow
                                    backgroundColor: darkMode ? '#22c55e' : '#16a34a',
                                    borderRadius: 4,
                                }}
                            />
                        ))}
                    </View>
                </View>

                <View style={{ height: 90 }} />
            </ScrollView>

            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ width: '88%', borderRadius: 18, padding: 20, backgroundColor: darkMode ? '#1e293b' : '#fff' }}>
                        <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 8 }}>
                            {selectedWorkout?.name || 'Workout'}
                        </Text>

                        <Text>💪 Muscle: {selectedWorkout?.muscle || 'N/A'}</Text>
                        <Text>🛠 Equipment: {selectedWorkout?.equipment || 'N/A'}</Text>
                        <Text style={{ marginBottom: 12 }}>
                            📋 {selectedWorkout?.instructions || 'No instructions available'}
                        </Text>

                        <TouchableOpacity
                            onPress={() => {
                                setModalVisible(false);
                                setSelectedWorkout(null);
                            }}
                            style={{
                                padding: 12,
                                backgroundColor: '#22c55e',
                                borderRadius: 10,
                                alignItems: 'center',
                            }}
                        >
                            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <BottomFooter activeTab="Home" />
        </View>
    );
}