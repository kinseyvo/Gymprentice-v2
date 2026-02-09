import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/app/Home';
import WorkoutsScreen from '../screens/app/Workouts';
import NutritionScreen from '../screens/app/Nutrition';
import ProgressScreen from '../screens/app/Progress';
import ScheduleScreen from '../screens/app/Schedule';
import ChallengesScreen from '../screens/app/Challenges';
import SettingsScreen from '../screens/app/Settings';
import CommunityScreen from '../screens/app/Community';
import LocationsScreen from '../screens/app/Locations';

const Stack = createNativeStackNavigator();

export default function AppStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Workouts" component={WorkoutsScreen} />
            <Stack.Screen name="Nutrition" component={NutritionScreen} />
            <Stack.Screen name="Progress" component={ProgressScreen} />
            <Stack.Screen name="Schedule" component={ScheduleScreen} />
            <Stack.Screen name="Challenges" component={ChallengesScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="Community" component={CommunityScreen} />
            <Stack.Screen name="Locations" component={LocationsScreen} />
        </Stack.Navigator>
    );
}
