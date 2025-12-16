import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, Image, Text, View } from 'react-native';
import api from '../services/api';
import useAuthStore from '../store/authStore';

type User = {
    email: string;
    createdAt: string;
};

export default function ProfileScreen() {
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
        const response = await api.get(`/user/${useAuthStore.getState().user?.id}`);
        if (response.status === 200) {
            setUser(response.user);
        }
        setLoading(false);
    }

    useEffect(() => {
        getUser();
    }, []);

    return (
        loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
        ) : (
            <View style={{ margin: 'auto', minWidth: '80%', minHeight: '50%', justifyContent: 'center', alignItems: 'center', gap: 20, padding: 20, borderRadius: 10, boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)' }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', position: 'absolute', top: 20 }}>Profil</Text>
                <View style={{ flexDirection: 'column', gap: 10, alignItems: 'center', width: '100%' }}>
                    <Image source={require('../../assets/images/profile_picture.png')} style={{ width: 150, height: 150, borderRadius: 10 }} />
                    <Text >Email: {user?.email}</Text>
                </View>
                <Text>
                    Compte créé le: {user?.createdAt
                        ? new Date(user?.createdAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        })
                        : ''}
                </Text>
                <View style={{ position: 'absolute', bottom: 20 }} >
                    <Button title="Se déconnecter" onPress={handleLogout} color="red" />
                </View>
            </View>
        )
    );
}