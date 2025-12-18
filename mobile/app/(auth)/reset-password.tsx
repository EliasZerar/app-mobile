import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    Button,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View
} from "react-native";
import api from '../services/api';

export default function ResetPasswordScreen() {
    const [token, setToken] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    const handleReset = async () => {
        if (!token || token.length !== 6) {
            Alert.alert("Erreur", "Veuillez entrer un code valide à 6 chiffres");
            return;
        }
        if (!newPassword || newPassword.length < 6) {
            Alert.alert("Erreur", "Le mot de passe doit contenir au moins 6 caractères");
            return;
        }

        setLoading(true);
        try {
            const response: any = await api.post("/auth/reset-password", { token, newPassword });

            if (response.status === 200) {
                Alert.alert("Succès", "Votre mot de passe a été modifié", [
                    { text: "Se connecter", onPress: () => router.replace("/(auth)/login") }
                ]);
            } else {
                const errorMessage = response.data?.message || "Code invalide ou expiré";
                Alert.alert("Erreur", errorMessage);
            }

        } catch (error: any) {
            const msg = error.response?.data?.message || "Une erreur est survenue";
            Alert.alert("Erreur", msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <Text style={styles.title}>Nouveau mot de passe</Text>
                    <Text style={styles.subtitle}>Entrez le code à 6 chiffres reçu par mail</Text>

                    <TextInput
                        style={[styles.input, { letterSpacing: 5, textAlign: 'center', fontSize: 18 }]}
                        placeholder="000000"
                        value={token}
                        onChangeText={setToken}
                        keyboardType="number-pad"
                        maxLength={6}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Nouveau mot de passe"
                        value={newPassword}
                        onChangeText={setNewPassword}
                        secureTextEntry
                    />
                    <Button title={loading ? "Validation..." : "Valider"} onPress={handleReset} disabled={loading} />
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    title: { fontSize: 24, marginBottom: 10, textAlign: 'center' },
    subtitle: { fontSize: 14, marginBottom: 20, textAlign: 'center', color: '#666' },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 20, borderRadius: 5 }
});