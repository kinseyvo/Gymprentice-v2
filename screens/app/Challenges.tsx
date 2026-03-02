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
import { collection, getDocs } from '@react-native-firebase/firestore';
import firestore from '@react-native-firebase/firestore';

type ChallengeStatus = 'in-progress' | 'done';

interface Challenge {
    id: string;
    title: string;
    goal: string;
    description: string;
    category: string;
}

type Category =
    | 'Strength'
    | 'Cardio'
    | 'Endurance'
    | 'Flexibility'
    | 'Nutrition'
    | 'Habits';

export default function ChallengesScreen() {
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [activeChallenges, setActiveChallenges] = useState<
        (Challenge & { status: ChallengeStatus })[]
    >([]);
    const [activeCategory, setActiveCategory] = useState<Category | null>(null);
    const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);

    // Fetch challenges from Firestore
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

    const toggleCategory = (category: Category) => {
        setActiveCategory(activeCategory === category ? null : category);
    };

    const joinChallenge = (challenge: Challenge) => {
        if (activeChallenges.find(c => c.id === challenge.id)) return;
        if (activeChallenges.length >= 3) return;

        setActiveChallenges([...activeChallenges, { ...challenge, status: 'in-progress' }]);
        setSelectedChallenge(null);
    };

    const updateStatus = (id: string, status: ChallengeStatus) => {
        setActiveChallenges(
            activeChallenges.map(c => (c.id === id ? { ...c, status } : c))
        );
    };

    const quitChallenge = (id: string) => {
        setActiveChallenges(activeChallenges.filter(c => c.id !== id));
    };

    const challengesToShow = activeCategory
        ? challenges.filter(c => c.category === activeCategory)
        : challenges;

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.headerText}>Challenges</Text>

                {/* Active Challenges */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Active Challenges</Text>
                    {activeChallenges.length === 0 && (
                        <Text style={styles.emptyText}>No active challenges yet.</Text>
                    )}
                    {activeChallenges.map(challenge => (
                        <View key={challenge.id} style={styles.item}>
                            <Text style={styles.itemTitle}>{challenge.title}</Text>
                            <Text style={styles.itemSubtitle}>{challenge.goal}</Text>
                            <Text style={styles.statusText}>Status: {challenge.status}</Text>

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

                {/* All Challenges / Filter by Category */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>
                        {activeCategory ? `${activeCategory} Challenges` : 'All Challenges'}
                    </Text>

                    {/* Category Buttons */}
                    <View style={styles.grid}>
                        {(['Strength', 'Cardio', 'Endurance', 'Flexibility', 'Nutrition', 'Habits'] as Category[]).map(
                            category => (
                                <TouchableOpacity
                                    key={category}
                                    style={[
                                        styles.categoryBox,
                                        activeCategory === category && styles.activeCategory,
                                    ]}
                                    onPress={() => toggleCategory(category)}
                                >
                                    <Text style={styles.categoryText}>{category}</Text>
                                </TouchableOpacity>
                            )
                        )}
                    </View>

                    {/* Challenge List */}
                    {challengesToShow.length === 0 && (
                        <Text style={styles.emptyText}>No challenges found in Firestore.</Text>
                    )}
                    {challengesToShow.map(challenge => (
                        <TouchableOpacity
                            key={challenge.id}
                            style={styles.challengeListItem}
                            onPress={() => setSelectedChallenge(challenge)}
                        >
                            <Text style={styles.itemTitle}>{challenge.title}</Text>
                            <Text style={styles.itemSubtitle}>{challenge.goal}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>

            {/* Challenge Modal */}
            <Modal visible={!!selectedChallenge} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        {selectedChallenge && (
                            <>
                                <Text style={styles.modalTitle}>{selectedChallenge.title}</Text>
                                <Text style={styles.modalGoal}>{selectedChallenge.goal}</Text>
                                <Text style={styles.modalDescription}>{selectedChallenge.description}</Text>

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
    container: { flex: 1, backgroundColor: '#0f172a' },
    scrollContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 80 },
    headerText: { fontSize: 26, fontWeight: '700', color: '#22c55e', marginBottom: 20 },
    card: { backgroundColor: '#1e293b', borderRadius: 18, padding: 18, marginBottom: 20 },
    sectionTitle: { fontSize: 18, fontWeight: '600', color: '#f8fafc', marginBottom: 15 },
    item: { marginBottom: 10 },
    itemTitle: { fontSize: 15, fontWeight: '600', color: '#f8fafc' },
    itemSubtitle: { fontSize: 13, color: '#94a3b8' },
    statusText: { fontSize: 12, color: '#22c55e' },
    emptyText: { color: '#94a3b8', fontSize: 14 },
    divider: { height: 1, backgroundColor: '#334155', marginVertical: 10 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    categoryBox: {
        width: '48%',
        backgroundColor: '#0f172a',
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: 'center',
        marginBottom: 12,
    },
    activeCategory: { borderWidth: 1, borderColor: '#22c55e' },
    categoryText: { color: '#f8fafc', fontWeight: '600', fontSize: 14 },
    challengeListItem: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#334155' },
    buttonRow: { flexDirection: 'row', marginTop: 8, justifyContent: 'space-between' },
    smallButton: { backgroundColor: '#22c55e', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
    quitButton: { backgroundColor: '#ef4444', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
    buttonText: { color: '#0f172a', fontWeight: '600', fontSize: 12 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
    modalCard: { backgroundColor: '#1e293b', width: '85%', padding: 20, borderRadius: 16 },
    modalTitle: { fontSize: 18, fontWeight: '700', color: '#f8fafc', marginBottom: 10 },
    modalGoal: { fontSize: 14, color: '#22c55e', marginBottom: 8 },
    modalDescription: { fontSize: 13, color: '#cbd5e1' },
});