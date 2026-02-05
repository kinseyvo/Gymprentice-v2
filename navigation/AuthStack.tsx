import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthLandingScreen from '../screens/auth/AuthLanding';
import LoginScreen from '../screens/auth/Login';
import SignUpScreen from '../screens/auth/SignUp';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="AuthLanding" component={AuthLandingScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
        </Stack.Navigator>
    );
}
