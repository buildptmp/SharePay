import React, { useEffect, useState} from "react";
import { Button, StyleSheet, TextInput, View, TouchableOpacity, Text, Image } from "react-native";
import { Styles } from "../Styles"
import { Link, useNavigation } from '@react-navigation/native';
import Homepage from "./Homepage";


export default function Login() {
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const navigation = useNavigation();

    //try use only phone number to log in for authentication (without password)
    //collect the username for display name in the application.
    //how to keep login?
    return (
    <View style={Styles.containerLogin}>
        <View style={[{flex:1}]} />
            <Image 
                style = {Styles.logoImg}
                source={require('../assets/Logo.png')} 
            />   
       <Text> Username </Text>
        <TextInput
        style={Styles.input}
        value={username}
        placeholder={"Username"}
        onChangeText={(text) => setUsername(text)}
        autoCapitalize={"none"}
        />

       <Text> Password </Text>
        <TextInput
            style={Styles.input}
            value={password}
            placeholder={"Password"}
            secureTextEntry
            onChangeText={(text) => setPassword(text)}
        />


        <View style={[{ width: '100%', paddingHorizontal: 100, flex: 3}]}>
        <TouchableOpacity
            style={Styles.btn}
            onPress={() => navigation.navigate(Homepage)}
        >
            <Text style={Styles.text}>Log in</Text>
        </TouchableOpacity>
        </View>
    </View>

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