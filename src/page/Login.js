import React, { useEffect, useState} from "react";
import { Button, StyleSheet, TextInput, View, TouchableOpacity, Text } from "react-native";
import { Styles } from "../Styles"
import { useNavigation } from '@react-navigation/native';


export default function Login() {
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);

    return (
        <>
        <TextInput
        style={styles.input}
        value={username}
        placeholder={"Username"}
        onChangeText={(text) => setUsername(text)}
        autoCapitalize={"none"}
        />
        <TextInput
            style={styles.input}
            value={password}
            placeholder={"Password"}
            secureTextEntry
            onChangeText={(text) => setPassword(text)}
        />
        <View style={[{ width: '100%', paddingHorizontal: 100, flex: 3}]}>
        <TouchableOpacity
            style={Styles.btn}
        >
            <Text style={Styles.text}>Log in</Text>
        </TouchableOpacity>
        </View>
        </>
    )
}

const styles = StyleSheet.create({
    input: {
        height: 40,
        marginBottom: 10,
        borderWidth: 1,
        borderRadius: 15,
        borderColor: '#B6B6B6',

    },
});