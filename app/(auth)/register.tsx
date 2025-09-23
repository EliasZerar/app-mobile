import Form from "@/app/components/form";
import {View, Text} from "react-native";
import {useState} from "react";

export default function Index() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

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
            />
            <Text>Register</Text>
        </View>
    );
}
