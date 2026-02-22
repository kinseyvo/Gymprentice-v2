import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import BottomFooter from '../../navigation/BottomFooter';

export default function ScheduleScreen() {
    const [selectedDate, setSelectedDate] = useState('');

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.headerText}>Schedule</Text>

                {/* Upcoming Workouts */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Upcoming Workouts</Text>

                    <TouchableOpacity style={styles.item}>
                        <Text style={styles.itemTitle}>Monday: Upper Body Strength</Text>
                        <Text style={styles.itemSubtitle}>8:00 AM • Gym</Text>
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    <TouchableOpacity style={styles.item}>
                        <Text style={styles.itemTitle}>Wednesday: Leg Day</Text>
                        <Text style={styles.itemSubtitle}>6:00 PM • Gym</Text>
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    <TouchableOpacity style={styles.item}>
                        <Text style={styles.itemTitle}>Friday: Core & Cardio</Text>
                        <Text style={styles.itemSubtitle}>7:30 AM • Home</Text>
                    </TouchableOpacity>
                </View>

                {/* Weekly Overview */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Weekly Overview</Text>

                    <View style={styles.grid}>
                        {[
                            'Mon • Upper',
                            'Tue • Rest',
                            'Wed • Legs',
                            'Thu • Rest',
                            'Fri • Core',
                            'Sat • Cardio',
                            'Sun • Rest',
                        ].map((day) => (
                            <View key={day} style={styles.categoryBox}>
                                <Text style={styles.categoryText}>{day}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Calendar */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Calendar</Text>
                    <Calendar
                        onDayPress={(day) => setSelectedDate(day.dateString)}
                        markedDates={{
                            [selectedDate]: {
                                selected: true,
                                selectedColor: '#22c55e',
                            },
                        }}
                        theme={{
                            backgroundColor: '#1e293b',
                            calendarBackground: '#1e293b',
                            textSectionTitleColor: '#f8fafc',
                            dayTextColor: '#f8fafc',
                            todayTextColor: '#22c55e',
                            monthTextColor: '#22c55e',
                            arrowColor: '#22c55e',
                            textDisabledColor: '#94a3b8',
                        }}
                    />
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
        width: '30%',
        backgroundColor: '#0f172a',
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: 'center',
        marginBottom: 12,
    },

    categoryText: {
        color: '#f8fafc',
        fontWeight: '600',
        fontSize: 13,
        textAlign: 'center',
    },
});