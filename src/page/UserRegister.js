import React, { FC, ReactElement, useState } from "react";
import { Button, StyleSheet, TextInput, TouchableOpacity, Text, View } from "react-native";
import { Styles } from "../Styles"
//import Parse from "parse/react-native";

export default function UserRegister() {
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const [phonenum, setPhoneNum] = useState(null);

    return(

        <View style={Styles.containerRegis}>
        <Text>Username</Text>
        <TextInput
            style={Styles.input}
            value={username}
            placeholder={"Insert Username"}
            onChangeText={(text) => setUsername(text)}
            autoCapitalize={"none"}
        />

        <Text>Password</Text>
        <TextInput
            style={Styles.input}
            value={password}
            placeholder={"Insert Password"}
            secureTextEntry
            onChangeText={(text) => setPassword(text)}
        />

        <Text>Phone Number</Text>
        <TextInput
            style={Styles.input}
            value={phonenum}
            placeholder={"Insert Phone Number"}
            onChangeText={(text) => setPhoneNum(text)}
        />
        <View style={[{ width: '100%', paddingHorizontal: 100, flex: 3}]}>
        <TouchableOpacity
            style={Styles.btn}
        >
            <Text style={Styles.text}>Request OTP</Text>
        </TouchableOpacity>
        </View> 
        </View>
    );
};