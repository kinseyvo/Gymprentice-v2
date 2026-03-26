import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import BottomFooter from '../../navigation/BottomFooter';
import { useTheme } from '../../src/context/ThemeContext';

const screenWidth = Dimensions.get('window').width - 40;

export default function ProgressScreen() {

    const { darkMode } = useTheme();

    const chartBackground = darkMode ? '#1e293b' : '#e2e8f0';
    const labelColor = darkMode ? '#cbd5e1' : '#475569';

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
                    Progress
                </Text>

                {/* Workout Stats */}
                <View style={[
                    styles.card,
                    { backgroundColor: chartBackground }
                ]}>
                    <Text style={[
                        styles.sectionTitle,
                        { color: darkMode ? '#f8fafc' : '#0f172a' }
                    ]}>
                        Workout Stats
                    </Text>

                    <LineChart
                        data={{
                            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                            datasets: [{
                                data: [30, 45, 28, 80, 99, 43, 50],
                                color: (opacity = 1) => `rgba(34,197,94, ${opacity})`,
                            }],
                        }}
                        width={screenWidth}
                        height={160}
                        yAxisSuffix=""
                        chartConfig={{
                            backgroundColor: chartBackground,
                            backgroundGradientFrom: chartBackground,
                            backgroundGradientTo: chartBackground,
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(34,197,94, ${opacity})`,
                            labelColor: () => labelColor,
                            style: { borderRadius: 16 },
                            propsForDots: {
                                r: '5',
                                strokeWidth: '2',
                                stroke: '#22c55e',
                            },
                        }}
                        style={{ borderRadius: 16 }}
                    />
                </View>

                {/* Nutrition Stats */}
                <View style={[
                    styles.card,
                    { backgroundColor: chartBackground }
                ]}>
                    <Text style={[
                        styles.sectionTitle,
                        { color: darkMode ? '#f8fafc' : '#0f172a' }
                    ]}>
                        Nutrition Stats
                    </Text>

                    <BarChart
                        data={{
                            labels: ['Protein', 'Carbs', 'Fats'],
                            datasets: [{ data: [120, 200, 70] }],
                        }}
                        width={screenWidth}
                        height={160}
                        fromZero
                        yAxisLabel=""
                        yAxisSuffix=""
                        chartConfig={{
                            backgroundColor: chartBackground,
                            backgroundGradientFrom: chartBackground,
                            backgroundGradientTo: chartBackground,
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(34,197,94, ${opacity})`,
                            labelColor: () => labelColor,
                            style: { borderRadius: 16 },
                        }}
                        style={{ borderRadius: 16 }}
                    />
                </View>

                {/* Weekly Summary */}
                <View style={[
                    styles.card,
                    { backgroundColor: chartBackground }
                ]}>
                    <Text style={[
                        styles.sectionTitle,
                        { color: darkMode ? '#f8fafc' : '#0f172a' }
                    ]}>
                        Weekly Summary
                    </Text>

                    <Text style={[
                        styles.placeholderText,
                        { color: darkMode ? '#94a3b8' : '#475569' }
                    ]}>
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
        paddingBottom: 80,
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