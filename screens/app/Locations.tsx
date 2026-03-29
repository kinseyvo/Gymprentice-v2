import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Keyboard,
    Alert,
    ActivityIndicator,
} from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import BottomFooter from '../../navigation/BottomFooter';
import { useTheme } from '../../src/context/ThemeContext';
import Config from 'react-native-config';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

type Gym = {
    id: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
};

export default function LocationsScreen() {
    const [zipCode, setZipCode] = useState('');
    const [gyms, setGyms] = useState<Gym[]>([]);
    const [favorites, setFavorites] = useState<Gym[]>([]);
    const [showFavorites, setShowFavorites] = useState(false);
    const [loading, setLoading] = useState(false);

    const { darkMode } = useTheme();

    useEffect(() => {
        const user = auth().currentUser;
        if (!user) return;

        const unsubscribe = firestore()
            .collection('users')
            .doc(user.uid)
            .collection('favoriteGyms')
            .onSnapshot((snapshot) => {
                const favs: Gym[] = [];
                snapshot.forEach((doc) => {
                    favs.push({ id: doc.id, ...doc.data() } as Gym);
                });
                setFavorites(favs);
            });

        return () => unsubscribe();
    }, []);

    const fetchGyms = async () => {
        if (zipCode.length !== 5) {
            Alert.alert('Invalid Zip', 'Enter a valid 5-digit zip code.');
            return;
        }

        Keyboard.dismiss();
        setLoading(true);

        try {
            const apiKey = Config.GOOGLE_MAPS_API_KEY;

            const geoRes = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?address=${zipCode}&key=${apiKey}`
            );
            const geoData = await geoRes.json();

            if (!geoData.results || geoData.results.length === 0) {
                Alert.alert('Error', 'Invalid zip or API issue');
                setLoading(false);
                return;
            }

            const location = geoData.results[0].geometry.location;

            const placesRes = await fetch(
                `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.lat},${location.lng}&radius=5000&type=gym&key=${apiKey}`
            );
            const placesData = await placesRes.json();

            if (!placesData.results) {
                Alert.alert('Error', 'Places API failed');
                setLoading(false);
                return;
            }

            const formattedGyms: Gym[] = placesData.results
                .slice(0, 6)
                .map((place: any) => ({
                    id: place.place_id,
                    name: place.name,
                    address: place.vicinity,
                    latitude: place.geometry.location.lat,
                    longitude: place.geometry.location.lng,
                }));

            setGyms(formattedGyms);
        } catch (error) {
            console.log(error);
            Alert.alert('Error', 'Failed to fetch gyms');
        } finally {
            setLoading(false);
        }
    };

    const toggleFavorite = async (gym: Gym) => {
        const user = auth().currentUser;

        if (!user) {
            Alert.alert('Not logged in');
            return;
        }

        const ref = firestore()
            .collection('users')
            .doc(user.uid)
            .collection('favoriteGyms')
            .doc(gym.id);

        const exists = favorites.some((g) => g.id === gym.id);

        try {
            if (exists) {
                await ref.delete();
            } else {
                await ref.set(gym);
            }
        } catch (err) {
            console.log(err);
            Alert.alert('Error saving favorite');
        }
    };

    const displayedGyms = showFavorites ? favorites : gyms;

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
                    Gym Locations
                </Text>

                <View style={styles.inputContainer}>
                    <Text style={[
                        styles.label,
                        { color: darkMode ? '#f8fafc' : '#0f172a' }
                    ]}>
                        Zip Code:
                    </Text>

                    <TextInput
                        style={[
                            styles.textInput,
                            {
                                backgroundColor: darkMode ? '#1e293b' : '#e2e8f0',
                                color: darkMode ? '#f8fafc' : '#0f172a',
                                borderColor: darkMode ? '#334155' : '#cbd5e1',
                            },
                        ]}
                        value={zipCode}
                        onChangeText={setZipCode}
                        keyboardType="numeric"
                        maxLength={5}
                        placeholder="99999"
                        placeholderTextColor="#94a3b8"
                    />

                    <TouchableOpacity style={styles.button} onPress={fetchGyms}>
                        <Text style={styles.buttonText}>Search</Text>
                    </TouchableOpacity>

                    {/* pushes this to far right */}
                    <View style={{ flex: 1 }} />

                    <TouchableOpacity
                        style={styles.favButton}
                        onPress={() => setShowFavorites(!showFavorites)}
                    >
                        <Text style={styles.buttonText}>
                            {showFavorites ? 'All' : 'Favorites'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <MapView
                    style={styles.map}
                    region={{
                        latitude: gyms[0]?.latitude || 34.05,
                        longitude: gyms[0]?.longitude || -118.24,
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.05,
                    }}
                    zoomControlEnabled={true}
                    showsUserLocation={true}
                >
                    {gyms.map((gym) => (
                        <Marker key={gym.id} coordinate={{
                            latitude: gym.latitude,
                            longitude: gym.longitude,
                        }}>
                            <Callout>
                                <View style={{ width: 150 }}>
                                    <Text style={{ fontWeight: 'bold' }}>{gym.name}</Text>
                                    <Text>{gym.address}</Text>
                                </View>
                            </Callout>
                        </Marker>
                    ))}
                </MapView>

                {loading && <ActivityIndicator size="large" style={{ margin: 20 }} />}

                {!loading && displayedGyms.length === 0 && (
                    <Text style={[
                        styles.emptyText,
                        { color: darkMode ? '#cbd5e1' : '#475569' }
                    ]}>
                        {showFavorites
                            ? 'No favorites yet ❤️\nStart tapping the heart on gyms to save them!'
                            : 'No gyms found. Try another zip code.'}
                    </Text>
                )}

                {displayedGyms.map((gym) => {
                    const isFav = favorites.some((g) => g.id === gym.id);

                    return (
                        <View key={gym.id} style={styles.card}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.gymName}>{gym.name}</Text>

                                <TouchableOpacity onPress={() => toggleFavorite(gym)}>
                                    <Text style={styles.heart}>
                                        {isFav ? '❤️' : '🤍'}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <Text style={styles.address}>{gym.address}</Text>
                        </View>
                    );
                })}

            </ScrollView>

            <BottomFooter activeTab="Home" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },

    scrollContent: {
        padding: 20,
        paddingBottom: 80,
    },

    headerText: {
        fontSize: 26,
        fontWeight: '700',
        marginBottom: 20,
    },

    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },

    label: {
        fontSize: 16,
        fontWeight: '600',
        marginRight: 8,
    },

    textInput: {
        width: 100,
        borderWidth: 1,
        borderRadius: 10,
        padding: 8,
        marginRight: 8,
    },

    button: {
        backgroundColor: '#22c55e',
        padding: 10,
        borderRadius: 10,
    },

    buttonText: {
        fontWeight: '700',
    },

    favButton: {
        backgroundColor: '#f43f5e',
        padding: 10,
        borderRadius: 10,
    },

    map: {
        height: 250,
        borderRadius: 12,
        marginBottom: 16,
    },

    card: {
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        backgroundColor: '#1e293b',
    },

    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    gymName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
    },

    address: {
        color: '#94a3b8',
        marginTop: 4,
    },

    heart: {
        fontSize: 18,
    },

    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        lineHeight: 22,
    },
});