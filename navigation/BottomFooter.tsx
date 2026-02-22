import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from '../styles/BottomFooter';

interface Props {
    activeTab: 'Home' | 'Stats' | 'Profile';
}

export default function BottomFooter({ activeTab }: Props) {
    const navigation = useNavigation<any>();

    return (
        <View style={styles.footerContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.tabButton}>
                <MaterialIcons
                    name="home"
                    size={28}
                    color={activeTab === 'Home' ? '#22c55e' : '#9ca3af'}
                />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Progress')} style={styles.tabButton}>
                <MaterialIcons
                    name="show-chart"
                    size={28}
                    color={activeTab === 'Stats' ? '#22c55e' : '#9ca3af'}
                />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.tabButton}>
                <MaterialIcons
                    name="person"
                    size={28}
                    color={activeTab === 'Profile' ? '#22c55e' : '#9ca3af'}
                />
            </TouchableOpacity>
        </View>
    );
}