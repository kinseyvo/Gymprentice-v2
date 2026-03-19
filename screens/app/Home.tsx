import React, { useMemo } from 'react';
import {
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from '../../styles/HomeScreen';
import BottomFooter from '../../navigation/BottomFooter';
import { useTheme } from '../../src/context/ThemeContext';

export default function HomeScreen({ navigation }: any) {
    const safeAreaInsets = useSafeAreaInsets();
    const { darkMode } = useTheme();

    // replace later with Firebase user data
    const userName = 'Batman';

    // tip of the Day
    // change for AI tips later
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

    // replace later with Firestore data
    const featuredWorkouts = [
        {
            id: '1',
            title: 'Upper Body Blast',
            image: 'https://via.placeholder.com/140',
            description: 'Chest, shoulders & triceps',
        },
        {
            id: '2',
            title: 'Leg Day',
            image: 'https://via.placeholder.com/140',
            description: 'Quads, glutes, hamstrings',
        },
        {
            id: '3',
            title: 'Core Strength',
            image: 'https://via.placeholder.com/140',
            description: 'Abs & stability',
        },
    ];

    return (
        <View
            style={[
                styles.container,
                { paddingTop: safeAreaInsets.top, backgroundColor: darkMode ? '#0f172a' : '#ffffff' },
            ]}
        >
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
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
                            activeOpacity={0.85}
                        >
                            <Text style={[styles.quickBoxText, { color: darkMode ? '#f8fafc' : '#0f172a' }]}>
                                {label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/*  Latest Workouts  */}
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: darkMode ? '#f8fafc' : '#0f172a' }]}>
                        Latest Workouts
                    </Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Workouts')}
                    >
                        <Text style={[styles.viewAllText, { color: darkMode ? '#22c55e' : '#16a34a' }]}>
                            View All
                        </Text>
                    </TouchableOpacity>
                </View>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                >
                    {featuredWorkouts.map((workout) => (
                        <TouchableOpacity
                            key={workout.id}
                            style={[styles.workoutCard, { backgroundColor: darkMode ? '#1e293b' : '#e2e8f0' }]}
                            activeOpacity={0.85}
                        >
                            <Image
                                source={{ uri: workout.image }}
                                style={styles.workoutImage}
                            />
                            <Text style={[styles.workoutTitle, { color: darkMode ? '#f8fafc' : '#0f172a' }]}>
                                {workout.title}
                            </Text>
                            <Text style={[styles.workoutDescription, { color: darkMode ? '#94a3b8' : '#475569' }]}>
                                {workout.description}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* ===== Today's Stats ===== */}
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: darkMode ? '#f8fafc' : '#0f172a' }]}>
                        Today’s Stats
                    </Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Progress')}
                    >
                        <Text style={[styles.viewAllText, { color: darkMode ? '#22c55e' : '#16a34a' }]}>
                            More Details
                        </Text>
                    </TouchableOpacity>
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

                    {/* Fake Mini Graph */}
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

                {/* spacer so content doesn't hide behind footer */}
                <View style={{ height: 90 }} />
            </ScrollView>

            {/* ===== Persistent Bottom Footer ===== */}
            <BottomFooter activeTab="Home" />
        </View>
    );
}