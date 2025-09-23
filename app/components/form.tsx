import {useState} from "react";
import {StyleSheet, TextInput, Text, Button, Pressable, View} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import {Link} from "expo-router";

const Form = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.containerForm}>
                <View>
                <Text>Email</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setEmail}
                    value={email}
                />
                </View>
                <View>
                <Text>Mot de passe</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setPassword}
                    value={password}
                />
                    </View>
                <Link href="/" asChild >
                    <Pressable>
                        <Text style={styles.button}>Connexion</Text>
                    </Pressable>
                </Link>
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
     },
    containerForm: {
        flex: 1,
        justifyContent: 'center',
        width: '100%',
        gap: 20
    },
    button: {
        fontSize: 15,
        textAlign:'center',
        color: 'blue',
        borderWidth: 1,
        borderColor:'blue',
        borderRadius: 50,
        width: '50%',
        margin: 'auto',
        padding: 5,
    }
});

export default Form;