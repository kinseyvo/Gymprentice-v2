import React, { useEffect, useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Modal,
    TextInput,
    Alert,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import BottomFooter from '../../navigation/BottomFooter';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useTheme } from '../../src/context/ThemeContext';

interface EventData {
    id: string;
    date: string;
    workout: string;
    calories: number;
    food: string;
}

export default function ScheduleScreen() {
    const { darkMode } = useTheme();

    const [selectedDate, setSelectedDate] = useState<string>('');
    const [events, setEvents] = useState<EventData[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);

    const [modalVisible, setModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [weeklyModalVisible, setWeeklyModalVisible] = useState(false);

    const [newWorkout, setNewWorkout] = useState('');
    const [newCalories, setNewCalories] = useState('');
    const [newFood, setNewFood] = useState('');
    const [modalDate, setModalDate] = useState('');

    const [editEventData, setEditEventData] = useState<EventData | null>(null);

    const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const [weeklyPlan, setWeeklyPlan] = useState(['Upper', 'Rest', 'Legs', 'Rest', 'Core', 'Cardio', 'Rest']);
    const [weeklyDraft, setWeeklyDraft] = useState<string[]>([...weeklyPlan]);

    const [userLoaded, setUserLoaded] = useState(false);
    const [user, setUser] = useState(auth().currentUser);

    useEffect(() => {
        const unsubscribe = auth().onAuthStateChanged((u) => {
            setUser(u);
            setUserLoaded(true);
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        if (user) {
            fetchEvents();
            fetchWeeklyPlan();
        }
    }, [user]);

    const fetchEvents = async () => {
        if (!user) return;
        try {
            const snapshot = await firestore()
                .collection('users')
                .doc(user.uid)
                .collection('schedule')
                .get();
            const data: EventData[] = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as Omit<EventData, 'id'>) }));
            setEvents(data);
        } catch (error) {
            console.log('Error fetching schedule:', error);
        }
    };

    const fetchWeeklyPlan = async () => {
        if (!user) return;
        try {
            const doc = await firestore().collection('users').doc(user.uid).get();
            const data = doc.data();
            if (data?.weeklyPlan) {
                const planArray = weekdays.map(day => data.weeklyPlan[day] || 'Rest');
                setWeeklyPlan(planArray);
            }
        } catch (error) {
            console.log('Error fetching weekly plan:', error);
        }
    };

    const handleDayPress = (day: any) => {
        const date = day.dateString;
        setSelectedDate(date);
        setModalDate(date);
        const found = events.find(e => e.date === date);
        setSelectedEvent(found || null);
    };

    const addEvent = async () => {
        if (!modalDate || !newWorkout || !newCalories || !newFood) {
            Alert.alert('Please fill all fields');
            return;
        }
        if (!user) return;
        try {
            await firestore()
                .collection('users')
                .doc(user.uid)
                .collection('schedule')
                .add({
                    date: modalDate,
                    workout: newWorkout,
                    calories: Number(newCalories),
                    food: newFood
                });
            setModalVisible(false);
            setNewWorkout(''); setNewCalories(''); setNewFood(''); setModalDate('');
            fetchEvents();
        } catch (error) {
            console.log('Error adding event:', error);
        }
    };

    const openEditEvent = (event: EventData) => {
        setEditEventData({ ...event });
        setEditModalVisible(true);
    };

    const saveEditedEvent = async () => {
        if (!editEventData || !user) return;
        try {
            await firestore()
                .collection('users')
                .doc(user.uid)
                .collection('schedule')
                .doc(editEventData.id)
                .set({
                    date: editEventData.date,
                    workout: editEventData.workout,
                    calories: Number(editEventData.calories),
                    food: editEventData.food
                }, { merge: true });
            setEditModalVisible(false);
            setEditEventData(null);
            fetchEvents();
        } catch (error) {
            console.log('Error editing event:', error);
        }
    };

    const deleteEvent = async (event: EventData) => {
        if (!user) return;
        try {
            await firestore()
                .collection('users')
                .doc(user.uid)
                .collection('schedule')
                .doc(event.id)
                .delete();
            setSelectedEvent(null);
            fetchEvents();
        } catch (error) {
            console.log('Error deleting event:', error);
        }
    };

    const saveWeeklyPlan = async () => {
        if (!user) return;
        try {
            const planObject: Record<string, string> = {};
            weekdays.forEach((day, i) => planObject[day] = weeklyDraft[i]);
            await firestore().collection('users').doc(user.uid).set({ weeklyPlan: planObject }, { merge: true });
            setWeeklyPlan([...weeklyDraft]);
            setWeeklyModalVisible(false);
        } catch (error) {
            console.log('Error saving weekly plan:', error);
        }
    };

    const markedDates = useMemo(() => {
        const marks: Record<string, any> = {};
        events.forEach(e => { marks[e.date] = { marked: true, dotColor: '#22c55e' }; });
        if (selectedDate) marks[selectedDate] = { ...(marks[selectedDate] || {}), selected: true, selectedColor: '#22c55e' };
        return marks;
    }, [events, selectedDate]);

    if (!userLoaded) {
        return (
            <View style={[styles.centered, { backgroundColor: darkMode ? '#0f172a' : '#ffffff' }]}>
                <Text style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>Loading...</Text>
            </View>
        );
    }

    if (!user) {
        return (
            <View style={[styles.centered, { backgroundColor: darkMode ? '#0f172a' : '#ffffff' }]}>
                <Text style={{ color: darkMode ? '#f8fafc' : '#0f172a' }}>Please log in to view your schedule</Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: darkMode ? '#0f172a' : '#ffffff' }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={[styles.headerText, { color: darkMode ? '#22c55e' : '#16a34a' }]}>Schedule</Text>

                <View style={[styles.card, { backgroundColor: darkMode ? '#1e293b' : '#e2e8f0' }]}>
                    <View style={styles.weeklyHeader}>
                        <Text style={[styles.sectionTitle, { color: darkMode ? '#f8fafc' : '#0f172a' }]}>Weekly Overview</Text>
                        <TouchableOpacity onPress={() => { setWeeklyDraft([...weeklyPlan]); setWeeklyModalVisible(true); }}>
                            <Text style={styles.editButton}>Edit</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.weeklyRow}>
                        {weekdays.map((day, i) => (
                            <View key={i} style={styles.weekBox}>
                                <Text style={[styles.weekDay, { color: darkMode ? '#f8fafc' : '#0f172a' }]}>{day}</Text>
                                <Text style={[styles.weekWorkout, { color: darkMode ? '#94a3b8' : '#475569' }]} numberOfLines={1} ellipsizeMode="tail">
                                    {weeklyPlan[i]}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={[styles.card, { backgroundColor: darkMode ? '#1e293b' : '#e2e8f0' }]}>
                    <Text style={[styles.sectionTitle, { color: darkMode ? '#f8fafc' : '#0f172a' }]}>Calendar</Text>
                    <Calendar
                        onDayPress={handleDayPress}
                        markedDates={markedDates}
                        markingType="dot"
                        theme={{
                            backgroundColor: darkMode ? '#1e293b' : '#e2e8f0',
                            calendarBackground: darkMode ? '#1e293b' : '#e2e8f0',
                            textSectionTitleColor: darkMode ? '#f8fafc' : '#0f172a',
                            dayTextColor: darkMode ? '#f8fafc' : '#0f172a',
                            todayTextColor: '#22c55e',
                            monthTextColor: '#22c55e',
                            arrowColor: '#22c55e',
                            textDisabledColor: '#94a3b8',
                        }}
                    />
                    <TouchableOpacity style={[styles.addButton, { backgroundColor: '#22c55e' }]} onPress={() => {
                        setModalDate(selectedDate);
                        setModalVisible(true);
                    }}>
                        <Text style={{ color: '#0f172a', fontWeight: '600' }}>+ Add Event</Text>
                    </TouchableOpacity>

                    {selectedEvent && (
                        <View style={[styles.eventCard, { backgroundColor: darkMode ? '#334155' : '#ffffff' }]}>
                            <Text style={[styles.eventTitle, { color: darkMode ? '#f8fafc' : '#0f172a' }]}>Workout: {selectedEvent.workout}</Text>
                            <Text style={[styles.eventDetail, { color: darkMode ? '#94a3b8' : '#475569' }]}>Calories: {selectedEvent.calories}</Text>
                            <Text style={[styles.eventDetail, { color: darkMode ? '#94a3b8' : '#475569' }]}>Food: {selectedEvent.food}</Text>

                            <View style={{ flexDirection: 'row', marginTop: 12, justifyContent: 'space-between' }}>
                                <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#22c55e' }]} onPress={() => openEditEvent(selectedEvent)}>
                                    <Text style={{ color: '#0f172a', fontWeight: '600' }}>Edit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#ef4444' }]} onPress={() => deleteEvent(selectedEvent)}>
                                    <Text style={{ color: '#f8fafc', fontWeight: '600' }}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>

            <BottomFooter activeTab="Home" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100
    },
    headerText: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    card: {
        borderRadius: 18,
        padding: 18,
        marginBottom: 20
    },
    weeklyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8
    },
    editButton: {
        color: '#22c55e',
        fontWeight: '600'
    },
    weeklyRow: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    weekBox: {
        alignItems: 'center',
        width: 40
    },
    weekDay: {
        fontSize: 12,
        fontWeight: '600'
    },
    weekWorkout: {
        fontSize: 12,
        textAlign: 'center'
    },
    addButton: {
        marginTop: 12,
        padding: 10,
        borderRadius: 10,
        alignItems: 'center'
    },
    eventCard: {
        padding: 12,
        borderRadius: 10,
        marginTop: 12
    },
    eventTitle: {
        fontSize: 15,
        fontWeight: '600' },
    eventDetail: {
        fontSize: 13,
        marginTop: 2 },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00000080'
    },
    modalContent: {
        width: '90%',
        padding: 20,
        borderRadius: 10,
        backgroundColor: '#1e293b'
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
        color: '#f8fafc'
    },
    input: {
        backgroundColor: '#334155',
        color: '#f8fafc',
        padding: 10,
        borderRadius: 10,
        marginBottom: 12
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12
    },
    modalButton: {
        flex: 1,
        padding: 10,
        borderRadius: 10,
        marginHorizontal: 4,
        alignItems: 'center'
    },
});