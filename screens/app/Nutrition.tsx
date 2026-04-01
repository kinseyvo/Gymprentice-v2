import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
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
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [categoryMeals, setCategoryMeals] = useState<any[]>([]);
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const [foodInput, setFoodInput] = useState('');
    const [caloriesInput, setCaloriesInput] = useState('');
    const [recentFoods, setRecentFoods] = useState<any[]>([]);

    const [aiRecommendation, setAiRecommendation] = useState('');
    const [loadingAI, setLoadingAI] = useState(false);
    const [selectedMealType, setSelectedMealType] = useState<string | null>(null);

    const estimateCalories = (meal: any) => {
        const carbs = meal?.carbohydrates_total_g ?? 0;
        const fat = meal?.fat_total_g ?? 0;
        return Math.round(carbs * 4 + fat * 9);
    };

    const fetchMeals = async () => {
        try {
            const apiKey = Config.API_NINJAS_KEY;
            if (!apiKey) return;

            const foodPool = [
                'chicken breast',
                'rice',
                'eggs',
                'salmon',
                'avocado',
                'oatmeal'
            ];

            const shuffled = foodPool.sort(() => 0.5 - Math.random());
            const foods = shuffled.slice(0, 3);

            let results: any[] = [];

            for (let food of foods) {
                const res = await fetch(
                    `https://api.api-ninjas.com/v1/nutrition?query=${food}`,
                    {
                        method: 'GET',
                        headers: {
                            'X-Api-Key': String(apiKey),
                        } as any,
                    }
                );

                const data = await res.json();
                if (data?.length > 0) results.push(data[0]);
            }

            setMeals(results);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchCategoryMeals = async (category: string) => {
        try {
            const apiKey = Config.API_NINJAS_KEY;
            if (!apiKey) return;

            const map: any = {
                Breakfast: ['eggs', 'oatmeal', 'yogurt'],
                Lunch: ['chicken breast', 'rice', 'salad'],
                Dinner: ['salmon', 'steak', 'quinoa'],
                Snacks: ['apple', 'banana', 'peanut butter'],
                Vegan: ['tofu', 'lentils', 'quinoa'],
                'High-Protein': ['chicken breast', 'eggs', 'protein shake'],
            };

            let results: any[] = [];

            for (let food of map[category]) {
                const res = await fetch(
                    `https://api.api-ninjas.com/v1/nutrition?query=${food}`,
                    {
                        method: 'GET',
                        headers: {
                            'X-Api-Key': String(apiKey),
                        } as any,
                    }
                );

                const data = await res.json();
                if (data?.length > 0) results.push(data[0]);
            }

            setCategoryMeals(results);
            setExpandedIndex(null);
        } catch (err) {
            console.log(err);
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

        if (!user) return Alert.alert('Not logged in');
        if (!foodInput || !caloriesInput) return;

        try {
            await firestore()
                .collection('users')
                .doc(user.uid)
                .collection('recentFoods')
                .add({
                    name: foodInput,
                    calories: Number(caloriesInput),
                    timestamp: firestore.FieldValue.serverTimestamp(),
                });

            setFoodInput('');
            setCaloriesInput('');
        } catch {
            Alert.alert('Error saving food');
        }
    };

    const getAIRecommendations = async () => {
        try {
            if (!selectedMealType && !activeCategory) {
                Alert.alert('Pick a category');
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
                            role: 'user',
                            content: `
User food log: ${foodSummary}

Give:
- A ${selectedMealType || activeCategory} meal
- A workout
Keep it clean.
`,
                        },
                    ],
                }),
            });

            const data = await response.json();
            setAiRecommendation(data?.choices?.[0]?.message?.content || '');
        } catch (err) {
            console.log(err);
        } finally {
            setLoadingAI(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: darkMode ? '#0f172a' : '#fff' }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>

                <Text style={styles.header}>Nutrition</Text>

                <View style={styles.card}>
                    <Text style={styles.title}>Featured Meals</Text>
                    {meals.map((meal, i) => (
                        <View key={i} style={styles.item}>
                            <Text style={styles.itemTitle}>{meal.name}</Text>
                            <Text style={styles.itemSub}>{estimateCalories(meal)} kcal</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.card}>
                    <Text style={styles.title}>Meal Categories</Text>

                    <View style={styles.grid}>
                        {['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Vegan', 'High-Protein'].map((item) => (
                            <TouchableOpacity
                                key={item}
                                style={[
                                    styles.category,
                                    activeCategory === item && styles.activeCategory
                                ]}
                                onPress={() => {
                                    setActiveCategory(item);
                                    fetchCategoryMeals(item);
                                }}
                            >
                                <Text style={styles.categoryText}>{item}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {categoryMeals.map((meal, i) => {
                        const expanded = expandedIndex === i;

                        return (
                            <TouchableOpacity
                                key={i}
                                style={styles.mealCard}
                                onPress={() => setExpandedIndex(expanded ? null : i)}
                            >
                                <Text style={styles.mealTitle}>🍽️ {meal.name}</Text>
                                <Text style={styles.itemSub}>{estimateCalories(meal)} kcal</Text>

                                {expanded && (
                                    <View style={{ marginTop: 8 }}>
                                        <Text style={styles.macro}>Protein: {meal.protein_g}g</Text>
                                        <Text style={styles.macro}>Carbs: {meal.carbohydrates_total_g}g</Text>
                                        <Text style={styles.macro}>Fat: {meal.fat_total_g}g</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <View style={styles.card}>
                    <Text style={styles.title}>Add Recent Food</Text>

                    <TextInput
                        placeholder="Food name"
                        value={foodInput}
                        onChangeText={setFoodInput}
                        style={styles.input}
                    />

                    <TextInput
                        placeholder="Calories"
                        value={caloriesInput}
                        onChangeText={setCaloriesInput}
                        style={styles.input}
                        keyboardType="numeric"
                    />

                    <TouchableOpacity style={styles.pillButton} onPress={addFood}>
                        <Text style={styles.pillButtonText}>Add Food</Text>
                    </TouchableOpacity>

                    {recentFoods.map((food) => (
                        <View key={food.id} style={styles.foodCard}>
                            <Text style={styles.foodName}>{food.name}</Text>
                            <Text style={styles.foodCal}>{food.calories} kcal</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.card}>
                    <Text style={styles.title}>AI Recommendations</Text>

                    <TouchableOpacity style={styles.pillButton} onPress={getAIRecommendations}>
                        <Text style={styles.pillButtonText}>
                            {loadingAI ? 'Generating...' : 'Get AI Plan'}
                        </Text>
                    </TouchableOpacity>

                    {aiRecommendation ? (
                        <Text style={styles.aiText}>{aiRecommendation}</Text>
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

    header: {
        fontSize: 26,
        fontWeight: '700',
        color: '#22c55e',
        marginBottom: 10
    },

    card: {
        backgroundColor: '#1e293b',
        padding: 16,
        borderRadius: 16,
        marginBottom: 20,
    },

    title: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10
    },

    item: {
        marginBottom: 10
    },

    itemTitle: {
        color: '#fff',
        fontWeight: '600',
    },

    itemSub: {
        color: '#94a3b8',
    },

    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },

    category: {
        width: '30%',
        backgroundColor: '#334155',
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
        alignItems: 'center',
    },

    activeCategory: {
        borderWidth: 2,
        borderColor: '#22c55e',
    },

    categoryText: {
        color: '#fff',
        fontSize: 12,
    },

    mealCard: {
        backgroundColor: '#0f172a',
        padding: 12,
        borderRadius: 10,
        marginTop: 10,
    },

    mealTitle: {
        color: '#fff',
        fontWeight: '700',
    },

    macro: {
        color: '#94a3b8',
        fontSize: 12
    },

    input: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 999,
        marginBottom: 10
    },

    pillButton: {
        backgroundColor: '#22c55e',
        paddingVertical: 12,
        borderRadius: 999,
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 10
    },

    pillButtonText: {
        color: '#000',
        fontWeight: '700'
    },

    foodCard: {
        backgroundColor: '#0f172a',
        padding: 10,
        borderRadius: 10,
        marginTop: 10
    },

    foodName: {
        color: '#fff',
        fontWeight: '600'
    },

    foodCal: {
        color: '#94a3b8'
    },

    aiText: {
        color: '#fff',
        marginTop: 10
    }
});