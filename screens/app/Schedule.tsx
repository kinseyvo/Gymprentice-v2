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

interface EventData {
    id: string;
    date: string;
    workout: string;
    calories: number;
    food: string;
}

export default function ScheduleScreen() {
    // STATE HOOKS
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
        setModalDate(date); // prefill modal date if clicked
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
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: '#f8fafc' }}>Loading...</Text>
            </View>
        );
    }

    if (!user) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: '#f8fafc' }}>Please log in to view your schedule</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.headerText}>Schedule</Text>

                <View style={styles.card}>
                    <View style={styles.weeklyHeader}>
                        <Text style={styles.sectionTitle}>Weekly Overview</Text>
                        <TouchableOpacity onPress={() => { setWeeklyDraft([...weeklyPlan]); setWeeklyModalVisible(true); }}>
                            <Text style={styles.editButton}>Edit</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.weeklyRow}>
                        {weekdays.map((day, i) => (
                            <View key={i} style={styles.weekBox}>
                                <Text style={styles.weekDay}>{day}</Text>
                                <Text style={styles.weekWorkout} numberOfLines={1} ellipsizeMode="tail">
                                    {weeklyPlan[i]}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Calendar</Text>
                    <Calendar
                        onDayPress={handleDayPress}
                        markedDates={markedDates}
                        markingType="dot"
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
                    <TouchableOpacity style={styles.addButton} onPress={() => {
                        setModalDate(selectedDate);
                        setModalVisible(true);
                    }}>
                        <Text style={styles.addButtonText}>+ Add Event</Text>
                    </TouchableOpacity>

                    {selectedEvent && (
                        <View style={styles.eventCard}>
                            <Text style={styles.eventTitle}>Workout: {selectedEvent.workout}</Text>
                            <Text style={styles.eventDetail}>Calories: {selectedEvent.calories}</Text>
                            <Text style={styles.eventDetail}>Food: {selectedEvent.food}</Text>

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

            <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add Event</Text>
                        <TextInput style={styles.input} placeholder="YYYY-MM-DD" placeholderTextColor="#94a3b8" value={modalDate} onChangeText={setModalDate} />
                        <TextInput style={styles.input} placeholder="Workout" placeholderTextColor="#94a3b8" value={newWorkout} onChangeText={setNewWorkout} />
                        <TextInput style={styles.input} placeholder="Calories" placeholderTextColor="#94a3b8" keyboardType="numeric" value={newCalories} onChangeText={setNewCalories} />
                        <TextInput style={styles.input} placeholder="Food" placeholderTextColor="#94a3b8" value={newFood} onChangeText={setNewFood} />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#22c55e' }]} onPress={addEvent}><Text style={{ color: '#0f172a', fontWeight: '600' }}>Save</Text></TouchableOpacity>
                            <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#334155' }]} onPress={() => setModalVisible(false)}><Text style={{ color: '#f8fafc', fontWeight: '600' }}>Cancel</Text></TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal visible={editModalVisible} transparent animationType="slide" onRequestClose={() => setEditModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Edit Event</Text>
                        {editEventData && <>
                            <TextInput style={styles.input} placeholder="Workout" placeholderTextColor="#94a3b8" value={editEventData.workout} onChangeText={(text) => setEditEventData({ ...editEventData, workout: text })} />
                            <TextInput style={styles.input} placeholder="Calories" placeholderTextColor="#94a3b8" keyboardType="numeric" value={String(editEventData.calories)} onChangeText={(text) => setEditEventData({ ...editEventData, calories: Number(text) })} />
                            <TextInput style={styles.input} placeholder="Food" placeholderTextColor="#94a3b8" value={editEventData.food} onChangeText={(text) => setEditEventData({ ...editEventData, food: text })} />
                        </>}
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#22c55e' }]} onPress={saveEditedEvent}><Text style={{ color: '#0f172a', fontWeight: '600' }}>Save</Text></TouchableOpacity>
                            <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#334155' }]} onPress={() => setEditModalVisible(false)}><Text style={{ color: '#f8fafc', fontWeight: '600' }}>Cancel</Text></TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal visible={weeklyModalVisible} transparent animationType="slide" onRequestClose={() => setWeeklyModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Edit Weekly Plan</Text>
                        {weekdays.map((day, i) => (
                            <TextInput
                                key={i}
                                style={styles.input}
                                placeholder={day}
                                placeholderTextColor="#94a3b8"
                                value={weeklyDraft[i]}
                                onChangeText={(text) => { const draft = [...weeklyDraft]; draft[i] = text; setWeeklyDraft(draft); }}
                            />
                        ))}
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#22c55e' }]} onPress={saveWeeklyPlan}><Text style={{ color: '#0f172a', fontWeight: '600' }}>Save</Text></TouchableOpacity>
                            <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#334155' }]} onPress={() => setWeeklyModalVisible(false)}><Text style={{ color: '#f8fafc', fontWeight: '600' }}>Cancel</Text></TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a'
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100
    },
    headerText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#22c55e',
        marginBottom: 20
    },
    card: {
        backgroundColor: '#1e293b',
        borderRadius: 16,
        padding: 16,
        marginBottom: 20
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#f8fafc',
        marginBottom: 0,
        lineHeight: 18
    },
    eventCard: {
        marginTop: 16,
        backgroundColor: '#334155',
        padding: 16,
        borderRadius: 12
    },
    eventTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#22c55e',
        marginBottom: 6
    },
    eventDetail: {
        fontSize: 14,
        color: '#f1f5f9',
        marginBottom: 4
    },
    weeklyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10
    },
    editButton: {
        color: '#22c55e',
        fontWeight: '600',
        lineHeight: 18
    },
    weeklyRow: {
        flexDirection: 'row',
        justifyContent: 'space-between', 
        alignItems: 'center'
    },
    weekBox: {
        flex: 1,
        height: 60,
        backgroundColor: '#1e293b',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
        marginHorizontal: 2,
    },
    weekDay: {
        fontSize: 12,
        color: '#f8fafc',
        marginBottom: 4,
        fontWeight: '600'
    },
    weekWorkout: {
        fontSize: 12,
        color: '#22c55e',
        textAlign: 'center',
        width: '100%'
    },
    addButton: {
        marginTop: 12,
        alignSelf: 'flex-end',
        backgroundColor: '#22c55e',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8
    },
    addButtonText: {
        color: '#0f172a',
        fontWeight: '600'
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    modalContent: {
        width: '100%',
        backgroundColor: '#1e293b',
        borderRadius: 16,
        padding: 20
    },
    modalTitle: { 
        fontSize: 20,
        fontWeight: 'bold',
        color: '#22c55e',
        marginBottom: 12
    },
    input: {
        backgroundColor: '#334155',
        color: '#f8fafc',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginBottom: 12
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10
    },
    modalButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 12,
        alignItems: 'center',
        marginHorizontal: 4
    },
});