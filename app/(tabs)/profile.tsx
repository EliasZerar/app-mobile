import { useTheme } from '@/app/utils/theme';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, Image, StyleSheet, Text, View } from 'react-native';
import api from '../services/api';
import useAuthStore from '../store/authStore';


type User = {
    email: string;
    createdAt: string;
};

export default function ProfileScreen() {
    const { colors } = useTheme();
    const logout = useAuthStore((state) => state.logout);
    const router = useRouter();

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (err) {
            console.log("Server logout failed, but clearing local state anyway", err);
        }

        logout();
        router.replace('/login');
    };

    async function getUser() {
        setLoading(true);
        try {
            const userId = useAuthStore.getState().user?.id;
            if (userId) {
                const response = await api.get(`/user/${userId}`);
                if (response.status === 200) {
                    setUser(response.user);
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getUser();
    }, []);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={colors.text} />
            </View>
        );
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={[
                styles.card,
                {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    shadowColor: colors.shadow
                }
            ]}>

                <Text style={[styles.title, { color: colors.text }]}>Profil</Text>

                <View style={styles.imageContainer}>
                    <Image
                        source={require('../../assets/images/profile_picture.png')}
                        style={styles.image}
                    />
                    <Text style={{ color: colors.text }}>Email: {user?.email}</Text>
                </View>

                <Text style={{ color: colors.text, textAlign: 'center' }}>
                    Compte créé le : {user?.createdAt
                        ? new Date(user?.createdAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        })
                        : 'Date inconnue'}
                </Text>

                <View style={styles.buttonContainer}>
                    <Button title="Se déconnecter" onPress={handleLogout} color='white' />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        width: '85%',
        minHeight: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
        padding: 20,
        borderRadius: 15,
        borderWidth: 1,

        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        position: 'absolute',
        top: 20,
    },
    imageContainer: {
        flexDirection: 'column',
        gap: 15,
        alignItems: 'center',
        width: '100%',
        marginTop: 40
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 2,
        borderColor: '#ddd'
    },
    buttonContainer: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    }
});