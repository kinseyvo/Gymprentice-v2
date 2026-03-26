import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import BottomFooter from '../../navigation/BottomFooter';
import { useTheme } from '../../src/context/ThemeContext';

export default function NutritionScreen() {

    const { darkMode } = useTheme();

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
                    Nutrition
                </Text>

                <Text style={[
                    styles.subText,
                    { color: darkMode ? '#94a3b8' : '#475569' }
                ]}>
                    TODO: Find API for this lol
                </Text>

                <Text style={[
                    styles.subText,
                    { color: darkMode ? '#94a3b8' : '#475569' }
                ]}>
                    everything below is all TEMPORARY
                </Text>

                {/* Featured Meals */}
                <View style={[
                    styles.card,
                    { backgroundColor: darkMode ? '#1e293b' : '#e2e8f0' }
                ]}>
                    <Text style={[
                        styles.sectionTitle,
                        { color: darkMode ? '#f8fafc' : '#0f172a' }
                    ]}>
                        Featured Meals
                    </Text>

                    <TouchableOpacity style={styles.item}>
                        <Text style={[
                            styles.itemTitle,
                            { color: darkMode ? '#f8fafc' : '#0f172a' }
                        ]}>
                            Protein-Packed Breakfast
                        </Text>
                        <Text style={[
                            styles.itemSubtitle,
                            { color: darkMode ? '#94a3b8' : '#475569' }
                        ]}>
                            Eggs • Oats • Avocado
                        </Text>
                    </TouchableOpacity>

                    <View style={[
                        styles.divider,
                        { backgroundColor: darkMode ? '#334155' : '#cbd5e1' }
                    ]} />

                    <TouchableOpacity style={styles.item}>
                        <Text style={[
                            styles.itemTitle,
                            { color: darkMode ? '#f8fafc' : '#0f172a' }
                        ]}>
                            Muscle Gain Lunch
                        </Text>
                        <Text style={[
                            styles.itemSubtitle,
                            { color: darkMode ? '#94a3b8' : '#475569' }
                        ]}>
                            Chicken • Rice • Broccoli
                        </Text>
                    </TouchableOpacity>

                    <View style={[
                        styles.divider,
                        { backgroundColor: darkMode ? '#334155' : '#cbd5e1' }
                    ]} />

                    <TouchableOpacity style={styles.item}>
                        <Text style={[
                            styles.itemTitle,
                            { color: darkMode ? '#f8fafc' : '#0f172a' }
                        ]}>
                            Recovery Dinner
                        </Text>
                        <Text style={[
                            styles.itemSubtitle,
                            { color: darkMode ? '#94a3b8' : '#475569' }
                        ]}>
                            Salmon • Quinoa • Veggies
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Meal Categories */}
                <View style={[
                    styles.card,
                    { backgroundColor: darkMode ? '#1e293b' : '#e2e8f0' }
                ]}>
                    <Text style={[
                        styles.sectionTitle,
                        { color: darkMode ? '#f8fafc' : '#0f172a' }
                    ]}>
                        Meal Categories
                    </Text>

                    <View style={styles.grid}>
                        {['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Vegan', 'High-Protein'].map((item) => (
                            <TouchableOpacity
                                key={item}
                                style={[
                                    styles.categoryBox,
                                    {
                                        backgroundColor: darkMode ? '#0f172a' : '#ffffff'
                                    }
                                ]}
                            >
                                <Text style={[
                                    styles.categoryText,
                                    { color: darkMode ? '#f8fafc' : '#0f172a' }
                                ]}>
                                    {item}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>

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
        paddingBottom: 80,
    },

    headerText: {
        fontSize: 26,
        fontWeight: '700',
        color: '#22c55e',
        marginBottom: 10,
    },

    subText: {
        fontSize: 14,
        color: '#94a3b8',
        marginBottom: 10,
    },

    card: {
        backgroundColor: '#1e293b',
        borderRadius: 18,
        padding: 18,
        marginTop: 10,
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
        paddingVertical: 18,
        borderRadius: 14,
        alignItems: 'center',
        marginBottom: 12,
    },

    categoryText: {
        color: '#f8fafc',
        fontWeight: '600',
        fontSize: 14,
    },
});