import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import BottomFooter from '../../navigation/BottomFooter';

export default function CommunityScreen() {
    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.headerText}>Community</Text>

                {/* Featured Groups */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Featured Groups</Text>

                    <TouchableOpacity style={styles.item}>
                        <Text style={styles.itemTitle}>Gym Buddies</Text>
                        <Text style={styles.itemSubtitle}>Find partners for your workouts</Text>
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    <TouchableOpacity style={styles.item}>
                        <Text style={styles.itemTitle}>Nutrition Tips</Text>
                        <Text style={styles.itemSubtitle}>Discuss diets, recipes, and meal prep</Text>
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    <TouchableOpacity style={styles.item}>
                        <Text style={styles.itemTitle}>Challenges & Competitions</Text>
                        <Text style={styles.itemSubtitle}>Join fitness challenges with the community</Text>
                    </TouchableOpacity>
                </View>

                {/* Recent Posts */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Recent Posts</Text>

                    <TouchableOpacity style={styles.item}>
                        <Text style={styles.itemTitle}>How I hit my weekly step goal!</Text>
                        <Text style={styles.itemSubtitle}>by @fitfan123</Text>
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    <TouchableOpacity style={styles.item}>
                        <Text style={styles.itemTitle}>Best pre-workout meals?</Text>
                        <Text style={styles.itemSubtitle}>by @nutritionguru</Text>
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    <TouchableOpacity style={styles.item}>
                        <Text style={styles.itemTitle}>Tips for recovery after leg day</Text>
                        <Text style={styles.itemSubtitle}>by @muscleman</Text>
                    </TouchableOpacity>
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
        textAlign: 'left',
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
});