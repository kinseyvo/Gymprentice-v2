import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import BottomFooter from '../../navigation/BottomFooter';

export default function NutritionScreen() {
    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.headerText}>Nutrition</Text>

                <Text style={styles.subText}>TODO: Find API for this lol</Text>
                <Text style={styles.subText}>everything below is all TEMPORARY</Text>

                {/* Featured Meals */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Featured Meals</Text>

                    <TouchableOpacity style={styles.item}>
                        <Text style={styles.itemTitle}>Protein-Packed Breakfast</Text>
                        <Text style={styles.itemSubtitle}>Eggs • Oats • Avocado</Text>
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    <TouchableOpacity style={styles.item}>
                        <Text style={styles.itemTitle}>Muscle Gain Lunch</Text>
                        <Text style={styles.itemSubtitle}>Chicken • Rice • Broccoli</Text>
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    <TouchableOpacity style={styles.item}>
                        <Text style={styles.itemTitle}>Recovery Dinner</Text>
                        <Text style={styles.itemSubtitle}>Salmon • Quinoa • Veggies</Text>
                    </TouchableOpacity>
                </View>

                {/* Meal Categories */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Meal Categories</Text>

                    <View style={styles.grid}>
                        <TouchableOpacity style={styles.categoryBox}>
                            <Text style={styles.categoryText}>Breakfast</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.categoryBox}>
                            <Text style={styles.categoryText}>Lunch</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.categoryBox}>
                            <Text style={styles.categoryText}>Dinner</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.categoryBox}>
                            <Text style={styles.categoryText}>Snacks</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.categoryBox}>
                            <Text style={styles.categoryText}>Vegan</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.categoryBox}>
                            <Text style={styles.categoryText}>High-Protein</Text>
                        </TouchableOpacity>
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
        paddingBottom: 80, // space for footer
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