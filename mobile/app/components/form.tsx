import { Link, usePathname } from "expo-router";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

interface FormProps {
    email: string;
    setEmail: (email: string) => void;
    password: string;
    setPassword: (password: string) => void;
    onSubmit: () => void;
    loading?: boolean;
}

const Form: React.FC<FormProps> = ({ email, setEmail, password, setPassword, onSubmit, loading }) => {
    const route = usePathname();
    const isLogin = route === "/login";

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.containerForm}>
                <View>
                    <Text>Email</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={setEmail}
                        value={email}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                </View>
                <View>
                    <Text>Mot de passe</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={setPassword}
                        value={password}
                        secureTextEntry
                    />
                </View>

                <Pressable
                    onPress={onSubmit}
                    style={styles.button}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="blue" />
                    ) : (
                        <Text style={styles.buttonText}>
                            {isLogin ? "Connexion" : "Inscription"}
                        </Text>
                    )}
                </Pressable>

                {isLogin ? (
                    <>
                        <Text>Pas encore de compte ?</Text>
                        <Link href="/register" asChild>
                            <Pressable>
                                <Text style={styles.linkText}>Inscrivez-vous</Text>
                            </Pressable>
                        </Link>
                    </>
                ) : (
                    <>
                        <Text>Déjà un compte ?</Text>
                        <Link href="/login" asChild>
                            <Pressable>
                                <Text style={styles.linkText}>Connectez-vous</Text>
                            </Pressable>
                        </Link>
                    </>
                )}

            </SafeAreaView>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    input: {
        height: 40,
        borderWidth: 1,
        padding: 10,
        minWidth: '70%',
        marginBottom: 10,
    },
    containerForm: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        gap: 20
    },
    button: {
        borderWidth: 1,
        borderColor: 'blue',
        borderRadius: 50,
        width: '50%',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        fontSize: 15,
        color: 'blue',
        textAlign: 'center',
    },
    linkText: {
        color: 'blue',
        textDecorationLine: 'underline',
        marginTop: 5
    }
});

export default Form;