import AsyncStorage from "@react-native-async-storage/async-storage";

const AUTH_KEY = 'isAuthenticated';

export const setAuthStatus = async (value: boolean) => {
    try {
        await AsyncStorage.setItem(AUTH_KEY, value ? 'true' : 'false');
    } catch (e) {
        console.error('Error saving auth status', e);
    }
};

export const getAuthStatus = async (): Promise<boolean> => {
    try {
        const value = await AsyncStorage.getItem(AUTH_KEY);
        return value === 'true';
    } catch (e) {
        console.error('Error reading auth status', e);
        return false;
    }
};

export const clearAuthStatus = async () => {
    try {
        await AsyncStorage.removeItem(AUTH_KEY);
    } catch (e) {
        console.error('Error clearing auth status', e);
    }
};