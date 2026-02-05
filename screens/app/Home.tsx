import React from 'react';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from '../../styles/HomeScreen';

const buttonLabels = [
    'Workouts',
    'Nutrition',
    'Progress',
    'Schedule',
    'Challenges',
    'Settings',
    'Community',
    'More',
];

export default function HomeScreen({ navigation }: any) {
    const safeAreaInsets = useSafeAreaInsets();

    const handlePress = (label: string) => {
        navigation.navigate(label);
    };

    return (
        <ScrollView
            contentContainerStyle={[
                styles.container,
                { paddingTop: safeAreaInsets.top },
            ]}
        >
            <Text style={styles.headerText}>Gymprentice</Text>

            <View style={styles.buttonGrid}>
                {buttonLabels.map((label, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.cardButton}
                        onPress={() => handlePress(label)}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.cardButtonText}>{label}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );
}