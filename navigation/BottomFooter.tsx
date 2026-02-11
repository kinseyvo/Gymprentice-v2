import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/BottomFooter';

interface Props {
    activeTab: 'Home' | 'Stats' | 'Profile';
}

export default function BottomFooter({ activeTab }: Props) {
    const navigation = useNavigation<any>();

    return (
        <View style={styles.footerContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                <Text
                    style={[
                        styles.footerText,
                        activeTab === 'Home' && styles.activeText,
                    ]}
                >
                    Home
                </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Progress')}>
                <Text
                    style={[
                        styles.footerText,
                        activeTab === 'Stats' && styles.activeText,
                    ]}
                >
                    Stats
                </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                <Text
                    style={[
                        styles.footerText,
                        activeTab === 'Profile' && styles.activeText,
                    ]}
                >
                    Profile
                </Text>
            </TouchableOpacity>
        </View>
    );
}
