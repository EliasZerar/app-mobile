import { Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import useAuthStore from "./store/authStore";

export default function RootLayout() {

    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    return (
        <>
            <Stack>
                <Stack.Protected guard={!isLoggedIn}>
                    <Stack.Screen name="(auth)/login" options={{ headerTitle: "Connexion" }} />
                </Stack.Protected>

                <Stack.Protected guard={!isLoggedIn}>
                    <Stack.Screen name="(auth)/register" options={{ headerTitle: "Inscription" }} />
                </Stack.Protected>

                <Stack.Protected guard={!isLoggedIn}>
                    <Stack.Screen name="(auth)/forgot-password" options={{ headerTitle: "Mot de passe oublié" }} />
                </Stack.Protected>

                <Stack.Protected guard={!isLoggedIn}>
                    <Stack.Screen name="(auth)/reset-password" options={{ headerTitle: "Réinitialisation de mot de passe" }} />
                </Stack.Protected>

                <Stack.Protected guard={isLoggedIn}>
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                </Stack.Protected>
            </Stack >
            <StatusBar style={"inverted"} />
        </>
    )
}
