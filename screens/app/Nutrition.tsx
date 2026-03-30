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

    const [aiRecommendation, setAiRecommendation] = useState<string>('');
    const [loadingAI, setLoadingAI] = useState(false);
    const [selectedMealType, setSelectedMealType] = useState<string | null>(null);

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

    const getAIRecommendations = async () => {
        try {
            if (!selectedMealType) {
                Alert.alert('Select Meal Type', 'Please choose a category first.');
                return;
            }

            setLoadingAI(true);

            const apiKey = Config.OPENAI_API_KEY;

            const foodSummary = recentFoods
                .map((f) => `${f.name} (${f.calories} kcal)`)
                .join(', ');

            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a fitness coach. Keep responses clean and structured.'
                        },
                        {
                            role: 'user',
                            content: `
                            User food log: ${foodSummary}
                            Give:
                            - A ${selectedMealType} meal recommendation
                            - A matching workout
                            
                            Format:
                            Meal:
                            Workout:
                            `
                        }
                    ],
                }),
            });

            const data = await response.json();
            const text = data?.choices?.[0]?.message?.content || 'No response';

            setAiRecommendation(text);
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingAI(false);
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

                <View style={[styles.card, { backgroundColor: darkMode ? '#1e293b' : '#e2e8f0' }]}>
                    <Text style={[styles.sectionTitle, { color: darkMode ? '#f8fafc' : '#0f172a' }]}>
                        Featured Meals
                    </Text>

                    {meals.map((meal, index) => (
                        <View key={index}>
                            <TouchableOpacity style={styles.item} onPress={() => setSelectedMeal(meal)}>
                                <Text style={[styles.itemTitle, { color: darkMode ? '#f8fafc' : '#0f172a' }]}>
                                    {meal?.name || 'Unknown Food'}
                                </Text>

                                <Text style={[styles.itemSubtitle, { color: darkMode ? '#94a3b8' : '#475569' }]}>
                                    {estimateCalories(meal)} kcal • {meal?.carbohydrates_total_g ?? 0}g carbs
                                </Text>
                            </TouchableOpacity>

                            {index < meals.length - 1 && (
                                <View style={[styles.divider, { backgroundColor: darkMode ? '#334155' : '#cbd5e1' }]} />
                            )}
                        </View>
                    ))}
                </View>

                <View style={[styles.card, { backgroundColor: darkMode ? '#1e293b' : '#e2e8f0' }]}>
                    <Text style={[styles.sectionTitle, { color: darkMode ? '#f8fafc' : '#0f172a' }]}>
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
                                        isSelected && { borderWidth: 2, borderColor: '#22c55e' }
                                    ]}
                                    onPress={() => setActiveCategory(isSelected ? null : item)}
                                >
                                    <Text style={styles.categoryText}>{item}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                <View style={[styles.card, { backgroundColor: darkMode ? '#1e293b' : '#e2e8f0' }]}>
                    <Text style={[styles.sectionTitle, { color: darkMode ? '#f8fafc' : '#0f172a' }]}>
                        Add Recent Food
                    </Text>

                    <TextInput placeholder="Food name" value={foodInput} onChangeText={setFoodInput} style={styles.input} />
                    <TextInput placeholder="Calories" value={caloriesInput} onChangeText={setCaloriesInput} style={styles.input} />

                    <Button title="Add Food" onPress={addFood} />

                    {recentFoods.map((food) => (
                        <Text key={food.id}>{food.name} - {food.calories} kcal</Text>
                    ))}
                </View>

                <View style={[styles.card, { backgroundColor: darkMode ? '#1e293b' : '#e2e8f0' }]}>
                    <Text style={[styles.sectionTitle, { color: darkMode ? '#22c55e' : '#16a34a' }]}>
                        Food Recommendations
                    </Text>

                    <View style={styles.selectorRow}>
                        {['Breakfast', 'Lunch', 'Dinner', 'Snacks'].map((type) => {
                            const selected = selectedMealType === type;
                            return (
                                <TouchableOpacity
                                    key={type}
                                    onPress={() => setSelectedMealType(type)}
                                    style={[
                                        styles.selector,
                                        selected && { backgroundColor: '#22c55e' }
                                    ]}
                                >
                                    <Text style={{
                                        color: selected ? '#fff' : '#000',
                                        fontWeight: '600'
                                    }}>
                                        {type}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    <TouchableOpacity
                        style={styles.aiButton}
                        onPress={getAIRecommendations}
                    >
                        <Text style={{ color: '#fff', fontWeight: '700' }}>
                            {loadingAI ? 'Generating...' : 'Get AI Recommendations'}
                        </Text>
                    </TouchableOpacity>

                    {aiRecommendation ? (
                        <View style={styles.aiOutput}>
                            <Text style={styles.aiTitle}>Your Plan</Text>
                            <Text style={styles.aiText}>{aiRecommendation}</Text>
                        </View>
                    ) : null}
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
        padding: 20
    },

    headerText: {
        fontSize: 26,
        fontWeight: '700',
        marginBottom: 10
    },

    card: {
        borderRadius: 18,
        padding: 18,
        marginBottom: 20
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10
    },

    item: {
        paddingVertical: 10
    },

    itemTitle: {
        fontSize: 15,
        fontWeight: '600'
    },

    itemSubtitle: {
        fontSize: 13
    },

    divider: {
        height: 1,
        marginVertical: 10
    },

    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },

    categoryBox: {
        padding: 10,
        margin: 5,
        borderRadius: 10,
        backgroundColor: '#cbd5e1'
    },

    categoryText: {
        fontWeight: '600'
    },

    input: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        marginBottom: 10
    },

    selectorRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 10
    },

    selector: {
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#cbd5e1',
        marginRight: 8,
        marginBottom: 8
    },

    aiButton: {
        backgroundColor: '#22c55e',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 5
    },

    aiOutput: {
        marginTop: 15,
        padding: 15,
        borderRadius: 12,
        backgroundColor: '#0f172a'
    },

    aiTitle: {
        color: '#22c55e',
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 8
    },

    aiText: {
        color: '#f8fafc',
        fontSize: 14,
        lineHeight: 20
    }
});