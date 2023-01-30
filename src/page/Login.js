// import React, { useEffect, useState} from "react";
// import { Button, StyleSheet, TextInput, View, TouchableOpacity, Text, Image } from "react-native";
// import { Styles } from "../Styles"
// import { Link, useNavigation } from '@react-navigation/native';
// import Homepage from "./Homepage";


// export default function Login() {
//     const [username, setUsername] = useState(null);
//     const [password, setPassword] = useState(null);
//     const navigation = useNavigation();

//     //try use only phone number to log in for authentication (without password)
//     //collect the username for display name in the application.
//     //how to keep login?
//     return (
//     <View style={Styles.containerLogin}>
//         <View style={[{flex:1}]} />
//             <Image 
//                 style = {Styles.logoImg}
//                 source={require('../assets/Logo.png')} 
//             />   
//        <Text> Username </Text>
//         <TextInput
//         style={Styles.input}
//         value={username}
//         placeholder={"Username"}
//         onChangeText={(text) => setUsername(text)}
//         autoCapitalize={"none"}
//         />

//        <Text> Password </Text>
//         <TextInput
//             style={Styles.input}
//             value={password}
//             placeholder={"Password"}
//             secureTextEntry
//             onChangeText={(text) => setPassword(text)}
//         />


//         <View style={[{ width: '100%', paddingHorizontal: 100, flex: 3}]}>
//         <TouchableOpacity
//             style={Styles.btn}
//             onPress={() => navigation.navigate(Homepage)}
//         >
//             <Text style={Styles.text}>Log in</Text>
//         </TouchableOpacity>
//         </View>
//     </View>

//     )
// }

// const styles = StyleSheet.create({
//     input: {
//         height: 40,
//         marginBottom: 10,
//         borderWidth: 1,
//         borderRadius: 15,
//         borderColor: '#B6B6B6',

//     },
// });

import React, { useState, useEffect } from "react";
import { TextInput, TouchableOpacity, Text, View } from "react-native";
import { Styles } from "../Styles"
import SelectDropdown from 'react-native-select-dropdown'
import auth from '@react-native-firebase/auth';

export default function Login({ navigation }) {
    const [phoneNum, setPhoneNum] = useState(null);
    const [countryCode, setCountryCode] = useState('+66');
    const [confirm, setConfirm] = useState(null);
    const [code, setCode] = useState('');
    const countriesCode = ["+66", "+65"]

    function onAuthStateChanged(user) {
        if (user) {
            navigation.navigate('Root');
        }
    }
    
    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
    }, []);

    // Handle the button press
    async function signInWithPhoneNumber() {
        const phoneNumber = countryCode + phoneNum
        const confirmation = await auth().signInWithPhoneNumber(phoneNumber, true);
        setConfirm(confirmation);
    }

    async function confirmCode() {
        try {
        await confirm.confirm(code);
        } catch (error) {
        console.log('Invalid code.');
        }
    }
    
    return(

        <View style={Styles.containerRegis}>

            <Text>Phone Number</Text>
            <View style={[{ flex: 1, flexDirection: 'row' }]}>
                <SelectDropdown
                    defaultValue={countryCode}
                    data={countriesCode}
                    onSelect={(selectedItem) => {
                        setCountryCode(selectedItem)
                    }}
                    buttonTextAfterSelection={(selectedItem) => {
                        return selectedItem
                    }}
                    rowTextForSelection={(item) => {
                        return item
                    }}
                    buttonStyle={Styles.dropDownBtnStyle}
                />
                <TextInput
                    style={Styles.input}
                    value={phoneNum}
                    placeholder={"Insert Phone Number"}
                    onChangeText={(text) => setPhoneNum(text)}
                />
            </View>
            <View style={[{ width: '100%', paddingHorizontal: 100, flex: 3}]}>
                <TouchableOpacity
                    style={Styles.btn}
                    onPress={signInWithPhoneNumber}
                >
                    <Text style={Styles.text}>Request OTP</Text>
                </TouchableOpacity>
            </View>
            <TextInput 
                style={Styles.input}
                value={code}
                placeholder={"Sent OTP"}
                onChangeText={(text) => setCode(text)}
            /> 
            <TouchableOpacity
                style={Styles.btn}
                onPress={confirmCode}
            >
                <Text style={Styles.text}>Confirm</Text>
            </TouchableOpacity>
        </View>
    );
};