import { useRouter } from 'expo-router';
import React from 'react';
import { Button, View } from 'react-native';
import api from '../services/api';
import useAuthStore from '../store/authStore';

export default function ProfileScreen() {
    const logout = useAuthStore((state) => state.logout);
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (err) {
            console.log("Server logout failed, but clearing local state anyway", err);
        }

        logout();

        router.replace('/login');
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Button title="Se déconnecter" onPress={handleLogout} color="red" />
        </View>
    );
}