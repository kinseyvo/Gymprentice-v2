import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Modal,
    Button,
    Alert,
} from 'react-native';
import BottomFooter from '../../navigation/BottomFooter';
import { useTheme } from '../../src/context/ThemeContext';
import Config from 'react-native-config';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export default function NutritionScreen() {
    const { darkMode } = useTheme();

    const [meals, setMeals] = useState<any[]>([]);
    const [selectedMeal, setSelectedMeal] = useState<any>(null);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    const [foodInput, setFoodInput] = useState('');
    const [caloriesInput, setCaloriesInput] = useState('');
    const [recentFoods, setRecentFoods] = useState<any[]>([]);

    const estimateCalories = (meal: any) => {
        if (!meal) return 0;

        const carbs = meal.carbohydrates_total_g ?? 0;
        const fat = meal.fat_total_g ?? 0;

        return Math.round((carbs * 4) + (fat * 9));
    };

    const fetchMeals = async () => {
        try {
            const apiKey = Config.API_NINJAS_KEY;
            if (!apiKey) throw new Error('Missing API key');

            const foodPool = [
                '100g chicken breast',
                '1 cup brown rice',
                '2 eggs',
                '100g salmon',
                '1 avocado',
                '1 cup oatmeal',
                '1 banana',
                '1 cup quinoa',
                '100g steak',
                '1 apple',
                '1 cup greek yogurt',
                '1 slice whole wheat bread',
                '1 tbsp peanut butter',
                '1 cup broccoli',
            ];

            const shuffled = foodPool.sort(() => 0.5 - Math.random());
            const foods = shuffled.slice(0, 6);

            let results: any[] = [];

            for (let food of foods) {
                const res = await fetch(
                    `https://api.api-ninjas.com/v1/nutrition?query=${encodeURIComponent(food)}`,
                    {
                        headers: { 'X-Api-Key': apiKey }
                    }
                );

                const data = await res.json();

                if (data && data.length > 0 && data[0]) {
                    results.push(data[0]);
                }
            }

            setMeals(results);
        } catch (err) {
            console.log('Nutrition API error:', err);
        }
    };

    useEffect(() => {
        fetchMeals();
    }, []);

    useEffect(() => {
        const user = auth().currentUser;
        if (!user) return;

        const unsubscribe = firestore()
            .collection('users')
            .doc(user.uid)
            .collection('recentFoods')
            .orderBy('timestamp', 'desc')
            .onSnapshot((snapshot) => {
                const foods: any[] = [];
                snapshot.forEach((doc) => {
                    foods.push({ id: doc.id, ...doc.data() });
                });
                setRecentFoods(foods);
            });

        return () => unsubscribe();
    }, []);

    const addFood = async () => {
        const user = auth().currentUser;

        if (!user) {
            Alert.alert('Not logged in', 'You must be logged in.');
            return;
        }

        if (!foodInput || !caloriesInput) return;

        try {
            const newFood = {
                name: foodInput,
                calories: Number(caloriesInput),
                timestamp: firestore.FieldValue.serverTimestamp(),
            };

            await firestore()
                .collection('users')
                .doc(user.uid)
                .collection('recentFoods')
                .add(newFood);

            setFoodInput('');
            setCaloriesInput('');
        } catch (error) {
            console.error('Error saving food:', error);
            Alert.alert('Error', 'Could not save food.');
        }
    };

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

                    {meals.map((meal, index) => (
                        <View key={index}>
                            <TouchableOpacity
                                style={styles.item}
                                onPress={() => setSelectedMeal(meal)}
                            >
                                <Text style={[
                                    styles.itemTitle,
                                    { color: darkMode ? '#f8fafc' : '#0f172a' }
                                ]}>
                                    {meal?.name || 'Unknown Food'}
                                </Text>

                                <Text style={[
                                    styles.itemSubtitle,
                                    { color: darkMode ? '#94a3b8' : '#475569' }
                                ]}>
                                    {estimateCalories(meal)} kcal • {meal?.carbohydrates_total_g ?? 0}g carbs
                                </Text>
                            </TouchableOpacity>

                            {index < meals.length - 1 && (
                                <View style={[
                                    styles.divider,
                                    { backgroundColor: darkMode ? '#334155' : '#cbd5e1' }
                                ]} />
                            )}
                        </View>
                    ))}
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
                        {['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Vegan', 'High-Protein'].map((item) => {
                            const isSelected = activeCategory === item;

                            return (
                                <TouchableOpacity
                                    key={item}
                                    style={[
                                        styles.categoryBox,
                                        { backgroundColor: darkMode ? '#0f172a' : '#ffffff' },
                                        isSelected && {
                                            borderWidth: 2,
                                            borderColor: '#22c55e'
                                        }
                                    ]}
                                    onPress={() =>
                                        setActiveCategory(isSelected ? null : item)
                                    }
                                >
                                    <Text style={[
                                        styles.categoryText,
                                        { color: darkMode ? '#f8fafc' : '#0f172a' }
                                    ]}>
                                        {item}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {/* CATEGORY RESULTS */}
                    {activeCategory && (
                        <View style={{ marginTop: 10 }}>
                            <Text style={{
                                color: darkMode ? '#f8fafc' : '#0f172a',
                                fontWeight: '600',
                                marginBottom: 8
                            }}>
                                {activeCategory} Options
                            </Text>

                            {meals
                                .filter((meal) => meal)
                                .filter((meal) => {
                                    if (activeCategory === 'Breakfast') return (meal.carbohydrates_total_g || 0) > 20;
                                    if (activeCategory === 'Lunch') return (meal.fat_total_g || 0) > 10;
                                    if (activeCategory === 'Dinner') return (meal.fat_total_g || 0) > 15;
                                    if (activeCategory === 'Snacks') return (meal.sugar_g || 0) > 8;
                                    if (activeCategory === 'Vegan') return (meal.name?.toLowerCase().includes('broccoli') || meal.name?.toLowerCase().includes('rice'));
                                    if (activeCategory === 'High-Protein') return (meal.fat_total_g || 0) > 10;
                                    return true;
                                })
                                .map((meal, idx) => (
                                    <Text
                                        key={idx}
                                        style={{
                                            color: darkMode ? '#94a3b8' : '#475569',
                                            marginBottom: 4
                                        }}
                                    >
                                        • {meal?.name || 'Unknown'} - {estimateCalories(meal)} kcal
                                    </Text>
                                ))}
                        </View>
                    )}
                </View>

                {/* Add Food */}
                <View style={[
                    styles.card,
                    { backgroundColor: darkMode ? '#1e293b' : '#e2e8f0' }
                ]}>
                    <Text style={[
                        styles.sectionTitle,
                        { color: darkMode ? '#f8fafc' : '#0f172a' }
                    ]}>
                        Add Recent Food
                    </Text>

                    <TextInput
                        placeholder="Food name"
                        placeholderTextColor={darkMode ? '#64748b' : '#94a3b8'}
                        value={foodInput}
                        onChangeText={setFoodInput}
                        style={[
                            styles.input,
                            {
                                color: darkMode ? '#f8fafc' : '#0f172a',
                                borderColor: darkMode ? '#334155' : '#cbd5e1'
                            }
                        ]}
                    />

                    <TextInput
                        placeholder="Calories"
                        placeholderTextColor={darkMode ? '#64748b' : '#94a3b8'}
                        value={caloriesInput}
                        onChangeText={setCaloriesInput}
                        keyboardType="numeric"
                        style={[
                            styles.input,
                            {
                                color: darkMode ? '#f8fafc' : '#0f172a',
                                borderColor: darkMode ? '#334155' : '#cbd5e1'
                            }
                        ]}
                    />

                    <Button title="Add Food" onPress={addFood} />

                    {recentFoods.map((food) => (
                        <Text key={food.id} style={{
                            color: darkMode ? '#94a3b8' : '#475569',
                            marginTop: 6
                        }}>
                            {food.name} - {food.calories} kcal
                        </Text>
                    ))}
                </View>
            </ScrollView>

            <BottomFooter activeTab="Home" />

            {/* Modal */}
            <Modal visible={!!selectedMeal} transparent animationType="slide">
                <View style={styles.modalBackground}>
                    <View style={[
                        styles.modalContainer,
                        { backgroundColor: darkMode ? '#1e293b' : '#ffffff' }
                    ]}>
                        <Text style={[
                            styles.modalTitle,
                            { color: darkMode ? '#22c55e' : '#16a34a' }
                        ]}>
                            {selectedMeal?.name || 'Unknown'}
                        </Text>

                        <Text>Estimated Calories: {estimateCalories(selectedMeal)} kcal</Text>
                        <Text>Carbs: {selectedMeal?.carbohydrates_total_g ?? 0}g</Text>
                        <Text>Fat: {selectedMeal?.fat_total_g ?? 0}g</Text>
                        <Text>Fiber: {selectedMeal?.fiber_g ?? 0}g</Text>
                        <Text>Sugar: {selectedMeal?.sugar_g ?? 0}g</Text>

                        <Button title="Close" onPress={() => setSelectedMeal(null)} />
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },

    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 80,
    },

    headerText: {
        fontSize: 26,
        fontWeight: '700',
        marginBottom: 10,
    },

    card: {
        borderRadius: 18,
        padding: 18,
        marginTop: 10,
        marginBottom: 20,
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 15,
    },

    item: { paddingVertical: 10 },

    itemTitle: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 4,
    },

    itemSubtitle: { fontSize: 13 },

    divider: {
        height: 1,
        marginVertical: 10,
    },

    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },

    categoryBox: {
        width: '48%',
        paddingVertical: 18,
        borderRadius: 14,
        alignItems: 'center',
        marginBottom: 12,
    },

    categoryText: {
        fontWeight: '600',
        fontSize: 14,
    },

    input: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 10,
        marginBottom: 10,
    },

    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    modalContainer: {
        padding: 20,
        borderRadius: 20,
        width: '85%',
    },

    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 12,
    },
});