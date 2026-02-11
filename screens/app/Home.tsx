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

export default function HomeScreen({ navigation }: any) {
    const safeAreaInsets = useSafeAreaInsets();

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
        <View style={[styles.container, { paddingTop: safeAreaInsets.top }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <Text style={styles.logoText}>Gymprentice</Text>
                <Text style={styles.greetingText}>
                    Hello, {userName}!
                </Text>

                <View style={styles.tipCard}>
                    <Text style={styles.tipText}>
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
                            style={styles.quickBox}
                            onPress={() => navigation.navigate(label)}
                            activeOpacity={0.85}
                        >
                            <Text style={styles.quickBoxText}>
                                {label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>


                {/*  Latest Workouts  */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>
                        Latest Workouts
                    </Text>
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate('Workouts')
                        }
                    >
                        <Text style={styles.viewAllText}>
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
                            style={styles.workoutCard}
                            activeOpacity={0.85}
                        >
                            <Image
                                source={{ uri: workout.image }}
                                style={styles.workoutImage}
                            />
                            <Text style={styles.workoutTitle}>
                                {workout.title}
                            </Text>
                            <Text style={styles.workoutDescription}>
                                {workout.description}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* ===== Today's Stats ===== */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>
                        Today’s Stats
                    </Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Progress')}
                    >
                        <Text style={styles.viewAllText}>
                            More Details
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.statsCard}>
                    <View style={styles.statsRow}>
                        <View style={styles.statBlock}>
                            <Text style={styles.statNumber}>1,240</Text>
                            <Text style={styles.statLabel}>Calories</Text>
                        </View>

                        <View style={styles.statBlock}>
                            <Text style={styles.statNumber}>45m</Text>
                            <Text style={styles.statLabel}>Workout</Text>
                        </View>

                        <View style={styles.statBlock}>
                            <Text style={styles.statNumber}>7,820</Text>
                            <Text style={styles.statLabel}>Steps</Text>
                        </View>
                    </View>

                    {/* Fake Mini Graph */}
                    <View style={styles.graphContainer}>
                        <View style={[styles.graphBar, { height: 30 }]} />
                        <View style={[styles.graphBar, { height: 45 }]} />
                        <View style={[styles.graphBar, { height: 20 }]} />
                        <View style={[styles.graphBar, { height: 60 }]} />
                        <View style={[styles.graphBar, { height: 35 }]} />
                        <View style={[styles.graphBar, { height: 50 }]} />
                        <View style={[styles.graphBar, { height: 25 }]} />
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
