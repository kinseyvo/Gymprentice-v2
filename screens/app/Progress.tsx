import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import BottomFooter from '../../navigation/BottomFooter';

const screenWidth = Dimensions.get('window').width - 40; // match padding

export default function ProgressScreen() {
    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.headerText}>Progress</Text>

                {/* Workout Stats Line Chart */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Workout Stats</Text>
                    <LineChart
                        data={{
                            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                            datasets: [
                                {
                                    data: [30, 45, 28, 80, 99, 43, 50],
                                    color: (opacity = 1) => `rgba(34,197,94, ${opacity})`, // green
                                },
                            ],
                        }}
                        width={screenWidth}
                        height={160}
                        yAxisLabel=""
                        yAxisSuffix="" // required for TypeScript
                        chartConfig={{
                            backgroundColor: '#1e293b',
                            backgroundGradientFrom: '#1e293b',
                            backgroundGradientTo: '#1e293b',
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(34,197,94, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(203,213,225, ${opacity})`,
                            style: { borderRadius: 16 },
                            propsForDots: { r: '5', strokeWidth: '2', stroke: '#22c55e' },
                        }}
                        style={{ borderRadius: 16 }}
                    />
                </View>

                {/* Nutrition Stats Bar Chart */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Nutrition Stats</Text>
                    <BarChart
                        data={{
                            labels: ['Protein', 'Carbs', 'Fats'],
                            datasets: [{ data: [120, 200, 70] }],
                        }}
                        width={screenWidth}
                        height={160}
                        fromZero
                        yAxisLabel=""
                        yAxisSuffix="" // Required for TypeScript
                        chartConfig={{
                            backgroundColor: '#1e293b',
                            backgroundGradientFrom: '#1e293b',
                            backgroundGradientTo: '#1e293b',
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(34,197,94, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(203,213,225, ${opacity})`,
                            style: { borderRadius: 16 },
                        }}
                        style={{ borderRadius: 16 }}
                    />
                </View>

                {/* Weekly Summary Placeholder */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Weekly Summary</Text>
                    <Text style={styles.placeholderText}>
                        Total workouts: 5{"\n"}
                        Total steps: 42,000{"\n"}
                        Calories burned: 3,500
                    </Text>
                </View>
            </ScrollView>

            <BottomFooter activeTab="Stats" />
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
        marginBottom: 12,
    },

    placeholderText: {
        fontSize: 14,
        color: '#94a3b8',
        lineHeight: 20,
    },
});
