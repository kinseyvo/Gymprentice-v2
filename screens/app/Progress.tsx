import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BottomFooter from '../../navigation/BottomFooter';

export default function ProgressScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Progress</Text>
            <BottomFooter activeTab="Stats" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 24, fontWeight: 'bold' },
});