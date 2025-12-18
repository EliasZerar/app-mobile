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

export default function ForgotPasswordScreen() {
    const [email, setEmail] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    const handleSendEmail = async () => {
        if (!email) {
            Alert.alert("Erreur", "Veuillez entrer votre email");
            return;
        }
        setLoading(true);
        try {
            await api.post("/auth/forgot-password", { email });
            Alert.alert("Succès", "Un email a été envoyé avec le code de réinitialisation", [
                { text: "OK", onPress: () => router.push("/(auth)/reset-password") }
            ]);
        } catch (error: any) {
            const msg = error.response?.data?.message || "Erreur technique";
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
                    <Text style={styles.title}>Mot de passe oublié</Text>
                    <Text style={styles.subtitle}>Entrez votre email (exemple: test@example.com)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Votre email"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                    <Button title={loading ? "Envoi..." : "Envoyer"} onPress={handleSendEmail} disabled={loading} />
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
    subtitle: { fontSize: 14, marginBottom: 5, textAlign: 'left', color: '#666' },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 20, borderRadius: 5 }
});