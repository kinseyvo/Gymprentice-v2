import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import BottomFooter from '../../navigation/BottomFooter';

export default function ChallengesScreen() {
    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.headerText}>Challenges</Text>

                {/* Active Challenges */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Active Challenges</Text>

                    <TouchableOpacity style={styles.item}>
                        <Text style={styles.itemTitle}>30-Day Push-Up Challenge</Text>
                        <Text style={styles.itemSubtitle}>Goal: 100 push-ups/day</Text>
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    <TouchableOpacity style={styles.item}>
                        <Text style={styles.itemTitle}>Weekly Step Challenge</Text>
                        <Text style={styles.itemSubtitle}>Goal: 70,000 steps/week</Text>
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    <TouchableOpacity style={styles.item}>
                        <Text style={styles.itemTitle}>Hydration Challenge</Text>
                        <Text style={styles.itemSubtitle}>Goal: 2 liters/day</Text>
                    </TouchableOpacity>
                </View>

                {/* Challenge Categories */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Challenge Categories</Text>

                    <View style={styles.grid}>
                        <TouchableOpacity style={styles.categoryBox}>
                            <Text style={styles.categoryText}>Strength</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.categoryBox}>
                            <Text style={styles.categoryText}>Cardio</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.categoryBox}>
                            <Text style={styles.categoryText}>Endurance</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.categoryBox}>
                            <Text style={styles.categoryText}>Flexibility</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.categoryBox}>
                            <Text style={styles.categoryText}>Nutrition</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.categoryBox}>
                            <Text style={styles.categoryText}>Habits</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            {/* Footer */}
            <BottomFooter activeTab="Home" />
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
        paddingBottom: 80, // space for footer
    },

    headerText: {
        fontSize: 26,
        fontWeight: '700',
        color: '#22c55e',
        marginBottom: 20,
    },

    card: {
        backgroundColor: '#1e293b',
        borderRadius: 18,
        padding: 18,
        marginBottom: 20,
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#f8fafc',
        marginBottom: 15,
    },

    item: {
        paddingVertical: 10,
    },

    itemTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#f8fafc',
        marginBottom: 4,
    },

    itemSubtitle: {
        fontSize: 13,
        color: '#94a3b8',
    },

    divider: {
        height: 1,
        backgroundColor: '#334155',
        marginVertical: 10,
    },

    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },

    categoryBox: {
        width: '48%',
        backgroundColor: '#0f172a',
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: 'center',
        marginBottom: 12,
    },

    categoryText: {
        color: '#f8fafc',
        fontWeight: '600',
        fontSize: 14,
        textAlign: 'center',
    },
});