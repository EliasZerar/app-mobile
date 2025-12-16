import Form from "@/app/components/form";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, View } from "react-native";

import api from '../services/api';
import useAuthStore from "../store/authStore";

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const setToken = useAuthStore((state) => state.setToken);
    const setUser = useAuthStore((state) => state.setUser);
    const setIsLoggedIn = useAuthStore((state) => state.setIsLoggedIn);

    const handleLogin = async () => {
        console.log('handleLogin called')
        if (!email || !password) {
            Alert.alert("Erreur", "Veuillez remplir tous les champs");
            return;
        }

        setLoading(true);

        try {
            console.log('1')
            const response = await api.post("/auth/login", { email, password });
            console.log('2:', response)
            if (response.status === 200) {
                setToken(response.token || response.data?.token);
                setUser(response.user || response.data?.user);
                setIsLoggedIn(true);


                router.replace("/");
                console.log('3', response)
            } else {
                console.log('4', response)
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Erreur", "Une erreur technique est survenue");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Form
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                onSubmit={handleLogin}
                loading={loading}
            />
        </View>
    );
}