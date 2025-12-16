import Form from "@/app/components/form";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, View } from "react-native";

import api from '../services/api';
import useAuthStore from "../store/authStore";

export default function RegisterScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const setToken = useAuthStore((state) => state.setToken);
    const setUser = useAuthStore((state) => state.setUser);
    const setIsLoggedIn = useAuthStore((state) => state.setIsLoggedIn);

    const handleRegister = async () => {
        if (!email || !password) {
            Alert.alert("Erreur", "Veuillez remplir tous les champs");
            return;
        }

        setLoading(true);

        try {
            const response = await api.post("/auth/register", {
                email,
                password
            });

            if (response.status === 201) {

                console.log('response:', response)

                const token = response.token || response.data?.token;

                if (token) {
                    setToken(token);
                    setUser(response.user || response.data?.user);
                    setIsLoggedIn(true);
                    router.replace("/");
                } else {
                    Alert.alert("Succès", "Compte créé ! Veuillez vous connecter.");
                    router.replace("/login");
                }
            } else {
                const errorMessage = response.data?.message || response.error || "Impossible de créer le compte";
                Alert.alert("Erreur d'inscription", errorMessage);
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
                onSubmit={handleRegister}
                loading={loading}
            />
        </View>
    );
}