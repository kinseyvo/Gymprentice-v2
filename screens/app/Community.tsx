import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Modal,
    TextInput,
    Button,
    Alert
} from 'react-native';

import BottomFooter from '../../navigation/BottomFooter';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useTheme } from '../../src/context/ThemeContext';

type Review = {
    id: string;
    userId: string;
    username: string;
    postName: string;
    postDescription: string;
    rating: number;
    category: 'gym' | 'workout';
    likes: number;
    likedBy: string[];
    createdAt: any;
};

export default function CommunityScreen() {

    const [reviews, setReviews] = useState<Review[]>([]);
    const [modalVisible, setModalVisible] = useState(false);

    const [postName, setPostName] = useState('');
    const [postDescription, setPostDescription] = useState('');
    const [rating, setRating] = useState(0);
    const [category, setCategory] = useState<'gym' | 'workout'>('gym');

    const { darkMode } = useTheme();

    useEffect(() => {
        const unsubscribe = firestore()
            .collection('reviews')
            .orderBy('createdAt', 'desc')
            .onSnapshot(snapshot => {

                const data: Review[] = snapshot.docs.map(doc => {
                    const d = doc.data();

                    return {
                        id: doc.id,
                        userId: d.userId,
                        username: d.username,
                        postName: d.postName,
                        postDescription: d.postDescription,
                        rating: d.rating,
                        category: d.category,
                        likes: d.likes ?? 0,
                        likedBy: d.likedBy ?? [],
                        createdAt: d.createdAt
                    };
                });

                setReviews(data);
            });

        return () => unsubscribe();
    }, []);

    const timeAgo = (timestamp: any) => {
        if (!timestamp) return '';

        const now = new Date();
        const postTime = timestamp.toDate();
        const seconds = Math.floor((now.getTime() - postTime.getTime()) / 1000);

        if (seconds < 60) return `${seconds}s ago`;
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;

        return `${Math.floor(seconds / 86400)}d ago`;
    };

    const createPost = async () => {
        if (!postName || !postDescription || rating === 0) {
            Alert.alert("Please fill all fields");
            return;
        }

        try {
            await firestore().collection('reviews').add({
                userId: auth().currentUser?.uid,
                username: auth().currentUser?.displayName ?? 'Anonymous',
                postName,
                postDescription,
                rating,
                category,
                likes: 0,
                likedBy: [],
                createdAt: firestore.FieldValue.serverTimestamp()
            });

            setModalVisible(false);
            setPostName('');
            setPostDescription('');
            setRating(0);

        } catch (error) {
            Alert.alert("Error creating post");
        }
    };

    const deletePost = async (id: string) => {
        Alert.alert("Delete Post", "Are you sure?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: async () => {
                    await firestore().collection('reviews').doc(id).delete();
                }
            }
        ]);
    };

    const likePost = async (review: Review) => {
        const userId = auth().currentUser?.uid;
        if (!userId) return;

        if (review.likedBy.includes(userId)) {
            Alert.alert("Already liked");
            return;
        }

        await firestore().collection('reviews').doc(review.id).update({
            likes: firestore.FieldValue.increment(1),
            likedBy: firestore.FieldValue.arrayUnion(userId)
        });
    };

    const renderStars = () => {
        let stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <TouchableOpacity key={i} onPress={() => setRating(i)}>
                    <Text style={i <= rating ? styles.starSelected : styles.star}>★</Text>
                </TouchableOpacity>
            );
        }
        return <View style={styles.starRow}>{stars}</View>;
    };

    const renderPosts = (section: 'gym' | 'workout') => {
        const filtered = reviews.filter(r => r?.category === section);

        if (filtered.length === 0) {
            return (
                <Text style={[styles.emptyText, { color: darkMode ? '#94a3b8' : '#475569' }]}>
                    No posts yet.
                </Text>
            );
        }

        return filtered.map(r => (
            <View key={r.id} style={[styles.item, { borderBottomColor: darkMode ? '#334155' : '#cbd5e1' }]}>
                <Text style={[styles.itemTitle, { color: darkMode ? '#f8fafc' : '#0f172a' }]}>
                    {r.postName}
                </Text>

                <Text style={styles.rating}>
                    {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                </Text>

                <Text style={[styles.itemSubtitle, { color: darkMode ? '#94a3b8' : '#475569' }]}>
                    by <Text style={styles.username}>{r.username}</Text>
                </Text>

                <Text style={[styles.itemSubtitle, { color: darkMode ? '#94a3b8' : '#475569' }]}>
                    {r.postDescription}
                </Text>

                <TouchableOpacity onPress={() => likePost(r)}>
                    <Text style={styles.likeText}>👍 {r.likes}</Text>
                </TouchableOpacity>

                {r.userId === auth().currentUser?.uid && (
                    <TouchableOpacity onPress={() => deletePost(r.id)}>
                        <Text style={styles.delete}>Delete</Text>
                    </TouchableOpacity>
                )}
            </View>
        ));
    };

    return (
        <View style={[styles.container, { backgroundColor: darkMode ? '#0f172a' : '#ffffff' }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={[styles.headerText, { color: darkMode ? '#22c55e' : '#16a34a' }]}>
                    Community
                </Text>

                <TouchableOpacity style={styles.createButton} onPress={() => setModalVisible(true)}>
                    <Text style={styles.createButtonText}>Create Post</Text>
                </TouchableOpacity>

                <View style={[styles.card, { backgroundColor: darkMode ? '#1e293b' : '#e2e8f0' }]}>
                    <Text style={[styles.sectionTitle, { color: darkMode ? '#f8fafc' : '#0f172a' }]}>
                        Gym Reviews
                    </Text>
                    {renderPosts('gym')}
                </View>

                <View style={[styles.card, { backgroundColor: darkMode ? '#1e293b' : '#e2e8f0' }]}>
                    <Text style={[styles.sectionTitle, { color: darkMode ? '#f8fafc' : '#0f172a' }]}>
                        Workout Reviews
                    </Text>
                    {renderPosts('workout')}
                </View>

            </ScrollView>

            <BottomFooter activeTab="Home" />

            <Modal visible={modalVisible} animationType="slide">
                <View style={[styles.modalContainer, { backgroundColor: darkMode ? '#0f172a' : '#ffffff' }]}>
                    <Text style={[styles.modalTitle, { color: darkMode ? '#ffffff' : '#0f172a' }]}>
                        Create Post
                    </Text>

                    <TextInput
                        placeholder="Post Name"
                        placeholderTextColor="#94a3b8"
                        value={postName}
                        onChangeText={setPostName}
                        style={[styles.input, { backgroundColor: darkMode ? '#334155' : '#e2e8f0', color: darkMode ? 'white' : '#0f172a' }]}
                    />

                    <TextInput
                        placeholder="Description"
                        placeholderTextColor="#94a3b8"
                        value={postDescription}
                        onChangeText={setPostDescription}
                        style={[styles.input, { backgroundColor: darkMode ? '#334155' : '#e2e8f0', color: darkMode ? 'white' : '#0f172a' }]}
                        multiline
                    />

                    <Text style={[styles.label, { color: darkMode ? 'white' : '#0f172a' }]}>Rating</Text>
                    {renderStars()}

                    <Button title="Post" onPress={createPost} />
                    <Button title="Cancel" color="gray" onPress={() => setModalVisible(false)} />
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a'
    },

    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 80
    },

    headerText: {
        fontSize: 26,
        fontWeight: '700',
        color: '#22c55e',
        marginBottom: 20
    },

    card: {
        backgroundColor: '#1e293b',
        borderRadius: 18,
        padding: 18,
        marginBottom: 20
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#f8fafc',
        marginBottom: 15
    },

    item: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#334155'
    },

    itemTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#f8fafc'
    },

    rating: {
        color: '#facc15',
        fontSize: 14,
        marginBottom: 4
    },

    itemSubtitle: {
        fontSize: 13,
        color: '#94a3b8'
    },

    username: {
        color: '#22c55e',
        fontWeight: '600'
    },

    likeButton: {
        marginTop: 6
    },

    likeText: {
        color: '#38bdf8',
        fontSize: 13
    },

    delete: {
        color: 'red',
        marginTop: 6
    },

    emptyText: {
        color: '#94a3b8',
        fontStyle: 'italic',
        marginTop: 10
    },

    createButton: {
        backgroundColor: '#22c55e',
        padding: 12,
        borderRadius: 10,
        marginBottom: 20,
        alignItems: 'center'
    },

    createButtonText: {
        color: 'white',
        fontWeight: '600'
    },

    modalContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: '#0f172a'
    },

    modalTitle: {
        fontSize: 20,
        color: 'white',
        marginBottom: 20
    },

    input: {
        backgroundColor: '#334155',
        color: 'white',
        padding: 10,
        borderRadius: 10,
        marginBottom: 15
    },

    label: {
        color: 'white',
        marginBottom: 8
    },

    starRow: {
        flexDirection: 'row',
        marginBottom: 20
    },

    star: {
        fontSize: 30,
        color: '#64748b',
        marginRight: 8
    },

    starSelected: {
        fontSize: 30,
        color: '#facc15',
        marginRight: 8
    },

    categoryRow: {
        flexDirection: 'row',
        marginBottom: 20
    },

    category: {
        backgroundColor: '#334155',
        padding: 10,
        borderRadius: 8,
        marginRight: 10
    },

    categorySelected: {
        backgroundColor: '#22c55e',
        padding: 10,
        borderRadius: 8,
        marginRight: 10
    },

    categoryText: {
        color: 'white'
    }

});