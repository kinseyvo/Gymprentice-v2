import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Modal,
} from 'react-native';
import BottomFooter from '../../navigation/BottomFooter';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useTheme } from '../../src/context/ThemeContext';

type ChallengeStatus = 'in-progress' | 'done';

interface Challenge {
    id: string;
    title: string;
    goal: string;
    description: string;
    category: string;
}

type ActiveChallenge = Challenge & { status: ChallengeStatus };

type Category =
    | 'Strength'
    | 'Cardio'
    | 'Endurance'
    | 'Flexibility'
    | 'Nutrition'
    | 'Habits';

export default function ChallengesScreen() {
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [activeChallenges, setActiveChallenges] = useState<ActiveChallenge[]>([]);
    const [activeCategory, setActiveCategory] = useState<Category | null>(null);
    const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);

    const { darkMode } = useTheme();

    const userId = auth().currentUser?.uid;

    useEffect(() => {
        const fetchChallenges = async () => {
            try {
                const snapshot = await firestore().collection('challenges').get();
                const challengesData: Challenge[] = snapshot.docs.map(doc => ({
                    id: doc.id,
                    title: doc.data().title,
                    goal: doc.data().goal,
                    description: doc.data().description,
                    category: doc.data().category,
                }));
                setChallenges(challengesData);
            } catch (error) {
                console.log('Error fetching challenges:', error);
            }
        };

        fetchChallenges();
    }, []);

    useEffect(() => {
        if (!userId) return;

        const unsubscribe = firestore()
            .collection('users')
            .doc(userId)
            .collection('activeChallenges')
            .onSnapshot(snapshot => {
                const activeData: ActiveChallenge[] = snapshot.docs.map(doc => ({
                    id: doc.id,
                    title: doc.data().title,
                    goal: doc.data().goal,
                    description: doc.data().description,
                    category: doc.data().category,
                    status: doc.data().status as ChallengeStatus,
                }));
                setActiveChallenges(activeData);
            });

        return () => unsubscribe();
    }, [userId]);

    const toggleCategory = (category: Category) => {
        setActiveCategory(activeCategory === category ? null : category);
    };

    const joinChallenge = async (challenge: Challenge) => {
        if (!userId) return;
        if (activeChallenges.find(c => c.id === challenge.id)) return;
        if (activeChallenges.length >= 3) return;

        const newChallenge: ActiveChallenge = { ...challenge, status: 'in-progress' };
        setActiveChallenges(prev => [...prev, newChallenge]);

        await firestore()
            .collection('users')
            .doc(userId)
            .collection('activeChallenges')
            .doc(challenge.id)
            .set(newChallenge);

        setSelectedChallenge(null);
    };

    const updateStatus = async (id: string, status: ChallengeStatus) => {
        if (!userId) return;

        setActiveChallenges(prev =>
            prev.map(c => (c.id === id ? { ...c, status } : c))
        );

        await firestore()
            .collection('users')
            .doc(userId)
            .collection('activeChallenges')
            .doc(id)
            .update({ status });
    };

    const quitChallenge = async (id: string) => {
        if (!userId) return;

        setActiveChallenges(prev => prev.filter(c => c.id !== id));

        await firestore()
            .collection('users')
            .doc(userId)
            .collection('activeChallenges')
            .doc(id)
            .delete();
    };

    const challengesToShow = activeCategory
        ? challenges.filter(c => c.category === activeCategory)
        : challenges;

    return (
        <View style={[
            styles.container,
            { backgroundColor: darkMode ? '#0f172a' : '#ffffff' }
        ]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={[
                    styles.headerText,
                    { color: darkMode ? '#22c55e' : '#16a34a' }
                ]}>
                    Challenges
                </Text>

                <View style={[
                    styles.card,
                    { backgroundColor: darkMode ? '#1e293b' : '#e2e8f0' }
                ]}>
                    <Text style={[
                        styles.sectionTitle,
                        { color: darkMode ? '#f8fafc' : '#0f172a' }
                    ]}>
                        Active Challenges
                    </Text>

                    {activeChallenges.length === 0 && (
                        <Text style={[
                            styles.emptyText,
                            { color: darkMode ? '#94a3b8' : '#475569' }
                        ]}>
                            No active challenges yet.
                        </Text>
                    )}

                    {activeChallenges.map(challenge => (
                        <View key={challenge.id} style={styles.item}>
                            <Text style={[
                                styles.itemTitle,
                                { color: darkMode ? '#f8fafc' : '#0f172a' }
                            ]}>
                                {challenge.title}
                            </Text>

                            <Text style={[
                                styles.itemSubtitle,
                                { color: darkMode ? '#94a3b8' : '#475569' }
                            ]}>
                                {challenge.goal}
                            </Text>

                            <Text style={styles.statusText}>
                                Status: {challenge.status}
                            </Text>

                            <View style={styles.buttonRow}>
                                <TouchableOpacity
                                    style={styles.smallButton}
                                    onPress={() => updateStatus(challenge.id, 'done')}
                                >
                                    <Text style={styles.buttonText}>✔</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.smallButton}
                                    onPress={() => updateStatus(challenge.id, 'in-progress')}
                                >
                                    <Text style={styles.buttonText}>In Progress</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.quitButton}
                                    onPress={() => quitChallenge(challenge.id)}
                                >
                                    <Text style={styles.buttonText}>Quit</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.divider} />
                        </View>
                    ))}
                </View>

                <View style={[
                    styles.card,
                    { backgroundColor: darkMode ? '#1e293b' : '#e2e8f0' }
                ]}>
                    <Text style={[
                        styles.sectionTitle,
                        { color: darkMode ? '#f8fafc' : '#0f172a' }
                    ]}>
                        {activeCategory ? `${activeCategory} Challenges` : 'All Challenges'}
                    </Text>

                    <View style={styles.grid}>
                        {(['Strength', 'Cardio', 'Endurance', 'Flexibility', 'Nutrition', 'Habits'] as Category[]).map(
                            category => (
                                <TouchableOpacity
                                    key={category}
                                    style={[
                                        styles.categoryBox,
                                        { backgroundColor: darkMode ? '#0f172a' : '#e2e8f0' },
                                        activeCategory === category && styles.activeCategory,
                                    ]}
                                    onPress={() => toggleCategory(category)}
                                >
                                    <Text style={[
                                        styles.categoryText,
                                        { color: darkMode ? '#f8fafc' : '#0f172a' }
                                    ]}>
                                        {category}
                                    </Text>
                                </TouchableOpacity>
                            )
                        )}
                    </View>

                    {challengesToShow.map(challenge => (
                        <TouchableOpacity
                            key={challenge.id}
                            style={[
                                styles.challengeListItem,
                                { borderBottomColor: darkMode ? '#334155' : '#cbd5e1' }
                            ]}
                            onPress={() => setSelectedChallenge(challenge)}
                        >
                            <Text style={[
                                styles.itemTitle,
                                { color: darkMode ? '#f8fafc' : '#0f172a' }
                            ]}>
                                {challenge.title}
                            </Text>

                            <Text style={[
                                styles.itemSubtitle,
                                { color: darkMode ? '#94a3b8' : '#475569' }
                            ]}>
                                {challenge.goal}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>

            <Modal visible={!!selectedChallenge} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={[
                        styles.modalCard,
                        { backgroundColor: darkMode ? '#1e293b' : '#ffffff' }
                    ]}>
                        {selectedChallenge && (
                            <>
                                <Text style={[
                                    styles.modalTitle,
                                    { color: darkMode ? '#f8fafc' : '#0f172a' }
                                ]}>
                                    {selectedChallenge.title}
                                </Text>

                                <Text style={styles.modalGoal}>
                                    {selectedChallenge.goal}
                                </Text>

                                <Text style={[
                                    styles.modalDescription,
                                    { color: darkMode ? '#cbd5e1' : '#334155' }
                                ]}>
                                    {selectedChallenge.description}
                                </Text>

                                <View style={styles.buttonRow}>
                                    <TouchableOpacity
                                        style={styles.smallButton}
                                        onPress={() => setSelectedChallenge(null)}
                                    >
                                        <Text style={styles.buttonText}>✕</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.smallButton}
                                        onPress={() => joinChallenge(selectedChallenge)}
                                    >
                                        <Text style={styles.buttonText}>✔</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    </View>
                </View>
            </Modal>

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
        marginBottom: 20
    },
    card: {
        backgroundColor: '#1e293b',
        borderRadius: 18,
        padding: 18,
        marginBottom: 20
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#f8fafc',
        marginBottom: 15
    },
    item: {
        marginBottom: 10
    },
    itemTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#f8fafc'
    },
    itemSubtitle: {
        fontSize: 13,
        color: '#94a3b8'
    },
    statusText: {
        fontSize: 12,
        color: '#22c55e'
    },
    emptyText: {
        color: '#94a3b8',
        fontSize: 14
    },
    divider: {
        height: 1,
        backgroundColor: '#334155',
        marginVertical: 10
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
    },
    categoryBox: {
        width: '48%',
        backgroundColor: '#0f172a',
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: 'center',
        marginBottom: 12,
    },
    activeCategory: {
        borderWidth: 1,
        borderColor: '#22c55e'
    },
    categoryText: {
        color: '#f8fafc',
        fontWeight: '600',
        fontSize: 14
    },
    challengeListItem: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#334155'
    },
    buttonRow: {
        flexDirection: 'row',
        marginTop: 8,
        justifyContent: 'space-between'
    },
    smallButton: {
        backgroundColor: '#22c55e',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8
    },
    quitButton: {
        backgroundColor: '#ef4444',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8
    },
    buttonText: {
        color: '#0f172a',
        fontWeight: '600',
        fontSize: 12
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalCard: {
        backgroundColor: '#1e293b',
        width: '85%',
        padding: 20,
        borderRadius: 16
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#f8fafc',
        marginBottom: 10
    },
    modalGoal: {
        fontSize: 14,
        color: '#22c55e',
        marginBottom: 8
    },
    modalDescription: {
        fontSize: 13,
        color: '#cbd5e1'
    },
});