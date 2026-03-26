import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native';
import BottomFooter from '../../navigation/BottomFooter';
import Config from 'react-native-config';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useTheme } from '../../src/context/ThemeContext';

export default function WorkoutsScreen() {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [workouts, setWorkouts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [cache, setCache] = useState<Record<string, any[]>>({});
    const [expandedWorkout, setExpandedWorkout] = useState<string | null>(null);
    const [savedWorkouts, setSavedWorkouts] = useState<Record<string, any>>({});

    const { darkMode } = useTheme();

    const categories = [
        'Strength',
        'Cardio',
        'Plyometrics',
        'Powerlifting',
        'Stretching',
        'Strongman',
    ];

    const categoryMap: Record<string, string> = {
        Strength: 'strength',
        Cardio: 'cardio',
        Plyometrics: 'plyometrics',
        Powerlifting: 'powerlifting',
        Stretching: 'stretching',
        Strongman: 'strongman',
    };

    useEffect(() => {
        const user = auth().currentUser;
        if (!user) return;

        const unsubscribe = firestore()
            .collection('users')
            .doc(user.uid)
            .collection('savedWorkouts')
            .onSnapshot((snapshot) => {
                const saved: Record<string, any> = {};
                snapshot.forEach((doc) => {
                    saved[doc.id] = doc.data();
                });
                setSavedWorkouts(saved);
            });

        return () => unsubscribe();
    }, []);

    const toggleCategory = async (category: string) => {
        if (selectedCategory === category) {
            setSelectedCategory(null);
            setWorkouts([]);
            setExpandedWorkout(null);
            return;
        }

        setSelectedCategory(category);
        fetchWorkouts(category);
        setExpandedWorkout(null);
    };

    const fetchWorkouts = async (category: string) => {
        if (cache[category]) {
            setWorkouts(cache[category]);
            return;
        }

        try {
            setLoading(true);
            const apiKey = Config.API_NINJAS_KEY;
            if (!apiKey) throw new Error('Missing API key');

            const type = categoryMap[category];

            const response = await fetch(
                `https://api.api-ninjas.com/v1/exercises?type=${type}`,
                {
                    headers: {
                        'X-Api-Key': apiKey
                    }
                }
            );

            const data = await response.json();
            setWorkouts(data);
            setCache((prev) => ({ ...prev, [category]: data }));
        } catch (error) {
            console.error('Error fetching workouts:', error);
        } finally {
            setLoading(false);
        }
    };

    const saveWorkout = async (workout: any) => {
        const user = auth().currentUser;
        if (!user) {
            Alert.alert('Not logged in', 'You must be logged in to save a workout.');
            return;
        }

        try {
            const sanitizedWorkout = {
                name: workout.name || '',
                type: workout.type || '',
                muscle: workout.muscle || '',
                equipment: workout.equipments || '',
                timestamp: firestore.FieldValue.serverTimestamp(),
            };

            await firestore()
                .collection('users')
                .doc(user.uid)
                .collection('savedWorkouts')
                .doc(workout.name)
                .set(sanitizedWorkout);

            Alert.alert('Saved!', `${workout.name} has been added to your workouts.`);
        } catch (error) {
            console.error('Error saving workout:', error);
            Alert.alert('Error', 'Could not save workout. Try again.');
        }
    };

    const removeWorkout = async (workout: any) => {
        const user = auth().currentUser;
        if (!user) return;

        try {
            await firestore()
                .collection('users')
                .doc(user.uid)
                .collection('savedWorkouts')
                .doc(workout.name)
                .delete();

            Alert.alert('Removed', `${workout.name} has been removed from your workouts.`);
        } catch (error) {
            console.error('Error removing workout:', error);
            Alert.alert('Error', 'Could not remove workout. Try again.');
        }
    };

    const toggleExpand = (workoutName: string) => {
        if (expandedWorkout === workoutName) {
            setExpandedWorkout(null);
        } else {
            setExpandedWorkout(workoutName);
        }
    };

    const renderWorkoutCard = (workout: any) => {
        const isExpanded = expandedWorkout === workout.name;
        const isSaved = !!savedWorkouts[workout.name];

        return (
            <View key={workout.name} style={styles.workoutRow}>
                <TouchableOpacity
                    style={[
                        styles.workoutCard,
                        { backgroundColor: darkMode ? '#0f172a' : '#e2e8f0' }
                    ]}
                    onPress={() => toggleExpand(workout.name)}
                >
                    <Text style={[styles.workoutItem, { color: darkMode ? '#cbd5f5' : '#0f172a' }]}>
                        • {workout.name}
                    </Text>

                    {isExpanded && (
                        <View style={styles.expandedContent}>
                            <Text style={[styles.workoutSub, { color: darkMode ? '#64748b' : '#475569' }]}>
                                Muscle: {workout.muscle || 'N/A'}
                            </Text>
                            <Text style={[styles.workoutSub, { color: darkMode ? '#64748b' : '#475569' }]}>
                                Equipment: {workout.equipments || 'N/A'}
                            </Text>
                            <Text style={[styles.workoutSub, { color: darkMode ? '#64748b' : '#475569' }]}>
                                Type: {workout.type || 'N/A'}
                            </Text>

                            <View style={styles.buttonsRow}>
                                {!isSaved ? (
                                    <TouchableOpacity
                                        style={styles.saveBtn}
                                        onPress={() => saveWorkout(workout)}
                                    >
                                        <Text style={styles.saveBtnText}>
                                            Add to My Workouts
                                        </Text>
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity
                                        style={styles.removeBtn}
                                        onPress={() => removeWorkout(workout)}
                                    >
                                        <Text style={styles.removeBtnText}>Remove</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    )}
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: darkMode ? '#0f172a' : '#ffffff' }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={[styles.headerText, { color: darkMode ? '#22c55e' : '#16a34a' }]}>
                    Workouts
                </Text>

                <Text style={[styles.subText, { color: darkMode ? '#94a3b8' : '#475569' }]}>
                    Tap a category to explore workouts
                </Text>

                {Object.keys(savedWorkouts).length > 0 && (
                    <View style={[styles.card, { backgroundColor: darkMode ? '#1e293b' : '#e2e8f0' }]}>
                        <Text style={[styles.sectionTitle, { color: darkMode ? '#f8fafc' : '#0f172a' }]}>
                            My Saved Workouts
                        </Text>
                        {Object.values(savedWorkouts).map((workout: any) =>
                            renderWorkoutCard(workout)
                        )}
                    </View>
                )}

                <View style={[styles.card, { backgroundColor: darkMode ? '#1e293b' : '#e2e8f0' }]}>
                    <Text style={[styles.sectionTitle, { color: darkMode ? '#f8fafc' : '#0f172a' }]}>
                        Categories
                    </Text>
                    <View style={styles.categoryGrid}>
                        {categories.map((category) => {
                            const isSelected = selectedCategory === category;
                            return (
                                <TouchableOpacity
                                    key={category}
                                    style={[
                                        styles.categoryBox,
                                        { backgroundColor: darkMode ? '#0f172a' : '#ffffff' },
                                        isSelected && styles.selectedCategoryBox,
                                    ]}
                                    onPress={() => toggleCategory(category)}
                                >
                                    <Text
                                        style={[
                                            styles.categoryText,
                                            { color: darkMode ? '#f8fafc' : '#0f172a' },
                                            isSelected && styles.selectedCategoryText,
                                        ]}
                                    >
                                        {category}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {selectedCategory && (
                    <View style={[styles.card, { backgroundColor: darkMode ? '#1e293b' : '#e2e8f0' }]}>
                        <Text style={[styles.sectionTitle, { color: darkMode ? '#f8fafc' : '#0f172a' }]}>
                            {selectedCategory} Workouts
                        </Text>

                        {loading ? (
                            <ActivityIndicator />
                        ) : workouts.length > 0 ? (
                            workouts.slice(0, 10).map((workout) =>
                                renderWorkoutCard(workout)
                            )
                        ) : (
                            <Text style={[styles.noDataText, { color: darkMode ? '#64748b' : '#475569' }]}>
                                No workouts found
                            </Text>
                        )}
                    </View>
                )}
            </ScrollView>

            <BottomFooter activeTab="Home" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a'
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 80
    },
    headerText: {
        fontSize: 26,
        fontWeight: '700',
        color: '#22c55e',
        marginBottom: 10
    },
    subText: {
        fontSize: 14,
        color: '#94a3b8',
        marginBottom: 10
    },
    card: {
        backgroundColor: '#1e293b',
        borderRadius: 18,
        padding: 18,
        marginTop: 10,
        marginBottom: 20
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#f8fafc',
        marginBottom: 15
    },
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
    },
    categoryBox: {
        width: '48%',
        backgroundColor: '#0f172a',
        paddingVertical: 18,
        borderRadius: 14,
        alignItems: 'center',
        marginBottom: 10
    },
    selectedCategoryBox: {
        backgroundColor: '#22c55e'
    },
    categoryText: {
        color: '#f8fafc',
        fontWeight: '600',
        fontSize: 14
    },
    selectedCategoryText: {
        color: '#022c22'
    },
    workoutRow: {
        marginBottom: 10
    },
    workoutCard: {
        backgroundColor: '#0f172a',
        padding: 12,
        borderRadius: 12
    },
    workoutItem: {
        color: '#cbd5f5',
        fontSize: 14,
        fontWeight: '500'
    },
    expandedContent: {
        marginTop: 6
    },
    workoutSub: {
        color: '#64748b',
        fontSize: 12,
        marginLeft: 10,
        marginTop: 2
    },
    buttonsRow: {
        flexDirection: 'row',
        marginTop: 6
    },
    saveBtn: {
        backgroundColor: '#22c55e',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 10,
        marginRight: 8
    },
    saveBtnText: {
        color: '#022c22',
        fontWeight: '600',
        fontSize: 12
    },
    removeBtn: {
        backgroundColor: '#ef4444',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 10
    },
    removeBtnText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 12
    },
    noDataText: {
        color: '#64748b',
        fontSize: 12
    },
});