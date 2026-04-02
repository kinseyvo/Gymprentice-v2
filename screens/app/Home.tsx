import React, { useMemo, useState, useEffect } from 'react';
import {
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from '../../styles/HomeScreen';
import BottomFooter from '../../navigation/BottomFooter';
import { useTheme } from '../../src/context/ThemeContext';
import Config from 'react-native-config';

export default function HomeScreen({ navigation }: any) {
    const safeAreaInsets = useSafeAreaInsets();
    const { darkMode } = useTheme();

    const userName = 'Batman';

    const [latestWorkouts, setLatestWorkouts] = useState<any[]>([]);
    const [loadingWorkouts, setLoadingWorkouts] = useState(false);

    const [selectedWorkout, setSelectedWorkout] = useState<any | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    const gymTipOfTheDay = useMemo(() => {
        const tips = [
            'Consistency beats intensity. Show up today.',
            'Progress is built one rep at a time.',
            'Hydration matters more than you think.',
            'Perfect form > heavier weight.',
            'Rest days are part of training.',
        ];

        const dayIndex = new Date().getDate() % tips.length;
        return tips[dayIndex];
    }, []);

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
    }, []);

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
                        {gymTipOfTheDay}
                    </Text>
                </View>

                {/* Quick Actions */}
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

                {/* Latest Workouts */}
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: darkMode ? '#f8fafc' : '#0f172a' }]}>
                        Latest Workouts
                    </Text>

                    <TouchableOpacity onPress={() => navigation.navigate('Workouts')}>
                        <Text style={[styles.viewAllText, { color: darkMode ? '#22c55e' : '#16a34a' }]}>
                            View All
                        </Text>
                    </TouchableOpacity>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {loadingWorkouts ? (
                        <ActivityIndicator style={{ marginTop: 20 }} />
                    ) : (
                        latestWorkouts.map((workout, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.workoutCard,
                                    { backgroundColor: darkMode ? '#1e293b' : '#e2e8f0' },
                                ]}
                                activeOpacity={0.85}
                                onPress={() => {
                                    setSelectedWorkout(workout);
                                    setModalVisible(true);
                                }}
                            >
                                <Image
                                    source={{ uri: 'https://via.placeholder.com/140' }}
                                    style={styles.workoutImage}
                                />

                                <Text style={[styles.workoutTitle, { color: darkMode ? '#f8fafc' : '#0f172a' }]}>
                                    {workout.name}
                                </Text>

                                <Text style={[styles.workoutDescription, { color: darkMode ? '#94a3b8' : '#475569' }]}>
                                    {workout.muscle || 'Workout'}
                                </Text>
                            </TouchableOpacity>
                        ))
                    )}
                </ScrollView>

                {/* ===== TODAY STATS + ORIGINAL GRAPH ===== */}
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: darkMode ? '#f8fafc' : '#0f172a' }]}>
                        Today’s Stats
                    </Text>
                </View>

                <View style={[styles.statsCard, { backgroundColor: darkMode ? '#1e293b' : '#e2e8f0' }]}>
                    <View style={styles.statsRow}>
                        <View style={styles.statBlock}>
                            <Text style={[styles.statNumber, { color: darkMode ? '#f8fafc' : '#0f172a' }]}>1,240</Text>
                            <Text style={[styles.statLabel, { color: darkMode ? '#94a3b8' : '#475569' }]}>Calories</Text>
                        </View>

                        <View style={styles.statBlock}>
                            <Text style={[styles.statNumber, { color: darkMode ? '#f8fafc' : '#0f172a' }]}>45m</Text>
                            <Text style={[styles.statLabel, { color: darkMode ? '#94a3b8' : '#475569' }]}>Workout</Text>
                        </View>

                        <View style={styles.statBlock}>
                            <Text style={[styles.statNumber, { color: darkMode ? '#f8fafc' : '#0f172a' }]}>7,820</Text>
                            <Text style={[styles.statLabel, { color: darkMode ? '#94a3b8' : '#475569' }]}>Steps</Text>
                        </View>
                    </View>

                    {/* ✅ ORIGINAL BAR GRAPH (UNCHANGED) */}
                    <View style={styles.graphContainer}>
                        <View style={[styles.graphBar, { height: 30, backgroundColor: darkMode ? '#22c55e' : '#16a34a' }]} />
                        <View style={[styles.graphBar, { height: 45, backgroundColor: darkMode ? '#22c55e' : '#16a34a' }]} />
                        <View style={[styles.graphBar, { height: 20, backgroundColor: darkMode ? '#22c55e' : '#16a34a' }]} />
                        <View style={[styles.graphBar, { height: 60, backgroundColor: darkMode ? '#22c55e' : '#16a34a' }]} />
                        <View style={[styles.graphBar, { height: 35, backgroundColor: darkMode ? '#22c55e' : '#16a34a' }]} />
                        <View style={[styles.graphBar, { height: 50, backgroundColor: darkMode ? '#22c55e' : '#16a34a' }]} />
                        <View style={[styles.graphBar, { height: 25, backgroundColor: darkMode ? '#22c55e' : '#16a34a' }]} />
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