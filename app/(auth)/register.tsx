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

    // Récupération des actions du store pour connecter l'utilisateur directement après l'inscription
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
            // Adaptez le endpoint si nécessaire (ex: "/auth/signup")
            const response = await api.post("/auth/register", {
                email,
                password
            });

            if (response.ok) {
                // Si votre API renvoie le token et l'user directement après l'inscription :
                if (response.token) {
                    setToken(response.token || response.data?.token);
                    setUser(response.user || response.data?.user);
                    setIsLoggedIn(true);
                    router.replace("/");
                } else {
                    // Si l'API ne renvoie pas de token (ex: demande de confirmation email),
                    // redirigez vers le login avec un message
                    Alert.alert("Succès", "Compte créé ! Veuillez vous connecter.");
                    router.replace("/login");
                }
            } else {
                // Gestion des erreurs (ex: Email déjà utilisé)
                Alert.alert("Erreur d'inscription", response.error || "Impossible de créer le compte");
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
                onSubmit={handleRegister} // L'action déclenche l'inscription
                loading={loading}
            />
        </View>
    );
}